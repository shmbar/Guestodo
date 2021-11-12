import React, {useContext} from 'react';
import {Grid,TextField, MenuItem, FormControl, InputLabel,Select}  from '@material-ui/core';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import { makeStyles } from '@material-ui/core/styles';
import {idToItem} from '../../../functions/functions.js';
import NumberFormatCustom from '../../Subcomponents/NumberFormatCustom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
	width: '100%',
    minWidth: 120,
  },
}));


const Tab7Details = (props) =>{
	const classes = useStyles();
	const {valueSettings, redValid, settingsShows, settings} = useContext(SettingsContext);	
	
	let deletetOwners = settings.owners!=null ? settings.owners.filter(x=>!x.show).map(x=>x.item): [];
	
	let ownerArr = settings.owners!=null  ? settings.owners.filter(y=>
								  (y.show || y.id===valueSettings.Owner)).map(x=> x.item) : ['Set owners']; //when the list is empty
	let ownerMenu = ownerArr.map((s,i)=>{
						return <MenuItem key={i} value={s} disabled={deletetOwners.includes(s) || s==='Set owners'} >{s}</MenuItem>
				});

	return (
   	<div>
			<Grid container spacing={3}>
					<Grid item xs={12} md={4} >
					 <TextField
						value={valueSettings.item}
						onChange={props.handleChange}
						name="item"
						//disabled={settingsShows[valueSettings.id]} 
						label="Fund"
						fullWidth
						error={valueSettings.item==='' && redValid ? true: false} 
					  />
					</Grid>
					<Grid item xs={12} md={4}>
						  	<FormControl className={classes.formControl}>
							<InputLabel htmlFor="Owner"
										error={valueSettings.Owner==='' && redValid ? true: false}
									>Owner</InputLabel>
								<Select
									value={	idToItem(settings.owners, valueSettings.Owner, 'item') }  
									onChange={props.handleChange}
									disabled={settingsShows[valueSettings.id]} 
									inputProps={{
										name: 'Owner'
									}}
									fullWidth
									name= 'Owner'
									error={valueSettings.Owner==='' && redValid ? true: false}
									>
									{ownerMenu}
								</Select>
							</FormControl>
					</Grid>
					<Grid item xs={12} md={4} >
					  <TextField
						value={valueSettings.IntCshFlBnce}
						onChange={props.handleChange}
						name="IntCshFlBnce"
						label="Cash Flow Balance"
						fullWidth
						InputProps={{inputComponent: NumberFormatCustom}}
					  />
					</Grid>	
				</Grid>
			</div>
    );
    };

export default Tab7Details;
