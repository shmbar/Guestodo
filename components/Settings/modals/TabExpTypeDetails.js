import React, {useContext} from 'react';
import {Grid, TextField} from '@material-ui/core';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import {FormControl, Select,InputLabel}  from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
	width: '100%',
    minWidth: 120,
  }
}));

const TabExpTypeDetails = (props) =>{

	const {valueSettings, redValid} = useContext(SettingsContext);
	
	const classes = useStyles();
	

	
	// let ownersArr = !props.runFromOrders ? [...new Set(settings.owners.filter(x=>x.show).map(z=>z.item))] : [valueOwner.owner];
	// let ownersMenu = ownersArr.map((s,i)=>{
	// 			return <MenuItem key={s} value={s} disabled={deletetOwners.includes(s)} className={deletetOwners.includes(s) ?
	// 					'dltItem': null}>{s}</MenuItem>
	// 	});
	
	// let deletedFund = settings.Funds.filter(x=>!x.show).map(x=>x.Fund);

	// let fundsArr =[...new Set(settings.Funds.filter(z=>
	// 			(z.Owner === valueSettings.OwnerName && z.show)  || (z.Fund === valueSettings.Fund && !z.show)).map(x=>x.Fund))];  
	// let fundsArrMenu = fundsArr.map((s,i)=>{
	// 			return <MenuItem key={i} value={s} disabled={deletedFund.includes(s)}
	// 					   className={deletedFund.includes(s) ?
	// 					'dltItem': null}>{s}</MenuItem>
	// 	});
	
	
	
	return (
			<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<TextField
						value={valueSettings.item}
						onChange={props.handleChange}
						name="item"
						label="Expense"
						fullWidth
						error={valueSettings.item==='' && redValid ? true: false}
					  />
					</Grid>
					<Grid item xs={12} md={6} >
						<TextField
							value={valueSettings.vends}
							onChange={props.handleChange}
							name="vends"
							label="Vendor"
							fullWidth
							error={(valueSettings.vends==='' || valueSettings.vends==null) && redValid ? true: false}
					  />
					</Grid>	
					<Grid item xs={12} md={8} >
						<FormControl className={classes.formControl}>
						<InputLabel htmlFor="exGroup"
							error={(valueSettings.exGroup==='' || valueSettings.exGroup==null) && redValid ? true: false}
							>Expense Group</InputLabel>
							<Select
								value={valueSettings.exGroup}  
								onChange={props.handleChange}
								fullWidth
								inputProps={{
									name: 'exGroup'
								}}
								error={(valueSettings.exGroup==='' || valueSettings.exGroup==null) && redValid ? true: false}
								>
								{props.groupOpt}
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			
    );
    };

export default TabExpTypeDetails;
