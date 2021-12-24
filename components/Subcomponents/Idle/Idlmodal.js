import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles, lighten, withStyles  } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

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
	},
 	margin: {
    	margin: theme.spacing(1),
  },
	
}));

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

const IdleTimeOutModal = (props)=> {
 const classes = useStyles();
	const [completed, setCompleted] = useState(0);
	
useEffect(() => {
  function progress() {
      setCompleted(oldCompleted => {
        
		if (oldCompleted === 100) {
			props.handleLogout();
			return 0;
		}
        
		const diff = Math.min(oldCompleted + 1, 100); //Math.random() * 10;   
        return diff; //Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 400);
    return () => {
      clearInterval(timer);
    };
  }, [props]);
	
  return (
      <Dialog
        open={props.showModal}
        onClose={() => props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
	  	style={{top:'-200px'}}
      >
        
        <DialogContent style={{paddingLeft: '55px'}}>
          <DialogContentText id="alert-dialog-description" >
           You will be loged out due to inactivity!
          </DialogContentText>
        </DialogContent>
	  <BorderLinearProgress
					className={classes.margin}
					variant="determinate"
					color="secondary"
					value={completed}
      /> 
        <DialogActions className={classes.root}>
          <Button onClick={props.handleLogout} variant="contained" color="primary" size="small">
           Log Out
          </Button>
          <Button onClick={props.handleClose} variant="outlined" color="primary" autoFocus size="small">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default IdleTimeOutModal;