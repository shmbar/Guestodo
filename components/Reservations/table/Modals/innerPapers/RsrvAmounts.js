import React, {useContext} from 'react';
import {Grid, Divider} from '@material-ui/core';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import {RcContext} from '../../../../../contexts/useRcContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import {Num2} from '../../../../../functions/functions.js';


const RsrvAmounts = ({rcDataPrp}) =>{

	const {value, getFees, getTaxes} = useContext(RcContext);
	const {settings} = useContext(SettingsContext);
	const vat = settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT'];
	//let ChnlCmsnShow =   isNaN( Math.round((+value.RsrvAmnt - +value.NetAmnt)/+value.RsrvAmnt*100))  ? 0:
	//								Math.round((+value.RsrvAmnt -   +value.NetAmnt)/+value.RsrvAmnt*100);

	const showTR = (x) => x.indexOf("_") === -1 ? x : x.substring(0, x.indexOf("_"));
	const chnls= settings.channels ? settings.channels: [];
	const cur = settings.CompDtls.currency;
	
	let clnFeeValue = settings.properties.filter(x=> x.id===value.PrpName)[0]['ClnFee'];
	clnFeeValue = clnFeeValue*1>0 ? clnFeeValue*1 : 0;
	

	
	const tmpAmnt = value.pStatus!=='Cancelled' ? +value.NetAmnt : +value.CnclFee;
	const eliminateVat = value.Vat ? (1 + parseFloat(vat)/100): 1;
	const VatCalc = value.Vat ? parseFloat(vat)/100: 0;
	
	const fees = cur + Array(1).fill('\xa0').join('') + 
		  Num2(getFees(value, tmpAmnt )/eliminateVat);
	const taxes = cur + Array(1).fill('\xa0').join('') + Num2(getTaxes(value, tmpAmnt, eliminateVat ));
	
	let reservationAMountBeforeVat = cur + Array(1).fill('\xa0').join('') +
		Num2(+value.TtlRsrvWthtoutVat);
	
	const clnFee = clnFeeValue!== '' && clnFeeValue!==undefined && clnFeeValue!==0?
		  			cur + Array(1).fill('\xa0').join('') + Num2(clnFeeValue/eliminateVat) : 0;

	let vatAmountBaseAndClnFee = cur + Array(1).fill('\xa0').join('') + 	
		Num2((value.TtlRsrvWthtoutVat + clnFeeValue/eliminateVat)*VatCalc);
				
	
	
	let TotalAmountPaidbyGuest = cur + Array(1).fill('\xa0').join('') + 	
		Num2(+value.TtlRsrvWthtoutVat + +clnFeeValue/eliminateVat + 
			 (+value.TtlRsrvWthtoutVat + +clnFeeValue/eliminateVat)*VatCalc)
			 
		
	
	let vatAmount = cur + Array(1).fill('\xa0').join('') + 	
		Num2(getFees(value, tmpAmnt )/eliminateVat*VatCalc);
	
	
	let TotalFeesAndTaxes =  cur + Array(1).fill('\xa0').join('') + 	
		Num2(getFees(value, tmpAmnt )/eliminateVat +
			 getFees(value, tmpAmnt )/eliminateVat*VatCalc +
			getTaxes(value, tmpAmnt, eliminateVat));
			 
			
	const txt = cur + Array(1).fill('\xa0').join('') + 
		  Num2((value.TtlRsrvWthtoutVat + clnFeeValue/eliminateVat + 
			 (value.TtlRsrvWthtoutVat + clnFeeValue/eliminateVat)*VatCalc)/value.NigthsNum);//cur.concat().concat().toString()
	
	
	const NewChnCmsn = value.RsrvChn!=='' ? chnls.filter(x=> x.id===value.RsrvChn)[0]['ChnCmsn'] : '';
	const ExistedChnCmsn = value.LstSave!==undefined && value.LstSave!==''?
			 rcDataPrp.filter(x=> x.Transaction===value.Transaction)[0]['RsrvChn'] : '';
	let ChnPrcnt=null;
		
	if(value.ChnPrcnt==null && value.RsrvChn===''){ //new reservation
		ChnPrcnt=''
	}else if(value.RsrvChn!==ExistedChnCmsn){ //choose new Channel
		ChnPrcnt = NewChnCmsn
	}else if(value.ChnPrcnt==='' && value.RsrvChn!==''){
		ChnPrcnt = NewChnCmsn
	}else if(value.ChnPrcnt!=='' && ExistedChnCmsn!==''){
		ChnPrcnt = value.ChnPrcnt
	}

	let amountFilled = value.NetAmnt!=='' || value.CnclFee!=='';
	
	let ChannelPayOut = cur + Array(1).fill('\xa0').join('') + 	
		Num2(value.TtlRsrvWthtoutVat + clnFeeValue/eliminateVat + 
			 (value.TtlRsrvWthtoutVat + clnFeeValue/eliminateVat)*VatCalc -
			(value.TtlRsrvWthtoutVat + +clnFeeValue/eliminateVat)*ChnPrcnt/100
		)
	
	let TotalReservationAmountLessChannelFee =  cur + Array(1).fill('\xa0').join('') + 	
			Num2(value.RsrvAmnt - (value.TtlRsrvWthtoutVat + 
						+clnFeeValue/eliminateVat)*ChnPrcnt/100)
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
						<RowOut name='Base Charge' value={amountFilled ? 
							reservationAMountBeforeVat: ''} pad='0'/>
					</Grid>
					{clnFeeValue!==undefined &&
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Cleaning Fee' value={clnFee} pad='0'/>
					</Grid>}
				
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='VAT' value={amountFilled ? vatAmountBaseAndClnFee: ''} pad='0'/>
					</Grid>	
					
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name={(value.NigthsNum!=='' && value.NetAmnt!=='') ? `Reservation Amount ${txt} X ${value.NigthsNum} Nights` :
							'Reservation Amount' }
							value={amountFilled ? TotalAmountPaidbyGuest: ''} pad='0'/>
					</Grid>	
			
					{ChnPrcnt!=='' &&
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name={`Channel Service Fee (${ChnPrcnt}%)`}
							value={amountFilled ? `${ChnPrcnt==='0'? '': '-'}${cur} ${Num2((value.TtlRsrvWthtoutVat + 
						+clnFeeValue/eliminateVat)*ChnPrcnt/100)}` :''}
							pad='0' />
					</Grid>
					}
			
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name={ChnPrcnt!=='' ? 'Channel Payout' : 'Payout'} value={amountFilled  ? 
							ChannelPayOut: ''}
							// Total amount paid by Guest less Channel reservation Fee
							pad='0' b={true}/>
					</Grid>	
					{/*////////////////////////////*/}
					<Grid item sm={12} style={{width:'100%'}}>
						<Divider />
						<RowOut name='Extra Fees' value={amountFilled ? fees: ''} pad='30'/>
					</Grid>
			
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Extra Fees VAT' value={amountFilled ? vatAmount: ''} pad='0'/>
					</Grid>	
			
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Taxes' value={amountFilled ? taxes: ''} pad='0'/>
					</Grid>	
					
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Extra Fees & Tax Charge' value={amountFilled ? TotalFeesAndTaxes: ''} pad='0' b={true}/>
					</Grid>	
					
					<Grid item xs={12} style={{width:'100%'}}>
						<RowOut name='Total Reservation Amount Less Channel Fee ' value={amountFilled ? 
								TotalReservationAmountLessChannelFee: ''} pad='0' b={true}/>
					</Grid>	
			
			{/*////////////////////////////////////////*/}
								
					<Grid item sm={12} style={{width:'100%'}}>
						<Divider />
						<RowOut name='Total Payment' value={(value.TtlPmnt!=='' && value.TtlPmnt!==0)?
								`${cur} ${Num2(value.TtlPmnt)}`:''} pad='30'/>
					</Grid>
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='Balance Due Reservation' value={(value.BlncRsrv!=='' && amountFilled ) ?
								`${cur} ${Num2(+value.BlncRsrv)}`:''} pad='0' />
					</Grid>
					<Grid item sm={12} style={{width:'100%'}}>
						<RowOut name='Payment Status' value={value.PmntStts!==null ?value.PmntStts : ''}
							pad='0' />
					</Grid>
				</Grid>
    );
    };

export default RsrvAmounts;
