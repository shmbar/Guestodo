import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {SettingsContext} from '../../../contexts/useSettingsContext';

//const SelectOptions = ['Upfront Payment','Standard Payment', 'No Cimmission'];
const cnlArr = ['Airbnb','Booking','Tripadvisor','Agoda','Flipkey','Expedia','HomeAway'];


const Tab4Details = (props) =>{

	const {valueSettings, redValid} = useContext(SettingsContext);
	
	
	/*let sopts=SelectOptions.map(s=>{
			return <MenuItem key={s} value={s}>{s}</MenuItem>
	}); */
	
	return (
   	<div>
			<Grid container spacing={3}>
				<Grid item xs={12} md={6} > 
					 <TextField
						value={valueSettings.RsrvChn}
						onChange={props.handleChange}
						name="RsrvChn"
						disabled={cnlArr.includes(valueSettings.RsrvChn)}
						label="Reservation Channel"
						fullWidth
						error={valueSettings.RsrvChn==='' && redValid ? true: false}
					 />
				</Grid>
				<Grid container item xs={12} md={5}>
					  <TextField
						value={valueSettings.ChnCmsn}  
						onChange={props.handleChange}
						name="ChnCmsn"
						label="Channel Service Fee"
						//disabled={(valueSettings.MngCmsn==='No Cimmission') ?
						//		 true: false}
						fullWidth
						InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}}
						// error={valueSettings.ChnCmsn==='' && redValid ? true: false}
					  />
					</Grid>
				{/*<Grid item xs={12} > 
					 	<FormControl className={classes.formControl}>
							<InputLabel htmlFor="MngCmsn">Management Commission</InputLabel>
							<Select
							  value={valueSettings.MngCmsn}
							  onChange={props.handleChange}
							  inputProps={{
								name: 'MngCmsn',
								id: 'MngCmsn',
							  }}
							error={valueSettings.MngCmsn==='' && redValid ? true: false}
							>
								{sopts}
							</Select>
						</FormControl>
					</Grid>*/}
				</Grid>
			</div>
    );
    };

export default Tab4Details;
