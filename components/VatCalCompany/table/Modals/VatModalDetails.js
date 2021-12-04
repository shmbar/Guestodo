import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Paper/*, Divider*/} from '@material-ui/core';
import DataSummary from './innerPapers/DataSummary';
import {Grid, Divider } from '@material-ui/core';
import PaymentsPaper from '../../../Subcomponents/PaymentsPaper';
import Dates from './innerPapers/Dates';
//import PaymentSummary from './innerPapers/PaymentSummary';
import Typography from '@material-ui/core/Typography';
import {VtContext} from '../../../../contexts/useVtContext';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ paddingTop: 8 * 3 }}>
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



const VatModalDetails=(props)=> {

  const classes = useStyles();
	const {value, setValue, handleChangePmnts,handleChangeDPmnts, redValid} = useContext(VtContext);
	
  return (
	<div style={{padding: '10px', background:'#eee'}}>
		<Grid container spacing={2}>
			<Grid item xs={12} md={8} style={{padding:'16px'}}>
				<Paper className={classes.root}>
					<h4 className='ttlClr1'>VAT Calculation</h4>
					<Dates Calculate={props.Calculate}/>
				</Paper>
			</Grid>
			<Grid item xs={12} md={4} style={{padding:'16px'}}>
				<Paper className={classes.root} style={{background: '#e7f3ff'}} >
					<h4 className='ttlClr1'>Summary</h4>
					<Divider />
					<DataSummary />
				</Paper>
			</Grid>
		</Grid>
			
		<Grid container spacing={2} alignItems="flex-end"/*justify="center */ >  
			<Grid item xs={12} md={8} style={{padding:'16px'}}>
				<Paper className={classes.root}>
					<h4 className='ttlClr1'>Payments</h4>
					<PaymentsPaper  value={value}  setValue={setValue} 
								handleChangePmnts={handleChangePmnts}
								handleChangeDPmnts={handleChangeDPmnts} redValid={redValid}
								blnc='BlncVat' amnt={value.VatPayRtrn} />
				</Paper>
			</Grid>	 
	  	</Grid>
	</div>
  );
}

export default VatModalDetails;

/*

	<Paper className={classes.root}>
								<h5 >Financial Summary</h5>
								<Divider/>
									<PaymentSummary	/>
							</Paper>
	
*/
