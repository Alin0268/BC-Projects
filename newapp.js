
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

const provider = new ethers.providers.Web3Provider(window.ethereum, 97); //bnbchain testnet
let player;
var contract;

const event = "Print";

provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {player = provider.getSigner(accounts[0]); //account in metamask
    contract = new ethers.Contract(contractAddress, abi, player);
  });
});

let CompChoiceWORD;

let userScore = 0;
let computerScore = 0;

const userScore_span = document.getElementById('user-score');
const computerScore_span = document.getElementById('computer-score');
const result_p = document.querySelector('.result > p');

const rock_div = document.getElementById("0");
const scissors_div = document.getElementById("1");
const paper_div = document.getElementById("2");


async function play(option) {
    
    const decimals = 18;
    const input = "10"; // Note: this is a string, e.g. user input
    //let amountInWei = ethers.utils.parseEther((0.00000000000000001).toString());
    let amountInWei = ethers.utils.parseEther(input, decimals);
    const setvalue = {value: amountInWei};
    //console.log(setvalue);

    await contract.YourMove(option);

    //Медленно работает
    contract.on('Print', (_GetResult, _GetValue, _GetUserMove, _GetCompMove) => {
        /*
        let PlayEvent ={
            GetUserMove: _GetUserMove.toString(),
            GetCompMove: _GetCompMove.toString(),
            GetResult: _GetResult.toString(),
            GetValue: _GetValue.toString(),
            eventData: event,
        }
        console.log(JSON.stringify(PlayEvent, null, 4))
       */

    console.log('GetUserMove: ', _GetUserMove.toString());
    console.log('GetCompMove: ', _GetCompMove.toString());
    console.log('GetResult: ', _GetResult.toString());
    console.log('GetValue: ', _GetValue.toString());

    var GetResult = _GetResult.toString();
    var GetUserMove = _GetUserMove.toString();
    var GetCompMove = _GetCompMove.toString();
    //var GetValue = _GetValue.toString();

    convertToWord(GetCompMove);
    HTMLProcess(GetResult, GetUserMove, GetCompMove);

    let ResultLogs = `
        Your choice (from the dApp): ${option},
        Your choice taken from the contract Event: ${GetUserMove},
        Computer's choice taken from the contract Event: ${GetCompMove} -- ${CompChoiceWORD},
        The result (taken from the contract): ${GetResult}
        -------------------------------------------------`; 
        //Contract amount (wei): ${input},
        //Bet value (wei): ${GetValue}`;      
    //console.log(ResultLogs);

    let resultLog = document.getElementById("action-msg");
    resultLog.innerText = ResultLogs;

});
    
    /*
    //Берем параметры исполненного контракта
    //Асинхрон. Нужно правильно вызывать, чтобы не обещания, а нужные значения получить
    let queryResult =  await contract.queryFilter('Print', await provider.getBlockNumber() - 5000, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1];

    console.log('GetUserMove: ', await queryResultRecent.args._option1.toString());
    console.log('GetCompMove: ', await queryResultRecent.args._compmove.toString());
    console.log('GetResult: ', await queryResultRecent.args._name.toString());
    console.log('GetValue: ', await queryResultRecent.args._value.toString());

    let ResultLogs = `
            Your choice (from the dApp): ${option.toString()}),
            Your choice (_option arg) got from the contract Event: ${await queryResultRecent.args._option1.toString()},
            Computer's choice got from the contract Event: ${await queryResultRecent.args._compmove.toString()},
            Computer's choice: ${CompChoiceWORD},
            The result (got from the contract): ${await queryResultRecent.args._name.toString()}, 
            Contract amount (wei): ${input},
            Bet value (wei): ${await queryResultRecent.args._value.toString()}`;    
        
    console.log(ResultLogs);
    
    GetUserMove = await queryResultRecent.args._option1.toString();
    GetCompMove = await queryResultRecent.args._compmove.toString();
    GetResult = await queryResultRecent.args._name.toString();
    GetValue = await queryResultRecent.args._value.toString();
    */
    

    /*
    console.log('GetResult: ', GetResult);
    console.log('GetUserMove: ', GetUserMove);
    console.log('GetCompMove: ', GetCompMove);
    console.log('GetValue: ', GetValue);

        GetResult = _GetResult.toString();
        GetUserMove = _GetUserMove.toString();
        GetCompMove = _GetCompMove.toString();
        GetValue = _GetValue.toString();
    */

/*
        convertToWord(GetCompMove);
        
        if (GetResult == "YOU WON"){
            userScore++;
            userScore_span.innerHTML = userScore;
            if (GetUserMove == "0"){
                result_p.innerHTML = `Rock (User) beats Scissors (Computer). You win!`;
            }
            if (GetUserMove == "1"){
                result_p.innerHTML = `Scissors (User) beats Paper (Computer). You win!`;
            }
            if (GetUserMove == "2"){
                result_p.innerHTML = `Paper (User) beats Rock (Computer). You win!`;
            }
        }
    
        if (GetResult == "COMPUTER WON"){
            computerScore++;
            computerScore_span.innerHTML = computerScore;
            if (GetCompMove == "0") {
                result_p.innerHTML = `Scissors (User) loses to Rock (Computer). You lost...`; 
            }
            if (GetCompMove == "1") {
                result_p.innerHTML = `Paper (User) loses to Scissors (Computer). You lost...`;
            }
            if (GetCompMove == "2") {
                result_p.innerHTML = `Rock (User) loses to Paper (Computer). You lost...`;
            }
        }
    
        if (GetResult == "DRAW"){
            result_p.innerHTML = `DRAW`;
        }
        /*
        //Bet value (wei): ${setvalue},
        let ResultLogs = `
            Your choice (from the dApp): ${option}),
            Your choice (_option arg) got from the contract Event: ${GetUserMove},
            Computer's choice got from the contract Event: ${GetCompMove},
            Computer's choice: ${CompChoiceWORD},
            The result (got from the contract): ${GetResult}, 
            Contract amount (wei): ${input},
            Bet value (wei): ${GetValue}`;    
        
        console.log(ResultLogs);
        */
    /*
        let resultLog = document.getElementById("action-msg");
        resultLog.innerText = ResultLogs;
    */
}

    function convertToWord(cm) {
        if (cm == "0") {
            CompChoiceWORD = "Rock";
        }
        if (cm == "1") {
            CompChoiceWORD = "Scissors";
        }
        if (cm == "2") {
            CompChoiceWORD = "Paper";
        }
    }
    
    function HTMLProcess(GetResult, GetUserMove, GetCompMove) {
        if (GetResult == "YOU WON"){
            userScore++;
            userScore_span.innerHTML = userScore;
            if (GetUserMove == "0"){
                result_p.innerHTML = `Rock (User) beats Scissors (Computer). You win!`;
            }
            if (GetUserMove == "1"){
                result_p.innerHTML = `Scissors (User) beats Paper (Computer). You win!`;
            }
            if (GetUserMove == "2"){
                result_p.innerHTML = `Paper (User) beats Rock (Computer). You win!`;
            }
        }

        if (GetResult == "COMPUTER WON"){
            computerScore++;
            computerScore_span.innerHTML = computerScore;
            if (GetCompMove == "0") {
                result_p.innerHTML = `Scissors (User) loses to Rock (Computer). You lost...`; 
            }
            if (GetCompMove == "1") {
                result_p.innerHTML = `Paper (User) loses to Scissors (Computer). You lost...`;
            }
            if (GetCompMove == "2") {
                result_p.innerHTML = `Rock (User) loses to Paper (Computer). You lost...`;
            }
        }

        if (GetResult == "DRAW"){
            result_p.innerHTML = `DRAW`;
        }
    }

    function main() {
        rock_div.addEventListener('click', function(){play("0");},)
        scissors_div.addEventListener('click', function(){play("1");})
        paper_div.addEventListener('click', function(){play("2");})
    }

main();