import React, {useContext, useState} from 'react';
import VatDetails from './VatDetails';
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
import SnackBar from '../../Subcomponents/SnackBar';
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


const VatModal = (props) =>{

	const {updtSettings, displayVat,setDisplayVat, setValueSettings, valueSettings} = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const {uidCollection} = useContext(AuthContext);
	
	const closeDialog = () => {
		setDisplayVat(false);
	}
	
	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=2) ? n :  n.substring(0, n.length - 1);
	} ;
	
	 const handleChange = e => {
		
		 setValueSettings({...valueSettings, 'vat':cmsnNum(e.target.value) });
	 };
 
    
	// // /**********************************/
	const handleSave = async(e) => { 
	
		
		//validation
	
		if(valueSettings.vat===''){
			setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		
		setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'vat', {'vat':valueSettings.vat.concat('%')})),
		  			  	msg: 'VAT has been updated!', variant: 'success'});	
	//	setDisplayVat(false);
		updtSettings('vat',valueSettings.vat.concat('%'));
		
	};
    
    const footer = <div>
                    <Button className='myFont' variant="contained" type='submit' onClick={handleSave}
						color="primary">Save
			  		</Button>
                        </div>;
 
	return (
		
   <div>
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
	   		<Dialog  aria-labelledby="customized-dialog-title" open={displayVat}  >
			  	<DialogTitle  onClose={closeDialog} >
					  <span style={{color: '#193e6d'}} >Vat Settings</span>
			  	</DialogTitle>
			  <DialogContent dividers>
					<VatDetails	
						handleChange={handleChange}
					/>
			  </DialogContent>
          <DialogActions>
            {footer}
          </DialogActions>
        </Dialog>
			</div>
    );
    };

export default VatModal;

/*

	

*/

      