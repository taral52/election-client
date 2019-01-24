import { Component } from '@angular/core';
import { EthcontractService } from './ethcontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Election';
	accounts: any;
	transferFrom = '0x0';
	balance ='0 ETH';
	transferTo='';
	amount=0;
	remarks='';
	candidatesCount = 0;
	candidateList = [];
	contractAddress = '0x0';
	constructor( private ethcontractService: EthcontractService ){
		this.initAndDisplayAccount();
	}
	initAndDisplayAccount = () => {
		this._getAccountInfo();
		this._getLoggedInAccountInfo();
		this._getCandidatesCount();
		this._getCandidates();
		this.ethcontractService.listenForEvents();
	};

	_getAccountInfo(){
		let that = this;
		this.ethcontractService.getAccountInfo()
		.then(function(address){
			that.contractAddress = address || "Transfer Account";
		}).catch(function(error){
			console.log(error);
		});
	}

	_getLoggedInAccountInfo(){
		let that = this;
		this.ethcontractService.getLoggedInAccountInfo()
		.then(function(account){
			that.transferFrom = account;
		})
	}

	_getCandidatesCount(){
		let that = this;
		this.ethcontractService.getCandidatesCount()
		.then(function(candidatesCount){
			that.candidatesCount = candidatesCount || 0;
		})
	}

	_getCandidates(){
		let that = this;
		this.ethcontractService.getCandidates()
		.then(function(list){
			let temp = [];
			let tempObj;
			for (let i in list) {
				tempObj = {};
				tempObj['id'] = list[i][0].toNumber();
				tempObj['name'] = list[i][1].toString();
				tempObj['voteCount'] = list[i][2].toNumber();
				temp.push(tempObj); 
			}
			that.candidateList = temp;
		})
	}

	addVote(id: number){
		let that = this;
		this.ethcontractService.addVote(id, that.transferFrom)
		.then(function(response){
			debugger;
		})
	}

}
