import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {ListItemIcon, IconButton, Box, Button, MenuItem, Tooltip}  from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';

import {SettingsContext} from '../../../../contexts/useSettingsContext';
import AddNew from '@material-ui/icons/AddCircleOutline';
import {idToItem} from '../../../../functions/functions.js';
import NumberFormatCustom from '../../../Subcomponents/NumberFormatCustom';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { v4 as uuidv4 } from 'uuid';


const dateFormat = require('dateformat');
const PaymentsPaper = (props) =>{
	//	const {value, setValue, handleChangePmnts,handleChangeDPmnts, redValid} = useContext(ExContext);
		const {settings, setDisplayDialogSettings, setRunTab, pmntsLogo} = useContext(SettingsContext);
					 						 				 
	
		const stl = {color:'purple', fontStyle: 'italic'};
		
	
		let deleted = settings.pmntMethods.filter(x=>!x.show).map(x=>x.item);
	
		let pmArr = ['Add new method'].concat(settings.pmntMethods.filter(q=> (props.pmnts.map(x=> x.PM).includes(q.id) || q.show)).map(x=>x.item));
		let pmMenu = pmArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deleted.includes(s)} className={deleted.includes(s) ?
						'dltItem': null}   style={i===0? stl : null}>
						{i!==0 && <ListItemIcon style={{display:'table-column'}}>
            					<img src={findImg(s,'img')} alt={s} width={findImg(s,'width')} />
          						</ListItemIcon> }{s}
						</MenuItem>
		});
	
	function findImg(txt,y){
		return	pmntsLogo.filter(x=> x.txt===txt)[0]!==undefined ?
				pmntsLogo.filter(x=> x.txt===txt)[0][y] : pmntsLogo[pmntsLogo.length-1][y]
	}
	
	const showImg =(val) =>{
		return  <img src={findImg(val,'img')} alt={val} width={findImg(val,'width')} />
	}
	
	 const Add = () =>{
	 	setDisplayDialogSettings(true);
	 	setRunTab('PM');
	 }
	
	const addPaymentLne=()=>{
	 	const Arr=[...props.pmnts, {P:'', Date:null, PM:'' , id : uuidv4()}]	
		props.setPmnts(Arr)
	}	
	
	const delPmnt=(row)=>{
		let newArr=[];
		if(row!==0){  //not the first row
			newArr = props.pmnts.filter((k,i)=>
				i!==row? k:null						   
		   )
		}else{
			let Tmp = {P:'', Date:null, PM:'' , id : uuidv4()};
			newArr = props.pmnts.map((k,i)=>i!==row? k:Tmp);
		}
			
		props.setPmnts(newArr)
	}
	
	const CopyAmount=()=>{
	
			let newVal=[...props.pmnts];
			newVal[0]={...newVal[0], 'P': props.data.filter(x=> x.key===props.scltID)[0]['data']['CmsnVat'],
					   'Date': newVal[0].Date==null ? dateFormat(new Date(),'dd-mmm-yyyy'): newVal[0].Date};
		
			props.setPmnts(newVal);
	}
	
	const Pmnts = props.pmnts.map((pmnt,i) =>{
	   	return <React.Fragment key={i}>
				<Grid item xs={12} md={3}>
					<TextField
						value={props.pmnts[i].P}
						name='P'
						onChange={e=> props.handleChangePmnts(e, i)}
						label={`Payment #${i+1}`}
						fullWidth
						error={props.pmnts[i].P==='' && props.pmnts[i].Date!==null && props.redValid ? true: false}	
						InputProps={{inputComponent: NumberFormatCustom, endAdornment: i===0 ?
							<InputAdornment position="end">
								<Tooltip title="Paste amount here">
									<IconButton
										  aria-label="toggle password visibility"
									      onClick={CopyAmount}
									>
										<FilterNoneIcon /> 
									</IconButton>
								</Tooltip>
							</InputAdornment> : ''}}
					  />
				</Grid>
	   			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Grid item xs={12} md={4} >
					<KeyboardDatePicker 
						autoOk
						disableToolbar
						okLabel={false}
						clearable
						label='Payment Date'
						value={props.pmnts[i].Date}
						onChange={date=>  props.handleChangeDPmnts('Date',date, i)}
						format="dd-MMM-yyyy"
						fullWidth
						InputProps={{
							readOnly: true,
						}}
						error={props.pmnts[i].P!=='' && props.pmnts[i].Date===null && props.redValid ? true: false}
					/>
				</Grid>
				</MuiPickersUtilsProvider>
				<Grid item xs={12} md={4}> 
					<TextField
						select
						label="Payment Method"
						value={idToItem(settings.pmntMethods, props.pmnts[i].PM, 'item')}
						onChange={e=> e.target.value!=='Add new method'? props.handleChangePmnts(e,i, settings):
												Add()}
						name ='PM'
						InputProps={{
							startAdornment: <InputAdornment position="start"> {showImg(idToItem(settings.pmntMethods, props.pmnts[i].PM, 'item'))}</InputAdornment>,
						}}
						fullWidth
					  >
						{pmMenu}
					</TextField>
				</Grid>
			
				<Box display={{ xs: 'none', md: 'block' }} style={{paddingTop: '10px' }}>
				<Grid item md={1} >
						<Tooltip title="Delete payment" aria-label='Delete'>
							<IconButton aria-label='Delete' onClick={()=> delPmnt(i)}  >
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					
				</Grid> 
				</Box>	
	   </React.Fragment>
	});
	
	
	return (
   		<div>
			<Grid container spacing={3} alignItems="flex-end">
				{Pmnts}
				 <Grid item xs={12} >   
						<Button variant="contained" onClick={addPaymentLne} color="primary" 
							endIcon={<AddNew />}>Add Payment</Button>	
				</Grid>
			</Grid>	
		</div>
	);
	
   
    };

export default PaymentsPaper;

