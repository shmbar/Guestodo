import React, {useState, useContext, useEffect} from 'react';
import {Grid, Tooltip, IconButton} from '@material-ui/core';
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import Header from '../../Subcomponents/tablecomponents/Header';
import PaymentIcon from '@material-ui/icons/Payment';
import {SelectContext} from '../../../contexts/useSelectContext';
import useWindowSize from '../../../hooks/useWindowSize';
import PmntsDialog from './PmntsDialog';
import {addData, addDPaymentsBatch, delDPaymentsBatch} from '../../../functions/functions.js';
import {delEmptyPaymentS} from '../../../functions/formValidation.js';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 
import {AuthContext} from '../../../contexts/useAuthContext';
import {showDataTreeTable} from '../../../functions/setTableDt.js';

const tableCols = [
			{field: 'Expander', header: '',el: 'el', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'date', header: 'Date', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'Owner', header: 'Owner', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: false,s:['xs','sm','md','lg', 'xl']},
			{field: 'PrpName', header: 'Property', showcol: true,s:['md','lg', 'xl']},
			{field: 'AmntInclVat', header: 'Reservation Incl. VAT', showcol: false,s:['xs','sm','md','lg', 'xl']},
			{field: 'AmntExcllVat', header: 'Reservation Excl. VAT', showcol: false,s:['xs','sm','md','lg', 'xl']},
			{field: 'CleanAmount', header: 'Cleaning Commission', showcol: false,s:['lg', 'xl']},
			{field: 'ExpAmnt', header: 'Management Commission', showcol: false,s:['lg', 'xl']},
			{field: 'Cmsn', header: 'Total Commission', showcol: true,s:['lg', 'xl']},
			{field: 'VatAmnt', header: 'VAT', showcol: true,s:['lg', 'xl']},
			{field: 'CmsnVat', header: 'Commission Plus VAT', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'TtlPmnt', header: 'Total Payment', showcol: true,s:['md','lg', 'xl']},
			{field: 'Blnc', header: 'Balance Due', showcol: true,s:['lg', 'xl']},
			{field: 'PmntStts', header: 'Payment Status', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'el' , header: '', el: 'el', showcol: true,s:['xs','sm','md','lg', 'xl']}
];
		
const twoDig=(n) => {
	n += '';
	var x = n.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1].substring(0,2) : '';
return	x1 + x2;
}

function status(payments,rsrv ){
		let result = +payments / +rsrv;   //payments
			
		switch(true) {
			case result===0:
			  	return 'Unpaid';
				//break;
			case ( result >0 && result<=0.97):
			  	return 'Partially paid';
				//break;
			case ( result>0.97):
			  	return 'Fully paid';
				//break
			default:
			  return null;
			}
	}

const dateFormat = require('dateformat');	

