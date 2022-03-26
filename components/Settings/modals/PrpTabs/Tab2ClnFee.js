import React, { useContext } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { SettingsContext } from '../../../../contexts/useSettingsContext';
import {AuthContext} from '../../../../contexts/useAuthContext';
import NumberFormatCustom from '../../../Subcomponents/NumberFormatCustom';

const Tab2Vat = (props) => {
	const { valueSettings, setValueSettings } = useContext(SettingsContext);
	const {write} = useContext(AuthContext);
	
	const handleChange = (e) => {
			setValueSettings({...valueSettings,[e.target.name]:e.target.value});
	}
	
	
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={2}>
				<TextField
					id="outlined-name"
					value={valueSettings.ClnFee}
					onChange={(e)=> write && handleChange(e)} 
					name='ClnFee'
					label='Cleaning Fee'
					InputProps={{inputComponent: NumberFormatCustom}}
				/>	
			</Grid>
		</Grid>
	);
};

export default Tab2Vat;
