
import React, {useContext, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, Grid, Paper, FormGroup,
	   	FormControlLabel, Fab, Container} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';	
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import TabCompanyExpTypeModal from './modals/TabCompanyExpTypeModal';
import {SettingsContext} from '../../contexts/useSettingsContext';
import useWindowSize from '../../hooks/useWindowSize';
import {AuthContext} from '../../contexts/useAuthContext';
import EditDel from '../Subcomponents/EditDel'
import { v4 as uuidv4 } from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {showDataTable} from '../../functions/setTableDt.js';

import {addDataSettings, delField} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import DelDialog from '../Subcomponents/DeleteDialog';

const tableCols = [
            {field: 'item', header: 'Expense', w: 100},
			{field: 'exGroup', header: 'Expense Group',w: 100},
			{field: 'vends', header: 'Vendor',w: 100},
        	{field: 'el' , header: '', el: 'el', w: 100},	
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

const TabCompanyExpType =() =>{
	const scrSize = useWindowSize();
	const classes = useStyles();
	const {settings, updtSettings, selectValueSettings, displayDialogSettings,
		   settingsShows} = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const [activeOnly, setActiveOnly] = useState(true);
	const {uidCollection} = useContext(AuthContext);
	
	
	const addEnt= ()=>{
        selectValueSettings(createEmptyObj());
    };
	
	 const createEmptyObj = () =>{
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= '';
		});
		 delete tmpObj.el;
		 tmpObj.id=uuidv4();
		 tmpObj.show=true;
		 return tmpObj;
    };
	
	
	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueSettings} rowData={rowData}  column={column}  delRow={delRow} dis={!rowData.show} />;
    }
	
	
	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr=[];
			if(settingsShows[row.id]){ ////is in use
				newArr = settings.exTypeCompany.map(x=> (x.id===row.id) ? {...x, 'show':false }: x);
				updtSettings('exTypeCompany',newArr);
			}else{  //not in use
				newArr = settings.exTypeCompany.filter(q=>q.id!==row.id);
				updtSettings('exTypeCompany',newArr);
				delField(uidCollection, 'settingsShows', 'shows', row.id);
			}

			async function Snack() {
				setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'exTypeCompany', {'exTypeCompany':newArr})),
					msg: 'Expense has been deleted!', variant: 'success'}); 
			}
			Snack();
		setOpen(false)
	};	
	
	
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}

	let dynamicColumns = tableCols.map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		body={col.field==='el'? actionTemplate:dataTable} 
					   		style={{textAlign:'center'}}
					   />;
        	});
	
	
	return(	
		<div className="datatable-responsive-demo">
		<Container maxWidth="lg" style={{paddingLeft:'0px', paddingRight:'0px'}}>
		<Paper className={classes.paper} >
			 	 <FormGroup row style={{justifyContent: 'space-between'}} >
				 	<h5 className='ttlClr'>Company Expenses Settings</h5>
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
					
					<DataTable  value={settings.exTypeCompany!=null ? 
									(activeOnly ? settings.exTypeCompany.filter(x=>x.show) : settings.exTypeCompany) : []} 
								paginator={true} 
								rows={10} rowsPerPageOptions={[5,10,20]}
								className="p-datatable-responsive-demo"
								>
                       		{dynamicColumns}
					</DataTable>

					<Fab color="primary" aria-label="add" className={classes.button} onClick={addEnt}>
	  						<AddIcon />
					</Fab>
				</Grid>
			 {displayDialogSettings ? <TabCompanyExpTypeModal snackbar={snackbar} setSnackbar={setSnackbar} /> : null}
		</Paper>	
		</Container>
		</div>	
	)
};

export default TabCompanyExpType;


