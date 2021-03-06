import React, {useContext} from 'react';
import {Grid, TextField, FormControl, Select, MenuItem, InputLabel, Checkbox} from '@material-ui/core';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import { makeStyles } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import {OiContext} from '../../../../../contexts/useOiContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {SelectContext} from '../../../../../contexts/useSelectContext';
import {idToItem} from '../../../../../functions/functions.js';
import NumberFormatCustom from '../../../../Subcomponents/NumberFormatCustom';
import MonthPicker from '../../../../Subcomponents/MonthPicker';

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

const OtherIncomeData = () =>{
	const classes = useStyles();
	const stl = {color:'purple', fontStyle: 'italic'};
	
	const {value, handleChange, handleChangeD, handleChangeTrueFalse, redValid} = useContext(OiContext);
	const {settings, setRunTab, setDisplayDialogSettings} = useContext(SettingsContext);
	const {incType}=settings;
	const {date} = useContext(SelectContext);
	const {write} = useContext(AuthContext);
	const vat= settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT']
	
	let deletedIncomes = incType!=null  ? incType.filter(x=>!x.show).map(x=>x.item) : [];
	
	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	
	   
	let incomeArr = incType!=null ? ['Add new income type'].concat([...new Set(incType.filter(y=>(y.id === value.incType || y.show)).map(x=> x.item))]) : ['Add new income type'];
	let IncMenu = incomeArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedIncomes.includes(s)}
				   className={deletedIncomes.includes(s) ? 'dltItem': null} style={i===0? stl : null}>{s}</MenuItem>
		});

	//let deletedPrprty = properties.filter(x=>!x.show).map(x=>x.PrpName);
	// let propertiesArr = [...new Set(properties.filter(x=> (x.Owner===valueOwner && x.show) || (x.id===value.PrpName && !x.show) ).map(x => x.PrpName))];			
	// let propertyMenu = propertiesArr.map((s,i)=>{
	// 			return <MenuItem key={s} value={s} disabled={deletedPrprty.includes(s)}
	// 					   className={deletedPrprty.includes(s) ? 
	// 					'dltItem': null} >{s}</MenuItem>
	// 	});
  		
	const AddtoList=(x)=>{
		setDisplayDialogSettings(true);
		setRunTab(x);
	}					
	
	return (
			<Grid container spacing={3}>
				<Grid item xs={12} md={6} >
						<FormControl className={classes.formControl}>
						<InputLabel htmlFor="incType"
									error={value.incType==='' && redValid ? true: false}
							>Income Type</InputLabel>
							<Select
								value={	idToItem(settings.incType, value.incType, 'item')}  
								onChange={e=>(e.target.value!=='Add new income type'? handleChange(e, settings.incType):
											  AddtoList('incTypeCompany'))}
								inputProps={{
									name: 'incType'
								}}
								fullWidth
								error={value.incType==='' && redValid ? true: false}
								>
								{IncMenu}
							</Select>
						</FormControl>
					</Grid>	
					<Grid item xs={12} md={6} >
						<MonthPicker date={date} handleChangeD={handleChangeD} value={value} redValid={redValid}/>
					</Grid>
					<Grid item xs={12} md={6} > 
					  <TextField   
						value={value.Amnt}    
						onChange={e=> write && handleChange(e, vat)}
						name="Amnt"
						label="Amount"
						InputProps={{inputComponent: NumberFormatCustom}}
						fullWidth
						error={value.Amnt==='' && redValid ? true: false}
					  />
					</Grid>
					<Grid item xs={12} md={6} >
						
					</Grid>	
					<Grid item xs={12} md={6}>
							<FormControlLabel
								control={
								  <GreenCheckbox
									checked={value.Vat}
									onChange={write && handleChangeTrueFalse('Vat', vat)}
									value="VAT"
								  />
									}
								 label={`${vat}% VAT included`}
								disabled={!write || +vat===0}
								labelPlacement="end"
								/>	
					</Grid>
					<Grid item xs={12} md={8} > 
						<TextField
							value={value.Notes}   
							onChange={e=>write && handleChange(e, vat )}
							label="Notes"
							multiline
							name = 'Notes'
							fullWidth
				  		/>
					</Grid>
				</Grid>
    );
    };

export default OtherIncomeData;

/*

<FormControl className={classes.formControl}>
						<InputLabel htmlFor="PrpName"
									error={value.PrpName==='' && redValid ? true: false}
							>Property Name</InputLabel>
							<Select
								value={	idToItem(settings.properties, value.PrpName, 'PrpName')}  
								onChange={e=> handleChange(e, settings.properties)}
								inputProps={{
									name: 'PrpName'
								}}
								fullWidth
								error={value.PrpName==='' && redValid ? true: false}
								>
								{propertyMenu}
							</Select>
						</FormControl>

*/
