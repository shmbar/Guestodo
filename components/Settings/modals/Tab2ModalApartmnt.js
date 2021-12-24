import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import {addData,updateField} from '../../../../functions/functions.js';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import CashFlowModalDetails from './CashFlowModalDetails';
import IconButton from '@material-ui/core/IconButton';
import AptTable from '../AptTable';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import useWindowSize from '../../../hooks/useWindowSize';

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Tab2ModalApartmnt = (props) =>{

  const classes = useStyles();
  const scr = useWindowSize();
  let scrSize = (scr==='xs' || scr==='sm');
	const {valueSettings} = useContext(SettingsContext);
	
    const DialogHeader =  <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=>props.setDisplayAptModalDialog(false)}
				aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
             <span style={{textTransform:'capitalize'}}>{valueSettings.PrpName}</span> Apartments
            </Typography>
          </Toolbar>
        </AppBar>;

	return (
			  <Dialog fullScreen style={!scrSize? {left: '30em'}: {left: '0'}} 
				  open={props.displayAptModalDialog} onClose={()=>props.setDisplayAptModalDialog(false)}
				  TransitionComponent={Transition}>
				{DialogHeader}
				<AptTable/>
			  </Dialog>
    );
    };

export default Tab2ModalApartmnt;

	 
      