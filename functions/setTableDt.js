import React from 'react';

import {idToItem, Num2, getFees, getTaxes} from './functions.js';
import Booking from '../logos/chnlsPics/Booking.png';
import Airbnb from '../logos/chnlsPics/Airbnb.png';
import Tripadvisor from '../logos/chnlsPics/Tripadvisor.png';
import Agoda from '../logos/chnlsPics/Agoda.png';
import Flipkey from '../logos/chnlsPics/Flipkey.png';
import Expedia from '../logos/chnlsPics/Expedia.png';
import HomeAway from '../logos/chnlsPics/HomeAway.png';
import DefaultChannel from '../logos/chnlsPics/DefaultChannel.png';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import {Tooltip} from '@material-ui/core';

const dateFormat = require('dateformat');

const   logos=  [{brnd: 'Booking', img: Booking, width:'90px'},
				 {brnd: 'Airbnb', img: Airbnb, width: '48px'},
				 {brnd: 'Tripadvisor', img: Tripadvisor, width: '95px'},
				 {brnd: 'Agoda', img: Agoda, width: '65px'},
				 {brnd: 'Flipkey', img: Flipkey, width: '75px'},
				 {brnd: 'Expedia', img: Expedia, width: '75px'},
				 {brnd: 'HomeAway', img: HomeAway, width: '90px'},
				 {brnd: 'DefaultChannel', img: DefaultChannel, width: '90px'}
		];
		
			
	export const showDataTable=( rowData, column,scrSize, settings) => { 
	
	let cur = settings.CompDtls.currency
	let tmp;
	
	if (column.field==='Transaction') {
		tmp = scrSize !== 'xs' ? showShortTR(rowData): <> <span className="p-column-title">{column.header}</span>{showShortTR(rowData)} </>
	}else if (column.field==='PmntStts') {
		tmp = scrSize !== 'xs' ? PmntClrStatus(rowData): <> <span className="p-column-title">{column.header}</span>{ PmntClrStatus(rowData)} </>
	}else if(column.field==='RsrvAmnt' || column.field==='BlncRsrv' || column.field==='TtlPmnt'  ||
			column.field==='Blnc' || column.field==='IncAmntWthtoutVat' || column.field==='Amnt' || column.field==='VatAmnt' ||	
			column.field==='VatPayRtrn' || column.field==='IncWithVat' || column.field==='ExpWithVat' ||
			column.field==='BlncVat' || column.field==='BlncExp'||	column.field==='ExpAmntWthtoutVat'	|| column.field==='IntCshFlBnce') {		
		tmp = scrSize !== 'xs' ? showCommas(rowData,column, cur ): <> <span className="p-column-title">{column.header}</span>
		{showCommas(rowData,column, cur )} </>
	}else if (column.field==='TtlRsrvWthtoutVat') {
		tmp = scrSize !== 'xs' ? showCommasNfees(rowData,column, cur , settings): <> <span className="p-column-title">{column.header}</span>
		{showCommasNfees(rowData,column, cur, settings )} </>
	}else if (column.field==='RsrvChn') {
		tmp = scrSize !== 'xs' ? brandTemplate(rowData): <> <span className="p-column-title">{column.header}</span>{brandTemplate(rowData)} </>
	}else if (column.field==='AccDate' || column.field==='From' || column.field==='To') {
		tmp = scrSize !== 'xs' ? showDatesMonth(rowData, column): <> <span className="p-column-title">{column.header}</span>{showDatesMonth(rowData, column)} </>
	}else if (column.field==='Income' || column.field==='receiving') {
		tmp = scrSize !== 'xs' ? SetGreen(rowData, column): <> <span className="p-column-title">{column.header}</span>{SetGreen(rowData, column)} </>
	}else if (column.field==='Expense' || column.field==='cost' ) {
		tmp = scrSize !== 'xs' ? SetRed(rowData, column): <> <span className="p-column-title">{column.header}</span>{SetRed(rowData, column)} </>
	}else if (column.field==='balance') {
		tmp = scrSize !== 'xs' ? SetRedGreen(rowData, column): <> <span className="p-column-title">{column.header}</span>{SetRedGreen(rowData, column)} </>
	}else if (column.field==='item') {
		tmp = scrSize !== 'xs' ? lineThrough(rowData, column): <> <span className="p-column-title">{column.header}</span>{lineThrough(rowData, column)} </>
	}else if (column.field==='Owner') {
		tmp = scrSize !== 'xs' ? showItem(rowData, column, settings.owners): <> <span className="p-column-title">{column.header}
		</span>{showItem(rowData, column, settings.owners)} </>
	}else if (column.field==='ManagCommission' || column.field==='ChnCmsn' || column.field==='ExtraRevCommission' ) {
		tmp = scrSize !== 'xs' ? showPrcntg(rowData, column): <> <span className="p-column-title">{column.header}</span>{showPrcntg(rowData, column)} </>
	}else if (column.field==='inclVat' || column.field==='addVat' || column.field==='admin' || column.field==='write') {
		tmp = scrSize !== 'xs' ? showIcons(rowData, column): <> <span className="p-column-title">{column.header}</span>{showIcons(rowData, column)} </>
	}else if (column.field==='Fund') {
		tmp = scrSize !== 'xs' ? showItem(rowData, column, settings.funds): <> <span className="p-column-title">{column.header}
		</span>{showItem(rowData, column, settings.funds)} </>
	}else if (column.field==='NetAmnt' || column.field==='Fees' || column.field==='Taxes' || column.field==='VAT') {
		tmp = scrSize !== 'xs' ? showCommasNfees1(rowData, column, settings, cur): <> <span className="p-column-title">{column.header}
		</span>{showCommasNfees1(rowData, column, settings, cur)} </>
	}else{
		tmp = scrSize !== 'xs' ? rowData[column.field]: <> <span className="p-column-title">{column.header}</span>{rowData[column.field]} </>
	}
	
	return tmp;
};

