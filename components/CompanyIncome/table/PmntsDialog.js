import React, {useContext}from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PaymentsPaper from './innerPapers/PaymentsPaper';
import { makeStyles } from '@material-ui/core/styles';
import PMmodal from '../../Settings/modals/listOfItems/PMmodal';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'flex-end!important',
  },
 helpIcon: {
	 color:'grey',
	 marginTop:'15px',
	 marginLeft:'15px'
 	},
	title:{
		display:'inline-flex',
		height: '45px',
		paddingTop: '6px'
	}
	
}));


export default function PmntsDialog(props) {
 const classes = useStyles();
	
	const {displayDialogSettings, runTab, settings, updtSettings,
		   	 } = useContext(SettingsContext);

  return (
      <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
	  	style={{top:'-200px'}}
	  //	fullWidth={true}
        maxWidth={'md'}
      >
		{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods}
								updtSettings={updtSettings} lbl='Add new payment method'
								typelist='pmnts'
								ttl='Payment Methods'
								name ='pmntMethods' snkbar='payment method' /> : null}
		<div className={classes.title}>
			<DialogTitle id="alert-dialog-title" style={{padding:'15px'}}>
				<div style={{fontSize: '24px', width:'320px', paddingLeft: '12px'}} className='ttlClr1'>
					{props.title}
				</div>
			</DialogTitle>
	  	</div>  
        
        <DialogContent style={{paddingLeft: '35px', minHeight: '130px', maxHeight:'45'}}>
			<PaymentsPaper	{...props} />		
        </DialogContent>
        <DialogActions className={classes.root}>
          <Button onClick={props.handleSave} variant="contained" color="primary" size="small">
            Save
          </Button>
          <Button onClick={() => props.setOpen(false)} variant="outlined" color="primary" autoFocus size="small">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}
