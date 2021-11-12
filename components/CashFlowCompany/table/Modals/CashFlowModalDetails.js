import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import CFData from './innerPapers/CFData';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
  padding: theme.spacing(3, 3),
  },
}));



const CashFlowModalDetails=(props)=> {

  const classes = useStyles();

  return (
	<div style={{padding: '10px', background:'#eee'}}>
		<Grid container spacing={2}/*justify="center */ >
			<Grid item xs={12} md={8} style={{padding:'16px'}}>
					<Paper className={classes.root}>
						<h4 className='ttlClr1'>Money Transfer</h4>
							<CFData />
					</Paper>
			</Grid>
		
		</Grid>
	  		
	</div>
  );
}

export default CashFlowModalDetails;

/*
	
	
	
*/
