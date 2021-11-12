import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import Lists from './Lists';
//import './styles.css';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
   // padding: theme.spacing(3),

  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function FormDialog(props) {
	const classes = useStyles();
	const {displayDialogSettings,
		  setDisplayDialogSettings} = useContext(SettingsContext);
	
  function handleClose() {
    setDisplayDialogSettings(false);
  }

  return (
    <div>
      <Dialog open={displayDialogSettings} className={classes.root} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='xs' fullWidth>
        <DialogContent style={{padding:'10px 8px 10px 8px', background:'#eee'}}>
			<Lists 
				{...props}
				/>
        </DialogContent>
        <DialogActions style={{background:'#eee'}}>
          <Button variant="contained" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
