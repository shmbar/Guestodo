import React, {useEffect } from 'react';

import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const reservationsCols = [
            {value: 'LstSave', label: 'LstSave'},  //Last Created
			{value: 'GstName', label: 'GstName'},  //Guest
			{value: 'Transaction', label: 'Transaction'},
			{value: 'ChckIn', label: 'ChckIn'},
			{value: 'ChckOut', label: 'ChckOut'},
			{value: 'NigthsNum', label: 'NigthsNum'},  //Nights
			{value: 'PrpName', label: 'PrpName'},
			{value: 'AptName', label: 'AptName'},
			{value: 'RsrvChn', label: 'RsrvChn'},	
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'CnclFee', label: 'CnclFee'},
			{value: 'MngTRexCmsn', label: 'MngTRexCmsn'},  //Management Transaction
			{value: 'ChnlTRex', label: 'ChnlTRex'},  //Channel Transaction
			{value: 'NetAmnt', label: 'NetAmnt'},   //Net Amount
			{value: 'RsrvCncl', label: 'RsrvCncl'},   //Rsrv Cancelation
			{value: 'Vat', label: 'Vat'},
			{value: 'BlncRsrv', label: 'BlncRsrv'},	 //Balance Due
			{value: 'PmntStts', label: 'PmntStts'},	  //Payment Status
        	{value: 'RsrvAmnt', label: 'RsrvAmnt'},	  //Reservation Amount
			{value: 'TtlRsrvWthtoutVat', label: 'TtlRsrvWthtoutVat'},  //Reservation Amount Without Vat
			{value: 'Notes', label: 'Notes'}
			
];

const PmntsCols = [
			{value: 'Transaction', label: 'Transaction'},
            {value: 'P', label: 'Payment'},
			{value: 'Date', label: 'Date'},
			{value: 'PM', label: 'Payment Method'},
];

const reservationsGstsCols = [
            {value: 'Transaction', label: 'Transaction'},
			{value: 'Passport', label: 'Passport'},
			{value: 'addrss', label: 'addrss'},
			{value: 'adlts', label: 'adlts '},
			{value: 'chldrn', label: 'chldrn'},
			{value: 'cntry', label: 'cntry'},
			{value: 'email', label: 'email'},
			{value: 'mobile', label: 'mobile'},
			{value: 'phone', label: 'phone'}	
];


const ExpensesCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'ExpType', label: 'ExpType'},
			{value: 'vendor', label: 'vendor'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'AccDate', label: 'AccDate'},
			{value: 'PrpName', label: 'PrpName'},
			{value: 'AptName', label: 'AptName'},
			{value: 'Amnt', label: 'Amnt'},
			{value: 'ExpAmntWthtoutVat', label: 'ExpAmntWthtoutVat'},
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'BlncExp', label: 'BlncExp'},
			{value: 'VatAmnt', label: 'VatAmnt'},
			{value: 'CostType', label: 'CostType'},
			{value: 'PmntStts', label: 'PmntStts'},
			{value: 'Notes', label: 'Notes'},
			{value: 'Vat', label: 'Vat'},
	
];

const ExpensesChannelCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'ExpType', label: 'ExpType'},
			{value: 'vendor', label: 'vendor'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'AccDate', label: 'AccDate'},
			{value: 'PrpName', label: 'PrpName'},
			{value: 'AptName', label: 'AptName'},
			{value: 'Amnt', label: 'Amnt'},
			{value: 'ExpAmntWthtoutVat', label: 'ExpAmntWthtoutVat'},
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'BlncExp', label: 'BlncExp'},
			{value: 'VatAmnt', label: 'VatAmnt'},
			{value: 'CostType', label: 'CostType'},
			{value: 'GstName', label: 'GstName'},
			{value: 'RC', label: 'RC'},
	];

const ExpensesManagementCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'ExpType', label: 'ExpType'},
			{value: 'vendor', label: 'vendor'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'AccDate', label: 'AccDatee'},
			{value: 'PrpName', label: 'PrpName'},
			{value: 'AptName', label: 'AptName'},
			{value: 'Amnt', label: 'Amnt'},
			{value: 'ExpAmntWthtoutVat', label: 'ExpAmntWthtoutVat'},
			{value: 'AmntWihtoutVat', label: 'AmntWihtoutVat'},
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'BlncExp', label: 'BlncExp'},
			{value: 'CmsnVat', label: 'CmsnVat'},
			{value: 'VatAmnt', label: 'VatAmnt'},
			{value: 'CostType', label: 'CostType'},
			{value: 'GstName', label: 'GstName'},
			{value: 'RC', label: 'RC'},
			{value: 'RsrvAmnt', label: 'RsrvAmnt'},
			{value: 'RsrvAmntDesc', label: 'RsrvAmntDesc'},
			{value: 'Vat', label: 'Vat'},
	];

const cashFlowCols = [
           	{value: 'Amnt', label: 'Amnt'},
			{value: 'Fund', label: 'Fund'},
			{value: 'LstSave', label: 'LstSave'},
			{value: 'PM', label: 'PM'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'TransactionDate', label: 'TransactionDate'},
			{value: 'WithdrDepst', label: 'WithdrDepst'},
			{value: 'owner', label: 'owner'},
			{value: 'Notes', label: 'Notes'},
	];

const vatCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'ExpWithVat', label: 'ExpWithVat'},
			{value: 'IncWithVat', label: 'IncWithVat'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'From', label: 'From'},
			{value: 'To', label: 'To'},
			{value: 'PmntStts', label: 'PmntStts'},	
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'VatPayRtrn', label: 'VatPayRtrn'},
			{value: 'valueInc-Vat', label: 'valueInc-Vat'},
			{value: 'valueInc-withVat', label: 'valueInc-withVat'},
			{value: 'valueInc-withoutVat', label: 'valueInc-withoutVat'},
			{value: 'valuex-Vat', label: 'valuex-Vat'},
			{value: 'valuex-withVat', label: 'valuex-withVat'},
			{value: 'valuex-withoutVat', label: 'valuex-withoutVat'},
			{value: 'Fund', label: 'Fund'},
			{value: 'BlncVat', label: 'BlncVat'},
			
	];
	
const incCmpny = [
            {value: 'Transaction', label: 'Transaction'},
			{value: 'PrpName', label: 'PrpName'},
	];

const ExpensesCompanyCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'ExpType', label: 'ExpType'},
			{value: 'vendor', label: 'vendor'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'AccDate', label: 'AccDate'},
			{value: 'Amnt', label: 'Amnt'},
			{value: 'ExpAmntWthtoutVat', label: 'ExpAmntWthtoutVat'},
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'BlncExp', label: 'BlncExp'},
			{value: 'VatAmnt', label: 'VatAmnt'},
			{value: 'CostType', label: 'CostType'},
			{value: 'PmntStts', label: 'PmntStts'},
			{value: 'Notes', label: 'Notes'},
			{value: 'Vat', label: 'Vat'},
	
];

const otherIncCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'incType', label: 'incType'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'AccDate', label: 'AccDate'},
			{value: 'Amnt', label: 'Amnt'},
			{value: 'IncAmntWthtoutVat', label: 'IncAmntWthtoutVat'},
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'Blnc', label: 'Blnc'},
			{value: 'VatAmnt', label: 'VatAmnt'},
			{value: 'PmntStts', label: 'PmntStts'},
			{value: 'Notes', label: 'Notes'},
			{value: 'Vat', label: 'Vat'},
	
];

const cashFlowCompanyCols = [
           	{value: 'Amnt', label: 'Amnt'},
			{value: 'LstSave', label: 'LstSave'},
			{value: 'PM', label: 'PM'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'TransactionDate', label: 'TransactionDate'},
			{value: 'WithdrDepst', label: 'WithdrDepst'},
			{value: 'Notes', label: 'Notes'},
	];

