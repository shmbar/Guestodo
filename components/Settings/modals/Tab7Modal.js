import React, {useContext} from 'react';
import {Button, Dialog, IconButton, Typography } from '@material-ui/core';
import Tab7Details from './Tab7Details';
import {addDataSettings, itemToId} from '../../../functions/functions.js';
import { withStyles } from '@material-ui/core/styles';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import {AuthContext} from '../../../contexts/useAuthContext';

const dateFormat = require('dateformat');
 ////
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const twoDig=(n) => {
	n += '';
	var x = n.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1].substring(0,2) : '';
return	x1 + x2;
}

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Tab7Modal = (props) =>{
	
	const {settings, selectValueSettings, displayDialogSettings,
		  setDisplayDialogSettings, valueSettings, setRedValid, updtSettings, updtShows, setFundList} = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);
	
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialogSettings(false);	
	}
	
	 const handleChange = e => {
		if(e.target.name==='IntCshFlBnce'){
			 selectValueSettings({...valueSettings, [e.target.name]:twoDig(e.target.value)});
		}else if(e.target.name === 'Owner'){
		 	selectValueSettings({...valueSettings, [e.target.name]: itemToId(settings.owners, e.target.value)});
		}else{
			selectValueSettings({...valueSettings, [e.target.name]:e.target.value});
		}
	};
	
	const handleChangeD = (name,val) =>{
		if(val===null){
		 	selectValueSettings({...valueSettings, [name]:null });
	 	}else {
			selectValueSettings({...valueSettings, [name]: dateFormat(val,'dd-mmm-yyyy') });
		}
	};
    
	// /**********************************/
	const handleSave= async(e) => { 
		 let indx = settings.funds!=null ? settings.funds.findIndex(x=>x.id===valueSettings.id): -1;
		
		//validationn
		 let fields=['item', 'Owner'];
		 let tmpTF=true;
		 for(let i=0; i<fields.length; i++){
		 	if( valueSettings[fields[i]]==='' || valueSettings[fields[i]]===null){
		 		 tmpTF=false; break;
		 	 }
		 }
		
		if(!tmpTF){
		 	setRedValid(true);
		 	props.setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
		 	return};
			
	
		let exstIntheList=false;
		let newArr=[];
		
			if(indx!==-1){ //update, id is in the list 
			//check if item is the same as one of the rows
			for(let rw in settings.funds){
		 		if(settings.funds[rw].item.toLowerCase()===valueSettings.item.toLowerCase() &&
				   	settings.funds[rw].id!==valueSettings.id){
					exstIntheList=true;  // the item exist and is valid, do not update/add	
				}else{
					newArr = settings.funds.map(x =>x.id===valueSettings.id ?
									  {...valueSettings}: x);
				}
			}
		}else{ //new, not in the list
			for(let rw in settings.funds){
		 		if(settings.funds[rw].item.toLowerCase()===valueSettings.item.toLowerCase() &&
				   	settings.funds[rw].show ){
		 			exstIntheList=true;  // the item exist and is valid, do not update/add	
		 		}else if(settings.funds[rw].item.toLowerCase()===valueSettings.item.toLowerCase() &&
		 		   	!settings.funds[rw].show ){ //item is deleted but in use
		 			newArr = settings.funds.map(x =>x.item.toLowerCase()===valueSettings.item.toLowerCase()
						   ? {...valueSettings, 'id': x.id}: x);
		 		}
			}
		}

		
		if(exstIntheList){
			props.setSnackbar( {open: true, msg: `Fund ${valueSettings.item} already exists!`, variant:
								'error'}); 
			return;
		}
		
		/////////////////////////
		if(newArr.length!==0){ //just an update
			props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'funds', {'funds':newArr})),
		 			  	msg: `Fund ${valueSettings.item} has been updated!`, variant: 'success'}); 
		}else{
			newArr = [...settings.funds || [], valueSettings];
		 	props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'funds', {'funds':newArr})),
		 			  	msg: 'New fund has been added!', variant: 'success'});	
		 	updtShows(uidCollection, [valueSettings.id], false)
		}
		
 		 	updtSettings('funds',newArr);
		 	const fnds =  newArr.filter(x=> x.show ).map(x=>x.item);
	 		setFundList(fnds);
	 		
		closeDialog();
			 
	};
	
    const footer = <div>
				<Button className='myFont' variant="contained" type='submit' onClick={handleSave}  color="primary">Save</Button> 
			</div>;
 
	return (
		
		
   <div>
		  <Dialog  aria-labelledby="customized-dialog-title" open={displayDialogSettings}
		  	fullWidth={true}
       		maxWidth={'sm'}
		  >
          <DialogTitle  onClose={closeDialog} >
           	<span style={{color: '#193e6d'}}>Fund Details</span>
          </DialogTitle>
			  <DialogContent dividers>
				<Tab7Details 
							handleChange={handleChange}
							handleChangeD={handleChangeD}
				/>
			  </DialogContent>
          <DialogActions>
            {footer}
          </DialogActions>
        </Dialog>
			</div>
    );
    };

export default Tab7Modal;





/*
                
				
				
				
               */
      
      