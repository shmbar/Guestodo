import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import DataSummary from './innerPapers/DataSummary';
import ExpenseData from './innerPapers/ExpenseData';
import Grid from '@material-ui/core/Grid';
import PaymentsPaper from '../../../Subcomponents/PaymentsPaper';
import {Typography, Divider} from '@material-ui/core';
import {ExContext} from '../../../../contexts/useExContext';

import './modals.css';

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
 padd:{
	 padding: theme.spacing(2),
 }	
}));



const ExpenseModalDetails=(props)=> {

  const classes = useStyles();
	const {value, setValue, handleChangePmnts,handleChangeDPmnts, redValid} = useContext(ExContext);

  return (
	<div  style={{padding: '10px', background:'#eee'}} >
		<Grid container spacing={2}/*justify="center */ >
			<Grid item xs={12} md={9} style={{padding:'16px'}}>
				<Grid container direction='column'  justifyContent="space-evenly" alignItems="stretch">
					<Grid item xs={12}>
						<Paper className={classes.root}>
							<h4 className='ttlClr1'>Expense</h4>
							<ExpenseData />
						</Paper>
					</Grid>
					<Grid item xs={12} style={{paddingTop: '30px'}}>
						<Paper className={classes.root}>
							<h4 className='ttlClr1'>Payments</h4>
							<PaymentsPaper value={value}  setValue={setValue} 
									handleChangePmnts={handleChangePmnts}
									handleChangeDPmnts={handleChangeDPmnts} redValid={redValid}
									blnc='BlncExp' amnt={value.Amnt} />
						</Paper>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} md={3} style={{padding:'16px'}}>
					<Paper className={classes.root} style={{background: '#e7f3ff'}}>
						<h4 className='ttlClr1'>Summary</h4>
						<Divider />
							<DataSummary />
					</Paper>
			</Grid>		
		</Grid>
	</div>
  );
}

export default ExpenseModalDetails;

/*
	<Grid item xs={12} md={4}>
				<div className={classes.root}>
					<Paper className={classes.root}>
						<h5 >Financial Summary</h5>
						<Divider />
							<PaymentSummary	/>
					</Paper>
				</div>	
			</Grid>
	
	
*/
