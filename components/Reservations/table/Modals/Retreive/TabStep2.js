import React from 'react';
import {Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ConnectAptsTable from './ConnectAptsTable';

const useStyles = makeStyles((theme) => ({
	mainGrid: {
		padding: theme.spacing(3),
	},

	txt: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '16px',
	  },
	gtgStarted: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '24px',
        fontWeight: 600,
	},
}));

const TabStep2=(props)=>{
    const classes = useStyles()
    return(
        <div className={classes.mainGrid}>
			
			<p className={classes.gtgStarted}>Step 2</p>
			<p className={classes.txt}>In this section you are requested to setup the connection between Tokeet apartments to GuesTodo Apartments.</p>
			
			<p className={classes.txt}>By pressing the <b>Get Apartments</b> button below, you will receive a list of your properties in Tokeet.</p>
			<p className={classes.txt}>Please select for each Tokeet apartment in the list, the related apartment in GuesTodo.</p>
			
			<div style={{paddingTop: '10px' }}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => props.getTokeetApartments()}
				>
					Get Apartments
				</Button>
			</div>
			<div style={{paddingTop: '30px', paddingBottom: '20px'}}>
				<ConnectAptsTable {...props}/>
			</div>
			
			<p className={classes.txt}>This integration wizard enables to connect Tokeet apartments based on
				the selected checkbox in the table above.</p>
			
			<p className={classes.txt}>Press the <b>Move to step 3</b> button to move to the next step.</p>
		
        </div>
       
    )
}

export default TabStep2;