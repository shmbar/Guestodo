import React, {useContext} from 'react';
import {Grid, Divider} from '@material-ui/core';
import {OiContext} from '../../../../../contexts/useOiContext';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {Num2} from '../../../../../functions/functions.js';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';

const showTR = (x) => x.indexOf("_") === -1 ? x : x.substring(0, x.indexOf("_"));

const DataSummary = () =>{

	const {value} = useContext(OiContext);
	const {settings} = useContext(SettingsContext);
	const  cur = settings.CompDtls.currency;

	let IncomeAmountBeforeVat = cur + Array(1).fill('\xa0').join('') + Num2(+value.IncAmntWthtoutVat);
	let Vat = cur + Array(1).fill('\xa0').join('') + Num2(value.Amnt-value.IncAmntWthtoutVat);
	let IncomeAmount = cur + Array(1).fill('\xa0').join('') + Num2(+value.Amnt);

	return (
			<Grid container spacing={3}>
					<Grid item xs={12} >
						<RowOut name='Transaction' value={showTR(value.Transaction)} pad='20'/>
					</Grid>
					<Grid item xs={12} >
						<RowOut name='Income Amount Before Vat' value={value.Amnt!=='' ? IncomeAmountBeforeVat: ''} pad='0' />
					</Grid>	
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='VAT' value={value.Amnt!=='' ? Vat: ''} pad='0'/>
					</Grid>
					<Grid item xs={12} >
						<RowOut name='Income Amount' value={value.Amnt!=='' ? IncomeAmount: ''} pad='0'  />
					</Grid>
					<Grid item xs={12}>
						<Divider />
						<RowOut name='Total Payment' value={(value.TtlPmnt!=='' && value.TtlPmnt!==0)?`${cur} ${Num2(value.TtlPmnt)}`:''} pad='22' />
					</Grid>
					<Grid item xs={12}>
						<RowOut name='Balance Due Income' value={(value.BlncRsrv!=='' && value.Amnt!=='')?`${cur} ${Num2(value.Blnc)}`:''}
							pad='0' />
					</Grid>
					<Grid item xs={12}>
						<RowOut name='Payment Status'value={value.PmntStts!==null ?value.PmntStts : ''} pad='0' />
					</Grid>
		</Grid>
    );
    };

export default DataSummary;


/*

	
					
					
					
					
					
*/
