import React, {useContext} from 'react';
import {Button, MenuItem} from '@material-ui/core';
import TabExpTypeDetails from './TabExpTypeDetails';
import { withStyles } from '@material-ui/core/styles';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {addDataSettings, updateField} from '../../../functions/functions.js';
import {AuthContext} from '../../../contexts/useAuthContext';
 
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

	

const TabCompanyExpTypeModal = (props) =>{
	
	const {settings,settingsShows, setSettingsShows, updtSettings, selectValueSettings, displayDialogSettings,
		  setDisplayDialogSettings, valueSettings, setRedValid, expCompany} = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);
	
	const GroupOpt = expCompany.map((s,i)=>{
				return <MenuItem key={i} value={s} >{s}</MenuItem>
		});
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialogSettings(false);	
	}
	
	 const handleChange = e => {
		 selectValueSettings({...valueSettings, [e.target.name]:e.target.value });
	 };

    
	// /**********************************/
	const handleSave= async(e) => { 
		let indx = settings.exTypeCompany!=null ? settings.exTypeCompany.findIndex(x=>x.id===valueSettings.id) : -1;
		let exstIntheList=false;
	
		//validation
		
		let fields=['item','vends','exGroup'];
		
		let tmpTF=true;
		for(let i=0; i<fields.length; i++){
			if( valueSettings[fields[i]]==='' || valueSettings[fields[i]]==null){
				 tmpTF=false; break;
			 }
		}
		
		if(!tmpTF){
			setRedValid(true);
			props.setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
			
		
		let newArr=[];
		if(indx!==-1){ //update, id is in the list 
			//check if expense is the same as one of the rows
			for(let rw in settings.exTypeCompany){
			if(settings.exTypeCompany[rw].item.toLowerCase()===valueSettings.item.toLowerCase() &&
				   	settings.exTypeCompany[rw].id!==valueSettings.id){
					exstIntheList=true;  // the expense exist and is valid, do not update/add	
				}else{
					newArr = settings.exTypeCompany.map(x =>x.id===valueSettings.id ?
									  {...valueSettings}: x);
				}
			}
		}else{ //new, not in the list
			for(let rw in settings.exTypeCompany){
			if(settings.exTypeCompany[rw].item.toLowerCase()===valueSettings.item.toLowerCase() &&
				   	settings.exTypeCompany[rw].show ){
			exstIntheList=true;  // the expense exists and is valid, do not update/add	
			}else if(settings.exTypeCompany[rw].item.toLowerCase()===valueSettings.item.toLowerCase()
						 &&	!settings.exTypeCompany[rw].show ){ //expense is deleted but in use
		 			newArr = settings.exTypeCompany.map(x =>x.item.toLowerCase()===valueSettings.item.toLowerCase()
						   ? {...valueSettings, 'id': x.id}: x);
		 		}
			}
		}
		
		if(exstIntheList){
			props.setSnackbar( {open: true, msg: `Expense ${valueSettings.item} already exists!`, variant: 'error'}); 
			return;
		}
		//////////////////////////////
	
		
		let tmpValue = valueSettings;
		
		
		if(newArr.length!==0){ //just an update
			props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'exTypeCompany', {'exTypeCompany':newArr})),
		 			  	msg: `Expense ${tmpValue.item} has been updated!`, variant: 'success'}); 
		}else{
			let tmpExType = settings.exTypeCompany!=null ? settings.exTypeCompany: [];
			newArr = [...tmpExType, tmpValue];
		 	props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'exTypeCompany', {'exTypeCompany':newArr})),
		 			  	msg: 'New expense has been added!', variant: 'success'});	
		
			let tmp = {...settingsShows, [tmpValue.id] : false};
			setSettingsShows(tmp)
			await updateField(uidCollection, 'settingsShows', 'shows', [tmpValue.id], false);

		}
			
 		 updtSettings('exTypeCompany',newArr);
 		 closeDialog();  
	};
	
	
    const footer = <div>
				<Button className='myFont' variant="contained" type='submit' onClick={handleSave}  color="primary">Save</Button> 
			</div>;
 
	return (
		
		
   <div>
		  <Dialog  aria-labelledby="customized-dialog-title" open={displayDialogSettings}  >
          <DialogTitle  onClose={closeDialog} >
        	<span style={{color: '#193e6d'}}>Expenses Details</span>
          </DialogTitle>
			  <DialogContent dividers>
				<TabExpTypeDetails 
							 handleChange={handleChange}
							groupOpt = {GroupOpt}
				/>
				  
				  
			  </DialogContent>
          <DialogActions>
            {footer}
          </DialogActions>
        </Dialog>
			</div>
    );
    };

export default TabCompanyExpTypeModal;





/*
                
				
				
				
               */
      
      