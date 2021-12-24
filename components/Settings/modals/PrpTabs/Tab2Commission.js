import React, { useContext } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {AuthContext} from '../../../../contexts/useAuthContext';

import InputAdornment from '@material-ui/core/InputAdornment';


const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		width: '100%',
		minWidth: 120,
	},
}));

const Tab2Commission = (props) => {
	const { valueSettings, redValid , selectValueSettings} = useContext(SettingsContext);
	const {write} = useContext(AuthContext);
	
	const classes = useStyles();



	const YesNo = ['Yes', 'No'].map((s, i) => {
		return (
			<MenuItem key={i} value={s}>
				{s}
			</MenuItem>
		);
	});
	
	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=3) ? n :  n.substring(0, n.length - 1);
	} ;
	
	 const handleChange = e => {
		 let tmp= (e.target.name=== 'ManagCommission') ?
			 	cmsnNum(e.target.value):e.target.value;
		let tmpObj =  valueSettings.Commissions;
		
		if(e.target.name === 'inclVat' || e.target.name === 'addVat'){
			tmpObj = {...tmpObj, [e.target.name]: e.target.value==='Yes'? true: false}
		 
		}else{	
		 	tmpObj = {...tmpObj, [e.target.name]:tmp }
		}
		 
		 selectValueSettings({...valueSettings,'Commissions':tmpObj });
	 };
	
	
	return (
			<Grid container spacing={3}>
				<Grid item xs={12} md={5}>
						<TextField
							value={valueSettings.Commissions.ManagCommission}
							onChange={e=> write && handleChange(e)}
							name="ManagCommission"
							label="Reservation Commission"
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
							}}
							error={valueSettings.Commissions.ManagCommission === '' && redValid ? true : false}
						/>
				</Grid>
				<Grid item xs={12} md={3}>
						<FormControl className={classes.formControl}>
							<InputLabel	htmlFor="inclVat">
								Include VAT
							</InputLabel>
							<Select
								value={valueSettings.Commissions.inclVat!==''? valueSettings.Commissions.inclVat ? 'Yes': 'No': ''}
								onChange={e=> write && handleChange(e)}
								fullWidth
								inputProps={{
									name: 'inclVat',
								}}
							>
								{YesNo}
							</Select>
						</FormControl>
				</Grid>
				<Grid item xs={12} md={3}>
						<FormControl className={classes.formControl}>
							<InputLabel	htmlFor="addVat"	>
								Add VAT
							</InputLabel>
							<Select
								value={valueSettings.Commissions.addVat!=='' ? valueSettings.Commissions.addVat ? 'Yes': 'No': ''}
								onChange={e=> write && handleChange(e)}
								fullWidth
								inputProps={{
									name: 'addVat',
								}}
							>
								{YesNo}
							</Select>
						</FormControl>
				</Grid>
			</Grid>
	);
};

export default Tab2Commission;

/*
	<Grid container direction="row" spacing={3}>
				<Grid item xs={12} md={6}>
					<TextField
							value={valueSettings.ExtraRevCommission}
							onChange={props.handleChange}
							name="ExtraRevCommission"
							label="Extra Revenue Commission"
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
							}}
					/>
				</Grid>
			</Grid> 
*/