const vatCompanyCols = [
            {value: 'LstSave', label: 'LstSave'},
			{value: 'ExpWithVat', label: 'ExpWithVat'},
			{value: 'IncWithVat', label: 'IncWithVat'},
			{value: 'Transaction', label: 'Transaction'},
			{value: 'From', label: 'From'},
			{value: 'To', label: 'To'},
			{value: 'PmntStts', label: 'PmntStts'},	
			{value: 'TtlPmnt', label: 'TtlPmnt'},
			{value: 'VatPayRtrn', label: 'VatPayRtrn'},
			{value: 'valueInc-Vat', label: 'valueInc-Vat'},
			{value: 'valueInc-withVat', label: 'valueInc-withVat'},
			{value: 'valueInc-withoutVat', label: 'valueInc-withoutVat'},
			{value: 'valuex-Vat', label: 'valuex-Vat'},
			{value: 'valuex-withVat', label: 'valuex-withVat'},
			{value: 'valuex-withoutVat', label: 'valuex-withoutVat'},
			{value: 'BlncVat', label: 'BlncVat'},
			
	];

const DownData=(props)=>{
	
  	useEffect(()=>{
		props.setServerData(null);
	})
	
	const runCols=(x) => {
		return x.map((col,i) => { 
				return <ExcelColumn  key={i}   value={col.value} 	label={col.label}   />;
		})	
	}
	
	
      return (
            <ExcelFile hideElement={true} element={<button>Download Data</button>}>
			 	 <ExcelSheet data={props.data.reservations} name="Reservations">
                  		{runCols(reservationsCols)}
                </ExcelSheet>
 				<ExcelSheet data={props.data.reservationsPmnts} name="Reservations Payments">
                  		{runCols(PmntsCols)}
                </ExcelSheet>
			  	 <ExcelSheet data={props.data.reservationsGstDtls} name="Guests Details">
                  		{runCols(reservationsGstsCols)}
                </ExcelSheet>
			  	 <ExcelSheet data={props.data.expenses} name="Expenses">
                  		{runCols(ExpensesCols)}
                </ExcelSheet>
			  	 <ExcelSheet data={props.data.chnexpenses} name="Channel Expenses">
                  		{runCols(ExpensesChannelCols)}
                </ExcelSheet>
			  	 <ExcelSheet data={props.data.mngexpenses} name="Management Expenses">
					 {runCols(ExpensesManagementCols)}
                </ExcelSheet>
			  	<ExcelSheet data={props.data.expensesPmnts} name="Expenses Payments">
					 {runCols(PmntsCols)}
                </ExcelSheet>
			  	<ExcelSheet data={props.data.cashFlow} name="Cash Flow">
					 {runCols(cashFlowCols)}
                </ExcelSheet>
			  	<ExcelSheet data={props.data.vat} name="Vat">
					 {runCols(vatCols)}
                </ExcelSheet>
				<ExcelSheet data={props.data.vatPmnts} name="Vat Payments">
					 {runCols(PmntsCols)}
				</ExcelSheet>
			  	<ExcelSheet data={props.data.incCompany} name="Company Income">
					 {runCols(incCmpny)}
				</ExcelSheet>
			  	<ExcelSheet data={props.data.incCompanyPmnts} name="Company Income Payments">
					 {runCols(PmntsCols)}
				</ExcelSheet>
			  	<ExcelSheet data={props.data.expCompany} name="Company Expenses">
					 {runCols(ExpensesCompanyCols)}
				</ExcelSheet>
			  	<ExcelSheet data={props.data.expCompanyPmnts} name="Company Expenses Payments">
					 {runCols(PmntsCols)}
				</ExcelSheet>
			  		<ExcelSheet data={props.data.otherInc} name="Other Company Income">
					 {runCols(otherIncCols)}
				</ExcelSheet>
				<ExcelSheet data={props.data.otherIncPmnts} name="Other Income Payments">
					 {runCols(PmntsCols)}
				</ExcelSheet>
			  	<ExcelSheet data={props.data.cashFlowCompany} name="Company Cash Flow">
					 {runCols(cashFlowCompanyCols)}
				</ExcelSheet>
				<ExcelSheet data={props.data.vatCpmpany} name="Company Vat">
					 {runCols(vatCompanyCols)}
                </ExcelSheet>
			  	<ExcelSheet data={props.data.vatCompanyPmnts} name="Company Vat Payments">
					 {runCols(PmntsCols)}
				</ExcelSheet>

			  <ExcelSheet dataSet={props.data.dataSet} name="Organization"/>
			  	
			  
            </ExcelFile>
		  
		  
		  
		  
        );
   
}


export default  DownData;


/*

	
  
*/