import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

declare let require: any;
declare let window: any;

let tokenAbi = require('../../../election/build/contracts/Election.json');


@Injectable({
  providedIn: 'root'
})
export class EthcontractService {

	private web3Provider: null;
	private contracts: {};
  	constructor() { 
		if (typeof window.web3 !== 'undefined') {
			this.web3Provider = window.web3.currentProvider;
		} else {
			this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		}
		window.web3 = new Web3(this.web3Provider);
  	}

  	getAccountInfo() {	
  		let electionContract = TruffleContract(tokenAbi);
      	electionContract.setProvider(this.web3Provider);
		return electionContract.deployed()
		.then(function(instance){
			return instance.address;
		})
		
	}

	getCandidates(){
		debugger;
		let electionInstance;
		let candidateList = [];
		let electionContract = TruffleContract(tokenAbi);
      	electionContract.setProvider(this.web3Provider);
      	return electionContract.deployed()
      	.then(function(instance){
      		electionInstance = instance;
      		return instance.candidatesCount();
      	})
      	.then(function(candidatesCount){
      		for (let i = 1; i <= candidatesCount; i++) {
      			electionInstance.candidates(i)
      			.then(function(candidate){
      				candidateList.push(candidate);
      			})
      		}
      		return candidateList;
      	})
	}
}
