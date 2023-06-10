# A Simple Example of SDK and API for web3. Perspectives

We have created SDK function getContractLogs and the API function printMetaMaskBalance, and then wrapped them into an npm package "nft-gallery-sdk-api".

_______________
Of course, there are similar functions in other libraries, for example, in the well-known web3,  
but in our case we have created a lightweight and very simple SDK with functions that are necessary for training and creating the simplest DApp applications.  

At the same time, it is planned to further expand the library and update the [published npm package](https://www.npmjs.com/settings/alin0268/packages).  
These extensions will include functions for tracking trends in NFT collections by subject  
based on classification and clustering algorithms, as well as algorithms for decision support and generating recommendations for managing  
your NFT collections and so-called utilitarian business NFT applications.


Note the prospects and plans of the team:

1. The team plans to formalize these ideas in the form of an explanatory note of a research project for participation in a funded competition,  
followed by the design of the results of scientific and (or) scientific and technical activities (in Russian РННТД)  
as "A framework for creating and maintaining DApp business applications based on utilitarian NFT and data mining algorithms."


As a result, the prospects of commercialization of the described provisions will be considered.

2. The topic has been formulated, the tasks have been concretized and some groundwork has been obtained for a PhD thesis  
(*the team invites those who wish to enter the PhD doctoral program this year for the educational program 8D06306 - Information Security Systems*). 

3. The results, taking into account the planned expansion of the developed SDK and API example,  
will be designed and published in one of the scientific and technical journals.
_______________




Here is how you can use the npm-package from the web3 application.


To use the npm package in a web3 application, you can follow these steps:

    In your web3 application directory, install the npm package as a dependency:


`npm install nft-gallery-sdk-api`

    Import the SDK and API modules from the npm package in your app.js file:


`const { sdk, api } = require('wrapped in an npm package');`

    Use the imported SDK and API functions in your web3 application as needed. Here's an example of how you can use the SDK function getContractLogs and the API function printMetaMaskBalance:


```// Example usage
sdk.getContractLogs('YourContractAddress', NFTCreate1ABI)
  .then(logs => {
    console.log('Contract Logs:', logs);
    // Process the logs or update your application UI with the retrieved data
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error appropriately
  });

api.printMetaMaskBalance()
  .then(balance => {
    console.log('MetaMask balance:', balance);
    // Display the MetaMask balance in your application UI or perform any other action
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error appropriately
  });
```

Make sure to replace NFTCreate1ABI with the actual ABI. Note, that I did and tested all this for my **NFTCreate1.sol** contract.

    Include the app.js file in your index.html file by adding the following line before the closing </body> tag:



`<script src="app.js"></script>`


    Start your web3 application and test the functionality.

By using the npm package in your web3 application, you can leverage the SDK and API functions provided by the package for interacting with your contract (in my case it was the **NFTCreate1.sol**) and performing other actions.
