import React from 'react';
import {Grid, Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TktReservationsTable from './TktReservationsTable'
import MonthPickerTokeet from '../../../../Subcomponents/MonthPickerTokeet';

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

const TabStep3=(props)=>{
    const classes = useStyles();
	
    return(
		
        <div className={classes.mainGrid}>
				
			  <p className={classes.gtgStarted}>Step 3</p>
			  <p className={classes.txt}>In this section you are requested to import rentals data  
			by selecting the check-in date.</p>
			
		
			<Grid container direction="row" justifyContent="flex-start" alignItems="center"
				spacing={4} style={{paddingBottom: '20px'}}>
				<Grid item style={{width: '220px'}}>
					<MonthPickerTokeet
						date={props.date} //handleChangeD={handleChangeD}
						startDate={props.startDate}
						setStartDate={props.setStartDate}
					/>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={() => props.importLines()}
						disabled={props.startDate === null}
					>
						Get Data
					</Button>
				</Grid>
			</Grid>
			
			<p className={classes.txt}>The table below shows the imported reservations starting from the selected date above.</p>
			
			 <Grid  container  direction="row" justifyContent="space-between" 
				alignItems="center" style={{paddingTop: '30px'}}>
				<Grid item xs={12}>
					<TktReservationsTable {...props}/>
				</Grid>
			</Grid> 
			
			
			{/*
           <Grid  container  direction="row" justifyContent="space-between" 
				alignItems="center">
				<Grid item xs={12} style={{paddingBottom: '20px'}}>
				 	<ConnectAptsTable {...props}/>
				</Grid>
				<Grid item xs={12}>
					<TktReservationsTable {...props}/>
				</Grid>
			</Grid> */}
        </div>
       
    )
}

export default TabStep3;