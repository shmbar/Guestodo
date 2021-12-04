import React, {useState, useContext, useEffect} from 'react';
import {Grid, Fab,IconButton, Tooltip} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { TreeTable } from 'primereact/treetable';
import {Column} from 'primereact/column';
import ExpenseModal from './Modals/ExpenseModal';
import Header from '../../Subcomponents/tablecomponents/Header';
import { makeStyles } from '@material-ui/core/styles';
import SnackBar from '../../Subcomponents/SnackBar';
import {delData, convId2Item, delDPaymentsBatch, Num2} from '../../../functions/functions.js';
import {ExContext} from '../../../contexts/useExContext';
import useWindowSize from '../../../hooks/useWindowSize';
import DelDialog from '../../Subcomponents/DeleteDialog';
import {AuthContext} from '../../../contexts/useAuthContext';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 
import {SelectContext} from '../../../contexts/useSelectContext';
import { v4 as uuidv4 } from 'uuid';

const tableCols = [
			{field: 'Expander', header: '',el: 'el', showcol: true, s:['xs','sm','md','lg', 'xl']},
            {field: 'LstSave', header: 'Last Created', showcol: false,s:['xs','sm','md','lg', 'xl']},
			{field: 'ExpType', header: 'Expense Type', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'vendor', header: 'Vendor', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: true,s:['md','lg', 'xl']},
			{field: 'AccDate', header: 'Accounting Date', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'ExpAmntWthtoutVat', header: 'Amount Before VAT', showcol: true,s:['lg', 'xl']},
			{field: 'VatAmnt', header: 'VAT', showcol: true,s:['md','lg', 'xl']},
			{field: 'Amnt', header: 'Amount', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'TtlPmnt', header: 'Total Payment', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'BlncExp', header: 'Balance Due', showcol: true,s:['lg', 'xl']},
			{field: 'el' , header: '', el: 'el', showcol: true,s:['xs','sm','md','lg', 'xl']}
];

const dateFormat = require('dateformat');	

const useStyles = makeStyles(theme => ({
 	button: {
     	margin: theme.spacing(1.5, 0 ,0, 1),
		background: '#5ec198'
  },
}));

