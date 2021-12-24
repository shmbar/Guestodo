import React, {useContext, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, FormGroup, Fab, Container, Checkbox, FormControlLabel} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';	
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import TabRecuurringModal from './modals/TabRecuurringModal';
import {SettingsContext} from '../../contexts/useSettingsContext';
import useWindowSize from '../../hooks/useWindowSize';
import {AuthContext} from '../../contexts/useAuthContext';
import EditDel from '../Subcomponents/EditDel'
import { v4 as uuidv4 } from 'uuid';
import {showDataTable} from '../../functions/setTableDt.js';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {readRecurringExpense, convId2Item, delRecurringExpense} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import DelDialog from '../Subcomponents/DeleteDialog';

const dateFormat = require('dateformat');

const tableCols = [
			{field: 'ExpType', header: 'Expense Type', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'vendor', header: 'Vendor', showcol: true, s:['md','lg', 'xl']},
			{field: 'PrpName', header: 'Property', showcol: true,initial: 4},
			{field: 'AptName', header: 'Apartment', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'startDate', header: 'Start', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'recEnd', header: 'End', showcol: true,s:['sm','md','lg', 'xl']},
			{field: 'Amnt', header: 'Amount', showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'el' , header: '', el: 'el', showcol: true,s:['xs','sm','md','lg', 'xl']}	
];


const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
     margin: theme.spacing(1.5, 0 ,0, 1),
  },
  input: {
    display: 'none',
  },
  paper: {
	 padding: theme.spacing(1, 4, 3, 4),
  },
	 grid: {
      padding: theme.spacing(1),
	}
}));

const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);


const TabExpRecurring =() =>{
	const scrSize = useWindowSize();
	const classes = useStyles();
	const {settings, selectValueSettings,setRecStart, setRecEnd} = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const {uidCollection} = useContext(AuthContext);
	const [recData, setRecData] = useState([]);
	const [activeOnly, setActiveOnly] = useState(true);
	
	useEffect(()=>{
		
		const loadRecurring=async()=>{
			let tmpData = await readRecurringExpense(uidCollection);
			setRecData(tmpData)
		}
	
		loadRecurring()
	},[setRecData, uidCollection])
	
	const addEnt= ()=>{
        selectValueSettings(createEmptyObj());
		setRecEnd(null);
		setRecStart(null);
    };
	
	 const createEmptyObj = () =>{
        let tmpObj={Amnt: '',AptName: '',BlncExp: '',CostType: "Fixed Cost",ExpAmntWthtoutVat: '',	ExpType: '',
		Expander: '',	Payments: [{Date:null, P: '', PM: ''}],	PmntStts: "Unpaid",	PrpName: '',TtlPmnt: '',Vat: false,
		VatAmnt: '', recEnd: null,	recTransaction: uuidv4(),	startDate: null,uidCollection: uidCollection,vendor: ''}
		
		 return tmpObj;
    };
	
	const selectValueOrder= async(rowData)=>{
		let tmp ={...rowData, 'AptName': rowData.AptName!=='All' ? settings.apartments.filter(x=> x.AptName===rowData.AptName)[0]['id'] : 'All',
	 			'ExpType': settings.exType.filter(y=>y.item===rowData.ExpType)[0]['id'],
				 'PrpName': settings.properties.filter(y=>y.PrpName===rowData.PrpName)[0]['id']
				 }
		
		selectValueSettings(tmp);

		setRecStart(tmp.startDate) 
		setRecEnd(tmp.recEnd)
	};
		
	
	
		
	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueOrder} rowData={rowData}  column={column}  delRow={delRow} />;
    }
	
	
	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr=[];
		
				newArr = recData.filter(x=> (x.recTransaction!==row.recTransaction));
				setRecData(newArr)
			
				async function Snack() {
					//delete
				setSnackbar( {open: (await delRecurringExpense(row)),	msg: 'Expense has been deleted!', variant: 'success'}); 
			}
			Snack();
		setOpen(false)
	};	
	
		
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}

	const Dates=(rowData, column)=>{
		return dateFormat(rowData[column.field], 'mmm-yyyy')
	}
	
	
	let dynamicColumns = tableCols.map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		body={col.field==='el'? actionTemplate:
							col.field==='startDate'? Dates:
							col.field==='recEnd'? Dates: dataTable} 
					   		style={{textAlign:'center'}}
					   />;
        	});

	return(	
		<div className="datatable-responsive-demo">
		<Container maxWidth="lg" style={{paddingLeft:'0px', paddingRight:'0px'}}>
		<Paper className={classes.paper} >
			 	 <FormGroup row style={{justifyContent: 'space-between'}} >
				 	<h5 className='ttlClr' style={{paddingBottom: '3px'}}>Recurring Expenses</h5>
					 <FormControlLabel
						control={
							  <GreenCheckbox
								checked={activeOnly}
								onChange={()=>setActiveOnly(!activeOnly)}
							  />
							}
					label="Active only"
			  		/>
					
				</FormGroup>
				<Grid container spacing={3} className={classes.grid} >
					<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
						variant={snackbar.variant}/>
					
					<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This expense will be deleted!' 
					content='Please Confirm'/>
					
					
				
					
					
					<DataTable  value={activeOnly ?  convId2Item(recData.filter(x=> new Date(x.recEnd)>= new Date()),
																 ['AptName', 'ExpType', 'PrpName'], settings) :
								convId2Item(recData, ['AptName', 'ExpType', 'PrpName'], settings)} 
						
								paginator={true} 
								className="p-datatable-responsive-demo"
								rows={10} rowsPerPageOptions={[5,10,20]}
								paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
								currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
								>
                       		{dynamicColumns}
					</DataTable>

					<Fab color="primary" aria-label="add" className={classes.button} onClick={addEnt}>
	  						<AddIcon />
					</Fab>
				</Grid>
			 <TabRecuurringModal snackbar={snackbar} setSnackbar={setSnackbar} recData={recData} setRecData={setRecData}/>
		</Paper>	
		</Container>
		</div>	
	)
};

export default TabExpRecurring;

