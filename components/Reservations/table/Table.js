import React, {useState, useContext,useEffect, /* useRef*/} from 'react';
import Grid from '@material-ui/core/Grid';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import OrdersModal from './Modals/OrdersModal';
import Header from '../../Subcomponents/tablecomponents/Header';
import { makeStyles } from '@material-ui/core/styles';
import {RcContext} from '../../../contexts/useRcContext';
import {SelectContext} from '../../../contexts/useSelectContext';
import SnackBar from '../../Subcomponents/SnackBar';
import {delData, getNewTR, convId2Item, deleteSlots, readDataSlots, delDPaymentsBatch} from '../../../functions/functions.js';
import {showDataTable} from '../../../functions/setTableDt.js';
import DelDialog from '../../Subcomponents/DeleteDialog';
import {AuthContext} from '../../../contexts/useAuthContext';
import useWindowSize from '../../../hooks/useWindowSize';
import { v4 as uuidv4 } from 'uuid';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 

import EditDel from '../../Subcomponents/EditDel'

import '../../Subcomponents/tablecomponents/Table.css';
//import '../../Subcomponents/tablecomponents/Table1.scss';

const dateFormat = require('dateformat');
const tableCols = [
            {field: 'LstSave', header: 'Last Created ', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'pStatus', header: 'Status ', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'GstName', header: 'Guest', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: true, s:['md','lg', 'xl']},
			{field: 'ChckIn', header: 'Check In', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'ChckOut', header: 'Check Out', showcol: true, s:['lg', 'xl']},
			{field: 'NigthsNum', header: 'Nights', showcol: false, s:['xs','sm','md','lg', 'xl']},
		//	{field: 'PrpName', header: 'Property', showcol: true,initial: 4},
			{field: 'AptName', header: 'Apartment', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'RsrvChn', header: 'Channel', showcol: true, s:['xs','sm','md','lg', 'xl']},	
			{field: 'TtlPmnt', header: 'Total Payment', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'BlncRsrv', header: 'Balance Due', showcol: true, s:['lg', 'xl']},	
			{field: 'PmntStts', header: 'Payment Status', showcol: true, s:['md','lg', 'xl']},	
        	{field: 'TtlRsrvWthtoutVat', header: 'Reservation Amount Before Vat', showcol: false, s:['xs','sm','md','lg', 'xl']},	
			{field: 'RsrvAmnt', header: 'Reservation Amount', showcol: true, s:['md','lg', 'xl']},	
			{field: 'el' , header: '', el: 'el', showcol: true, s:['xs','sm','md','lg', 'xl']} 
];


const useStyles = makeStyles(theme => ({
 	button: {
    margin: theme.spacing(1.5, 0 ,0, 1),
	background: '#5ec198'
  }
}));

