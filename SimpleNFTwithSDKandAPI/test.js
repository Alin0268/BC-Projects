// Import the npm package
const { sdk, api } = require('nft-gallery-sdk-api');

// Test the SDK and API functions
sdk.getContractLogs('0x3d79cB0817813E02dED20d05081A26cbc07d2a9F', NFTCreate1ABI)
  .then(logs => console.log('Contract Logs:', logs))
  .catch(error => console.error('Error:', error));

api.printMetaMaskBalance()
  .then(() => console.log('MetaMask balance printed in the console.'))
  .catch(error => console.error('Error:', error));
