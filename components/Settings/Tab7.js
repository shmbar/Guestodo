import React, {useContext, useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, Grid, Paper, FormGroup,
	   	FormControlLabel, Fab, Container} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';	
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Tab7Modal from './modals/Tab7Modal';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {SelectContext} from '../../contexts/useSelectContext';
import { v4 as uuidv4 } from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import useWindowSize from '../../hooks/useWindowSize';
import {addDataSettings, delField} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import DelDialog from '../Subcomponents/DeleteDialog';
import {AuthContext} from '../../contexts/useAuthContext';
import EditDel from '../Subcomponents/EditDel'
import {showDataTable} from '../../functions/setTableDt.js';
import Typography from '@material-ui/core/Typography';


const tableCols = [
            {field: 'item', header: 'Fund',  showcol: true,s:['xs','sm','md','lg', 'xl']},
		/* 	{field: 'StartDate', header: 'Start Date',  showcol: true,s:['xs','sm','md','lg', 'xl']}, */
			{field: 'IntCshFlBnce', header: 'Initial Cash Flow Balance',  showcol: true,s:['xs','sm','md','lg', 'xl']},
			{field: 'Owner', header: 'Owner',  showcol: true,s:['xs','sm','md','lg', 'xl']},
        	{field: 'el' , header: '', el: 'el',  showcol: true,s:['xs','sm','md','lg', 'xl']},	
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
//	 maxWidth: 1100
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

const Tab7 =() =>{
	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	const [cols, setCols] = useState(tableCols);
	const classes = useStyles();
	const {settings, updtSettings, selectValueSettings, displayDialogSettings,
		   settingsShows, setFundList} = useContext(SettingsContext);
	const {setFundSlct, setPage} = useContext(SelectContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const [activeOnly, setActiveOnly] = useState(true);
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

	const addEnt= ()=>{
        selectValueSettings(createEmptyObj());
    };
	
	 const createEmptyObj = () =>{
        let tmpObj={};
     /*    tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= (q==='StartDate' || q==='EndDate' ) ? null: '';
		}); */
		 delete tmpObj.el;
		 tmpObj.item='';
		 tmpObj.id=uuidv4();
		 tmpObj.IntCshFlBnce=0;
		 tmpObj.show=true;
		 return tmpObj;
    };
	
	
	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueSettings} rowData={rowData}  column={column}  delRow={delRow} dis={!rowData.show}/>;
    }
	
	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{

		let newArr=[];
			if(settingsShows[row.id]){ ////is in use
				newArr = settings.funds.map(x=> (x.id===row.id) ? {...x, 'show':false }: x);
				updtSettings('funds',newArr);
			}else{  //not in use
				newArr = settings.funds.filter(q=>q.id!==row.id);
				updtSettings('funds',newArr);
				delField(uidCollection, 'settingsShows', 'shows', row.id);
			}

			async function Snack() {
				setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'funds', {'funds':newArr})),
					msg: 'Fund has been deleted!', variant: 'success'}); 
			}
	
			const fnds =  newArr.filter(x=> x.show ).map(x=>x.item);
			setFundList(fnds);
			setFundSlct(null)
		
			Snack();
		setOpen(false)
		
	};	
	
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}


	let dynamicColumns = tableCols.filter(col => col.showcol === true).map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		style={{textAlign:'center'}}
							body={col.field==='el'? actionTemplate:dataTable}
					   />;
        	});
	
	return(	
		<div className="datatable-responsive-demo">
		<Container maxWidth="lg" style={{paddingLeft:'0px', paddingRight:'0px'}}>
		<Paper className={classes.paper} >
			 	 <FormGroup row style={{justifyContent: 'space-between'}} >
				 	<h5 className='ttlClr'>Funds Settings</h5>
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
					title='This fund will be deleted!' 
					content='Please Confirm'/>
					
					<DataTable  value={ settings.funds!=null ? 						
										(activeOnly ? settings.funds.filter(x=>x.show) : settings.funds): []} 
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
			 	{displayDialogSettings ? <Tab7Modal snackbar={snackbar} setSnackbar={setSnackbar} /> : null}
		</Paper>
			
		 <Typography variant="h6" style={{fontFamily: '"Varela Round", sans-serif', fontSize: '1rem', paddingTop: '15px'}}>
       			To proceed setting properties click <span style={{color: 'blue', cursor: 'pointer'}} onClick={()=>setPage('Properties')}>here </span> 
      	</Typography>
			
		</Container>
		</div>
	)
};

export default Tab7;

/*		
		
					  

*/