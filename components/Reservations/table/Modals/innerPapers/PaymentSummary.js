import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
//import TextField from '@material-ui/core/TextField';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {RcContext} from '../../../../../contexts/useRcContext';
//import '../Settings.css';

const PaymentSummary = () =>{

	const {value} = useContext(RcContext);
	
	return (
			<Grid container spacing={3}>
				<Grid item sm={12} style={{width:'100%'}}>
					<RowOut name='Total Payment' value={value.TtlPmnt!==''?`${addComma(value.TtlPmnt)} $`:''}/>
				</Grid>
				<Grid item sm={12} style={{width:'100%'}}>
					<RowOut name='Balance Due Reservation' value={value.BlncRsrv!==''?`${addComma(value.BlncRsrv)} $`:''} pad='20' />
				</Grid>
				<Grid item sm={12} style={{width:'100%'}}>
					<RowOut name='Payment Status' value={value.PmntStts!==null ?value.PmntStts : ''} pad='20' />
				</Grid>
			</Grid>
    );
    };

export default PaymentSummary;

/*

		<Grid item xs={12}> 
					  <TextField
						value={value.TtlPmnt!==''?`${addComma(value.TtlPmnt)} $`:''}
						name="TtlPmnt"
						label="Total Payment"
						fullWidth
					  />
					</Grid>
				
				<Grid item xs={12}>
						<TextField
						value={value.BlncRsrv!==''?`${addComma(value.BlncRsrv)} $`:''}
						name="BlncRsrv"
						label="Balance Due Reservation"
						fullWidth
					  />
					</Grid>
				<Grid item xs={12}>
						<TextField
						value={value.PmntStts!==null ?value.PmntStts : ''} 
						name="PmntStts"
						label="Payment Status"
						fullWidth
					  />
					</Grid>

*/