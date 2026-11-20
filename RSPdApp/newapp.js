const contractAddress = "0xb3e139349108f2f65D72525587E3b62fbBCafe75"; //в Remix MyRSPv2.sol
const abi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_option1",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_compmove",
				"type": "uint256"
			}
		],
		"name": "Print",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_option",
				"type": "uint8"
			}
		],
		"name": "YourMove",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "compmove",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const chainId = 97; // BNB Smart Chain Testnet
const moves = ['Rock', 'Scissors', 'Paper'];
const buttons = [...document.querySelectorAll('.choice')];
const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const result = document.querySelector('.result > p');
const status = document.getElementById('action-msg');
const resultLog = document.getElementById('resultLog');

let busy = false;
let userScore = 0;
let computerScore = 0;

function showRound(outcome, userMove, computerMove) {
    const user = moves[userMove];
    const computer = moves[computerMove];
    if (outcome === 'YOU WON') {
        userScoreSpan.textContent = ++userScore;
        result.textContent = `${user} (User) beats ${computer} (Computer). You win!`;
    } else if (outcome === 'COMPUTER WON') {
        computerScoreSpan.textContent = ++computerScore;
        result.textContent = `${user} (User) loses to ${computer} (Computer). You lost.`;
    } else {
        result.textContent = `${user} (User) and ${computer} (Computer). Draw.`;
    }
    resultLog.textContent = `User: ${user}. Computer: ${computer}. ${outcome}.`;
}

function roundFromReceipt(receipt, contract, option) {
    const logs = receipt.logs.filter(log =>
        log.address.toLowerCase() === contract.address.toLowerCase() &&
        log.topics[0] === contract.interface.getEventTopic('Print')
    );
    if (logs.length !== 1) throw new Error('Expected one Print event for this round');

    const { _name, _option1, _compmove } = contract.interface.parseLog(logs[0]).args;
    const userMove = Number(_option1.toString());
    const computerMove = Number(_compmove.toString());
    if (userMove !== option ||
        !Number.isInteger(computerMove) || computerMove < 0 || computerMove >= moves.length ||
        !['YOU WON', 'COMPUTER WON', 'DRAW'].includes(_name)) {
        throw new Error('Invalid round result');
    }
    return { outcome: _name, userMove, computerMove };
}

async function play(option) {
    if (busy) return;
    busy = true;
    buttons.forEach(button => { button.disabled = true; });
    resultLog.textContent = '—';
    result.textContent = 'Round in progress…';
    status.textContent = 'Checking wallet and network…';

    let tx;
    let receipt;
    try {
        if (!window.ethereum || !window.ethers) {
            result.textContent = 'Wallet or ethers.js could not be loaded.';
            status.textContent = 'Open the page with a compatible wallet and check your connection.';
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum, chainId);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (!accounts.length) throw new Error('No wallet account available');
        if (Number(await provider.send('eth_chainId', [])) !== chainId) {
            result.textContent = 'Wrong network.';
            status.textContent = 'Select BNB Smart Chain Testnet (chain ID 97) in your wallet.';
            return;
        }
        if (await provider.getCode(contractAddress) === '0x') {
            result.textContent = 'The game contract was not found.';
            status.textContent = 'No transaction was sent. Check the configured testnet address.';
            return;
        }

        const contract = new ethers.Contract(contractAddress, abi, provider.getSigner(accounts[0]));
        status.textContent = 'Confirm the move in your wallet…';
        tx = await contract.YourMove(option);
        status.textContent = `Waiting for confirmation. Transaction: ${tx.hash}`;
        try {
            receipt = await tx.wait(1);
        } catch (error) {
            // Ethers labels a speed-up with the same destination, value and data as repriced.
            if (error.code !== 'TRANSACTION_REPLACED' || error.reason !== 'repriced' || error.cancelled) {
                throw error;
            }
            receipt = error.receipt;
        }
        if (receipt.status !== 1) {
            result.textContent = 'Transaction failed. No point was added.';
            status.textContent = `Transaction: ${receipt.transactionHash}`;
            return;
        }

        const round = roundFromReceipt(receipt, contract, option);
        showRound(round.outcome, round.userMove, round.computerMove);
        status.textContent = `Round confirmed. Transaction: ${receipt.transactionHash}`;
    } catch (error) {
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
            result.textContent = 'Request declined in the wallet.';
            status.textContent = 'No point was added.';
        } else if (error.code === 'TRANSACTION_REPLACED') {
            result.textContent = 'The move transaction was cancelled or replaced.';
            status.textContent = 'No point was added.';
        } else if (error.receipt?.status === 0) {
            result.textContent = 'Transaction failed. No point was added.';
            status.textContent = `Transaction: ${error.receipt.transactionHash || tx?.hash || 'unavailable'}`;
        } else if (receipt?.status === 1) {
            result.textContent = 'Transaction confirmed, but the game result could not be read.';
            status.textContent = `No point was added. Transaction: ${receipt.transactionHash}`;
        } else if (tx) {
            result.textContent = 'Confirmation could not be verified.';
            status.textContent = `Check the status in your wallet before submitting another move. Transaction: ${tx.hash}`;
        } else {
            result.textContent = 'Could not submit the move.';
            status.textContent = 'Check the wallet and testnet connection. No point was added.';
        }
        console.error(error);
    } finally {
        buttons.forEach(button => { button.disabled = false; });
        busy = false;
    }
}

buttons.forEach(button => button.addEventListener('click', () => play(Number(button.id))));
