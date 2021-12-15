import React, {useContext} from 'react';
import {Grid, Tooltip, TextField, FormControl} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Radio from '@material-ui/core/Radio';
//import RadioGroup from '@material-ui/core/RadioGroup';
import { v4 as uuidv4 } from 'uuid';
import {idToItem} from '../../../../../functions/functions.js';

import {ExContext} from '../../../../../contexts/useExContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import NumberFormatCustom from '../../../../Subcomponents/NumberFormatCustom';
import MonthPicker from '../../../../Subcomponents/MonthPicker';
import {SelectContext} from '../../../../../contexts/useSelectContext';

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


const ExpenseData = () =>{
	const classes = useStyles();
	const stl = {color:'purple', fontStyle: 'italic'};
	
	const {value, handleChange, handleChangeD, handleChangeTrueFalse, redValid} = useContext(ExContext);
	const {settings, setRunTab, setDisplayDialogSettings, selectValueSettings} = useContext(SettingsContext);
	const {exTypeCompany, vat}=settings;
	const {date} = useContext(SelectContext);
	
	let deletedExpens = exTypeCompany!=null ? exTypeCompany.filter(x=>!x.show).map(x=>x.item):[];
	//let deletedVends = vendsCompany.filter(x=>!x.show).map(x=>x.item);
	
	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	
	   
	let expensesArr = exTypeCompany!=null? ['Add new expense type'].concat([...new Set(exTypeCompany.filter(y=> (y.id===value.ExpType ||  y.show)).map(x=> x.item))]): ['Add new expense type'];
	let ExpMenu = expensesArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedExpens.includes(s)}  className={deletedExpens.includes(s) ? 'dltItem': null} style={i===0? stl : null}>{s}</MenuItem>
		});

	
	let vendsArr = exTypeCompany!=null ? [...new Set(exTypeCompany.filter(y=> y.id===value.ExpType))].map(z=>z.vends) : [];
	let vendsMenu = vendsArr.map((s,i)=>{
				return <MenuItem key={s} value={s} >{s}</MenuItem>
		});
  		
	const AddtoList=(x)=>{
		selectValueSettings({id:uuidv4(), item: '' ,vends: '' , exGroup:'', show:true})
		setDisplayDialogSettings(true);
		setRunTab(x);
	}					
	
	return (
			<Grid container spacing={3}>
				<Grid item xs={12} md={6} >
						<FormControl className={classes.formControl}>
						<InputLabel htmlFor="ExpType"
									error={value.ExpType==='' && redValid ? true: false}
							>Expense Type</InputLabel>
							<Select
								value={idToItem(exTypeCompany, value.ExpType, 'item')}  
								onChange={e=>(e.target.value!=='Add new expense type'? handleChange(e, exTypeCompany):
											  AddtoList('exTypeCompany'))}
								inputProps={{
									name: 'ExpType'
								}}
								fullWidth
								error={value.ExpType==='' && redValid ? true: false}
								>
								{ExpMenu}
							</Select>
						</FormControl>
					</Grid>	
					<Grid item xs={12} md={6} >
						<Tooltip title={value.ExpType==='' ? 'Choose expense' : ''} placement="bottom-start">
							<FormControl className={classes.formControl}>
							<InputLabel htmlFor="vendor"
										error={value.vendor==='' && redValid ? true: false}
								>Vendor</InputLabel>
								<Select
									value={value.vendor || ''}  
									onChange={e=> handleChange(e, exTypeCompany)}
									inputProps={{
										name: 'vendor'
									}}
									fullWidth
									disabled={value.ExpType===''? true: false}
									error={value.vendor==='' && redValid ? true: false}
									>
									{vendsMenu}
								</Select>
							</FormControl>
						</Tooltip>
					</Grid>
					<Grid item xs={12} md={6} >
						<MonthPicker date={date} handleChangeD={handleChangeD} value={value} redValid={redValid}/>
					</Grid>
			{/*<Grid item xs={12} md={12} style={{paddingBottom: '0px'}} >
						<FormControl component="fieldset" className={classes.formControl}>
							<RadioGroup
							  aria-label="gender"
							  name="CostType"
							  className={classes.group}
							  style={{display: 'inline', paddingLeft: '16px'}}	
							  value={value.CostType}
							  onChange={handleChange}
							>
								  <FormControlLabel
									value="Fixed Cost"
									control={<Radio color="primary" />}
									label="Fixed Cost"
									labelPlacement="end"
								  />
								  <FormControlLabel
									value="Variable Cost"
									control={<Radio color="primary" />}
									label="Variable Cost"
									labelPlacement="end"
								  />
							</RadioGroup>
						  </FormControl>
					</Grid> */}
					<Grid item xs={12} md={6} > 
					  <TextField   
						value={value.Amnt}    
						onChange={e=> handleChange(e, settings.vat)}
						name="Amnt"
						label="Amount"
						InputProps={{inputComponent: NumberFormatCustom}}
						fullWidth
						error={value.Amnt==='' && redValid ? true: false}
					  />
					</Grid>
					<Grid item xs={12} md={6}>
							<FormControlLabel
								control={
								  <GreenCheckbox
									checked={value.Vat}
									onChange={handleChangeTrueFalse('Vat', vat)}
									value="Vat"
								  />
									}
								 label={`${vat} VAT included `}
								labelPlacement="end"
								/>	
					</Grid>
					<Grid item xs={12} md={8} > 
						<TextField
							value={value.Notes}   
							onChange={e=>handleChange(e, settings )}
							label="Notes"
							multiline
							name = 'Notes'
							fullWidth
				  		/>
					</Grid>
				</Grid>
    );
    };

export default ExpenseData;

/*


let proprArr = ['Add new property'].concat([...new Set(properties.filter(x=>
							 x.OwnerName===valueOwner.owner).map(x => x.PrpName))]);
	let proprMenu = proprArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedPrprty.includes(s)}  className={deletedPrprty.includes(s) ? 'dltItem': null} style={i===0? stl : null}>{s}</MenuItem>
		});
let ObjProperty={id:uuid(), OwnerName:'' ,PrpName: '' , StartDate: null, EndDate : null, ManagCommission : '', IntCshFlBnce: '', BAccNum: '', show:true};
let deletedPrprty = settings.properties.filter(x=>!x.show).map(x=>x.PrpName);




	<Grid item xs={12} md={6}>
						<FormControlLabel
							  value="end"
							  control={<Checkbox checked={value.RecExp} 
									value="RecExp" />}
							  label="Recurring Expense"
							disabled
							  labelPlacement="end"
							/>
					</Grid>
					<Grid item xs={12} md={6} > 
					  	<TextField   
						//	value={value.Vndr}    
						//	value='1'
						//	onChange={e=>handleChange(e,channels, taxes)}
							disabled
							name="Vndr"
							label="Repeat Every"
						//	disabled={value.RsrvCncl==='No' ? false:true}
							fullWidth
					  />
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControlLabel
							  value="end"
							  control={<Checkbox checked={false} 
									 //  onChange={handleChange('gilad')}
									value="RecExp" />}
								disabled
							  label="Never Expired"
							  labelPlacement="end"
							/>
					</Grid>
					<Grid item xs={12} md={6} > 
					  <TextField   
					//	onChange={e=>handleChange(e,channels, taxes)}
						name="Amnt"
						label="Number of Expenses"
						disabled
						InputProps={{
						//		inputComponent: NumberFormatCustom,
								endAdornment: <InputAdornment position="end">$</InputAdornment>}}
						fullWidth
					  />
					</Grid>




*/
