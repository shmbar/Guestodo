import React, {useContext} from 'react';
import {Grid, Button, TextField, FormControl, Radio,RadioGroup,
		FormControlLabel, Tooltip } from '@material-ui/core';
import {VtContext} from '../../../../../contexts/useVtContext';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import MRangePickerVat from '../../../../Subcomponents/MRangePickerVat';
import {Num2} from '../../../../../functions/functions.js';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import {SelectContext} from '../../../../../contexts/useSelectContext';
import NumberFormatCustom from '../../../../Subcomponents/NumberFormatCustom';
import { withStyles } from '@material-ui/core/styles';

const Dates = (props) =>{
	
	const {value, setValue, handleChange} = useContext(VtContext);
	const {write} = useContext(AuthContext);	
	const {settings} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
	const cur =settings.CompDtls.currency

	const CustomToolTip = withStyles({
        tooltip: {
            fontSize: 13,
        },
})(Tooltip);

	return (
		<>
		
			<Grid container spacing={3} style={{padding:'10px', paddingBottom: '20px'}}>
				<Grid item xs={12} md={4}>
					<MRangePickerVat	value={value} setValue={setValue} date={date}/>
				</Grid>
				<Grid item xs={12} md={4} style={{marginLeft: '10px' }}>
					<Button variant="contained" onClick={props.Calculate}
					color="primary"
						disabled={(value.inputVat==='' || !write) ? true: false}
						> Calculate Vat</Button>
				</Grid> 
				<Grid item xs={12} md={6} style={{paddingTop:'20px', paddingBottom:'24px'}}>
					<RowOut name='Revenue Amount (Before VAT)'
						value='' st={true}
						pad='10' />
					<RowOut name='Amount including VAT'
						value={value.valueInc.withoutVat!=='' ? `${cur} 
						${Num2(value.valueInc.withoutVat)}`: `${cur} 0`} 
						pad='10' />
					<RowOut name='Amount Excluding VAT' 
						value={value.valueInc.withVat!=='' ? `${cur} 
						${Num2(value.valueInc.withVat)}`: `${cur} 0`} 
						pad='10' />
					<RowOut name='Output VAT'
						value={value.valueInc.Vat!=='' ? `${cur} ${Num2(value.valueInc.Vat)} `: 
						`${cur} 0`}
						st={true} pad='10' />
				</Grid>
				<Grid item xs={12} md={6} style={{paddingTop:'20px', paddingBottom:'24px'}}>
					<RowOut name='Expenses Amount (Before VAT)'
						value='' st={true}
						pad='10' />
					
				{/*	<RowOut name='Amount including VAT'
							value={value.valuex.withoutVat!=='' ? `${cur} 
							${Num2(value.valuex.withoutVat)}`: `${cur} 0`} 
							pad='10' />
					<RowOut name='Amount Excluding VAT' 
						value={value.valuex.withVat!=='' ? `${cur} ${Num2(value.valuex.withVat)}`:
						`${cur} 0`} 
						pad='10' /> 
					<RowOut name='Input VAT'
						value={value.valuex.Vat!=='' ? `${cur} ${Num2(value.valuex.Vat)}`: `${cur} 0`}
						st={true} pad='10' /> */}
					<Grid container justifyContent='space-between' style={{alignItems: "end",
																  paddingTop: '5.5em'}}>
						<Grid item xs={12} md={3}>
							<div>Input VAT</div>
						</Grid>
						<Grid item xs={12} md={5}>
							<TextField   
								value={value.inputVat}    
								onChange={e=>write && handleChange(e) }
								name="inputVat"
								InputProps={{inputComponent: NumberFormatCustom}}
								fullWidth
					  		/>
						</Grid>
						
							<FormControl component="fieldset" style={{paddingTop: '15px'}}>
							<RadioGroup
							  aria-label="gender"
							  name="CostType"
						//	  className={classes.group}
							  style={{display: 'inline', paddingLeft: '16px'}}	
							  value={'Manual'}
						//	  onChange={handleChange}
							>
								  <FormControlLabel
									value="Manual"
									control={<Radio color="primary" />}
									label="Manual"
									labelPlacement="end"
								  />
								 <CustomToolTip title={'Still in progress'}>
								  <FormControlLabel
									value="Automatic"
									control={<Radio color="primary" />}
									label="Automatic"
									labelPlacement="end"
									disabled
								  />
								</CustomToolTip>
							</RadioGroup>
						  </FormControl>
						
					</Grid>
						
				</Grid>
		</Grid>
		</>
    );
    };

export default Dates;
