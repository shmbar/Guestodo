import React, {useContext, useState} from 'react';
import {Grid, FormGroup, Paper, FormControlLabel, Checkbox, Fab, Tooltip, Container } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';	
import { makeStyles } from '@material-ui/core/styles';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Tab4Modal from './modals/Tab4Modal';
import {SettingsContext} from '../../contexts/useSettingsContext';
import useWindowSize from '../../hooks/useWindowSize';
import { v4 as uuidv4 } from 'uuid';
import {addDataSettings, delField} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {AuthContext} from '../../contexts/useAuthContext';
import EditDel from '../Subcomponents/EditDel'
import DelDialog from '../Subcomponents/DeleteDialog';
import {showDataTable} from '../../functions/setTableDt.js';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';

const tableCols = [
            {field: 'RsrvChn', header: 'Reservation Channel'},
			{field: 'ChnCmsn', header: 'Invoice Channel Fee'},
			//{field: 'MngCmsn', header: 'Management Commission'},
			{field: 'UpFrnt', header: 'Up Front Fee'},
			{field: 'el' , header: '', el: 'el'}

];

const cnlArr = ['Airbnb','Booking','Tripadvisor','Agoda','Flipkey','Expedia','HomeAway', 'Tokeet'];


const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);



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

const Tab4 =() =>{
	const scrSize = useWindowSize();
	const {settings, updtSettings, selectValueSettings, displayDialogSettings,
		   settingsShows,chnnlslogo} = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const [activeOnly, setActiveOnly] = useState(true);
	const {uidCollection} = useContext(AuthContext);
	
	const classes = useStyles();
	
	const addChannel= ()=>{
		selectValueSettings(createEmptyObj());
	};
	
	 const createEmptyObj = () =>{
		 let tmpObj={};
		 tableCols.map(k =>k.field).map(q =>{
		 return tmpObj[q]='';
		 });
		 delete tmpObj.el;
		 tmpObj.id = uuidv4();
		 tmpObj.show = true;
		 return tmpObj;
	 };
	
	
	const actionTemplate = (rowData, column) => {
		const dsbl =  cnlArr.includes(rowData['RsrvChn']);
		return <EditDel selectValueOrder={selectValueSettings} rowData={rowData}  column={column}  delRow={delRow} dis={!rowData.show} dsbl={dsbl}/>;
		
    }
	
	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr=[];
			if(settingsShows[row.id]){ ////is in use
				newArr = settings.channels.map(x=> (x.id===row.id) ? {...x, 'show':false }: x);
				updtSettings('channels',newArr);
			}else{  //not in use
				newArr = settings.channels.filter(q=>q.id!==row.id);
				updtSettings('channels',newArr);
				delField(uidCollection, 'settingsShows', 'shows', row.id);
			}

			async function Snack() {
				setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'channels', {'channels':newArr})),
					msg: 'Channel has been deleted!', variant: 'success'}); 
			}
			Snack();
	setOpen(false)
	}
	

	const lineThrough = (rowData, column) =>{
		const tmpImg = chnnlslogo.filter(x=> x.brnd===rowData['RsrvChn'])[0] || chnnlslogo[chnnlslogo.length-1];
        //  style={{width: '100px', margin: 'auto'}}
		return 	scrSize !== 'xs' ?
			!rowData.show ?
					<div style={{width: '100px', margin: 'auto', textDecoration: 'line-through'}}>
							<img src={tmpImg.img} alt={tmpImg.brnd}	width={tmpImg.width} style={{marginRight: '15px'}} />
								{rowData['RsrvChn']}
					</div>:
					<div style={{width: '100px', margin: 'auto'}}>
							<img src={tmpImg.img} alt={tmpImg.brnd}	width={tmpImg.width} style={{marginRight: '15px'}} />
								{rowData['RsrvChn']}
					</div> :
			<> 
			  	<span className="p-column-title">{column.header}</span>
				  	{!rowData.show ?
						<div style={{width: '100px', margin: 'auto', textDecoration: 'line-through', display: 'inline'}}>
								<img src={tmpImg.img} alt={tmpImg.brnd}	width={tmpImg.width} style={{marginRight: '15px'}} />
									{rowData['RsrvChn']}
						</div>:
						<div style={{width: '100px', margin: 'auto', display: 'inline'}}>
								<img src={tmpImg.img} alt={tmpImg.brnd}	width={tmpImg.width} style={{marginRight: '15px'}} />
									{rowData['RsrvChn']}
						</div>
					}
			</>
			
		
    }
	

	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}

	const CustomToolTip = withStyles({
        tooltip: {
            fontSize: 13,
        },
	})(Tooltip);
	
	const setToolTip=(x)=>{
	 if(x==='Invoice Channel Fee'){
		return	<span>
					{x}		
					 <CustomToolTip title={'Service fee charged by the Channel and deducted from your payout'}>
						 <ContactSupportIcon style={{marginLeft: '10px'}}/>
					 </CustomToolTip>
				</span>
	}else{
		return x;
	}
	}
	
	let dynamicColumns = tableCols.map((col,i) => {
            return <Column key={col.field}
					   field={col.field}
					   header={setToolTip(col.header)}
					   style={col.field!=='RsrvChn'?{textAlign:'center'}:
							 {textAlign:'left'}}
					   headerStyle={{textAlign:'center'}}
					   body={col.el==='el'? actionTemplate:
						col.field==='RsrvChn' ? lineThrough: dataTable}
					   />;
        });

	
	return(	
		<div className="datatable-responsive-demo" /* style={{maxWidth: '1100px'}} */>
		<Container maxWidth="lg" style={{paddingLeft:'0px', paddingRight:'0px'}}>
		<Paper className={classes.paper} >
			 <FormGroup row style={{justifyContent: 'space-between'}} >
				 	<h5 className='ttlClr'>Channels Settings
						{/*<CustomToolTip title="Service fee charged by the Channel and deducted from your payout">
							<ContactSupportIcon style={{marginLeft: '20px'}}/>
						</CustomToolTip>*/}
					</h5>
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
				<Grid container spacing={3} className={classes.grid}>
					<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
						variant={snackbar.variant} />
					<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This channel will be deleted!' 
					content='Please Confirm'/>
					
					<DataTable  value={settings.channels!=null ?
								(activeOnly ? settings.channels.filter(x=>x.show) :settings.channels) : []} /*className='moshe' */ 
								paginator={true}
								className="p-datatable-responsive-demo"
								rows={10} rowsPerPageOptions={[5,10,20]}
								paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
								currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
								>
									
							{dynamicColumns}
					</DataTable>
			
					<Fab color="primary" aria-label="add" className={classes.button} onClick={addChannel}>
	  						<AddIcon />
					</Fab>
				</Grid>
			 {displayDialogSettings ? <Tab4Modal  snackbar={snackbar} setSnackbar={setSnackbar} /> : null}
		</Paper>
		</Container>
		</div>	
	)
};

export default Tab4;

/*

					  

*/