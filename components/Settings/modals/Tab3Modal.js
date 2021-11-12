import React, {useContext} from 'react';
import Tab3Details from './Tab3Details';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import {addDataSettings} from '../../../functions/functions.js';
import {AuthContext} from '../../../contexts/useAuthContext';

const dateFormat = require('dateformat');
 
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


const Tab3Modal = (props) =>{

	const {settings, updtSettings, selectValueSettingsApt, displayDialogSettingsApt,
		  setDisplayDialogSettingsApt, valueSettingsApt, setRedValid, updtShows} = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);
	
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialogSettingsApt(false);	
	}
	
	 const handleChange = e => {
		 selectValueSettingsApt({...valueSettingsApt, [e.target.name]:e.target.value });
	 };
 
	const handleChangeD = (name,val) =>{
		if(val===null){
		 	selectValueSettingsApt({...valueSettingsApt, [name]:null });
		}else{
			selectValueSettingsApt({...valueSettingsApt, [name]: dateFormat(val,'dd-mmm-yyyy') });
		}
	};
    
	// // /**********************************/
	const handleSave = async(e) => { 
		let indx = settings.apartments!=null ? settings.apartments.findIndex(x=>x.id===valueSettingsApt.id) : -1;
		
		let exstIntheList=false;
		
		//validation
		
		let fields=['PrpName','AptName','StartDate'];
		let tmpTF=true;
		for(let i=0; i<fields.length; i++){
			if( valueSettingsApt[fields[i]]==='' || valueSettingsApt[fields[i]]===null){
				 tmpTF=false; break;
			 }
		}
		
		if(!tmpTF){
			setRedValid(true);
			props.setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		
		let newArr=[];
		if(indx!==-1){ //update, id is in the list 
			//check if Apartment is the same as one of the rows
			for(let rw in settings.apartments){
		 		if(settings.apartments[rw].AptName.toLowerCase()===valueSettingsApt.AptName.toLowerCase() &&
				   	settings.apartments[rw].id!==valueSettingsApt.id){
					exstIntheList=true;  // the channel exist and is valid, do not update/add	
				}else{
					newArr = settings.apartments.map(x =>x.id===valueSettingsApt.id ? valueSettingsApt : x);
				}
			}
		}else{ //new, not in the list
			for(let rw in settings.apartments){
		 		if(settings.apartments[rw].AptName.toLowerCase()===valueSettingsApt.AptName.toLowerCase() &&
				   	settings.apartments[rw].show ){
		 			exstIntheList=true;  // the channel exist and is valid, do not update/add	
		 		}else if(settings.apartments[rw].AptName.toLowerCase()===valueSettingsApt.AptName.toLowerCase() &&
		 		   	!settings.apartments[rw].show ){ //channel is deleted but in use
		 			newArr = settings.apartments.map(x =>x.AptName.toLowerCase()===valueSettingsApt.AptName.toLowerCase()
						   ? {...valueSettingsApt, 'id': x.id}: x);
		 		}
			}
		}
		
		if(exstIntheList){
			props.setSnackbar( {open: true, msg: `Apartment ${valueSettingsApt.AptName} already exists!`, variant: 'error'}); 
			return;
		}
		
		
		//////////////////////////////
			
	
		if(newArr.length!==0){ //just an update
			props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'apartments', {'apartments':newArr})),
		 			  	msg: `Apartment ${valueSettingsApt.AptName} has been updated!`, variant: 'success'}); 
		}else{
			let tmpApts = settings.apartments!=null ? settings.apartments: [];
			newArr = [...tmpApts, valueSettingsApt];
		 	props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'apartments', {'apartments':newArr})),
		 			  	msg: 'New apartment has been added!', variant: 'success'});	
		 	updtShows(uidCollection, [valueSettingsApt.id], false)
		}
		
 		 updtSettings('apartments',newArr);
 		 closeDialog();

	};
    
    const footer = <div>
                    <Button className='myFont' variant="contained" type='submit' onClick={handleSave}
						color="primary">Save
			  		</Button>
                        </div>;
 
	return (
		
   <div>
		   <Dialog  aria-labelledby="customized-dialog-title" open={displayDialogSettingsApt}  >
          <DialogTitle  onClose={closeDialog} >
           <span style={{color: '#193e6d'}}>Apartment Details</span>
          </DialogTitle>
			  <DialogContent dividers>
				<Tab3Details	
					handleChange={handleChange}
					handleChangeD={handleChangeD}
					runFromOrders={props.runFromOrders}
					/>
			  </DialogContent>
          <DialogActions>
            {footer}
          </DialogActions>
        </Dialog>
			</div>
    );
    };

export default Tab3Modal;





/*
                
               */
      
      