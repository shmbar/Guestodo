import React, {useState, useContext} from 'react';
import {Paper, Grid, TextField, InputAdornment, Button, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GroupIcon from '@material-ui/icons/Group';
import {updateField, addDataSettings} from '../../functions/functions.js';
import SnackBar from '../Subcomponents/SnackBar';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {AuthContext} from '../../contexts/useAuthContext';
import NumberFormatCustom from '../Subcomponents/NumberFormatCustom';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
 	 padding: theme.spacing(2, 2),
	 maxWidth: 1200
  },
  button:{
	  marginTop: 15,
  }
}));

const twoDig=(n) => {
	n += '';
	var x = n.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1].substring(0,2) : '';
return	x1 + x2;
}



const CompanyDetails=()=> {
	
	const tmp={'cpmName':'', 'initCF':0, 'cur' : '$'};
	const [snackbar, setSnackbar] = useState(false);
	const {settings, updtSettings} = useContext(SettingsContext);
	const [value, setValue] = useState(settings.CompDtls || tmp)
	const {uidCollection} = useContext(AuthContext);
	
  const classes = useStyles();
	
  const currencies = [
	{value: '$',label: 'US Dollar - $'},
	{value: '€',label: 'Euro  -  €'},
	{value: '£',label: 'British Pound Sterling - £'},
	{value: 'J¥Y',label: 'Japanese Yen - ¥'},
	{value: '₩',label: 'South Korean Won - ₩'},
	{value: '₹',label: 'Indian Rupee - ₹'},
	{value: '₪',label: 'Israeli New Sheqel - ₪'},
	{value: '₱',label: 'Philippine Peso - ₱'},
	{value: '฿',label: 'Thai Baht - ฿'},
	{value: '₡',label: 'Costa Rican Colón - ₡'},
	{value: '₫',label: 'Vietnamese Dong - ₫'},
  ];


	const handleChange=(e)=>{
		if(e.target.name!=='initCF'){
			 setValue({...value, [e.target.name]: e.target.value})
		}else{
			setValue({...value, [e.target.name]: e.target.value!=='' ? +twoDig(e.target.value): '' })
		}
	}
	
	const handleSave=async ()=>{
		
		if(settings.companyDetails==null){
			await addDataSettings(uidCollection, 'settings', 'companyDetails', {'CompDtls':value})
		}else{
			await updateField(uidCollection, 'settings', 'companyDetails','CompDtls', value);
		}
		
		setSnackbar( {open: true, msg: 'Details have been updated!',  variant: 'success'});
	 	updtSettings('CompDtls',value);
	}
	
  return (
	<div style={{padding: '10px', background:'#eee'}}>
		<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
						variant={snackbar.variant}/>
		  	<Paper className={classes.root}>
			<h4 style={{padding: '10px', color: '#193e6d'}}>Company Details</h4>
			
			<Grid container spacing={5} /*justifyContent="center  style={{maxWidth: '600px'}}*/ >
				
				<Grid item xs={12} md={3} className={classes.root} >
					<TextField
						value={value.cpmName}
						onChange={handleChange}
					//	required
						name="cpmName"
						label="Company Name"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<GroupIcon />
							</InputAdornment>
						  ),
						}}		
					  />
				</Grid>
				<Grid item xs={12} md={3} className={classes.root}>
					<TextField
						value={value.initCF}
						onChange={handleChange}
					//	required
						name="initCF"
						label="Initial Cash FLow"
						fullWidth
						InputProps={{inputComponent: NumberFormatCustom}}
							
					  />
				</Grid>
				<Grid item xs={12} md={6} className={classes.root}>
				<TextField
						select
						label="Select currency"
						name="currency"
						value={value.currency}
						fullWidth
						onChange={handleChange}
						helperText="Please select your currency"
						>
						{currencies.map((option) => (
							<MenuItem key={option.value} value={option.value}>
							{option.label}
							</MenuItem>
						))}
        		</TextField>
				</Grid>
			</Grid>
			<Button variant="contained" color="primary" className={classes.button} onClick={handleSave}>
				Save
			  </Button>
			</Paper>	
		
	</div>
  );
}

export default CompanyDetails;