const Table =() =>{
	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	const {rcDataPrp, setRcDataPrp, selectValue, displayDialog, setDisplayDialog,
		   		snackbar, setSnackbar, setSlotsTable, setRcTable} = useContext(RcContext);
	const {propertySlct, date} = useContext(SelectContext);
	const {write, uidCollection} = useContext(AuthContext);					 						 				 
	const {settings} = useContext(SettingsContext);
	
	const classes = useStyles();
	const [cols, setCols] = useState(tableCols);
//	const myRef = useRef();
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');

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

		const addOrder= ()=>{

		if(propertySlct===null){
			setSnackbar({open: true, msg: 'Choose property',
						 variant: 'warning'});
			return;
		}else{
			selectValue(createEmptyObj());
			setDisplayDialog(true);
		}
		
		};
	
	 const createEmptyObj = () =>{
		 
		const tmpArrApts=settings.apartments.filter(x=> x.PrpName===propertySlct)
		 
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= (q==='ChckIn' || q==='ChckOut' ) ? null: '';
		});
		 delete tmpObj.el;
		 tmpObj.Transaction = '';
		 tmpObj.Payments=[{P:'', Date:null, PM:'', 'id': uuidv4()}];	
		 tmpObj.Vat=true;
		 tmpObj.PrpName=propertySlct;
	//	 tmpObj.RsrvCncl=false;
		 tmpObj.RsrvChn='';		/////////////////////
		 tmpObj.NetAmnt='';
		 tmpObj.pStatus='Confirmed';
		 tmpObj.CnclFee='';
		 tmpObj.AptName= tmpArrApts.length===1 ? tmpArrApts[0].id : '';
		 tmpObj.dtls = {adlts: '', chldrn:'', Passport:'', email:'', mobile: '',
			phone: '', addrss:'', cntry:''};
		
		 return tmpObj;
    };
	
	const onSearchChange = (event) => { 
     //   dt.filter(null, '', 'equals');
        setGlobalFilter(event.target.value);
        setSearchValue(event.target.value);
    }; //search
	
	 const resetFilter = async() =>{
        setGlobalFilter(null);
        setSearchValue('');
        setShowFilter(false);
        setRcDataPrp(rcDataPrp);
        
        for (var key in cols) {
         if(cols[key].field !=='SDate' && cols[key].field !=='EDate') dt.filter('', cols[key].field, 'equals');
        }
    };
	
	 const handleToggleCols= value => {
        let newArr = [...cols];
        let newObj = {...value, 'showcol': !value.showcol};
        newArr[newArr.map(i => i.field).indexOf(value.field)] = newObj;
        setCols(newArr);
    };
	
	const selectValueOrder= async(rowData)=>{
		let tmp = rowData.Transaction!=null ? {...rowData, 'AptName': settings.apartments.filter(x=> x.AptName===rowData.AptName)[0]['id'],
	 			'RsrvChn': settings.channels.filter(y=>y.RsrvChn===rowData.RsrvChn)[0]['id']}:
					{...rowData,'Transaction' : await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'RC') };
		selectValue(tmp)
		
		let slotsData = await readDataSlots(uidCollection, 'slots', dateFormat(tmp.ChckIn, 'yyyy'), null, tmp.AptName)
		setSlotsTable(slotsData.dates);
		setRcTable(slotsData.rc)
	}
	
	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueOrder} rowData={rowData}  column={column}  delRow={delRow} />;
    }
	
	const showShortTR=(rowData, column) => {
		//need to make it work with Ical. For now, doesn't work with Ical
		return (rowData.Transaction).indexOf("_") === -1 ? rowData.Transaction : rowData.Transaction.substring(0, rowData.Transaction.indexOf("_"))
	}

	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete= async()=>{
			let ExIDCommissionCnhl = row.ChnlTRex;
			let ExIDCommissionMng = row.MngTRexCmsn;
		
		 	let newArr = rcDataPrp.filter(q=>q.Transaction!==row.Transaction);
			setRcDataPrp(newArr);
			async function Snack() {
				deleteSlots(uidCollection, settings.apartments.filter(x=> x.AptName===row.AptName)[0]['id'] , row.Transaction, row.ChckIn, row.ChckOut)
				setSnackbar({open: ( await delData(uidCollection,'reservations', date.year, row.Transaction)), msg: 'Order has been deleted!',
							 variant: 'success'}) ; 
			}
		Snack();
		setOpen(false);
		
		
		if(ExIDCommissionCnhl!==undefined) {await delData(uidCollection, 'expenses', date.year, ExIDCommissionCnhl)};
		await delData(uidCollection,'expenses', date.year, ExIDCommissionMng);
		
		await delDPaymentsBatch(uidCollection,'payments',row.Payments)
	}
	
	const setSHortTr=(ddd) => { //for data export to excel
		return ddd!=null ? ddd.map(x=> ({...x, 'Transaction': showShortTR(x, null)})) : [];
	}
	
	const header = <Header 
                                onChange={onSearchChange}
                                runFltr={()=> setShowFilter(!showFilter)}
                                showFilter={showFilter}
                                searchValue={searchValue}
                                resetFltr={resetFilter}
                                handleToggleCols={handleToggleCols}
                                cols={cols}
                                tableData={setSHortTr(convId2Item(rcDataPrp, ['AptName','RsrvChn', 'TtlRsrvWthtoutVat', 'RsrvAmnt', 'TtlPmnt'], settings))}
					   			showOwners={false}
					   			showSearch={true}
							/> ;  
							
						
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}

	let dynamicColumns = cols.filter(col => col.showcol === true).map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		body={col.field==='el'? actionTemplate: dataTable} 
					   		headerStyle={{overflow:'visible', textAlign:'center'}}
					   		style={{textAlign:'center'}}
					   		filter={col.field!=='el'? showFilter:false} 
					   />;
        	});
	

	return(	
		<div className="datatable-responsive-demo">
		<Grid container >
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This order will be deleted!' 
					content='Please Confirm'/>
				
					<DataTable  value={convId2Item(rcDataPrp, ['AptName','RsrvChn'], settings)}
								className="p-datatable-responsive-demo"
								ref={(el) => setDt(el)}
								globalFilter={globalFilter}
								header={header}
								paginator={true}
								rows={10} rowsPerPageOptions={[5,10,20]}
								paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
								currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
						>
							{dynamicColumns}
						
					</DataTable>
				

					{write && <Fab color="primary" aria-label="add" className={classes.button} onClick={addOrder}>
									<AddIcon />
							</Fab>}
			
			{ displayDialog ?  <OrdersModal  />: null}
			 
		 </Grid> 
		 </div>
	)
};

export default Table;

/*



*/