import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import {ExContext} from '../../../../../contexts/useExContext';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
//import '../Settings.css';

function addComma(nStr){
		 nStr += '';
		 var x = nStr.split('.');
		 var x1 = x[0];
		 var x2 = x.length > 1 ? '.' + x[1].substring(0,2) : '';
		 var rgx = /(\d+)(\d{3})/;
		 while (rgx.test(x1)) {
		  //x1 = x1.replace(rgx, '$1' + ',' + '$2');
		x1 = x1.replace(rgx, '$1,$2');	 
		 }
		 return x1 + x2;
	}


const PaymentSummary = () =>{

	const {value} = useContext(ExContext);

	return (
			<Grid container spacing={3}>
					<Grid item xs={12}> 
						<RowOut name='Total Payment' value={value.TtlPmnt!==''?`${addComma(value.TtlPmnt)} $`:''} pad='28'/>
					</Grid>
				
				<Grid item xs={12}>
					<RowOut name='Balance Due Expense' value={value.BlncExp!==''?`${addComma(value.BlncExp)} $`:''} pad='13'/>
				</Grid>
				<Grid item xs={12}>
					<RowOut name='Payment Status'value={value.PmntStts!==null ?value.PmntStts : ''} pad='13'/>
				</Grid>
			</Grid>
    );
    };

export default PaymentSummary;

