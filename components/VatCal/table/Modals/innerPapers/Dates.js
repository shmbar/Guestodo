import React, {useContext} from 'react';
import {Grid, Button /*, Divider*/} from '@material-ui/core';
import {VtContext} from '../../../../../contexts/useVtContext';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import MRangePickerVat from '../../../../Subcomponents/MRangePickerVat';
import {Num2} from '../../../../../functions/functions.js';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import {SelectContext} from '../../../../../contexts/useSelectContext';

const Dates = (props) =>{
	
	const {value, setValue} = useContext(VtContext);
	const {write} = useContext(AuthContext);	
	const {settings} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
	const cur =settings.CompDtls.currency

	return (
		<>
		
			<Grid container spacing={3} style={{padding:'10px', paddingBottom: '20px'}}>
				<Grid item xs={12} md={4}>
					<MRangePickerVat	value={value} setValue={setValue} date={date}/>
				</Grid>
			{write && <Grid item xs={12} md={4} style={{marginLeft: '10px' }}>
					<Button variant="contained" onClick={props.Calculate}
					color="primary"
						disabled={(value.From==='') ? true: false}
						> Calculate Vat</Button>
				</Grid> }
				<Grid item xs={12} md={6} style={{paddingTop:'20px', paddingBottom:'24px'}}>
					<RowOut name='Revenue Amount (Before Vat)'
						value='' st={true}
						pad='10' />
					<RowOut name='Amount including Vat'
						value={value.valueInc.withoutVat!=='' ? `${cur} ${Num2(value.valueInc.withoutVat)}`: `${cur} 0`} 
						pad='10' />
					<RowOut name='Amount Excluding Vat' 
						value={value.valueInc.withVat!=='' ? `${cur} ${Num2(value.valueInc.withVat)}`: `${cur} 0`} 
						pad='10' />
					<RowOut name='Output Vat'
						value={value.valueInc.Vat!=='' ? `${cur} ${Num2(value.valueInc.Vat)} `: `${cur} 0`}
						st={true} pad='10' />
				</Grid>
				<Grid item xs={12} md={6} style={{paddingTop:'20px', paddingBottom:'24px'}}>
					<RowOut name='Expenses Amount (Before Vat)'
						value='' st={true}
						pad='10' />
					<RowOut name='Amount including Vat'
							value={value.valuex.withoutVat!=='' ? `${cur} ${Num2(value.valuex.withoutVat)}`: `${cur} 0`} 
							pad='10' />
					<RowOut name='Amount Excluding Vat' 
						value={value.valuex.withVat!=='' ? `${cur} ${Num2(value.valuex.withVat)}`: `${cur} 0`} 
						pad='10' /> 
					<RowOut name='Input Vat'
						value={value.valuex.Vat!=='' ? `${cur} ${Num2(value.valuex.Vat)}`: `${cur} 0`}
						st={true} pad='10' />
				</Grid>
		</Grid>
		</>
    );
    };

export default Dates;
