import React, { useContext } from 'react';
import { Grid, TextField, InputAdornment } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { makeStyles } from '@material-ui/core/styles';
import {AuthContext} from '../../../../contexts/useAuthContext';


const useStyles = makeStyles(theme => ({
  Vat: {
    marginBottom: '0px',
	color: 'red'
  }
 
}));

const Tab2Vat = (props) => {
	const { valueSettings, setValueSettings } = useContext(SettingsContext);
	const {write} = useContext(AuthContext);
	const classes = useStyles();
	
	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=2) ? n :  n.substring(0, n.length - 1);
	} ;
	
	const handleChange = (e) => {
	
			setValueSettings({...valueSettings,[e.target.name]: cmsnNum(e.target.value)});
	}
	
	
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={2}>
				<TextField
					id="outlined-name"
					value={valueSettings.VAT}
					onChange={e=> write && handleChange(e)}
					name='VAT'
					label='VAT'
					InputProps={{endAdornment: <InputAdornment position="end" className={classes.Vat}>%</InputAdornment>}}
				/>	
			</Grid>
		</Grid>
	);
};

export default Tab2Vat;



