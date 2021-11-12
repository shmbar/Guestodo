import React, {useContext} from 'react';
import {Grid, TextField, FormControl, MenuItem} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Radio, ListItemIcon,FormControlLabel, RadioGroup, FormLabel}  from '@material-ui/core';

import {CfContext} from '../../../../../contexts/useCfContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import {idToItem} from '../../../../../functions/functions.js';
import NumberFormatCustom from '../../../../Subcomponents/NumberFormatCustom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
	width: '100%',
    minWidth: 120,
  },
  group: {
    margin: theme.spacing(1, 0),
  },
}));

function addComma(nStr){
		 nStr += '';
		 var x = nStr.split('.');
		 var x1 = x[0];
		 var x2 = x.length > 1 ? '.' + x[1].substring(0,2) : '';
		 var rgx = /(\d+)(\d{3})/;
		 while (rgx.test(x1)) {
		//  x1 = x1.replace(rgx, '$1' + ',' + '$2');
			x1 = x1.replace(rgx, '$1,$2');	 
		 }
		 return x1 + x2;
	}

const showTR = (x) => x.indexOf("_") === -1 ? x : x.substring(0, x.indexOf("_"));

const CFData = () =>{
	const classes = useStyles();
	const stl = {color:'purple', fontStyle: 'italic'};
	const {write} = useContext(AuthContext);					 						 				 
	
	
	const {value, handleChange, handleChangeD, handleSave, redValid} = useContext(CfContext);
	const {settings,  setRunTab, setDisplayDialogSettings, pmntsLogo} = useContext(SettingsContext);
	
	let deleted = settings.pmntMethods ? settings.pmntMethods.filter(x=>!x.show).map(x=>x.item) : [];
	
	let pmArr =  settings.pmntMethods ? ['Add new method'].concat([...new Set(settings.pmntMethods.filter(q=>q.show).map(y=>y.item))]):['Add new method'];
	let pmMenu = pmArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deleted.includes(s)}  className={deleted.includes(s) ?
						'dltItem': null}  style={i===0? stl:{}}>
					{i!==0 && <ListItemIcon style={{display:'table-column'}}>
            					<img src={findImg(s,'img')} alt={s} width={findImg(s,'width')} />
          			</ListItemIcon> }{s}
				</MenuItem>	});

	function findImg(txt,y){
		return	pmntsLogo.filter(x=> x.txt===txt)[0]!==undefined ?
				pmntsLogo.filter(x=> x.txt===txt)[0][y] : pmntsLogo[pmntsLogo.length-1][y]
	}
	
	const showImg =(val) =>{
		return  <img src={findImg(val,'img')} alt={val} width={findImg(val,'width')} />
	}
	
	const AddtoList=(x)=>{
		setDisplayDialogSettings(true);
		setRunTab(x);
	}
	
	return (
		<form onSubmit={handleSave}>
			<Grid container spacing={3} alignItems="flex-end">
				<Grid item xs={12} md={6} >
						<TextField
							value={idToItem(settings.owners, value.owner, 'item')}
							label="Owner Name"
							fullWidth
					  />
				</Grid>
				<Grid item xs={12} md={6} >
						<TextField
							value={showTR(value.Transaction)}
							name="Transaction"
							label="Transaction"
							fullWidth
					  />
				</Grid>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid item xs={12} md={6} >
						<KeyboardDatePicker 
								autoOk
								disableToolbar
								okLabel={false}
								clearable
								label="Transaction Date"
								value={value.TransactionDate}
								onChange={date=>write && handleChangeD('TransactionDate',date)}
								format="dd-MMM-yyyy"
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								error={value.TransactionDate===null && redValid ? true: false}
							/>
						</Grid>
				</MuiPickersUtilsProvider>
				<Grid item xs={12} md={6}> 
					<TextField
						select
						label="Payment Method"
						value={idToItem(settings.pmntMethods, value.PM, 'item')}
						onChange={e=> write && (e.target.value!=='Add new method'? handleChange(e, settings): AddtoList('PM'))}
						name ='PM'
						InputProps={{
							startAdornment: <InputAdornment position="start"> {showImg(idToItem(settings.pmntMethods, value.PM, 'item'))}</InputAdornment>,
						}}
						fullWidth
					  >
						{pmMenu}
					</TextField>
				</Grid>
				<Grid item xs={12} md={6} style={{alignSelf: 'center'}}> 
					  	<TextField   
							value={addComma(value.Amnt)}    
							onChange={handleChange}
							name="Amnt"
							label="Amount"
							fullWidth
							error={value.Amnt==='' && redValid ? true: false}
							InputProps={{inputComponent: NumberFormatCustom,
								readOnly: !write ? true:false }}
							
							/>
				</Grid>
				<Grid item xs={12} md={6} >
					<FormControl component="fieldset" className={classes.formControl}>
						<FormLabel component="legend">Withdrawal / Deposit</FormLabel>
						<RadioGroup
						  aria-label="gender"
						  name="WithdrDepst"
						  className={classes.group}
						  value={value.WithdrDepst}
						  onChange={handleChange}
						 style={{ display: 'inline'}}
						>
							  <FormControlLabel
								value="Withdrawal"
								control={<Radio color="primary" />}
								label="Withdrawal"
								labelPlacement="end"
							  />
							  <FormControlLabel
								value="Deposit"
								control={<Radio color="primary" />}
								label="Deposit"
								labelPlacement="end"
							  />
						</RadioGroup>
					  </FormControl>
				</Grid>
				<Grid item xs={12} md={8} > 
						<TextField
							value={value.Notes}   
							onChange={handleChange}
							label="Notes"
							multiline
							name = 'Notes'
							fullWidth
							InputProps={{readOnly: !write? true:false }}
				  		/>
				</Grid>
			</Grid>
		</form>	
    );
    };

export default CFData;
