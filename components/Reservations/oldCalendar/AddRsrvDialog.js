import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'flex-end!important',
  },
 helpIcon: {
	 color:'grey',
	// marginTop:'15px',
	 marginLeft:'10px'
 	},
	title:{
		display:'inline-flex',
		height: '45px',
		paddingTop: '6px'
	}
	
}));


export default function DeleteDialog(props) {
 	const classes = useStyles();
	
  return (
      <Dialog
        open={props.open}
        onClose={() => props.setOpen()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
	  	style={{top:'-200px'}}
      >
		
		<div className={classes.title}>
			<DialogTitle id="alert-dialog-title" style={{padding:'15px'}}>
				<div style={{fontSize: '16px', width:'320px'}}>
					{props.title}
					<HelpIcon className={classes.helpIcon}/>
				</div>
			</DialogTitle>
			
	  	</div>  
        
        <DialogContent style={{paddingLeft: '55px'}}>
          <DialogContentText id="alert-dialog-description" >
          
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.root}>
          <Button onClick={()=>props.handleAdd()} variant="contained" color="primary" size="small">
            Ok
          </Button>
          <Button onClick={()=> props.setOpen()} variant="outlined" color="primary" autoFocus size="small">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}