/////////////////////////////////////////////////////////////////////////
/********************************************************************** */
const showShortTR = (rowData) => {
	return (rowData.Transaction).indexOf("_") === -1 ? rowData.Transaction : rowData.Transaction.substring(0, rowData.Transaction.indexOf("_"))
}

	const FullP = { backgroundColor: '#65E188', color: '#256029'};
	const PartP = {backgroundColor: '#F9DB45', color: '#805B36'};
	const Unp = {backgroundColor: '#F25C63', color: '#3b0d0d'};

const PmntClrStatus = (rowData) =>{
	
	let Status = rowData.PmntStts==='Fully paid' ? FullP : rowData.PmntStts==='Partially paid' ?  PartP: Unp;
	return  <span className='badge' style={Status}>{rowData.PmntStts}</span> ;
};

const showCommas=(rowData, column, cur)=>{
	return `${cur} ${addCommas(rowData[column.field]) }`;
}

const showCommasNfees=(rowData, column, cur, settings)=>{
	const tmpAmnt = rowData.pStatus!=='Cancelled' ? +rowData.NetAmnt : +rowData.CnclFee;
	const vat = settings.properties.filter(x=> x.id===rowData.PrpName)[0]['VAT'];
	let tmp = rowData[column.field] + +getFees(rowData, tmpAmnt )/(rowData.Vat ? (1 + parseFloat(vat)/100): 1)
	
	return `${cur} ${addCommas(tmp) }`;
}

const showCommasNfees1=(rowData, column, settings, cur )=>{
	const tmpAmnt = rowData.pStatus!=='Cancelled' ? +rowData.NetAmnt : +rowData.CnclFee;
	const vat = settings.properties.filter(x=> x.id===rowData.PrpName)[0]['VAT'];
	
	let vatAmount =	rowData.RsrvAmnt-rowData.TtlRsrvWthtoutVat -
				getFees(rowData, tmpAmnt )/(rowData.Vat ? (1 + parseFloat(vat)/100) :1) -
												+getTaxes(rowData, tmpAmnt );
	
	const tmp = column.field==='NetAmnt' ? rowData.TtlRsrvWthtoutVat :
								column.field==='Fees' ? +getFees(rowData, tmpAmnt )/(rowData.Vat ? (1 + parseFloat(vat)/100): 1) :
								column.field==='Taxes' ? +getTaxes(rowData, tmpAmnt ):
								vatAmount;
	
	return `${cur} ${addCommas(tmp) }`;
}


function addCommas(x) {
	//var parts = Math.round(x).toString().split('.');
	return Num2(+x)//parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const brandTemplate = (rowData)=> {
	const tmp = logos.filter(x=>x.brnd===rowData.RsrvChn)[0];
	const tempo = (tmp!==undefined) ? <img src={tmp.img} alt={ rowData.RsrvChn} width={tmp.width} />:
						rowData.RsrvChn
	return tempo;
}

const showDatesMonth=(rowData, column)=>{
	return dateFormat(rowData[column.field], "mmm-yyyy");
}