const Table =(props) =>{

	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();

	const classes = useStyles();
	
	const {exDataC, setExDataC, selectValue, displayDialog, setDisplayDialog,
		  snackbar, setSnackbar} = useContext(ExContext);
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const [open, setOpen] = useState(false);
	const [id, setId] = useState('');
	const {write, uidCollection} = useContext(AuthContext);					 						 				 
	const {settings} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
	
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
		return tmpObj[q]= q==='AccDate'  ? null: '';
		});
		 tmpObj.Vat=false;
		 delete tmpObj.el;
		tmpObj.Transaction = '';
		 tmpObj.Payments=[{P:'', Date:null, PM:'', id: uuidv4()}];	
		 tmpObj.vendor='';
		 tmpObj.TtlPmnt = '';
		 tmpObj.BlncExp='';
		 tmpObj.CostType='Fixed Cost';
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
        await  setExDataC(exDataC);
        
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
	
	const selectValueOrder= (r)=>{
		let tmp = {...r, 'ExpType': settings.exTypeCompany.filter(x=> x.item===r.ExpType)[0]['id']};
		selectValue(tmp)
	}
	
	
		const actionTemplate = (node) => {
        return <div style={{display: 'inline-flex'}}>
			<Tooltip title='Edit' aria-label='Edit'>
				<div>
					<IconButton aria-label='Edit' onClick={() => selectValueOrder(node.data)}
							style={node.data.Transaction==='' ? {display:'none'}:
						{display:'block'}}
						>
						<EditIcon />
					</IconButton>
				</div>
			</Tooltip>
			<Tooltip title='Delete'	aria-label='Delete'>
				<div>
					<IconButton aria-label='Delete' onClick={()=> delRow(node.data)} 
						style={node.data.Transaction==='' ? {display:'none'}:
						{display:'block'}}
						disabled={!write}>
						<DeleteIcon />
					</IconButton>
				</div>
			</Tooltip>	
        </div>;
    }
		
	
	const delRow = (rowData) =>{
		setId(rowData.Transaction)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr = exDataC.filter(q=>q.Transaction!==id);
			setExDataC(newArr);
			async function Snack() {
				setSnackbar({open: ( await delData(uidCollection,'expensesCompany',date.year, id)), msg: 'Expense has been deleted!',
							 variant: 'success'}) ; 
				await delDPaymentsBatch(uidCollection,'paymentsCompany', exDataC.filter(q=>q.Transaction===id)[0].Payments)
			}
		Snack();
		setOpen(false);
	}
	
	const showShortTR=(zz) =>  { 
		return 	(zz==null || zz.indexOf("_") === -1) ? zz : zz.substring(0, zz.indexOf("_"));
	}
	
	const setSHortTr=(ddd) => { //for data export to excel
			return ddd.map(x=> ({...x, 'Transaction': showShortTR(x.Transaction)}));
	}
	
	const cur = settings.CompDtls.currency;	
	const showAmnt=(node)=>`${cur} ${Num2(node.data.Amnt)}`;
	const ShowExpAmntWthtoutVat=(node)=>`${cur} ${Num2(node.data.ExpAmntWthtoutVat)}`;
	const showBlncExp=(node)=> `${cur} ${Num2(node.data.BlncExp)}`;
	const showTtlPmnt=(node)=> `${cur} ${Num2(node.data.TtlPmnt)}`;
	const showVatAmnt=(node)=>`${cur} ${Num2(node.data.VatAmnt)}`;
	const showDatesMonth=(node)=> dateFormat(node.data.AccDate, "mmm-yyyy");
	const showRCref=(node)=>{return 	showShortTR(node.data.Transaction)}
				
	
	
	 const header = <Header 
                                onChange={onSearchChange}
                                runFltr={()=> setShowFilter(!showFilter)}
                                showFilter={showFilter}
                                searchValue={searchValue}
                                resetFltr={resetFilter}
                                handleToggleCols={handleToggleCols}
                                cols={cols}
                                tableData={setSHortTr(convId2Item(exDataC, ['ExpType'], settings))}
								showOwners={false}
								showSearch={true}
                            /> ;  
	

	let dynamicColumns = cols.filter(col => col.showcol === true).map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		body={col.field==='el' ? actionTemplate: 
							col.field==='Amnt'? showAmnt :
							col.field==='ExpAmntWthtoutVat'? ShowExpAmntWthtoutVat:
							col.field==='BlncExp'? showBlncExp: 
							col.field==='TtlPmnt'? showTtlPmnt: 
							col.field==='VatAmnt' ? showVatAmnt:
							col.field==='AccDate' ? showDatesMonth:
							col.field==='Transaction' ? showRCref:
							null}
					   
					   		style={col.field==='Expander' ? {textAlign:'center', width: '4em'} :
							    {textAlign:'center'}}
					   		filter={(col.field!=='el' && col.field!=='Expander')? showFilter:false }
							expander={col.field==='Expander' && true}
					   />;
        	});

	return(	
		<div className="datatable-responsive-demo">
		<Grid container >
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This expense will be deleted!' 
					content='Please Confirm'/>
			
			<TreeTable  value={props.dataTable}  
						ref={(el) => setDt(el)}
						className="p-datatable-responsive-demo"
				 		globalFilter={globalFilter}
						header={header}
						paginator={true}
						rows={10} rowsPerPageOptions={[5,10,20]}
						paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
								currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}>
					{dynamicColumns}
			</TreeTable>
				{write && <Fab color="primary" aria-label="add" className={classes.button} onClick={addOrder}>
	  						<AddIcon />
					</Fab>}
			{ displayDialog ?  <ExpenseModal  />: null}
		</Grid>
		</div>
	)
};

export default Table;

/*
	
*/
