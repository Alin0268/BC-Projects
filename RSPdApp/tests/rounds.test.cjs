const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '../newapp.js'), 'utf8');
const address = '0xb3e139349108f2f65D72525587E3b62fbBCafe75';

function makeLog(name, user, computer, logAddress = address) {
    return {
        address: logAddress, topics: ['Print topic'],
        args: { _name: name, _option1: BigInt(user), _compmove: BigInt(computer) }
    };
}

function receipt(status, ...logs) {
    return { status, logs, transactionHash: '0xconfirmed' };
}

function mount({ chain = '0x61', bytecode = '0x01', walletError, sendMove } = {}) {
    const getText = () => ({ textContent: '' });
    const nodes = Object.fromEntries(
        ['user-score', 'computer-score', 'action-msg', 'resultLog', '.result > p'].map(id => [id, getText()])
    );
    nodes['user-score'].textContent = nodes['computer-score'].textContent = '0';
    const buttons = [0, 1, 2].map(id => ({
        id: String(id), disabled: false, addEventListener(_, handler) { this.click = handler; }
    }));
    const sent = [];
    const confirmations = [];
    const ethereum = {};
    const ethers = {
        providers: { Web3Provider: class {
            constructor(wallet, network) { assert.equal(wallet, ethereum); assert.equal(network, 97); }
            async send(method) {
                if (method === 'eth_requestAccounts') {
                    if (walletError) throw walletError;
                    return ['0xtest-player'];
                }
                assert.equal(method, 'eth_chainId');
                return chain;
            }
            async getCode(givenAddress) { assert.equal(givenAddress, address); return bytecode; }
            getSigner(account) { assert.equal(account, '0xtest-player'); return {}; }
        }},
        Contract: class {
            constructor(givenAddress, abi) {
                assert.equal(givenAddress, address);
                assert.ok(abi.find(item => item.type === 'event' && item.name === 'Print'));
                this.address = givenAddress;
                this.interface = {
                    getEventTopic: name => { assert.equal(name, 'Print'); return 'Print topic'; },
                    parseLog: log => log
                };
            }
            async YourMove(option) {
                sent.push(option);
                return {
                    hash: '0xsent',
                    wait: count => { confirmations.push(count); return sendMove(option); }
                };
            }
        }
    };
    vm.runInNewContext(source, {
        document: {
            querySelectorAll: () => buttons, querySelector: id => nodes[id],
            getElementById: id => nodes[id],
        },
        window: { ethereum, ethers }, ethers, console: { error() {} }
    });
    return {
        click: option => buttons[option].click(), buttons, sent, confirmations,
        scoreboard: () => [Number(nodes['user-score'].textContent), Number(nodes['computer-score'].textContent)],
        result: () => nodes['.result > p'].textContent,
        status: () => nodes['action-msg'].textContent
    };
}

test('successive rounds count once each and draws leave the score unchanged', async () => {
    const rounds = [
        ['YOU WON', 0, 1], ['YOU WON', 1, 2], ['COMPUTER WON', 2, 1], ['DRAW', 1, 1]
    ];
    const app = mount({
        sendMove: async () => receipt(1, makeLog(...rounds.shift()), makeLog('YOU WON', 0, 1, '0xforeign'))
    });
    for (const [move, score] of [[0,[1,0]], [1,[2,0]], [2,[2,1]], [1,[2,1]]]) {
        await app.click(move);
        assert.deepEqual(app.scoreboard(), score);
    }
    assert.deepEqual(app.sent, [0,1,2,1]);
    assert.deepEqual(app.confirmations, [1,1,1,1]);
    assert.match(app.result(), /Draw/);
});

test('score cannot change while pending and a second click sends nothing', async () => {
    let confirm;
    const pending = new Promise(resolve => { confirm = resolve; });
    const app = mount({ sendMove: () => pending });
    const firstClick = app.click(0);
    await new Promise(setImmediate);
    assert.match(app.status(), /Waiting for confirmation/);
    assert.ok(app.buttons.every(button => button.disabled));
    await app.click(1);
    assert.deepEqual(app.sent, [0]);
    assert.deepEqual(app.scoreboard(), [0,0]);
    confirm(receipt(1, makeLog('YOU WON', 0, 1)));
    await firstClick;
    assert.deepEqual(app.scoreboard(), [1,0]);
    assert.ok(app.buttons.every(button => !button.disabled));
});

test('reverted receipt and provider error with reverted receipt add nothing', async () => {
    for (const sendMove of [
        async () => receipt(0, makeLog('YOU WON', 0, 1)),
        async () => { throw Object.assign(new Error(), { receipt: receipt(0) }); }
    ]) {
        const app = mount({ sendMove });
        await app.click(0);
        assert.deepEqual(app.scoreboard(), [0,0]);
        assert.match(app.result(), /Transaction failed/);
    }
});

test('missing, duplicated and mismatched contract events add nothing', async () => {
    for (const logs of [[], [makeLog('YOU WON', 0, 1), makeLog('YOU WON', 0, 1)], [makeLog('YOU WON', 1, 2)]]) {
        const app = mount({ sendMove: async () => receipt(1, ...logs) });
        await app.click(0);
        assert.deepEqual(app.scoreboard(), [0,0]);
        assert.match(app.result(), /could not be read/);
    }
});

test('a wallet rejection, wrong network and empty contract address never send a move', async () => {
    for (const [options, expected] of [
        [{ walletError: Object.assign(new Error(), { code: 4001 }) }, /declined/],
        [{ chain: '0x38' }, /Wrong network/],
        [{ bytecode: '0x' }, /not found/]
    ]) {
        const app = mount(options);
        await app.click(0);
        assert.deepEqual(app.sent, []);
        assert.deepEqual(app.scoreboard(), [0,0]);
        assert.match(app.result(), expected);
    }
});

test('a repriced transaction counts once, but replacement or cancellation does not', async () => {
    for (const reason of ['repriced','replaced','cancelled']) {
        const app = mount({ sendMove: async () => {
            throw Object.assign(new Error(), {
                code: 'TRANSACTION_REPLACED', reason, cancelled: reason !== 'repriced',
                receipt: receipt(1, makeLog('YOU WON', 0, 1))
            });
        }});
        await app.click(0);
        assert.deepEqual(app.scoreboard(), [reason === 'repriced' ? 1 : 0,0]);
    }
});

test('a connection failure after submission preserves the transaction hash and the score', async () => {
    const app = mount({ sendMove: async () => { throw new Error('connection unavailable'); } });
    await app.click(0);
    assert.deepEqual(app.scoreboard(), [0,0]);
    assert.match(app.result(), /could not be verified/);
    assert.match(app.status(), /0xsent/);
});
