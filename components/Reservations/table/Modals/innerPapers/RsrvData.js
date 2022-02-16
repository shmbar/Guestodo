import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {MenuItem, InputLabel, Select, FormControl, TextField,
		Grid, ListItemIcon, Typography, FormHelperText }  from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { v4 as uuidv4 } from 'uuid';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import {RcContext} from '../../../../../contexts/useRcContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
//import {SelectContext} from '../../../../../contexts/useSelectContext';
import './papersStyle.css';
import {idToItem, Num2} from '../../../../../functions/functions.js';
import NumberFormatCustom from '../../../../Subcomponents/NumberFormatCustom';
import CustomDatePicker from './datePicker';
import {SelectContext} from '../../../../../contexts/useSelectContext';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
//import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
	width: '100%',
    minWidth: 120,
  },
  treeview: {
    flexGrow: 1,
    maxWidth: 400,
  },
  labelRoot: {
    display: 'flex',
   // padding: theme.spacing(0.5, 3),
	justifyContent: 'space-between',
  },
  labelText: {
    fontWeight: 'inherit',
  },
 GreenCheckboxFeesTaxes:{
	marginLeft: '20px',
	marginRight: 0,
}
}));

/*
	function nextDay(date){
		let nextD = new Date(dateFormat(date,'dd-mmm-yyyy'));
		return nextD.setDate(nextD.getDate() + 1);
	}

	function lastDay(date){
		let lastD = new Date(dateFormat(date,'dd-mmm-yyyy'));
		return lastD.setDate(lastD.getDate() - 1);
	}
*/




