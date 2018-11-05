// //overrides metamask v0.2 for our 1.0 version.  
//1.0 lets us use async and await instead of promises

import Web3 from 'web3';
//overrides metamask v0.2 for our v 1.0
//const web3 = new Web3(window.web3.currentProvider);
//console.log(web3.currentProvider);

let  web3;
if (window.web3) {
	web3 = new Web3(window.web3.currentProvider);
	//console.log(web3.currentProvider);
}else{
	console.log('Non-Ethereum browser detected. You should consider trying MetaMask! ');
	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/b53f4131a6bf44b6ace760bb97c3e98d"));
}
export default web3;
