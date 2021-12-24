import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import RsrvAmounts from './innerPapers/RsrvAmounts';
import RsrvData from './innerPapers/RsrvData';
import Grid from '@material-ui/core/Grid';
import PaymentsPaper from '../../../Subcomponents/PaymentsPaper';
import GstDetails from './innerPapers/GstDetails';
import {RcContext} from '../../../../contexts/useRcContext';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import './modals.css';

function TabContainer(props) {
  return (
    <Typography component="div" /*style={{ paddingTop: 8 * 3 }}*/>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};



const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  //  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 2),
  },
}));



const OrderModalDetails=(props)=> {

  const classes = useStyles();
	const {value, setValue, handleChangePmnts,handleChangeDPmnts, redValid, rcDataPrp} = useContext(RcContext);
	
  return (
	<div style={{padding: '10px', background:'#eee'}}>
		<Grid container spacing={2} /*justify="center */ >
			<Grid item sm={12} md={9} style={{padding:'16px'}}>
			  {props.valueTab === 0 && <TabContainer>
					<div>
						<Paper className={classes.root}  >
							<h4 className='ttlClr1' >Reservation</h4>
							<RsrvData />
						</Paper>
					</div>	
					<div style={{paddingTop:'25px'}}>
						<Paper className={classes.root}>
							<h4 className='ttlClr1'>Payments</h4>
							<PaymentsPaper  value={value}  setValue={setValue} 
								handleChangePmnts={handleChangePmnts}
								handleChangeDPmnts={handleChangeDPmnts} redValid={redValid}
								blnc='BlncRsrv' amnt={value.RsrvAmnt}/>
						</Paper>
					</div>	
				 </TabContainer>}
			  {props.valueTab === 1 && <TabContainer>
				  	<div>
						<Paper className={classes.root}>
							<h4>Guest Reservation</h4>
							<GstDetails />
						</Paper>
					</div>	
				  </TabContainer>}
		</Grid>
	  		
			
		<Grid item sm={12} md={3} style={{padding:'16px'}}>
				<Paper className={classes.root} style={{background: '#e7f3ff'}}>
					<h4 className='ttlClr1'>Summary</h4>
					<Divider style={{marginBottom: '25px'}}/>
					<RsrvAmounts rcDataPrp={rcDataPrp}/>
				</Paper>
		</Grid>
		</Grid>
	</div>
  );
}

export default OrderModalDetails;

