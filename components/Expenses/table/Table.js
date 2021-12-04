import React, {useState, useContext, useEffect} from 'react';
import {Grid,IconButton,Tooltip, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpenseModal from './Modals/ExpenseModal';
import Header from '../../Subcomponents/tablecomponents/Header';
import { makeStyles } from '@material-ui/core/styles';
import SnackBar from '../../Subcomponents/SnackBar';
import {delData, convId2Item,getRecurringExpense, delDPaymentsBatch, Num2} from '../../../functions/functions.js';
import {ExContext} from '../../../contexts/useExContext';
import {SelectContext} from '../../../contexts/useSelectContext';
import DelDialog from '../../Subcomponents/DeleteDialog';
import {AuthContext} from '../../../contexts/useAuthContext';
import useWindowSize from '../../../hooks/useWindowSize';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 
import { v4 as uuidv4 } from 'uuid';

const dateFormat = require('dateformat');	
const tableCols = [
			{field: 'Expander', header: '',el: 'el', showcol: true, s:['xs','sm','md','lg', 'xl']},
            {field: 'LstSave', header: 'Last Created', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'ExpType', header: 'Expense Type', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'vendor', header: 'Vendor', showcol: true, s:['md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: true, s:['md','lg', 'xl']},
		//	{field: 'GstName', header: 'Guest', showcol: true,initial: 9},
			{field: 'AccDate', header: 'Accounting Date', showcol: true,s:['xs','sm','md','lg', 'xl']},
		//	{field: 'PrpName', header: 'Property', showcol: true,initial: 4},
			{field: 'AptName', header: 'Apartment', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'ExpAmntWthtoutVat', header: 'Expense Amount Before VAT', showcol: true,s:['lg', 'xl']},
			{field: 'VatAmnt', header: 'VAT', showcol: true,s:['lg', 'xl']},
			{field: 'Amnt', header: 'Amount', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'TtlPmnt', header: 'Total Payment', showcol: true,s:['lg', 'xl']},
			{field: 'BlncExp', header: 'Balance Due', showcol: true,s:['lg', 'xl']},
			{field: 'el' , header: '', el: 'el', showcol: true,s:['xs','sm','md','lg', 'xl']}
];

        
const useStyles = makeStyles(theme => ({
 	button: {
     margin: theme.spacing(1.5, 0 ,0, 1),
	background: '#5ec198'
  },
}));

const Table =(props) =>{
	
	const classes = useStyles();
	const scrSize = useWindowSize();
	const [screenSize, setScreenSize] = useState();
	const {exDataPrp, setExDataPrp, selectValue, displayDialog, setDisplayDialog,
		  snackbar, setSnackbar, setRecStart, setRecEnd} = useContext(ExContext);
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const {propertySlct, date} = useContext(SelectContext);
	const {write, uidCollection} = useContext(AuthContext);					 						 				 
	const {settings} = useContext(SettingsContext);
	
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
			setRecStart(null)
			setRecEnd(null)
		}
	};
	
	 const createEmptyObj = () =>{
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= q==='AccDate'  ? null: '';
		});
		 tmpObj.Vat=+settings.properties.filter(x=> x.id===propertySlct)[0]['VAT']===0? false :true;
		 delete tmpObj.el;
		 tmpObj.Transaction = '';
		 tmpObj.Payments=[{P:'', Date:null, PM:'', id: uuidv4()}];	
		 tmpObj.vendor='';
		 tmpObj.PrpName=propertySlct;
		 tmpObj.AptName='All';
		 tmpObj.TtlPmnt = '';
		 tmpObj.BlncExp='';
		 tmpObj.recCost=false;
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
        setExDataPrp({...exDataPrp, 'exData' : exDataPrp.exData});
        
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
	
	
	const selectValueOrder= async(r)=>{
		let tmp = {...r, 'AptName': r.AptName!=='All' ? settings.apartments.filter(x=> x.AptName===r.AptName)[0]['id']:r.AptName,
	 			'ExpType': settings.exType.filter(y=>y.item===r.ExpType)[0]['id']};
		selectValue(tmp)
		
		if(r.recCost && r.recTransaction!==null){
			let valTmp = await getRecurringExpense(r)
			setRecStart(valTmp.startDate)
			setRecEnd(valTmp.recEnd)
		}
	}
	
	const actionTemplate = (node) => {
        return <div style={{display: 'inline-flex'}}>
			<Tooltip title='Edit' aria-label='Edit'>
				<div>
					<IconButton aria-label='Edit' onClick={() => selectValueOrder(node.data)}
							style={(node.data.ExpType=== 'Channel advance commission' || 
							node.data.ExpType=== 'Management commission' || node.data.Transaction==='') ? {display:'none'}:
						{display:'block'}}
						>
						<EditIcon />
					</IconButton>
				</div>
			</Tooltip>
			<Tooltip title='Delete'	aria-label='Delete'>
				<div>
					<IconButton aria-label='Delete' onClick={()=> delRow(node.data)} 
						style={(node.data.ExpType=== 'Channel advance commission' || 
							node.data.ExpType=== 'Management commission' || node.data.Transaction==='') ? {display:'none'}:
						{display:'block'}}
						disabled={!write}>
						<DeleteIcon />
					</IconButton>
				</div>
			</Tooltip>	
        </div>;
    }

	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr = exDataPrp.exData.filter(q=>q.Transaction!==row.Transaction);
		setExDataPrp({...exDataPrp, 'exData' :newArr} );
			async function Snack() {
				setSnackbar({open: ( await delData(uidCollection, 'expenses',  date.year, row.Transaction)), msg: 'Expense has been deleted!',
							 variant: 'success'}) ; 
				await delDPaymentsBatch(uidCollection,'payments',row.Payments)
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
	
	const header = <Header 
                                onChange={onSearchChange}
                                runFltr={()=> setShowFilter(!showFilter)}
                                showFilter={showFilter}
                                searchValue={searchValue}
                                resetFltr={resetFilter}
                                handleToggleCols={handleToggleCols}
                                cols={cols}
                                tableData={setSHortTr(convId2Item(exDataPrp.exData, ['AptName','ExpType','vendor', 'ExpAmntWthtoutVat', 'TtlPmnt'], settings)  )} 
								showOwners={false}
						 		showSearch={true}
                            /> ;  
	
	const cur = settings.CompDtls.currency;	
	const showAmnt=(node)=>`${cur} ${Num2(node.data.Amnt)}`;
	const ShowExpAmntWthtoutVat=(node)=>`${cur} ${Num2(node.data.ExpAmntWthtoutVat)}`;
	const showBlncExp=(node)=> {return (node.data.Transaction!=='' && node.data.ExpType==='Management commission') ? '' : `${cur} ${Num2(node.data.BlncExp)}`}
	const showTtlPmnt=(node)=> {return (node.data.Transaction!=='' && node.data.ExpType==='Management commission') ? '' : `${cur} ${Num2(node.data.TtlPmnt)}`}
	const showVatAmnt=(node)=>`${cur} ${Num2(node.data.VatAmnt)}`;
	const showDatesMonth=(node)=> dateFormat(node.data.AccDate, "mmm-yyyy");
	const showRCref=(node)=>{
			return <div>
			<Tooltip title={(node.data.ExpType==='Channel advance commission' || 
						node.data.ExpType==='Management commission')? <span>{showShortTR(node.data.RC)} {node.data.GstName}</span> :''}>
				<div>
					<span>{showShortTR(node.data.Transaction)}</span>
				</div>
			</Tooltip>
			</div>
	}
	

	// const showItemExpType=(node)=>{
	// 	return 	(node.data.ExpType==='Channel advance commission' || 
	// 					node.data.ExpType==='Management commission') ? node.data.ExpType:
	// 					idToItem(settings.exType, node.data.ExpType, 'item' );
	// }
	// const showItemVend=(node)=>{		
	// 	return 	(node.data.ExpType!=='Channel advance commission') ? node.data.vendor :	idToItem(settings.channels, node.data.vendor, 'RsrvChn');
	// }
	
	
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
							col.field==='Transaction' ? showRCref:null}
					   		//headerStyle={{overflow:'visible'}}
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
