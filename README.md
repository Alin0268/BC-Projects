# BC-Projects

## Rock Paper Scissors dApp

[RSPdApp](RSPdApp/) is a teaching project for the Cryptographic Protocols course. The original browser game calculated the winner in JavaScript. This version sends the player's move to a contract on BNB Smart Chain Testnet. The contract determines the outcome. The page displays that outcome and keeps the score for the current page session.

- [Hosted demo](https://oademi.kz/RSPweb/index.html). It is deployed separately from this repository.
- Network: BNB Smart Chain Testnet (chain ID `97`). Use a compatible wallet and testnet tokens only.
- Contract configured in `RSPdApp/newapp.js`: `0xb3e139349108f2f65D72525587E3b62fbBCafe75`. The repository contains the frontend and contract ABI, not the Solidity source.

### Run locally

From the repository root, run `python3 -m http.server 8000 --bind 127.0.0.1` and open [localhost:8000/RSPdApp/](http://localhost:8000/RSPdApp/). The page loads ethers.js v5 from a CDN. Select the testnet in your wallet, choose a move, approve the transaction and wait for confirmation.

### How the score updates

The frontend calls `YourMove(option)` with `0` for rock, `1` for scissors or `2` for paper. After one confirmation it reads the contract's `Print` event from that transaction's receipt. A decisive round adds exactly one point to the winner. A draw, cancelled request, failed transaction or unreadable result adds no points. A pending transaction is not a failed transaction. The score resets when the page reloads.

The old interface added a persistent `Print` listener on every move. That could delay display and count a later round more than once. The new flow reads the receipt directly and does not subscribe to game events. It does not change the deployed contract.

Run the frontend regression tests with `node --test RSPdApp/tests/rounds.test.cjs`. The tests mock the wallet and transaction receipts and do not require a blockchain connection.

<details>
<summary>Описание на русском</summary>

В учебной игре «Камень — ножницы — бумага» ход отправляется в смарт-контракт в тестовой сети BNB Smart Chain. Контракт определяет исход раунда, а страница ведёт счёт до её перезагрузки. Для игры подключите кошелёк к тестовой сети и используйте только тестовые токены.

Раньше каждый ход добавлял ещё один обработчик события `Print`. Теперь интерфейс читает событие из квитанции своей транзакции после её подтверждения. За победу начисляется одно очко, при ничьей счёт не меняется. Отклонённая или неуспешная транзакция не меняет счёт. Не отправляйте ход повторно только потому, что подтверждение ещё не пришло.

</details>

## NFTCreation folder. It contains dApp for interaction with "TestNFT" smart contract.
**dApp ["NFT-gallery"](https://oademi.kz/SimpleNFT/index.html)**

Contract name **TestNFT**. The **address**:
```0x3d79cB0817813E02dED20d05081A26cbc07d2a9F```

Here you can see [minted NFTs 1](https://testnets.opensea.io/collection/fruits-and-street-landscape) and [minted NFTs 2](https://testnets.opensea.io/collection/riddlesfordetectives).

<details><summary>Note</summary>
  
  - Ресурсы сгенерированы бесплатным сервисом искусственного интеллекта.
  
  - Вот [то](https://betterprogramming.pub/how-to-create-your-own-nft-smart-contract-tutorial-1b90978bd7a3), что очень помогло при создании NFT.
</details>

