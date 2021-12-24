import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AuthContext} from '../../../contexts/useAuthContext';
import { Tooltip, FormControl,Select,MenuItem, InputLabel, Grid,TextField, FormControlLabel, Checkbox  } from '@material-ui/core';
import {idToItem} from '../../../functions/functions.js';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import NumberFormatCustom from '../../Subcomponents/NumberFormatCustom';
import  RecMonthPickerForSettigs  from '../../Subcomponents/RecMonthPickerForSettigs';
import {SelectContext} from '../../../contexts/useSelectContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  //  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 2),
  },
 padd:{
	 padding: theme.spacing(2),
 },
 formControl: {
	width: '100%',
    minWidth: 120,
  }
}));


const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);

const TabRecuurringDetails=()=> {

  const classes = useStyles();
	
	const {settings, recStart, setRecStart, recEnd, setRecEnd, valueSettings, setValueSettings, redValid} = useContext(SettingsContext);
	const {exType, apartments, properties}=settings;
	const {write} = useContext(AuthContext);					 						 				 
	const {date} = useContext(SelectContext);

	
	let deletedExpens = exType ? exType.filter(x=>!x.show).map(x=>x.item) : [];
	let deletedApt = apartments ? apartments.filter(x=>!x.show).map(x=>x.AptName): [];
	let deletedPrp = properties ? properties.filter(x=>!x.show).map(x=>x.PrpName): [];
	
	   
	let expensesArr = [...new Set(exType.filter(y=> (y.id===valueSettings.ExpType ||  y.show)).map(x=> x.item))];		
	let ExpMenu = expensesArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedExpens.includes(s)}  className={deletedExpens.includes(s) ? 'dltItem': null}>{s}</MenuItem>
		});

	
	let ListOfProperties = [...new Set(properties.filter(y=>y.show).map(x=>x.PrpName))]
	
	ListOfProperties = ListOfProperties.map((s,i)=>{
						return <MenuItem key={s} value={s} disabled={deletedPrp.includes(s)}
						   className={deletedPrp.includes(s) ? 'dltItem': null} >{s}</MenuItem>
				});
	
	
	
	let aptArr = ['All'].concat([...new Set(apartments.filter(y=>
					(y.PrpName===valueSettings.PrpName && y.show) || (y.id===valueSettings.AptName && !y.show) ))].map(x=> x.AptName));
	let aptMenu = aptArr.map((s,i)=>{
						return <MenuItem key={s} value={s} disabled={deletedApt.includes(s)}
						   className={deletedApt.includes(s) ? 'dltItem': null}>{s}</MenuItem>
				});
	
	
	let vendsArr = exType ? [...new Set(exType.filter(y=> y.id===valueSettings.ExpType))].map(z=>z.vends) : [];
	let vendsMenu = vendsArr.map((s,i)=>{
				return <MenuItem key={s} value={s} >{s}</MenuItem>
		});
  		
	const handleChange = (e) => { //(e, val) 

		if (e.target.name==='ExpType') {	
			setValueSettings({...valueSettings, [e.target.name]: settings.exType.filter(x=> x.item===e.target.value)[0]['id'], 'vendor': '' });
		}else if (e.target.name==='PrpName'){	
			setValueSettings({...valueSettings, [e.target.name]: settings.properties.filter(x=> x.PrpName===e.target.value)[0]['id'], 'AptName': '' });
		}else if (e.target.name==='AptName'){	
			setValueSettings({...valueSettings, [e.target.name]:e.target.value!=='All' ? settings.apartments.filter(x=> x.AptName===e.target.value)[0]['id'] : 'All' });
		}else if (e.target.name==='Amnt'){	
			setValueSettings({...valueSettings, [e.target.name]:e.target.value*1,  'BlncExp': e.target.value*1,
							'ExpAmntWthtoutVat': valueSettings.Vat===false ?  +e.target.value*1:+e.target.value/(1+parseFloat(settings.vat)/100)
							 });
		}else {
			setValueSettings({...valueSettings, [e.target.name]:e.target.value });
		}  
	};
	
	const handleChangeTrueFalse= (name) =>e => {
   	 	setValueSettings({ ...valueSettings, [name]: e.target.checked,
			'ExpAmntWthtoutVat':  e.target.checked===false ?  +valueSettings.Amnt :	+valueSettings.Amnt/(1+parseFloat(settings.vat)/100) })	}
	
	
  return (
	
  <Grid container spacing={3}>
		<Grid item xs={12} md={6} >
			<FormControl className={classes.formControl}>
			<InputLabel htmlFor="ExpType"
						error={valueSettings.ExpType==='' && redValid ? true: false}
				>Expense Type</InputLabel>
				<Select 
					value={idToItem(settings.exType, valueSettings.ExpType, 'item')}  
					onChange={e=>write && handleChange(e)}
					inputProps={{
						name: 'ExpType'
					}}
					fullWidth
					error={valueSettings.ExpType==='' && redValid ? true: false}
					>
					{ExpMenu}
				</Select>
			</FormControl>
		</Grid>	
		<Grid item xs={12} md={6} >
			<Tooltip title={valueSettings.ExpType==='' ? 'Choose expense' : ''}
						placement="bottom-start">
					<FormControl className={classes.formControl}>
					<InputLabel htmlFor="vendor"
								error={valueSettings.vendor==='' && redValid ? true: false}
						>Vendor</InputLabel>
						<Select
							value={valueSettings.vendor || ''}  
							onChange={e=> handleChange(e)}
							inputProps={{
								name: 'vendor'
							}}
							fullWidth
							disabled={valueSettings.ExpType===''? true: false}
							error={valueSettings.vendor==='' && redValid ? true: false}
							>
							{vendsMenu}
						</Select>
					</FormControl>
			</Tooltip>
		</Grid>
		<Grid item xs={12} md={6}>
			<FormControl className={classes.formControl}>
			<InputLabel htmlFor="PrpName"
						error={valueSettings.PrpName==='' && redValid ? true: false}
				>Property</InputLabel>
				<Select
					value={idToItem(settings.properties, valueSettings.PrpName, 'PrpName') }  
					onChange={e=> write && 	handleChange(e)
							  }
					inputProps={{
						name: 'PrpName'
					}}
					fullWidth
					error={valueSettings.PrpName==='' && redValid ? true: false}
					>
					{ListOfProperties}
				</Select>
			</FormControl>
		</Grid>
		<Grid item xs={12} md={6}>
			<FormControl className={classes.formControl}>
			<InputLabel htmlFor="AptName"
						error={valueSettings.AptName==='' && redValid ? true: false}
				>Apartment</InputLabel>
				<Select
					value={valueSettings.AptName!=='All' ? idToItem(settings.apartments, valueSettings.AptName, 'AptName'):
								valueSettings.AptName}  
					onChange={e=> write &&	handleChange(e)
							  }
					inputProps={{
						name: 'AptName'
					}}
					fullWidth
					error={valueSettings.AptName==='' && redValid ? true: false}
					>
					{aptMenu}
				</Select>
			</FormControl>
		</Grid>
		<Grid item xs={12} style={{display: 'inline-flex', paddingTop: '15px', alignItems: 'center'}} >
				<Grid container>
						<Grid item sx={12} style={{alignSelf: 'self-end', display: 'inline-flex'}}>
								<span style={{fontSize: '16px',paddingRight: '14px'}}>Recurring every month from </span> 
						</Grid>
						<Grid item sx={12} style={{alignSelf: 'self-end', display: 'inline-flex'}}>
								<RecMonthPickerForSettigs date={date} setDate={setRecStart} recDate={recStart===undefined ? null : recStart} redValid={redValid}/>
						</Grid>
						<Grid item sx={12} style={{alignSelf: 'self-end', display: 'inline-flex'}}>
								<span style={{fontSize: '16px',paddingLeft: '14px', paddingRight: '14px'}}>to</span> 
						</Grid>
						<Grid item s={12} md={6} style={{alignSelf: 'self-end'}}>
								<RecMonthPickerForSettigs date={date} setDate={setRecEnd} recDate={recEnd===undefined ? null : recEnd} /> 
						</Grid>
				</Grid>					
		</Grid>
		<Grid item xs={12} md={4} > 
					  <TextField   
						value={valueSettings.Amnt}    
						onChange={write && handleChange}
						name="Amnt"
						label="Amount"
						InputProps={{inputComponent: NumberFormatCustom}}
						fullWidth
						error={valueSettings.Amnt==='' && redValid ? true: false}
					  />
		</Grid>
		<Grid item xs={12} md={6} style={{padding: '22px ​8px 0px 45p'}}>
			<FormControlLabel
				control={
				  <GreenCheckbox
					checked={valueSettings.Vat}
					onChange={handleChangeTrueFalse('Vat')}
					value="Vat"
				  />
					}
				label={`Include ${settings.vat} Vat`}
				disabled={!write}
				labelPlacement="end"
				/>	
		</Grid>
		  
	</Grid>
	  
  );
}

export default TabRecuurringDetails;