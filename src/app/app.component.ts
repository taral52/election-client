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
		this._getCandidates();
	};

	_getAccountInfo (){
		let that = this;
		this.ethcontractService.getAccountInfo()
		.then(function(address){
			that.transferFrom = address || "Transfer Account";
		}).catch(function(error){
			console.log(error);
		});
	}

	_getCandidates(){
		let that = this;
		this.ethcontractService.getCandidates()
		.then(function(candidateList){
			that.candidateList = candidateList || 0;
		})
	}
}
