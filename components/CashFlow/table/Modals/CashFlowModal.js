import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {addData,updateField, getNewTR} from '../../../../functions/functions.js';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CashFlowModalDetails from './CashFlowModalDetails';
import IconButton from '@material-ui/core/IconButton';
import {CfContext} from '../../../../contexts/useCfContext';
import PMmodal from '../../../Settings/modals/listOfItems/PMmodal';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import {AuthContext} from '../../../../contexts/useAuthContext';
import { v4 as uuidv4 } from 'uuid';
import {SelectContext} from '../../../../contexts/useSelectContext';
import useWindowSize from '../../../../hooks/useWindowSize';

	const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'sticky',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
	color: 'white',  
  },
	bgr:{
		background:'#eee'
	}
}));

const dateFormat = require('dateformat');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CashFlowModal = (props) =>{
	
  	const classes = useStyles();
	const scr = useWindowSize();
	let scrSize = (scr==='xs' || scr==='sm');
	
	const {displayDialog, setDisplayDialog, setRedValid, value, setValue,  cfData, setCfData,
		 	setSnackbar} =  useContext(CfContext);
	const {displayDialogSettings, runTab, settings, updtSettings,
		   	settingsShows, setSettingsShows} = useContext(SettingsContext);
	const {write, uidCollection} = useContext(AuthContext);					 						 				 	
	const {date} = useContext(SelectContext);
	
	useEffect(()=>{
		
		const load=async()=>{
			 let tmpCF = await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'CF');
			setValue({...value, 'Transaction' : 'CF'.concat(tmpCF).concat('_' + uuidv4())	});
		}
		
		if(value.Transaction==='')load();
	},[value, setValue, uidCollection])
	
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialog(false);
	}
	
	const updateSettingsShows = async()=>{
		
		let ownerID = value.owner
		let pmID = value.PM;
		let fndID = value.Fund;
		
	 	let tmp = pmID!=='' ? {...settingsShows, [ownerID]: true, [pmID]: true, [fndID]: true }:
							{...settingsShows, [ownerID]: true, [fndID]: true};
	
	 	await setSettingsShows(tmp); //update localstorage

	 	await updateField(uidCollection, 'settingsShows', 'shows', [ownerID], true);	 //update server
		await updateField(uidCollection, 'settingsShows', 'shows', [fndID], true)
	 	pmID!=='' && await updateField(uidCollection, 'settingsShows', 'shows', [pmID], true);	 //update server
	}
		
	const handleSave = async() => { 
		
		///validation
		let fields=['TransactionDate','Amnt'];
		let tmpTF=true;
		for(let i=0; i<fields.length; i++){
			if( value[fields[i]]==='' || value[fields[i]]===null){
				 tmpTF=false; break;
			 }
		}
	
		if(!tmpTF){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		///////////////////
		
		let indx = cfData.findIndex(x=>x.Transaction===value.Transaction);
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Amnt': +(+value.Amnt).toFixed(2), 'm': dateFormat(value.TransactionDate,'mm')};
		
	 	if(indx!==-1){ //Update the table
			const tmpArr = cfData.map(k =>
	 		   		k.Transaction===value.Transaction ? newObj : k  );
			setSnackbar( {open: (await addData(uidCollection, 'cashflow',dateFormat(newObj.TransactionDate,'yyyy'), newObj)), msg: 'Transaction has been updated!',
						  variant: 'success'});
			
			// update settingsShows	
			updateSettingsShows()
			setCfData(tmpArr);
		}else{ //add new data
			
			setSnackbar( {open: (await addData(uidCollection, 'cashflow',dateFormat(newObj.TransactionDate,'yyyy'), newObj)), msg: 'New Transaction has been added!',
						  variant: 'success'});
			// update settingsShows	
			updateSettingsShows()
			if(	(date.month!==12 && dateFormat(String(date.year).concat('-').concat(date.month+1),'yyyy-mm') === dateFormat(newObj.TransactionDate,'yyyy-mm')) ||
			   			((date.month===12 && dateFormat(newObj.TransactionDate,'yyyy')===String(date.year)))){
				const tmpArr = [...cfData, newObj];
				setCfData(tmpArr);
			} 
	
	 	setDisplayDialog(false);
	 }
	}
	
	
    const DialogHeader =  <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
             Money Transfer Details
            </Typography>
			  {write && <Button color="inherit" onClick={handleSave} >
              Save
            </Button>}
          </Toolbar>
        </AppBar>;

	return (
			  <Dialog fullScreen style={!scrSize? {left: '15em'}: {left: '0'}} open={displayDialog}
				  onClose={closeDialog} TransitionComponent={Transition}>
				
					{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods? settings.pmntMethods : []}
							updtSettings={updtSettings} lbl='Add new payment method' name='pmntMethods'
							snkbar='payment method' typelist='pmnts'
							ttl='Payment Methods'/> : null}
					{runTab === 'owner' && displayDialogSettings ? <PMmodal list={settings.owners} 
																	   updtSettings={updtSettings}
																	   name='owners'
																	   snkbar='owner'
										lbl='Add new owner'/> : null}
			
				{DialogHeader}
				<CashFlowModalDetails 	/>	
			  </Dialog>
    );
    };

export default CashFlowModal;

      
	
	  
	 
      