const RsrvAmounts = () =>{
	const classes = useStyles();
	const stl = {color:'purple', fontStyle: 'italic'};

	
	const {value, handleChange, handleChangeTrueFalse, redValid,
		   rcDataPrp,handleChangeTrueFalseFeesTaxes, getFees} = useContext(RcContext);
	const {settings, selectValueSettings, setRunTab, selectValueSettingsApt,
		   chnnlslogo} = useContext(SettingsContext);
	const {apartments, channels} =  settings;
	const {write, uidCollection} = useContext(AuthContext);					 						 	 const {date} = useContext(SelectContext);
	
	const  cur = settings.CompDtls.currency;
	
	const vat= settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT']
	
	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
				color: green[600],	
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	
	const GreenCheckboxFeesTaxes = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  padding: '0px',
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	
	let deletedChnl = settings.channels!=null ? settings.channels.filter(x=>!x.show).map(x=>x.RsrvChn) : [];
	let deletedApt = settings.apartments!=null ? settings.apartments.filter(x=>!x.show).map(x=>x.AptName) : [];
	//let deletedPrprty = settings.properties.filter(x=>!x.show).map(x=>x.PrpName);
	
	///////////////
/*	let toolTipTmp = {num: value.RsrvChn!=='' && settings.channels.filter(x=>
				  x.id===value.RsrvChn)[0]['ChnCmsn'],
				  grs: value.RsrvChn!=='' && settings.channels.filter(x=> x.id===value.RsrvChn)[0]['MngCmsn']
			}
	let showYN = (value.RsrvChn!=='' && toolTipTmp.grs==='Upfront Payment') ? true:false;
	
	*/
	// let propertiesArr = ['Add new property'].concat([...new Set(properties.map(x => x.PrpName))]);
	// let propertyMenu = propertiesArr.map((s,i)=>{
	// 			return <MenuItem key={s} value={s} disabled={deletedPrprty.includes(s)}
	// 					   className={deletedPrprty.includes(s) ? 
	// 					'dltItem': null} style={i===0? stl : null}>{s}</MenuItem>
	// 	});
	
	
	//////////////////
	
	// let ListOfProperties = settings.properties.filter(x =>
	// 				x.OwnerName===valueOwner.owner ? x :null).map(x=>x.PrpName);
	
	// let aptArr=[];
	// if(value.PrpName ===''){
	// 		aptArr = ['Add new apartment'].concat([...new Set(apartments.filter(y=>
	// 					ListOfProperties.includes(y.PrpName)).map(x=> x.AptName))]);
	// }else{
	// 	 	aptArr = ['Add new apartment'].concat([...new Set(apartments.filter(y=> 
	// 				y.PrpName===value.PrpName))].map(x=> x.AptName));
	// }
	

	let aptArr = apartments!=null ? ['Add new apartment'].concat([...new Set(apartments.filter(y=>
					 (y.PrpName===value.PrpName && y.show) || (y.id===value.AptName && !y.show)))].map(x=> x.AptName)) : ['Add new apartment'];
	let aptMenu = aptArr.map((s,i)=>{
						return <MenuItem key={s} value={s} disabled={deletedApt.includes(s)}
						   className={deletedApt.includes(s) ?
						'dltItem': null} style={i===0? stl : null} >{s}</MenuItem>
				});
	
	
	
	let chnlArr =  channels!=null ? ['Add new channel'].concat([...new Set(channels.filter(x=>
								  (x.show || x.id===value.RsrvChn)).map(z=>z.RsrvChn))]) : ['Add new channel'];
	let chnlMenu = chnlArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedChnl.includes(s)}
						   className={deletedChnl.includes(s) ?
						'dltItem': null}  style={i===0? stl : null}>
					{i!==0 && <ListItemIcon style={{display:'table-column'}}>
            					<img src={findImg(s,'img')} alt={s} width={findImg(s,'width')} />
          			</ListItemIcon> }{s}</MenuItem>
		});
  	
	function findImg(txt,y){
		return	chnnlslogo.filter(x=> x.brnd===txt)[0]!==undefined ?
				chnnlslogo.filter(x=> x.brnd===txt)[0][y] : chnnlslogo[chnnlslogo.length-1][y]
	}
	
	const showImg =(val) =>{
		return  <img src={findImg(idToItem(settings.channels,value.RsrvChn, 'RsrvChn'),'img')} alt={idToItem(settings.channels,value.RsrvChn, 'RsrvChn')}
					width={findImg(idToItem(settings.channels,value.RsrvChn, 'RsrvChn'),'width')} />
	}
	
	const valueExist = rcDataPrp.filter(x=> x.Transaction===value.Transaction)[0]
	let rsr = ['Tentative','Confirmed','Cancelled'].map((s,i)=>{
						return <MenuItem key={s} value={s} disabled={i===0 && valueExist!=null  && (valueExist.pStatus==='Confirmed' || 
															valueExist.pStatus==='Cancelled')}>{s}</MenuItem>
				});
	
	
	// let ObjProperty={id:uuid(),PrpName: '' , StartDate: null, EndDate : null, ManagCommission : '',
	// 	IntCshFlBnce: '', BAccNum: '', show:true};
	let ObjChannel={RsrvChn:'',ChnCmsn:'', MngCmsn:'', id: uuidv4(), show:true };
	let ObjApt={id:uuidv4(), PrpName: value.PrpName, AptName: '' , StartDate:null, EndDate : null,
				show:true/*, Ical: '', RsrvChn: ''*/ };  
	
	const Add=(obj,tab)=>{
		tab!=='TabApt' ? selectValueSettings(obj):selectValueSettingsApt(obj);
		setRunTab(tab)
	}

	const tmpAmnt =  value.pStatus!=='Cancelled' ? +value.NetAmnt : +value.CnclFee
	const fees = value.Fees!=null ? value.Fees.map((x,i)=>{
		return  <div className={classes.labelRoot} key={i}>
          			<Typography variant="body1" className={classes.labelText}
						style={{marginLeft: '20px'}}>
            			{x.FeeName}
          			</Typography>
					{x.FeeType==='Percent' && 
						<Typography variant="body1" className={classes.labelText}>
            				({  x.FeeAmount + '%' })
          				</Typography>
			 		}
					{x.FeeAmount !=='' &&
						<Typography variant="body1" className={classes.labelText}>
            				{	x.FeeType==='Percent' ?  tmpAmnt*x.FeeAmount/100 + cur : 
								x.FeeType==='Flat' && x.FeeModality==='Per Stay'  ? 
							 (x.FeeAmount) + cur:
								x.FeeType==='Flat' && x.FeeModality==='Per Night'  ? 
							 ( x.FeeAmount*value.NigthsNum) + cur:
								x.FeeType==='Flat' && x.FeeModality==='Per Person'  ? 
							 (x.FeeAmount*(+value.dtls.adlts + +value.dtls.chldrn)) + cur:
							x.FeeType==='Flat' && x.FeeModality==='Per Person/Per Night' ?
								(x.FeeAmount*( +value.dtls.adlts + 
							+value.dtls.chldrn)*value.NigthsNum) + cur: ''
						}
						<FormControlLabel
							control={
								  <GreenCheckboxFeesTaxes
									checked={x.show}
									onChange={handleChangeTrueFalseFeesTaxes('Fees', i, settings)}
								  />
							}
						disabled={!write}
						labelPlacement="end"
						className={classes.GreenCheckboxFeesTaxes}
						
      					/>	
          				</Typography> 
					}
        		</div> 
		}) : [];
	
	const vatExisted = value.Vat ? (1 + parseFloat(vat)/100): 1;
	
	const taxes = value.Taxes!=null ? value.Taxes.map((x,i)=>{
		return  	<div className={classes.labelRoot} key={i}>
						<Typography variant="body1" className={classes.labelText}
							style={{marginLeft: '20px'}}>
							{x.TaxName}
						</Typography>
						{x.TaxType==='Percent' && 
							<Typography variant="body1" className={classes.labelText}>
								({ x.TaxAmount + '%' })
							</Typography>
						}
						{x.TaxAmount !=='' &&
							<Typography variant="body1" className={classes.labelText}>
								{	x.TaxType==='Percent' ?   Num2((tmpAmnt +
							 +getFees(value, tmpAmnt ))*x.TaxAmount/100/vatExisted) + cur : 
							 		x.TaxType==='Flat' && x.TaxModality==='Per Stay'  ? 
								x.TaxAmount + cur:
							  		x.TaxType==='Flat' && x.TaxModality==='Per Night'  ? 
								x.TaxAmount*value.NigthsNum + cur:
							 		x.TaxType==='Flat' && x.TaxModality==='Per Person'  ? 
								x.TaxAmount*(+value.dtls.adlts) + cur:
							 		x.TaxType==='Flat' && x.TaxModality==='Per Person/Per Night'  ?
					x.TaxAmount*( +value.dtls.adlts )*value.NigthsNum + cur: ''
							 }
							<FormControlLabel
								control={
									  <GreenCheckboxFeesTaxes
										checked={x.show}
										onChange={handleChangeTrueFalseFeesTaxes('Taxes', i, settings)}
									  />
								}
								disabled={!write}
								labelPlacement="end"
								className={classes.GreenCheckboxFeesTaxes}
      					/>	
							</Typography>
						}
					</div>
		}): [];

	return (
			<Grid container spacing={3} alignItems="flex-end">
					<Grid item xs={12} md={7}>
						<TextField
						value={value.GstName}
						onChange={e=>write && handleChange(uidCollection, e,settings) }
						name='GstName'
						label="Guest Name"
						fullWidth
						error={value.GstName==='' && redValid ? true: false}	
					  />
					</Grid>
					<Grid item xs={12} md={6}> 
						<TextField
							select
							label="Reservation Channel"
							value={idToItem(settings.channels,value.RsrvChn, 'RsrvChn')} 
							onChange={e=> write &&  (e.target.value!=='Add new channel'? 
									 handleChange(uidCollection, e,settings): Add(ObjChannel, 'Tab4'))
										 }
							name ='RsrvChn'
							InputProps={{
								startAdornment: <InputAdornment position="start"> {showImg(value.RsrvChn)}</InputAdornment>,
							}}
							fullWidth
							error={value.RsrvChn==='' && redValid ? true: false}	
						  >
							{chnlMenu}
						</TextField>
					</Grid>
					<Grid item xs={12} md={6}>
						  	<FormControl className={classes.formControl}>
							<InputLabel htmlFor="AptName"
										error={value.AptName==='' && redValid ? true: false}
									>Apartment</InputLabel>
								<Select
									value={idToItem(settings.apartments,value.AptName, 'AptName')}  
									onChange={e=> write && (e.target.value!=='Add new apartment'? 
									handleChange(uidCollection, e,settings, date): Add(ObjApt, 'TabApt'))
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
					<Grid item xs={12} md={6} >
							<CustomDatePicker />
					</Grid>
					<Grid item xs={12} md={3}>
						  	<FormControl className={classes.formControl}>
							<InputLabel htmlFor="pStatus"
										error={value.pStatus==='' && redValid ? true: false}
									>Reservation Status</InputLabel>
								<Select
									value={value.pStatus}  
									onChange={e=> write && handleChange(uidCollection, e,settings)			 }
									inputProps={{
										name: 'pStatus'
									}}
									fullWidth
									error={value.pStatus==='' && redValid ? true: false}
									>
									{rsr}
								</Select>
								<FormHelperText style={{color: 'red'}}>
									{value.pStatus==='Tentative' && 'Base amount will not be taken into revenue, expenses and channel fees until the status is Confirmed or Canceled.'}
								</FormHelperText>
							</FormControl>
					</Grid>
					{value.pStatus==='Cancelled' ?
						<Grid item xs={12} md={3} style={{alignSelf: 'normal'}}> 

									  <TextField   
										value={value.CnclFee}       
										onChange={e=>write && handleChange(uidCollection, e,settings)}
										name="CnclFee"
										label="Cancellation Fee"
										InputProps={{inputComponent: NumberFormatCustom}}
										fullWidth
										error={(value.CnclFee==='' && redValid) ? true: false}
									  />

						</Grid>:
						''
					 }
					
					<Grid item xs={12} md={6} style={{alignSelf: 'normal'}}>
							  <TextField   
								value={value.NetAmnt}    
								onChange={e=>write && handleChange(uidCollection, e,settings)}
								name="NetAmnt"
								label="Base Charge"
								disabled={value.pStatus==='Cancelled'}
								InputProps={{inputComponent: NumberFormatCustom}}
								fullWidth
								 error={value.NetAmnt==='' && redValid ? true: false}
							  />
					
					</Grid>
					<Grid item xs={12} md={6}>
						<FormControl >
							<FormControlLabel
							control={
							  <GreenCheckbox
								checked={value.Vat}
								onChange={handleChangeTrueFalse('Vat', vat)}
								value="Tax"
							  />
							}
							label={`${vat}% VAT included`}
							disabled={!write || +vat===0}
							labelPlacement="end"
						/>	
						</FormControl>
					</Grid>
			
					<Grid item xs={12}>
						 <TreeView  className={classes.treeview} 
							 defaultCollapseIcon={<ExpandMoreIcon />} 
							 defaultExpandIcon={<ChevronRightIcon />}>
							  {fees}
							  {taxes}
						</TreeView>
					</Grid>
					<Grid item xs={12} md={6} style={{alignSelf: 'normal'}}>
							  <TextField   
								value={Num2(value.RsrvAmnt)}    
								label="Total Amount Paid by Guest"
								InputProps={{inputComponent: NumberFormatCustom, readOnly: true,}}
								fullWidth
								 error={value.NetAmnt==='' && redValid ? true: false}
							  />
					
					</Grid>
					
					<Grid item xs={12} md={8} > 
						<TextField
							value={value.Notes}   
							onChange={e=>handleChange(uidCollection, e,settings)}
							label="Notes"
							multiline
							name = 'Notes'
							fullWidth
							InputProps={{readOnly: !write ? true: false }}
				  		/>
					</Grid>
				</Grid>
    );
    };

export default RsrvAmounts;

		
