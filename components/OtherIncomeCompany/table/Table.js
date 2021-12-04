import React, {useState, useContext, useEffect} from 'react';
import {Grid,Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import OtherIncomeModal from './Modals/OtherIncomeModal';
import Header from '../../Subcomponents/tablecomponents/Header';
import { makeStyles } from '@material-ui/core/styles';
import SnackBar from '../../Subcomponents/SnackBar';
import {delData, convId2Item, delDPaymentsBatch} from '../../../functions/functions.js';
import {OiContext} from '../../../contexts/useOiContext';
import useWindowSize from '../../../hooks/useWindowSize';
import DelDialog from '../../Subcomponents/DeleteDialog';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 
import {AuthContext} from '../../../contexts/useAuthContext';
import {SelectContext} from '../../../contexts/useSelectContext';
import EditDel from '../../Subcomponents/EditDel'
import {showDataTable} from '../../../functions/setTableDt.js';
import { v4 as uuidv4 } from 'uuid';

const tableCols = [
            {field: 'LstSave', header: 'Last Created', showcol: false,s:['xs','sm','md','lg', 'xl']},
			{field: 'incType', header: 'Income Type', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'AccDate', header: 'Accounting Date', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'IncAmntWthtoutVat', header: 'Amount Before VAT', showcol: true,s:['md','lg', 'xl']},
			{field: 'VatAmnt', header: 'VAT', showcol: true,s:['md','lg', 'xl']},
			{field: 'Amnt', header: 'Amount', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'TtlPmnt', header: 'Total Payment', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'Blnc', header: 'Balance Due', showcol: true,s:['lg', 'xl']},
			{field: 'el' , header: '', el: 'el', showcol: true,s:['xs','sm','md','lg', 'xl']}
];

            
        
const useStyles = makeStyles(theme => ({
 	button: {
     	margin: theme.spacing(1.5, 0 ,0, 1),
		background: '#5ec198'
  },
}));

const Table =() =>{

	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	
	const {otherIncC, setOtherIncC, selectValue, displayDialog, setDisplayDialog,
		  snackbar, setSnackbar} = useContext(OiContext);
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const [open, setOpen] = useState(false);
	const [id, setId] = useState('');			 						 				 
	const {settings} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
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

	const addOrder= ()=>{
			selectValue(createEmptyObj());
			setDisplayDialog(true);	
	};
	
	const classes = useStyles();

	 const createEmptyObj = () =>{
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= q==='AccDate'  ? null: '';
		});
		 tmpObj.Vat=false;
		 delete tmpObj.el;
		tmpObj.Transaction = '';
		 tmpObj.Payments=[{P:'', Date:null, PM:'', id: uuidv4()}];	
		 tmpObj.TtlPmnt = '';
		 tmpObj.incType = '';
		 tmpObj.Blnc='';
		 tmpObj.PmntStts='';
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
        await  setOtherIncC(otherIncC);
        
    };
	
	 const handleToggleCols= value => {
        let newArr = [...cols];
        let newObj = {...value, 'showcol': !value.showcol};
        newArr[newArr.map(i => i.field).indexOf(value.field)] = newObj;
        setCols(newArr);
    };
	
	const selectValueOrder= (r)=>{
		let tmp = {...r, 'incType': settings.incTypeCompany.filter(y=>y.item===r.incType)[0]['id']}
					
		selectValue(tmp)
	}
	
	
	const actionTemplate = (rowData, column) => {
      return <EditDel selectValueOrder={selectValueOrder} rowData={rowData}  column={column}  delRow={delRow} />;
    }
	
	const delRow = (rowData) =>{
		setId(rowData.Transaction)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr = otherIncC.filter(q=>q.Transaction!==id);
			setOtherIncC(newArr);
			async function Snack() {
				setSnackbar({open: ( await delData(uidCollection, 'otherIncomeCompany',date.year,  id)), msg: 'Income has been deleted!',
							 variant: 'success'}) ; 
				await delDPaymentsBatch(uidCollection,'paymentsCompany', otherIncC.filter(q=>q.Transaction===id)[0].Payments)
			}
		Snack();
		setOpen(false);
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
                                tableData={setSHortTr(convId2Item(otherIncC, ['incType', 'IncAmntWthtoutVat'], settings))}
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
					title='This income will be deleted!' 
					content='Please Confirm'/>
			
			<DataTable  value={convId2Item(otherIncC, ['incType'], settings)}
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
			<Fab color="primary" aria-label="add" className={classes.button} onClick={addOrder}>
	  						<AddIcon />
			</Fab>
			{ displayDialog ?  <OtherIncomeModal  />: null}
		</Grid>
		</div>
	)
};

export default Table;

/*
	
*/
