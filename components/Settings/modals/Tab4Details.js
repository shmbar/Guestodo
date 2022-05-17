import React, {useContext} from 'react';
import {Grid, FormControl, FormControlLabel, Checkbox} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import NumberFormatCustom from '../../Subcomponents/NumberFormatCustom';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
//const SelectOptions = ['Upfront Payment','Standard Payment', 'No Cimmission'];
const cnlArr = ['Airbnb','Booking','Tripadvisor','Agoda','Flipkey','Expedia','HomeAway', 'Tokeet', 'Webready'];

const GreenCheckbox = withStyles({
	root: {
		'&$checked': {
			color: green[600],
		},
		padding: '5px',
	},
	checked: {},
})((props) => <Checkbox color="default" {...props} />);

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
						InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>,
									inputComponent: NumberFormatCustom}}
						// error={valueSettings.ChnCmsn==='' && redValid ? true: false}
					  />
				</Grid>
				<Grid item>
						<FormControl>
							<FormControlLabel
								control={<GreenCheckbox checked={valueSettings.UpFrnt===undefined? true : valueSettings.UpFrnt } />}
								onChange={props.handleChange}
								name="UpFrnt"
								label="Up Front Fee"
								labelPlacement="end"
							/>
						</FormControl>
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
