import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import {forkJoin} from 'rxjs';
import {Observable} from 'rxjs';



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

	getCandidatesCount(){
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
  		return candidatesCount;
  	})
	}

  getCandidates(){
    let electionInstance;
    let candidateList = [];
    let electionContract = TruffleContract(tokenAbi);
    electionContract.setProvider(this.web3Provider);
    return new Promise((resolve, reject) => {
      electionContract.deployed()
      .then(function(instance){
        electionInstance = instance;
        return instance.candidatesCount();
      })
      .then(function(candidatesCount){
        if(candidatesCount <= 0){
          return [];
        }
        const observables = []; // create array of observables
        for (let i = 1; i <= candidatesCount; i++) {
          observables.push(electionInstance.candidates(i)); // push all calls into observable array
        }
        // Now provide that observale and do forkJoin
        return forkJoin(...observables).subscribe(dataGroup => {
          resolve(dataGroup);
        });
      })
    })
  }

  getLoggedInAccountInfo(){
  	return new Promise((resolve, reject) => {
  		window.web3.eth.getCoinbase(function(err, account){
  			if(err === null){
  				return resolve(account);
  			}
  		})
  	})
  }

  addVote(id: number, transferForm: any){
  	return new Promise((resolve, reject) => {
  		let electionContract = TruffleContract(tokenAbi);
    	electionContract.setProvider(this.web3Provider);
  		electionContract.deployed()
		  .then(function(instance){			
			return instance;
		  })
		  .then(function(instance){
		  	return instance.addVote(id, {from: transferForm})
		  })
		  .then(function(response){
		  	debugger;
		  }, function(e){
		  	debugger;
		  })
  	})
  }

  	listenForEvents(){
		let electionContract = TruffleContract(tokenAbi);
		electionContract.setProvider(this.web3Provider);
		electionContract.deployed()
		.then(instance => {
			instance.votedEvent({}, (err, ev) => {
				console.log("Refresh.");
			})
		})
	}
}
