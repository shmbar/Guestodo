import React, {useContext} from 'react';
import {Grid, Tooltip, FormControl,Select,MenuItem, InputLabel, Checkbox, FormControlLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import {idToItem} from '../../../../../functions/functions.js';
import {ExContext} from '../../../../../contexts/useExContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import NumberFormatCustom from '../../../../Subcomponents/NumberFormatCustom';
import MonthPicker  from '../../../../Subcomponents/MonthPicker';
import  RecurringMonthPicker  from '../../../../Subcomponents/RecurringMonthPicker';
import {SelectContext} from '../../../../../contexts/useSelectContext';
import './papersStyle.css';


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
	const {value, handleChange, handleChangeD, handleChangeTrueFalse, redValid, recStart, setRecStart, recEnd, setRecEnd} = useContext(ExContext);
	const {settings, selectValueSettings, setRunTab, setDisplayDialogSettings,
		  selectValueSettingsApt} = useContext(SettingsContext);
	const {exType, apartments}=settings;
	const {write} = useContext(AuthContext);					 						 				 
	const {date} = useContext(SelectContext);
	
	let deletedExpens = exType ? exType.filter(x=>!x.show).map(x=>x.item) : [];
	//let deletedVends = settings.vends.filter(x=>!x.show).map(x=>x.item);
	let deletedApt = apartments ? apartments.filter(x=>!x.show).map(x=>x.AptName): [];
	const vat= settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT']
	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	
	   
	let expensesArr = exType ? ['Add new expense type'].concat([...new Set(exType.filter(y=> (y.id===value.ExpType ||  y.show)).map(x=> x.item))]) : ['Add new expense type'];		
	let ExpMenu = expensesArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedExpens.includes(s)}  className={deletedExpens.includes(s) ? 'dltItem': null} style={i===0? stl : null}>{s}</MenuItem>
		});

	

	// let ListOfProperties = settings.properties.filter(x =>
	// 				x.OwnerName===valueOwner.owner ? x :null).map(x=>x.PrpName);

	
	// if(value.PrpName ===''){
	// 		aptArr = ['Add new apartment'].concat([...new Set(apartments.filter(y=>
	// 					ListOfProperties.includes(y.PrpName)).map(x=> x.AptName))]);
	// }else{
	// 	 	aptArr = ['Add new apartment'].concat([...new Set(apartments.filter(y=>
	// 					y.PrpName===value.PrpName))].map(x=> x.AptName));
	// }

	let aptArr = apartments ? ['Add new apartment'].concat('All').concat([...new Set(apartments.filter(y=>
					(y.PrpName===value.PrpName && y.show) || (y.id===value.AptName && !y.show) ))].map(x=> x.AptName)) : ['Add new apartment', 'All'];
	let aptMenu = aptArr.map((s,i)=>{
						return <MenuItem key={s} value={s} disabled={deletedApt.includes(s)}
						   className={deletedApt.includes(s) ? 'dltItem': null} style={i===0? stl : null} >{s}</MenuItem>
				});
	
	
	let vendsArr = exType ? [...new Set(exType.filter(y=> y.id===value.ExpType))].map(z=>z.vends) : [];
	let vendsMenu = vendsArr.map((s,i)=>{
				return <MenuItem key={s} value={s} >{s}</MenuItem>
		});
  		
	let ObjApt={id:uuidv4(), PrpName: value.PrpName ,AptName: '' , StartDate:null, EndDate : null, show:true};
	
	const Add=(obj,tab)=>{
		tab!=='TabApt' ? selectValueSettings(obj):selectValueSettingsApt(obj);
		setRunTab(tab)
	}
	
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
								value={idToItem(settings.exType, value.ExpType, 'item')}  
								onChange={e=>write && (e.target.value!=='Add new expense type'? handleChange(e, settings.exType): AddtoList('ExpType'))}
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
					<Tooltip title={value.ExpType==='' ? 'Choose expense' : ''}
								placement="bottom-start">
							<FormControl className={classes.formControl}>
							<InputLabel htmlFor="vendor"
										error={value.vendor==='' && redValid ? true: false}
								>Vendor</InputLabel>
								<Select
									value={value.vendor || ''}  
									onChange={e=> handleChange(e, settings.exType)}
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
				{!value.recCost	? 
					<Grid item xs={12} md={6} >
						<MonthPicker date={date} handleChangeD={handleChangeD} value={value} redValid={redValid}/>
					</Grid> :
					<Grid item xs={12} style={{alignSelf: 'end'}} >
						<Grid container >
							<Grid item sx={12} style={{alignSelf: 'self-end', display: 'inline-flex'}}>
									<span style={{fontSize: '16px',paddingRight: '14px', alignSelf: 'flex-end'}}>From </span> 
									<RecurringMonthPicker date={date} setDate={setRecStart} recDate={recStart===undefined ? null : recStart} redValid={redValid} 
										dis={value.recTransaction!==undefined}/>
							</Grid>
							<Grid item sx={12} style={{alignSelf: 'self-end', display: 'inline-flex'}}>
									<span style={{fontSize: '16px',paddingLeft: '14px', paddingRight: '14px', alignSelf: 'flex-end'}}>To</span> 
									<RecurringMonthPicker date={date} setDate={setRecEnd} recDate={recEnd===undefined ? null : recEnd}
										dis={value.recTransaction!==undefined}/>
							</Grid>
						</Grid>
					</Grid>
				}
				<Grid item xs={12} md={6}>
						  	<FormControl className={classes.formControl}>
							<InputLabel htmlFor="AptName"
										error={value.AptName==='' && redValid ? true: false}
								>Apartment</InputLabel>
								<Select
									value={value.AptName!=='All' ? idToItem(settings.apartments, value.AptName, 'AptName'):
										  		value.AptName}  
									onChange={e=> write && (e.target.value!=='Add new apartment'?
										handleChange(e, settings.apartments ): Add(ObjApt, 'TabApt'))
											  }
									inputProps={{
										name: 'AptName'
									}}
									fullWidth
									error={value.AptName==='' && redValid ? true: false}
									>
									{aptMenu}
								</Select>
							</FormControl>
				</Grid>
				<Grid item xs={12} md={12}>
							<FormControlLabel
								control={
								  <GreenCheckbox
									checked={value.recCost}
									onChange={handleChangeTrueFalse('recCost', null)}
									value="recCost"
								  />
									}
								 label='Recurring Expense'
								disabled={!write || value.LstSave!==''}
								labelPlacement="end"
								/>	
				</Grid>
				
				 	<Grid item xs={12} md={4}  style={{paddingTop: 0}}> 
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
					<Grid item xs={12} md={3}>
							<FormControlLabel
								control={
								  <GreenCheckbox
									checked={value.Vat}
									onChange={handleChangeTrueFalse('Vat', vat)}
									value="VAT"
								  />
									}
								 label={`${vat}% VAT included`}
								disabled={!write || +vat===0}
								labelPlacement="end"
								/>	
					</Grid>
					<Grid item xs={12} md={8} style={{paddingTop: 0}}> 
						<TextField
							value={value.Notes}   
							onChange={e=>handleChange(e, settings )}
							label="Notes"
							multiline
							name = 'Notes'
							fullWidth
							InputProps={{readOnly: !write ? true:false }}
				  		/>
					</Grid>
				</Grid>
    );
    };

