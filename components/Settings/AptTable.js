import React, {useContext, useState, useEffect} from 'react';
import {Grid, FormControlLabel, Checkbox, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';	
import { makeStyles } from '@material-ui/core/styles';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { v4 as uuidv4 } from 'uuid';
import Tab3Modal from './modals/Tab3Modal';
import {SettingsContext} from '../../contexts/useSettingsContext';
import useWindowSize from '../../hooks/useWindowSize';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {AuthContext} from '../../contexts/useAuthContext';

import {addDataSettings, delField} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import DelDialog from '../Subcomponents/DeleteDialog';
import EditDel from '../Subcomponents/EditDel'

const tableCols = [
			{field: 'AptName', header: 'Apartment',w: 100},
			{field: 'StartDate', header: 'Start Date',w: 100},
			{field: 'EndDate', header: 'End Date',w: 100},
        	{field: 'el' , header: '', el: 'el',w: 100},	
];

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
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
   paper: {
	//marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
	paddingTop:theme.spacing(1),	
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
     // marginTop: theme.spacing(3),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
	  paddingTop:theme.spacing(2),	
    },
  }
}));


const Tab2ModalApartmnt =(props) =>{
	const colsShow = useWindowSize();
	const classes = useStyles();
	const {settings, updtSettings, selectValueSettingsApt, valueSettings,
		   displayDialogSettingsApt, settingsShows,openMenu} =  useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const [activeOnly, setActiveOnly] = useState(true);
	const [aptData,setAptData] = useState([]);
	const {uidCollection} = useContext(AuthContext);
	
	useEffect(()=>{
	
		let PropId = settings.properties.filter(x=> x.PrpName===valueSettings.PrpName)[0]['id'];
		const tmp = settings.apartments!=null? settings.apartments.filter(x =>
						 x.PrpName===PropId) : [];
		setAptData(tmp);
	},[settings.apartments, valueSettings.PrpName, settings.properties])
	
	const addApartment= ()=>{
        selectValueSettingsApt(createEmptyObj());
    };
	
	 const createEmptyObj = () =>{
        let tmpObj={};
        tableCols.map(k =>k.field).map(q =>{
		return tmpObj[q]= (q==='StartDate' || q==='EndDate' ) ? null: '';
		});
		 delete tmpObj.el;
		 tmpObj.id = uuidv4();
		 tmpObj.show = true;
		 tmpObj.PrpName = settings.properties.filter(x=> x.PrpName===valueSettings.PrpName)[0]['id']; 
	//	 tmpObj.Ical='';
	//	 tmpObj.RsrvChn='';
		 return tmpObj;
    };
	
	
	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueSettingsApt} rowData={rowData}  column={column}  delRow={delRow} dis={!rowData.show} />;
    }
	
	const delRow = (rowData) =>{
		setRow(rowData)
		setOpen(true)
	};
	
	const handleDelete=()=>{
		let newArr=[];
			if(settingsShows[row.id]){ //is in use
				newArr = settings.apartments.map(x=> (x.id===row.id) ? {...x, 'show':false }: x);
				updtSettings('apartments',newArr);
			}else{ //not in use
				newArr = settings.apartments.filter(q=>q.id!==row.id);
				updtSettings('apartments',newArr);
				delField(uidCollection,'settingsShows', 'shows', row.id);
			}

			async function Snack() {
				setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'apartments', {'apartments':newArr})),
					msg: 'Apartment has been deleted!', variant: 'success'}); 
			}
			Snack();
		
		setOpen(false)
	}
	
	const lineThrough = (rowData, column) =>{
        return !rowData.show ? <span style={{textDecoration: 'line-through'}}>{rowData['AptName']}</span>:
			<span>{rowData['AptName']}</span>;
    }
	
	let dynamicColumns = tableCols.map((col,i) => {
            return <Column key={col.field}
					   field={col.field}
					   header={col.header}
					   style={{textAlign:'center', width: col.w + 'px'}}
					   body={col.el==='el'? actionTemplate:
					   col.field==='AptName' ? lineThrough: null}
					   />;
        });
	
	
	
	return(	
		<div className={classes.paper} >		
				<FormControlLabel
						control={
							  <GreenCheckbox
								checked={activeOnly}
								onChange={()=>setActiveOnly(!activeOnly)}
							  />
							}
					label="Active only"
			  		/>
				<Grid container spacing={3} >
					<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
						variant={snackbar.variant}/>
					<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
					title='This apartment will be deleted!' 
					content='Please Confirm'/>
					<DataTable  value={activeOnly? aptData.filter(x=>x.show) :aptData} 
								paginator={true}
								scrollable
								style={{width: colsShow >=960 ? openMenu ? colsShow-220-105: colsShow-162 : colsShow-105+95  + 'px'}}
								rows={10} rowsPerPageOptions={[5,10,20]}>
							{dynamicColumns}
					</DataTable>
			
					<Fab color="primary" aria-label="add" className={classes.button} onClick={addApartment}>
	  						<AddIcon />
					</Fab>
				</Grid>
			 {displayDialogSettingsApt ? <Tab3Modal  snackbar={snackbar} setSnackbar={setSnackbar} /> : null}
		</div>	
	)
};

export default Tab2ModalApartmnt;

/*

					  

*/