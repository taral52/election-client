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
	constructor( private ethcontractService: EthcontractService ){
		this.initAndDisplayAccount();
	}
	initAndDisplayAccount = () => {
		this._getAccountInfo();
		this._getCandidatesCount();
		this._getCandidates();
	};

	_getAccountInfo(){
		let that = this;
		this.ethcontractService.getAccountInfo()
		.then(function(address){
			that.transferFrom = address || "Transfer Account";
		}).catch(function(error){
			console.log(error);
		});
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
}
