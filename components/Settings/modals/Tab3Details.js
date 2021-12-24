import React, {useContext} from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import {TextField,Grid,/* MenuItem, ListItemIcon,*/ }  from '@material-ui/core';
import {idToItem} from '../../../functions/functions.js';

const dateFormat = require('dateformat');	


function nextDay(date){
		let nextD = new Date(dateFormat(date,'dd-mmm-yyyy'));
		return nextD.setDate(nextD.getDate() + 1);
	}

	function lastDay(date){
		let lastD = new Date(dateFormat(date,'dd-mmm-yyyy'));
		return lastD.setDate(lastD.getDate() - 1);
	}

	// const useStyles = makeStyles(theme => ({
	//   root: {
	// 	display: 'flex',
	// 	flexWrap: 'wrap',
	//   },
	//   formControl: {
	// 	width: '100%',
	// 	minWidth: 120,
	//   },
	// }));

const Tab3Details = (props) =>{

	const {valueSettingsApt, redValid, settings/*,chnnlslogo*/ } = useContext(SettingsContext);
//	const {valueOwner} = useContext(OwnerSelectContext);
//	let deletedPRoperties = settings.properties.filter(x=>!x.show).map(x=>x.PrpName);
	
	//let tmpProperties = settings.properties.filter(x=>x.OwnerName===valueOwner.owner).map(q=>q.PrpName);
	// let propArr = !props.runFromOrders ? [...new Set(settings.properties.map(k=>k.PrpName))]: tmpProperties;
	
	// let sopts = propArr.map((s,i)=>{
	// 		return <MenuItem key={s} value={s} disabled={deletedPRoperties.includes(s)}
	// 				   className={deletedPRoperties.includes(s) ?
	// 					'dltItem': null}>{s}</MenuItem>
	// });
	
	
	
	/*let deletedChnl = settings.channels.filter(x=>!x.show).map(x=>x.RsrvChn);
	let chnlArr = [...new Set(settings.channels.filter(x=>
								  (x.show || x.RsrvChn===valueSettingsApt.RsrvChn)).map(z=>z.RsrvChn))];
	let chnlMenu = chnlArr.map((s,i)=>{
				return <MenuItem key={s} value={s} disabled={deletedChnl.includes(s)}
						   className={deletedChnl.includes(s) ?
						'dltItem': null} >
					<ListItemIcon style={{display:'table-column'}}>
            					<img src={findImg(s,'img')} alt={s} width={findImg(s,'width')} />
          			</ListItemIcon>{s}</MenuItem>
		});*/

	return (
   	<div>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} >
				 	<TextField
						value={	idToItem(settings.properties, valueSettingsApt.PrpName, 'PrpName') }
					//	onChange={props.handleChange}
					//	name="AptName"
						label="Property Name"
						disabled={true}
						fullWidth
					  />
				</Grid>
				<Grid item xs={12} sm={6}>
						<TextField
						value={valueSettingsApt.AptName}
						onChange={props.handleChange}
						name="AptName"
						label="Apartment Name"
						fullWidth
						error={valueSettingsApt.AptName==='' && redValid ? true: false}
					  />
					
				</Grid>
				
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container item sm={12} md={5} justifyContent="space-around">
						<KeyboardDatePicker 
								autoOk
								disableToolbar
								okLabel={false}
								clearable
								label="Start Date"
								value={valueSettingsApt.StartDate}
								onChange={date=> props.handleChangeD('StartDate',date)}
								maxDate={valueSettingsApt.EndDate===null? '2999-12-12': lastDay(valueSettingsApt.EndDate)}
								initialFocusedDate={new Date(dateFormat(valueSettingsApt.StartDate, "yyyy-mm-dd"))}
								format="dd-MMM-yyyy"
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								error={valueSettingsApt.StartDate===null && redValid ? true: false}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container item sm={12} md={5} justifyContent="space-around">
							<KeyboardDatePicker
								autoOk
								disableToolbar
								okLabel={false}
								clearable
							  	format="dd-MMM-yyyy"
							  	label="End Date"
							  	value={valueSettingsApt.EndDate}
							  	onChange={date=> props.handleChangeD('EndDate',date)}
								minDate={valueSettingsApt.StartDate!==null && 
									nextDay(valueSettingsApt.StartDate)}
								initialFocusedDate={new Date(dateFormat(valueSettingsApt.StartDate,
																		"yyyy-mm-dd"))}
								fullWidth
								InputProps={{
									readOnly: true,
								}}
						//		error={valueSettings.EndDate===null && redValid ? true: false}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
					
				</Grid>
			</div>
    );
    };

export default Tab3Details;

/*

		<Grid item xs={12} md={12} >
							<TextField
								value={valueSettingsApt.Ical}
								onChange={props.handleChange}
								name="Ical"
								disabled
								label="Ical Url"
								fullWidth
							  />
						</Grid>
						<Grid item xs={12} md={6}> 
						<TextField
							select
							label="Reservation Channel"
							value={valueSettingsApt.RsrvChn}
							onChange={props.handleChange}
							disabled
							name ='RsrvChn'
							InputProps={{
								startAdornment: <InputAdornment position="start"> {showImg(valueSettingsApt.RsrvChn)}</InputAdornment>,
							}}
							fullWidth
						//	error={value.RsrvChn==='' && redValid ? true: false}	
						  >
							{chnlMenu}
						</TextField>
					</Grid>

					*/
