import React, {useContext} from 'react';
import {Grid} from '@material-ui/core';
import {VtContext} from '../../../../../contexts/useVtContext';
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

	const {value} = useContext(VtContext);

	return (
			<Grid container spacing={3} style={{paddingTop: '15px'}}>
						<Grid item xs={12}> 
							<RowOut name='Total Payment'
							value={value.TtlPmnt!==''?`${addComma(value.TtlPmnt)} $`:`0 $`}
							pad='0'  />
					</Grid>
				
				<Grid item xs={12}>
					<RowOut name='Balance'
						value={value.BlncVat!==''?`${addComma(value.BlncVat)} $`:`0 $`}
							pad='0' />
					</Grid>
				<Grid item xs={12}>
					<RowOut name='Payment Status'
						value={value.PmntStts!==null ?value.PmntStts : `0 $`} 
							pad='0' />
				</Grid>
				<Grid item xs={12}> 
					<Divider />
					<RowOut name='Total Payment'
						value={value.TtlPmnt!==''?`${addComma(value.TtlPmnt)} $`:`0 $`}
							pad='0' />
					</Grid>
				
				<Grid item xs={12}>
					<RowOut name='Balance'
							value={value.BlncVat!==''?`${addComma(value.BlncVat)} $`:`0 $`}
							pad='0' />
					</Grid>
				<Grid item xs={12}>
					<RowOut name='Payment Status'
							value={value.PmntStts!==null ?value.PmntStts : `0 $`} 
							pad='0' />
				</Grid>
			</Grid>
    );
    };

export default PaymentSummary;