const SetGreen=(rowData, column)=>{
	let tmp = addCommas(rowData[column.field]);	
	 return <span style={{color: 'green'}}>{tmp!==0? tmp: ''}</span>; 
};

const SetRed=(rowData, column)=>{
	let tmp = addCommas(rowData[column.field]);	
	return <span style={{color: 'red'}}>{tmp!==0? tmp: ''}</span>;
};

const SetRedGreen=(rowData, column)=>{
	let tmp = addCommas(rowData[column.field]);	
	   return <span style={rowData.balance>=0? {color: 'green', fontWeight: 'bold'}: {color: 'red', fontWeight: 'bold'}}>
		 {tmp}</span>;
		
};


const lineThrough = (rowData, column) =>{
	return !rowData.show ? <span style={{textDecoration: 'line-through'}}>{rowData['item']}</span>:
		<span>{rowData['item']}</span>;
}

const showItem=(rowData, column, sets)=>{
	let tmp = idToItem(sets, rowData[column.field], 'item');
	return	<span>{tmp}</span>

}

const showPrcntg = (rowData, column)=>{
	return (rowData[column.field]==='' || rowData[column.field]===undefined) ? '-' : `${rowData[column.field]}%`;
}

const showIcons = (rowData, column)=>{
	
	let icon = (rowData[column.field])==="Yes" || rowData[column.field]=== true ? <Check style={{color: '#43a047'}} /> :
		<Close style={{color: '#dc1b4e'}} />
	return icon;
}
export const brandTemplate1 = (chnl)=> {
	const tmp = logos.filter(x=>x.brnd===chnl)[0];
	const tempo = (tmp!==undefined) ? <img src={tmp.img} alt={ chnl} width={tmp.width} />:
						chnl
	return tempo;
}

const FullP1 = { backgroundColor: '#65E188'};
const PartP1 = {backgroundColor: '#F9DB45',};
const Unp1 = {backgroundColor: '#F25C63'};

export const PmntClrStatus1 = (value) =>{	
	let Status = value==='Fully paid' ? FullP1 : value==='Partially paid' ?  PartP1: Unp1;
	return  Status.backgroundColor ;
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

export const showDataTreeTable=( node, column, scrSize, settings) => { 
	
	let cur = settings.CompDtls.currency
	let tmp;
	
	if (column.field==='Amnt' || column.field==='ExpAmntWthtoutVat' || column.field==='VatAmnt' ) {
		tmp = showCommas(node.data,column, cur )
	}else if (column.field==='AccDate') {
		tmp = dateFormat(node.data.AccDate, "mmm-yyyy");
	}else if (column.field==='Transaction') {
		tmp = 	<Tooltip title={(node.data.ExpType==='Channel advance commission' || 
					node.data.ExpType==='Management commission')? <span>{showShortTR1(node.data.RC)} {node.data.GstName}</span> :''}>
					<div>
						<span>{showShortTR1(node.data.Transaction)}</span>
					</div>
				</Tooltip>
	}else if (column.field==='BlncExp') {
		if(node.data.Transaction!=='' && node.data.ExpType==='Management commission'){
			tmp = '';
		}else{
			tmp = showCommas(node.data,column, cur )
		}
	}else if (column.field==='TtlPmnt') {
		if(node.data.Transaction!=='' && node.data.ExpType==='Management commission'){
			tmp = '';
		}else{
			tmp = showCommas(node.data,column, cur )
		}
	}else if (column.field === 'AmntInclVat' || column.field === 'AmntExcllVat' || column.field === 'Cmsn' || column.field === 'CmsnVat') {
		tmp = `${cur} ${Num2(	node.data[column.field]	)}`
	}else if (column.field==='Blnc') {
			let prt = Math.round(node.data.Blnc).toString().split('.')[0];
			tmp = node.data.Blnc==='' ? '' : prt=== '0' ? `${cur} 0` : `${cur} ${Num2(+node.data.Blnc)}`;
	}else if (column.field === 'PmntStts') {
		tmp = PmntClrStatusCmpIncome(node.data.PmntStts)
	}else{
		tmp = node.data[column.field];;
	}
	
	return tmp;
};


const showShortTR1=(zz) =>  { 
		return 	(zz==null || zz.indexOf("_") === -1) ? zz : zz.substring(0, zz.indexOf("_"));
	}

const PmntClrStatusCmpIncome = (val) =>{
	
	let Status = val==='Fully paid' ? FullP : val==='Partially paid' ?  PartP: Unp;
	return  <span className='badge' style={Status}>{val}</span> ;
};
