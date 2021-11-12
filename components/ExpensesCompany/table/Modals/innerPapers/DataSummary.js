import React, {useContext} from 'react';
import {Grid, Divider} from '@material-ui/core';
import {ExContext} from '../../../../../contexts/useExContext';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {Num2} from '../../../../../functions/functions.js';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';


const showTR = (x) => x.indexOf("_") === -1 ? x : x.substring(0, x.indexOf("_"));

const DataSummary = () =>{

	const {value} = useContext(ExContext);
	const {settings} = useContext(SettingsContext);

	const  cur = settings.CompDtls.currency;
	const ExpenseAmountBeforeVat = cur + Array(1).fill('\xa0').join('') + Num2(value.ExpAmntWthtoutVat);
	const Vat = cur + Array(1).fill('\xa0').join('') + Num2(+value.Amnt - +value.ExpAmntWthtoutVat);
	const ExpenseAmount = cur + Array(1).fill('\xa0').join('') + Num2(+value.Amnt);

	return (
			<Grid container spacing={3}>
					<Grid item xs={12} >
						<RowOut name='Transaction' value={showTR(value.Transaction)} pad='20'/>
					</Grid>
					<Grid item xs={12} >
						<RowOut name='Expense Amount Before Vat' value={value.Amnt!=='' ? ExpenseAmountBeforeVat: ''} pad='0' />
					</Grid>	
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='Vat' value={value.Amnt!=='' ? Vat : ''} pad='0'/>
					</Grid>
					<Grid item xs={12} >
						<RowOut name='Expense Amount' value={value.Amnt!=='' ? ExpenseAmount: ''} pad='0'  />
					</Grid>
					<Grid item xs={12}>
						<Divider />
						<RowOut name='Total Payment' value={(value.TtlPmnt!=='' && value.TtlPmnt!==0)?`${cur} ${Num2(value.TtlPmnt)}`:''} pad='22' />
					</Grid>
					<Grid item xs={12}>
						<RowOut name='Balance Due Expense' value={(value.BlncRsrv!=='' && value.Amnt!=='')?`${cur} ${Num2(value.BlncExp)}`:''} pad='0' />
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
