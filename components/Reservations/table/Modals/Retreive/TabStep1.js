import React from 'react';
import {Grid,Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckedIcon from '../../../../LandingPage/checked.png';

const useStyles = makeStyles((theme) => ({
	mainGrid: {
		padding: theme.spacing(3),
	},
	gtgStarted: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '24px',
        fontWeight: 600,
	},
	txt: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '16px',
	  },
}));

const TabStep1=(props)=>{
    const classes = useStyles()
    return(
        <div className={classes.mainGrid}>
			<p className={classes.gtgStarted}>Step 1</p>
            <p className={classes.txt}>In this section you are requested to log into your Tokeet account for user's authorization by
                 pressing the <b>Get Authorization</b> button below.</p>
            <p className={classes.txt}>Once the authorization process has finished you will be redirected back to GuesTodo app.</p>
			
            <p className={classes.txt}>This process is required only once during initial connection.</p>

            <Grid item style={{ paddingTop: '20px', display: 'inline-flex' }}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => props.runAuth()}
						disabled={props.authorized}
					>
						Get Authorization
					</Button>
					{props.authorized && (
						<div style={{ alignSelf: 'center', paddingLeft: '10px' }}>
							<img src={CheckedIcon} alt="123" width="20px" />
						</div>
					)}
			</Grid>
        </div>
       
    )
}

export default TabStep1;