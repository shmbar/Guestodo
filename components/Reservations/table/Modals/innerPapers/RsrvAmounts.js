import React, {useContext} from 'react';
import {Grid, Divider} from '@material-ui/core';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {RcContext} from '../../../../../contexts/useRcContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import {Num2} from '../../../../../functions/functions.js';


const RsrvAmounts = () =>{

	const {value} = useContext(RcContext);
	const {settings} = useContext(SettingsContext);

	//let ChnlCmsnShow =   isNaN( Math.round((+value.RsrvAmnt - +value.NetAmnt)/+value.RsrvAmnt*100))  ? 0:
	//								Math.round((+value.RsrvAmnt -   +value.NetAmnt)/+value.RsrvAmnt*100);
	
	const showTR = (x) => x.indexOf("_") === -1 ? x : x.substring(0, x.indexOf("_"));
	const chnls= settings.channels ? settings.channels: [];
	const  cur = settings.CompDtls.currency;
	let reservationAMountBeforeVat = cur + Array(1).fill('\xa0').join('') + Num2(+value.TtlRsrvWthtoutVat);
	let vatAmount = cur + Array(1).fill('\xa0').join('') + Num2(value.RsrvAmnt-value.TtlRsrvWthtoutVat);
	const txt = cur + Array(1).fill('\xa0').join('') + Num2(value.RsrvAmnt/value.NigthsNum);//cur.concat().concat().toString()
	const ReservationAmount = cur + Array(1).fill('\xa0').join('') + Num2(+value.RsrvAmnt);
	const ChnCmsn = value.RsrvChn!=='' ? chnls.filter(x=> x.id===value.RsrvChn)[0]['ChnCmsn'] : '';
	
	let amountFilled = value.NetAmnt!=='' || value.CnclFee!=='';
	return (
			<Grid container spacing={3}>
					<Grid item xs={12} style={{width:'100%'}} >
						<RowOut name='Transaction' value={showTR(value.Transaction)} pad='0'/>
					</Grid>
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Nights' value={value.NigthsNum} pad='0'/>
					</Grid>
					{/*<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='Guest Price per night' value={value.NigthsNum!=='' ?
								`${cur} ${addComma(value.RsrvAmnt/value.NigthsNum)}` : ''} pad='0'/>
					</Grid>*/}
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Reservation Amount Before Vat' value={amountFilled ? 
							reservationAMountBeforeVat: ''} pad='0'/>
					</Grid>
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Vat' value={amountFilled ? vatAmount: ''} pad='0'/>
					</Grid>	
					
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name={(value.NigthsNum!=='' && value.NetAmnt!=='') ? `Reservation Amount ${txt} X ${value.NigthsNum} Nights` : 	'Reservation Amount' } 
								value={amountFilled ? ReservationAmount: ''}  pad='0'/>
					</Grid>	
			
					{ChnCmsn!=='' &&
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name={`Channel Service Fee (${ChnCmsn}%)`}
							value={amountFilled ? `${cur} ${Num2(value.TtlRsrvWthtoutVat*ChnCmsn/100)}` :''}
							pad='0' />
					</Grid>
					}
					

					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name={ChnCmsn!=='' ? 'Channel Payout' : 'Payout'} value={amountFilled  ? 
							`${cur} ${Num2(value.RsrvAmnt-value.TtlRsrvWthtoutVat*ChnCmsn/100)}`: ''} pad='0'/>
					</Grid>	
			
					
					
					<Grid item sm={12} style={{width:'100%'}}>
						<Divider />
						<RowOut name='Total Payment' value={(value.TtlPmnt!=='' && value.TtlPmnt!==0)?`${cur} ${Num2(value.TtlPmnt)}`:''} pad='30'/>
					</Grid>
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='Balance Due Reservation' value={(value.BlncRsrv!=='' && amountFilled ) ?`${cur} ${Num2(+value.BlncRsrv)}`:''} pad='0' />
					</Grid>
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='Payment Status' value={value.PmntStts!==null ?value.PmntStts : ''} pad='0' />
					</Grid>
				</Grid>
    );
    };

export default RsrvAmounts;
