import React, {useState, useContext, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import AddIcon from '@material-ui/icons/Add';
import {Fab,} from '@material-ui/core';
import VatModal from './Modals/VatModal';
import Header from '../../Subcomponents/tablecomponents/Header';
import { makeStyles } from '@material-ui/core/styles';
import {VtContext} from '../../../contexts/useVtContext';
import SnackBar from '../../Subcomponents/SnackBar';
import {delData, delDPaymentsBatch} from '../../../functions/functions.js';
import DelDialog from '../../Subcomponents/DeleteDialog';
import useWindowSize from '../../../hooks/useWindowSize';
import {AuthContext} from '../../../contexts/useAuthContext';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 
import {SelectContext} from '../../../contexts/useSelectContext';
import EditDel from '../../Subcomponents/EditDel'
import {showDataTable} from '../../../functions/setTableDt.js';
import { v4 as uuidv4 } from 'uuid';

const dateFormat = require('dateformat');	

const tableCols = [
			{field: 'LstSave', header: 'Last Created', showcol: true,s:['md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'From', header: 'From', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'To', header: 'To', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'VatPayRtrn', header: 'VAT Pay/Return', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'TtlPmnt', header: 'Total Payment', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'BlncVat', header: 'Balance Due', showcol: true,s:['lg', 'xl']},
			{field: 'PmntStts', header: 'Payment Status', showcol: true,s:['md','lg', 'xl']},
			{field: 'IncWithVat', header: 'Revenue Amount Incl VAT', showcol: false,s:['xs','sm','md','lg', 'xl']},	
			{field: 'ExpWithVat', header: 'Expense Amount Incl VAT', showcol: false,s:['xs','sm','md','lg', 'xl']},	
			{field: 'el' , header: '', el: 'el', showcol: true,s:['xs','sm','md','lg', 'xl']}
];

const useStyles = makeStyles(theme => ({
 	button: {
    	margin: theme.spacing(1.5, 0 ,0, 1),
		background: '#5ec198'
  },
}));

const Table =({newOrdr}) =>{

	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	const {settings} = useContext(SettingsContext);
	const {vtDataC, setVtDataC, selectValue, displayDialog, setDisplayDialog,
		  snackbar, setSnackbar} = useContext(VtContext);
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const [open, setOpen] = useState(false);
	const {write, uidCollection} = useContext(AuthContext);	
	const {date} = useContext(SelectContext);
	
	const [id, setId] = useState('');
	
	const classes = useStyles();

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
			selectValue(createEmptyObj());
			setDisplayDialog(true);	
	};
	
	const createEmptyObj = () =>{
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= (q==='From' || q==='To') ? null: '';
		});
		
		  delete tmpObj.el;
		  tmpObj.Transaction = '';
		  tmpObj.From = dateFormat(new Date(),'mmm-yyyy')
		  tmpObj.To = dateFormat(new Date(),'mmm-yyyy')
		  tmpObj.Payments=[{P:'', Date:null, PM:'', id: uuidv4()}];	
		  tmpObj.valueInc= {withVat: '', withoutVat:'', Vat:''};
		  tmpObj.valuex= {withVat: '', withoutVat:'', Vat:''};
		  tmpObj.TtlPmnt = '';
		  tmpObj.BlncVat='';
		  tmpObj.inputVat=0;
		  tmpObj.PmntStts='Unpaid';
		 return tmpObj;
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
        await  setVtDataC(vtDataC);
        
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
	
	const actionTemplate = (rowData, column) => {
       return <EditDel selectValueOrder={selectValue} rowData={rowData}  column={column}  delRow={delRow} />;
    }
		
	const delRow = (rowData) =>{
		setId(rowData.Transaction)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr = vtDataC.filter(q=>q.Transaction!==id);
			setVtDataC(newArr);
			async function Snack() {
				setSnackbar({open: ( await delData(uidCollection, 'vatcalCompany', date.year, id)), msg: 'Vat transaction has been deleted!',
							 variant: 'success'}) ; 
				await delDPaymentsBatch(uidCollection,'paymentsCompany', vtDataC.filter(q=>q.Transaction===id)[0].Payments)
			}
		Snack();
		setOpen(false)
	}
	
	const showShortTR=(rowData, column) => {
		return (rowData.Transaction).indexOf("_") === -1 ? rowData.Transaction : rowData.Transaction.substring(0, rowData.Transaction.indexOf("_"))
	}
	
	const setSHortTr=(ddd) => { //for data export to excel
		return ddd.map(x=> ({...x, 'Transaction': showShortTR(x, null)}));
	}
	
	 const header = <Header 
                                onChange={onSearchChange}
                                runFltr={()=> setShowFilter(!showFilter)}
                                showFilter={showFilter}
                                searchValue={searchValue}
                                resetFltr={resetFilter}
                                handleToggleCols={handleToggleCols}
                                cols={cols}
                                tableData={setSHortTr(vtDataC)}
								showOwners={true}
								showSearch={true}
                            /> ;  
	
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}

	let dynamicColumns = cols.filter(col => col.showcol === true).map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		style={{textAlign:'center'}}
					   		body={col.field==='el'? actionTemplate: dataTable}
					   		filter={col.field!=='el'? showFilter:false}
					   />;
        	});
		
	return(	
		<div className="datatable-responsive-demo">
		<Grid container >
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
				title='This vat payment will be deleted!' 
				content='Please Confirm'/>
			<DataTable  value={vtDataC}
						ref={(el) => setDt(el)}
						globalFilter={globalFilter}
						className="p-datatable-responsive-demo"
						header={header}
						paginator={true}
						paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
						currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
						rows={10} rowsPerPageOptions={[5,10,20]}>
					{dynamicColumns}
			</DataTable>
		
			{write && <Fab color="primary" aria-label="add" className={classes.button} onClick={addOrder}>
	  						<AddIcon />
					</Fab>}
			{ displayDialog ?  <VatModal  />: null}
		</Grid>
		</div>
	)
};

export default Table;

/*
	
*/
