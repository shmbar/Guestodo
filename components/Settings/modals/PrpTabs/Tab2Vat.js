import React, { useContext } from 'react';
import { Grid, TextField, InputAdornment } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  Vat: {
    marginBottom: '0px',
	color: 'red'
  }
 
}));

const Tab2Vat = (props) => {
	const { valueSettings, redValid, } = useContext(SettingsContext);
	const classes = useStyles();
	
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={3}>
				<TextField
					id="outlined-name"
					value={valueSettings.vat}
					onChange={props.handleChange}
					label='VAT'
					InputProps={{endAdornment: <InputAdornment position="end" className={classes.Vat}>%</InputAdornment>}}
				/>	
			</Grid>
		</Grid>
	);
};

export default Tab2Vat;



