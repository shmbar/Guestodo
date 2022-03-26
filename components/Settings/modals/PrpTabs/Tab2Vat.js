import React, { useContext } from 'react';
import { Grid, TextField, InputAdornment } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { makeStyles } from '@material-ui/core/styles';
import {AuthContext} from '../../../../contexts/useAuthContext';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  Vat: {
    marginBottom: '0px',
	color: 'red'
  },
	formControl: {
		width: '100%',
		minWidth: 120,
	},
 
}));

const Tab2Vat = (props) => {
	const { valueSettings, setValueSettings } = useContext(SettingsContext);
	const {write} = useContext(AuthContext);
	const classes = useStyles();
	
	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=2) ? n :  n.substring(0, n.length - 1);
	} ;
	
	const handleChange = (e) => {
		if(e.target.name==='VAT'){
			setValueSettings({...valueSettings,[e.target.name]:cmsnNum(e.target.value)});
		}else{
			setValueSettings({...valueSettings,[e.target.name]:(e.target.value)});
		}
			
	}
	const YesNo = ['Yes', 'No'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});
	
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
			<Grid item xs={12} md={5}>
						<FormControl className={classes.formControl}>
							<InputLabel	htmlFor="importWthVat"	>
								Import reservations with VAT
							</InputLabel>
							<Select
								value={valueSettings.importWthVat}
								onChange={e=> write && handleChange(e)}
								fullWidth
								inputProps={{
									name: 'importWthVat',
								}}
							>
								{YesNo}
							</Select>
						</FormControl>
				</Grid>
		</Grid>
	);
};

export default Tab2Vat;