const Table =(props) =>{
	
	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const {setValuePL, setPlData,setPanelDatePicker} = useContext(SelectContext);
	const [pmnts, setPmnts] = useState([]);
	const [open, setOpen] = useState(false);
	const [scltID, setSlctId] = useState(null);
	const [redValid, setRedValid] = useState(false);
	const {settings} = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);

	useEffect(()=>{
	
		let newArr = [...cols];
		for(let col of cols){
			 if(	(col.showcol && !(col.s).includes(scrSize)) || (!col.showcol &&  tableCols[cols.indexOf(col)].showcol  &&  (col.s).includes(scrSize)) ){
				let newObj = {...col, 'showcol': !col.showcol};
				newArr[newArr.map(i => i.field).indexOf(col.field)] = newObj;
			}
		};
		if(screenSize !== scrSize ){
			setCols(newArr);
			setScreenSize(scrSize);
		}

	},[scrSize, screenSize, cols])

	const actionTemplate = (rowData) => {
		
        return Object.keys(rowData).length===3 ? <div style={{display: 'inline-flex'}}>
			<Tooltip title='Payments'aria-label='Delete'>
				<div>
					<IconButton aria-label='Payments' onClick={()=> showPmnts(rowData)} >
						<PaymentIcon />
					</IconButton>
				</div>
			</Tooltip>	
        </div>: '';
    }
	
	const showPmnts = (rowData) =>{
		setSlctId(rowData.key);
		setPmnts(rowData.data.Payments);
		setOpen(true);
	};
	
	const onSearchChange = (event) => { 
        dt.filter(null, '', 'equals');
        setGlobalFilter(event.target.value);
        setSearchValue(event.target.value);
    }; //search
	
	 const resetFilter = async() =>{
        setGlobalFilter(null);
        setSearchValue('');
        setShowFilter(false);

		 setPanelDatePicker('');
		 setPlData({data:[],inc:'',exp:''});
		 setValuePL({start:null, end:null});
		 
		for (var key in cols) {
			dt.filter('', cols[key].field, 'equals');
		}
    };
	
	  const handleToggleCols= value => {
        let newArr = [...cols];
        let newObj = {...value, 'showcol': !value.showcol};
        newArr[newArr.map(i => i.field).indexOf(value.field)] = newObj;
        setCols(newArr);
    };
	

	const handleChangePmnts= (e, id) => {
			let newVal=[...pmnts];
		
			newVal[id]={...newVal[id],[e.target.name]:
							e.target.name!=='PM' ? twoDig(e.target.value) :settings.pmntMethods.filter(x=> x.item===e.target.value)[0]['id'] };

			setPmnts(newVal);
	}
	
	const handleChangeDPmnts = (name,val, id) =>{

		let newVal=[...pmnts];
		
		if(val===null){
		   	newVal[id]={...newVal[id],[name]:null};
		}else{
			newVal[id]={...newVal[id],[name]:dateFormat(val,'dd-mmm-yyyy')};
		}
		
		setPmnts(newVal);
	}
	
	const handleSave=async()=>{
	
		let tmpTF=true;
		
		for(let i=0; i<pmnts.length; i++){
			if( ( pmnts[i]['P']===''  && pmnts[i]['Date']!==null) || 
		  		(pmnts[i]['P']!=='' && pmnts[i]['Date']===null)){
					 tmpTF=false; break;
			}
		}
		
		if(!tmpTF){
			setRedValid(true);
			props.setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		
		const TotalPmnt = pmnts.map(x=> +(+x.P).toFixed(2)).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);
		
		const CmsnVat = props.data.filter(x=> x.key===scltID)[0]['data']['CmsnVat'];
		
		if(TotalPmnt > CmsnVat){
			props.setSnackbar( {open: true, msg: 'Total payments exceed commission plus Vat', variant: 'warning'});
			return;
		}
		
		const Blnc =  (+CmsnVat - +TotalPmnt).toFixed(2);
		const st = status(TotalPmnt,CmsnVat)
		
		let newLine = {...props.data.filter(x=>x.key===scltID)[0]['data'], 'TtlPmnt': TotalPmnt, 'Blnc' : Blnc, 'PmntStts': st,
					   'Payments': delEmptyPaymentS(pmnts) };
		let newData = props.data.map(x=>x.key===scltID ? ({...x, 'data': newLine}) : x);
		
		let prp = props.data.filter(x=> x.key===scltID)[0]['data']['PrpName'];
	
		const forServer= {'Payments': delEmptyPaymentS(pmnts), 'Transaction': scltID,  'PrpName': settings.properties.filter(x=> x.PrpName===prp)[0]['id']  };
		
		props.setData(newData)
	
		props.setSnackbar( {open: await addData(uidCollection, 'incomeCompany', dateFormat(newLine.date,'yyyy'),forServer),
							msg: 'Payments updated', variant: 'success'});
		
		
		
		let pmtnsObj = forServer.Payments.map(x=>{
					return {...x, ExpType: 'Management commission',  'VendChnnl': settings.CompDtls.cpmName, 'Date': new Date(x.Date),
							'Transaction': scltID, 'Fund': settings.properties.filter(x=> x.PrpName===prp)[0]['Fund']}
			})
		
		let olPayments =props.data.filter(x=>x.key===scltID)[0]['data'].Payments;
		
		await delDPaymentsBatch(uidCollection,'payments',olPayments)
		await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
		
		
		
		let pmtnsObj1 = forServer.Payments.map(x=>{
					return {...x, ExpType: 'Management commission',  'VendChnnl': settings.properties.filter(x=> x.PrpName===prp)[0]['id'],
							'Date': new Date(x.Date),'Transaction': scltID}
			})
		
		await delDPaymentsBatch(uidCollection,'paymentsCompany',olPayments)
		await addDPaymentsBatch(uidCollection,'paymentsCompany',pmtnsObj1)
		
		setOpen(false);
	}

	
	const header = <Header 
			 onChange={onSearchChange}
			 runFltr={()=> setShowFilter(!showFilter)}
			// n={showFilter}
			 searchValue={searchValue}
			 resetFltr={resetFilter}
			 handleToggleCols={handleToggleCols}
			 cols={cols}
			 tableData={props.dataTable}
			 dates={true}
			 showOwners={false}
		   	showSearch={true}
		 /> ;  
	
	
	const dataTable=(node, col)=>{
		return showDataTreeTable(node, col, scrSize, settings);
	}
	
	let dynamicColumns = cols.filter(col => col.showcol === true).map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		body={col.field==='el'? actionTemplate:  dataTable}
					   		style={col.field==='Expander' ? {textAlign:'center', width: '4em'} :
							    {textAlign:'center'}}
					  		
					   		filter={showFilter} 
					   		expander={col.field==='Expander' && true}
					   />;
        	});

	return(	
		<Grid container >	
			<PmntsDialog open={open} setOpen={setOpen} 
					title='Payments' pmnts={pmnts}
					handleChangePmnts={handleChangePmnts}
					handleChangeDPmnts={handleChangeDPmnts}
					setPmnts={setPmnts}
					handleSave={handleSave}
					redValid={redValid}
					data={props.data}
					scltID={scltID}
				/>
			
			<TreeTable  value={props.data}
						ref={(el) => setDt(el)}
				 		globalFilter={globalFilter}
						header={header}
						paginator={true}
						rows={10} rowsPerPageOptions={[5,10,20]}
						paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
						currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
				>
					{dynamicColumns}
			</TreeTable>
		</Grid>
		
	)
};

export default Table;

/*
	
*/