export default ExpenseData;

/*

const fromRecDate= value.recTransaction!=null ? dateFormat(valueRec.startDate,'mmmm yyyy') :  value.AccDate===null? '-' :
					dateFormat(	new Date(value.AccDate).setMonth(new Date(value.AccDate).getMonth()+1), 'mmmm yyyy') 

<Grid item xs={12} md={12} style={{paddingBottom: '0px'}} >
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
									value="Variable Cost"
									control={<Radio color="primary" />}
									label="Variable Cost"
									disabled={value.recTransaction!=null ? true: false} 
									labelPlacement="end"
								  />
								  <FormControlLabel
									value="Fixed Cost"
									control={<Radio color="primary" />}
									label="Fixed Cost"
									labelPlacement="end"
								  />
							</RadioGroup>
						  </FormControl>
					</Grid>




	<Grid item xs={12} style={{display: 'inline-flex', paddingTop: '10px', alignItems: 'center'}} >
					
						<Grid item s={12} md={6} style={{textAlign: 'right', alignSelf: 'self-end'}}>
								<span style={{fontSize: '16px',paddingRight: '14px'}}><>Recurring every month from <span>{fromRecDate}</span> to </> </span> 
						</Grid>
						<Grid item s={12} md={6} style={{alignSelf: 'self-end'}}>
								<RecurringMonthPicker date={date} setRecEnd={setRecEnd} recEnd={recEnd===undefined ? null : recEnd} />
						</Grid>
					
					 								
					</Grid>


*/
