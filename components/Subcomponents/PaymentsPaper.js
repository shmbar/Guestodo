import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import {TextField, MenuItem,IconButton, Box, ListItemIcon, Button } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {AuthContext} from '../../contexts/useAuthContext';
import AddNew from '@material-ui/icons/AddCircleOutline';
import {idToItem, paymentStatus} from '../../functions/functions.js';
import NumberFormatCustom from './NumberFormatCustom';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { v4 as uuidv4 } from 'uuid';

const dateFormat = require('dateformat');

const PaymentsPaper = (props) =>{
		
		const {settings, setDisplayDialogSettings, setRunTab, pmntsLogo } = useContext(SettingsContext);
	
		const {value, handleChangePmnts, handleChangeDPmnts, setValue, redValid, blnc,amnt} = props
		const stl = {color:'purple', fontStyle: 'italic'};
		const {write} = useContext(AuthContext);					 						 				 
	
		let deleted = settings.pmntMethods!= null ? settings.pmntMethods.filter(x=>!x.show).map(x=>x.item) : [];	
		
		let pmArr = settings.pmntMethods!=null ? ['Add new method'].concat(settings.pmntMethods.filter(q=> (value.Payments.map(x=> x.PM).includes(q.id) || q.show)).map(x=>x.item)) : ['Add new method'];
		let pmMenu = pmArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deleted.includes(s)}  className={deleted.includes(s) ?
						'dltItem': null}  style={i===0? stl:{}}>
					{i!==0 && <ListItemIcon style={{display:'table-column'}}>
		<img src={findImg(s,'img')} alt={s} width={findImg(s,'width')} />
		</ListItemIcon> }{s}
				</MenuItem>	})
		
		
		
																			   
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
		 let Arr=[...value.Payments, {P:'', Date:null, PM:'', 'id' : uuidv4()}]	
		 setValue({...value, 'Payments': Arr})
	}	
	
	const delPmnt=(row)=>{
		let newArr=[];
		if(row!==0){  //not the first row
			newArr = value.Payments.filter((k,i)=>
				i!==row? k:null					   
		   )
		}else{
			if (value.Payments.length===1){
				let Tmp = {P:'', Date:null, PM:'', id : uuidv4()};
				newArr = value.Payments.map((k,i)=>	i!==row? k:Tmp);
			}else{
				newArr = value.Payments.filter((k,i)=>
				i!==row? k:null	)
			}
		}
		
		let TotalPmnt = newArr.map(x=> parseInt(x.P)).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);
		setValue({...value,'Payments':newArr, 'TtlPmnt':TotalPmnt, [blnc]: +amnt - +TotalPmnt,
				  'PmntStts': paymentStatus(TotalPmnt, amnt) });
	}
	
	
	const CopyAmount=()=>{
	
			let newVal=[...value.Payments];
			newVal[0]={...newVal[0], 'P': amnt,
					   'Date': newVal[0].Date==null ? dateFormat(new Date(),'dd-mmm-yyyy'): newVal[0].Date};
			
			let TotalPmnt = newVal.map(x=> parseFloat(x.P) || parseFloat(x.Advnc)).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);
	
			setValue({...value,'Payments':newVal, 'TtlPmnt':TotalPmnt,
					  'BlncRsrv': amnt-TotalPmnt, 'PmntStts': paymentStatus(TotalPmnt, amnt) });	
	}
	
	const Pmnts = value.Payments.map((pmnt,i) =>{		
		
	   	return <React.Fragment key={i}>
				<Grid item xs={12} md={3}>
					<TextField
						value={value.Payments[i].P}
						name='P'
						onChange={e=> write && handleChangePmnts(e, i)}
						label={ `Payment #${i+1}`}
						fullWidth
						disabled={value.pStatus==='Tentative'}
						error={value.Payments[i].P==='' && value.Payments[i].Date!==null && redValid ? true: false}	
						InputProps={{inputComponent: NumberFormatCustom, endAdornment: i===0 ?
							<InputAdornment position="end">
								<Tooltip title="Paste amount here">
									<span>
									<IconButton
											disabled={value.pStatus==='Tentative'}
										  aria-label="toggle password visibility"
									      onClick={write && CopyAmount}
									>
										<FilterNoneIcon /> 
									</IconButton></span>
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
						disabled={value.pStatus==='Tentative'}
						value={value.Payments[i].Date}
						onChange={date=> write && handleChangeDPmnts('Date',date, i)}
						format="dd-MMM-yyyy"
						fullWidth
						InputProps={{
							readOnly: true,
						}}
						error={value.Payments[i].P!=='' && value.Payments[i].Date===null && redValid ? true: false}
					/>
				</Grid>
				</MuiPickersUtilsProvider>
				
				<Grid item xs={12} md={4}> 
					<TextField
						select
						label="Payment Method"
						disabled={value.pStatus==='Tentative'}
						value={idToItem(settings.pmntMethods, value.Payments[i].PM, 'item')	}
						onChange={e=> write && (e.target.value!=='Add new method'? handleChangePmnts(e,i, settings):
												Add())}
						name ='PM'
						InputProps={{
							startAdornment: <InputAdornment position="start"> {showImg(idToItem(settings.pmntMethods, value.Payments[i].PM, 'item'))}</InputAdornment>,
						}}
						fullWidth
					  >
						{pmMenu}
					</TextField>
				</Grid>
				{write && <Box display={{ xs: 'none', md: 'block'}} style={{paddingTop: '10px' }}>
					<Grid item md={1} >	
							<Tooltip title="Delete payment" aria-label='Delete'><span>
								<IconButton aria-label='Delete' onClick={()=> delPmnt(i)}  disabled={value.pStatus==='Tentative'}>
									<DeleteIcon />
								</IconButton></span>
							</Tooltip>

					</Grid>
				</Box>	}
	   </React.Fragment>
	});
	
	
	return (
   		<div>
			<Grid container spacing={3} alignItems="flex-end">
				{Pmnts}
				{write && <Grid item xs={12} >   
						<Button variant="contained" onClick={addPaymentLne} color="primary"
							  endIcon={<AddNew />} >Add Payment</Button>	
				</Grid>	}
				{value.pStatus==='Tentative' && <div style={{color: "red", fontSize: '12px'}}>
				 		Not applicable as long as reservation status is Tentative.
				 </div>}
			</Grid>	
		</div>
	);
	
};
   

export default PaymentsPaper;

/*

	<Box display={{ xs: 'none', md: 'block'}} style={{paddingBottom: '10px' }}>
					<Grid item  md={1}>
						<img src={findImg(value.Payments[i].PM,'img')}
							alt={value.Payments[i].PM} width={findImg(value.Payments[i].PM,'width')} />
          			</Grid>
				</Box>
	

*/
