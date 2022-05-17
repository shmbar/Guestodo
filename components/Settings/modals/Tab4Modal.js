import React, {useContext} from 'react';
import Tab4Details from './Tab4Details';
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

/*const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=3) ? n :  n.substring(0, n.length - 1);
	} ; */

const Tab4Modal = (props) =>{

	const {settings, updtSettings, selectValueSettings, displayDialogSettings,
		  setDisplayDialogSettings, valueSettings, setRedValid, updtShows} = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialogSettings(false);	
	}
	
	const handleChange = (e) => {

		 let tmp= (e.target.nam === 'ChnCmsn') ? (e.target.value):
		          (e.target.name === 'UpFrnt') ? (e.target.checked ? true: false) :
		 		  e.target.value;
			 
		
		// let CmsnOptChange = (e.target.name==='MngCmsn' && (e.target.value==='No Cimmission'))?true:false;
		 
		selectValueSettings({...valueSettings, [e.target.name]:tmp });
	 /*	if(!CmsnOptChange){
		 	selectValueSettings({...valueSettings, [e.target.name]:tmp });
		}else{
			selectValueSettings({...valueSettings, [e.target.name]:tmp , 'ChnCmsn': '0' });
		}	 
	*/	
	 };

    
	const handeSave = async(e) => { 
		let indx =  settings.channels!=null ?  settings.channels.findIndex(x=>x.id===valueSettings.id) : -1;
			
		//validation	
		let fields=['OwnerName','RsrvChn'];
		let tmpTF=true;
		
		for(let i=0; i<fields.length; i++){
			if( valueSettings[fields[i]]===''){
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
			//check if RsrvChn is the same as one of the rows
			for(let rw in settings.channels){
		 		if(settings.channels[rw].RsrvChn.toLowerCase()===valueSettings.RsrvChn.toLowerCase() &&
				   	settings.channels[rw].id!==valueSettings.id){
					exstIntheList=true;  // the channel exist and is valid, do not update/add	
				}else{
					newArr = settings.channels.map(x =>x.id===valueSettings.id ?
									  {...valueSettings}: x);
				}
			}
		}else{ //new, not in the list
			for(let rw in settings.channels){
		 		if(settings.channels[rw].RsrvChn.toLowerCase()===valueSettings.RsrvChn.toLowerCase() &&
				   	settings.channels[rw].show ){
		 			exstIntheList=true;  // the channel exist and is valid, do not update/add	
		 		}else if(settings.channels[rw].RsrvChn.toLowerCase()===valueSettings.RsrvChn.toLowerCase() &&
		 		   	!settings.channels[rw].show ){ //channel is deleted but in use
		 			newArr = settings.channels.map(x =>x.RsrvChn.toLowerCase()===valueSettings.RsrvChn.toLowerCase()
						   ? {...valueSettings, 'id': x.id}: x);
		 		}
			}
		}

		
		if(exstIntheList){
			props.setSnackbar( {open: true, msg: `Channel ${valueSettings.RsrvChn} already exists!`, variant:
								'error'}); 
			return;
		}
		
	
		if(newArr.length!==0){ //just an update
			props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'channels', {'channels':newArr})),
		 			  	msg: `Channel ${valueSettings.RsrvChn} has been updated!`, variant: 'success'}); 
		}else{
			let tmpChannels = settings.channels!=null ? settings.channels: [];
			newArr = [...tmpChannels, valueSettings];
		 	props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'channels', {'channels':newArr})),
		 			  	msg: 'New channel has been added!', variant: 'success'});	
		 	updtShows(uidCollection, [valueSettings.id], false)
		}
		
 		 updtSettings('channels',newArr);
 		 closeDialog();
	};
  
    const footer = <div>
                            <Button variant="contained" className='myFont' type='submit'  onClick={handeSave}   color="primary">Save</Button> 
					</div>;

	return (
	 <div>
        <Dialog  aria-labelledby="customized-dialog-title" open={displayDialogSettings}  >
          <DialogTitle  onClose={closeDialog} >
           <span style={{color: '#193e6d'}}>Channel Details</span>
          </DialogTitle>
			  <DialogContent dividers>
				<Tab4Details	handleChange={handleChange}		/>
			  </DialogContent>
          <DialogActions>
            {footer}
          </DialogActions>
        </Dialog>
      </div>
    );
    };

export default Tab4Modal;
