import React, {useContext, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, Grid, Paper, FormGroup,
	   	FormControlLabel, Fab, Tooltip} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';	
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Tab2Modal from './modals/Tab2Modal';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {SelectContext} from '../../contexts/useSelectContext';
import useWindowSize from '../../hooks/useWindowSize';
import Tab2ModalApartmnt from './modals/Tab2ModalApartmnt';
import { v4 as uuidv4 } from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {AuthContext} from '../../contexts/useAuthContext';
import EditDel from '../Subcomponents/EditDel'
import {showDataTable} from '../../functions/setTableDt.js';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import TableTtl from '../Subcomponents/tableTitleAndExplain'
import {addDataSettings, delField} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import DelDialog from '../Subcomponents/DeleteDialog';



const tableCols = [
            {field: 'Owner', header: 'Owner Name'},
			{field: 'PrpName', header: 'Property Name'},
			{field: 'StartDate', header: 'Start Date'},
			{field: 'EndDate', header: 'End Date'},
			{field: 'ManagCommission', header: 'Management Commission'},
		//	{field: 'ExtraRevCommission', header: 'Extra Commission'},
		//	{field: 'inclVat', header: 'Management Comission Include/Exclude Vat'},
		//	{field: 'addVat', header: 'Add VAT to Comission amount'},
			{field: 'Fund', header: 'Fund'},	
        	{field: 'el' , header: '', el: 'el'},	
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

const CustomToolTip = withStyles({
        tooltip: {
            fontSize: 13,
        },
})(Tooltip);

const Tab2 =() =>{
	const scrSize = useWindowSize();

	const classes = useStyles();
	const {settings, updtSettings, selectValueSettings, displayDialogSettings,
		   settingsShows, setValueSettings, setPropertyList, setSettings} = useContext(SettingsContext);
	const {setPropertySlct} = useContext(SelectContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const [activeOnly, setActiveOnly] = useState(true);
	const [displayAptModalDialog, setDisplayAptModalDialog] = useState(false);
	const {uidCollection} = useContext(AuthContext);
	
	const addEnt= ()=>{
        selectValueSettings(createEmptyObj());
    };
	
	 const createEmptyObj = () =>{
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= (q==='StartDate' || q==='EndDate' ) ? null: '';
		});
		 delete tmpObj.el;
		 tmpObj.id=uuidv4();
		 tmpObj.show=true;
		 tmpObj.VAT=0;
		 tmpObj.Commissions={ManagCommission: 0, addVat:false, inclVat:false};
		 tmpObj.Fees=[{FeeName:'', FeeType:'', FeeAmount: '', FeeModality: '', FeeDescription: '', 'id': uuidv4()}];
		 tmpObj.Taxes=[{TaxName:'', TaxType:'', TaxAmount: '', TaxTypeDscrp: '', TaxModality: '', TaxDescription: '', 'id': uuidv4()}];
		 return tmpObj;
    };
	
	
	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueSettings} rowData={rowData}  column={column}  delRow={delRow} dis={!rowData.show} selectPropertyData={selectPropertyData}  properties={true} />;
    }
	
	const selectPropertyData=(rowData)=>{
		setValueSettings(rowData)
		setDisplayAptModalDialog(true);
	}
	
	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr=[];
			if(settingsShows[row.id]){ ////is in use
				newArr = settings.properties.map(x=> (x.id===row.id) ? {...x, 'show':false }: x);
				updtSettings('properties',newArr);
			}else{  //not in use
				newArr = settings.properties.filter(q=>q.id!==row.id);
				let apts = settings.apartments.filter(a=> a.PrpName!==row.id)
				setSettings({...settings, 'properties': newArr, 'apartments': apts});
				
				delField(uidCollection, 'settingsShows', 'shows', row.id);
				addDataSettings(uidCollection, 'settings', 'apartments', {'apartments':apts})
			}

			async function Snack() {
				setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'properties', {'properties':newArr})),
					msg: 'Property has been deleted!', variant: 'success'}); 
			}
			
			const properties =  newArr.filter(x=> x.show ).map(x=>x.PrpName);
			setPropertyList(properties);
			setPropertySlct(null)
		
			Snack();
		setOpen(false)
	};	

	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}
	
	const dataTable1=(rowData, column)=>{
		return `${rowData.Commissions.ManagCommission}%`
	}
	
	const headerTemplate=(txt, tltip)=>{
					return( 
						<span>
							{txt}
							
							 <CustomToolTip title={tltip}>
								<ContactSupportIcon style={{marginLeft: '10px'}}/>
							 </CustomToolTip>
						</span>
					)
			
		
	}		
			
	//const vatIncluded = <>Commission on VAT Included - VAT (value added Tax) is a sales tax that applies to the purchase of most goods and services. Select Yes if you wish to charge the commision 		
	//						percentage from property reservation revenue amount include VAT. Select No if you wish to charge the commision percentage from property reservation revenue before vat or if in 
	//							the property’s region not charging  VAT by law.</>
	
	//const vatAdded=<>Commission on VAT Added - VAT (value added Tax) is a sales tax that applies to the purchase of most goods and services. Select Yes if you wish to charge VAT on the commission you
	//				collect	from the property owner Or select no if your region not charging  VAT by law.</>
	
	return(	
		<div className="datatable-responsive-demo">
		<Paper className={classes.paper} >
			 	 <FormGroup row style={{justifyContent: 'space-between'}} >
					 <TableTtl ttl='Properties Settings' tltip='List of managed properties' />
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
					title='This property will be deleted!' 
					content='Please Confirm'/>
					
					<DataTable  value={settings.properties!=null ?
										(activeOnly ? settings.properties.filter(x=>x.show) : settings.properties) : []} 
								paginator={true} 
								rows={10} rowsPerPageOptions={[5,10,20]}
								className="p-datatable-responsive-demo"
								paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
								currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
								>
						
                        <Column field="Owner" header="Owner" style={{textAlign:'center'/* , width: '100px' */}} body={dataTable} />
                        <Column field="PrpName" header="Property" body={dataTable} 
							style={{textAlign:'center'/* , width: '100px' */}}/>
                        <Column field="StartDate" header={headerTemplate('Start Date', 'The date of property activation')} style={{textAlign:'center'/* , width: '100px' */}} body={dataTable}/>
						<Column field="ManagCommission" header={headerTemplate('Rsrv. Comm.','Reservation Commission - Management  percentage  fee you collect from each property on reservation revenue')} body={dataTable1}
							style={{textAlign:'center'/* , width: '100px' */}} />
					
				{/*		<Column field="inclVat" header={headerTemplate('VAT Included', vatIncluded)} body={dataTable}
							style={{textAlign:'center'}} /> */}
				{/*		<Column field="addVat" header={headerTemplate('VAT Added', vatAdded)} body={dataTable}
							style={{textAlign:'center'}} />  */}
						<Column field="Fund" header="Fund" body={dataTable}
							style={{textAlign:'center'}} />
						<Column field="el" header=""  el='el' body={actionTemplate}
							style={{textAlign:'center'/* , width: '130px' */}} />
						
					</DataTable>

					<Fab color="primary" aria-label="add" className={classes.button} onClick={addEnt}>
	  						<AddIcon />
					</Fab>
				</Grid>
			 {displayDialogSettings ? <Tab2Modal snackbar={snackbar} setSnackbar={setSnackbar} /> : null}
			{ displayAptModalDialog ?  <Tab2ModalApartmnt 
									   displayAptModalDialog={displayAptModalDialog}
									   setDisplayAptModalDialog={setDisplayAptModalDialog}
										/>: null}
		</Paper>
		</div>
	)
};

export default Tab2;

/*
	{/*	<Column field="ExtraRevCommission" header={headerTemplate('Extra Comm.','Extra Revenue Commission - Management  percentage  fee you collect from each property on Extra revenue transaction')} body={dataTable}
							style={{textAlign:'center'/* , width: '100px'  */
					  

