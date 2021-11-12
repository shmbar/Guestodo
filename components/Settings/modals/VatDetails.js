import React, {useContext} from 'react';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import { Grid,TextField, InputAdornment }  from '@material-ui/core';
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


const VatDetails = (props) =>{
	
	const {valueSettings/*, settings*/} = useContext(SettingsContext);	
	const classes = useStyles();
	
	
	return (
   	<div>
			<Grid container spacing={3} alignItems="flex-end">
				<Grid item xs={12} md={6}>
					<TextField
							id="outlined-name"
							className={classes.textField}
							value={valueSettings.vat}
							onChange={props.handleChange}
							margin="normal"
							label='Vat'
							InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}}
					/>
				</Grid>
					
					
				</Grid>
			</div>
    );
    };

export default VatDetails;
