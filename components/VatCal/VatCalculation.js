// import React, {useState, useContext} from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Table from '../Reservations/table/Table';
// import ViewList from '@material-ui/icons/ViewList';
// import Event from '@material-ui/icons/Event';
// import PermMedia from '@material-ui/icons/PermMedia';
// import Weekend from '@material-ui/icons/Weekend';
// import PannelData from './innerpapers/PannelData';
// import Grid from '@material-ui/core/Grid';
// import Dates from './innerpapers/Dates';
// //import Income from './innerpapers/Income';
// //import Expense from './innerpapers/Expense';
// //import Vat from './innerpapers/Vat'; ///
// import {RcContext} from '../../contexts/useRcContext';
// import {ExContext} from '../../contexts/useExContext';
// import {SettingsContext} from '../../contexts/useSettingsContext';
// //import './Orders.css'; 

// const dateFormat = require('dateformat');	

// const useStyles = makeStyles(theme => ({
//   root: {
//     padding: theme.spacing(1, 4),
// 	paddingBottom: theme.spacing(0),
//   }
// }));

// const getNight=(end,start)=>{
// 		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
// 		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
// 	};

// const VatCalculation = ()=> {
//   	const classes = useStyles();
// 	const [value, setValue] = useState({'From': null, 'To': null});
// 	const {rcData} = useContext(RcContext);
// 	const [valueInc,setValueInc] = useState({withVat:'', withoutVat:'', Vat:''});
	
// 	const {exData} = useContext(ExContext);
// 	const [valuex, setValuex] = useState({withVat:'', withoutVat:'', Vat:''});
// 	const {taxes} = useContext(SettingsContext);
	
// 	const pushArr=(valueVatTmp, i /*, Yahas*/)=>{
// 		let tmp = {...valueVatTmp};
// 		let newTmp='';
		
// 		if(rcData[i].Vat===false){
// 					newTmp = ({...tmp, 'withVat': ((+tmp.withVat) + (+rcData[i].RsrvAmnt/* * Yahas*/))});
// 				}else{
// 					newTmp = ({...tmp, 'withoutVat': +tmp.withoutVat + (+rcData[i].TtlRsrvWthtoutVat/**Yahas*/),
// 								   'Vat': +tmp.Vat + (+rcData[i].RsrvAmnt - (+rcData[i].TtlRsrvWthtoutVat))/**Yahas*/
// 							});
// 				}
// 		return newTmp;
// 	};
	
// 	const pushArrEx=(valueVatTmpEx, i)=>{
// 		let tmp = {...valueVatTmpEx};
// 		let newTmp='';
		
// 		if(exData[i].Vat===false){
// 					newTmp = ({...tmp, 'withVat': ((+tmp.withVat) + (+exData[i].ExpAmntWthtoutVat))});
// 				}else{
// 					newTmp = ({...tmp, 'withoutVat': +tmp.withoutVat + (+exData[i].ExpAmntWthtoutVat),
// 							   'Vat': +tmp.Vat + (+exData[i].ExpAmntWthtoutVat*((1+parseFloat(taxes)/100)-1))
// 							});
// 				}
// 		return newTmp;
// 	};
	
// 	const Calculate =() =>{
		
// 		let From = dateFormat(value.From, "yyyy-mm-dd");
// 		let To = dateFormat(value.To, "yyyy-mm-dd");
		
// 		let valueVatTmp={withVat:'', withoutVat:'', Vat:''};
// 		let valueVatTmpEx={withVat:'', withoutVat:'', Vat:''};
		
// 		for(let i=0; i<rcData.length; i++){  //Income
// 			let ChckIn = dateFormat(rcData[i].ChckIn, "yyyy-mm-dd");
// 			let ChckOut = dateFormat(rcData[i].ChckOut, "yyyy-mm-dd");
			
			
// 			if(ChckIn>=From && ChckIn<=To){
// 				//tableArr.push(RC(rcData[i]/*, x, startdate*/));
// 				valueVatTmp = pushArr(valueVatTmp,i /*,Yahas*/);
// 			}
			
			
// 			// first case: the reservation inside the period
// 			// if(ChckIn>=From && ChckOut<=To){
// 			// 	let Yahas = +getNight(ChckOut, ChckIn) / +getNight(ChckOut,ChckIn);
// 			// 	valueVatTmp = pushArr(valueVatTmp,i,Yahas);
// 			// } else if(ChckIn<From && ChckOut>=From && ChckOut<To){ //second case: checkIn before start of period
// 			// 	let Yahas = +getNight(ChckOut, From) / +getNight(ChckOut,ChckIn);
// 			// 	valueVatTmp = pushArr(valueVatTmp,i,Yahas);
// 			// } else if(ChckIn<=To && ChckOut>To && ChckIn>From){ //third case: checkIn after start of period and checkout after To
// 			// 	let Yahas = +getNight(To, ChckIn) / +getNight(ChckOut,ChckIn);
// 			// 	valueVatTmp = pushArr(valueVatTmp,i,Yahas);
// 			// } else if(ChckIn<From && ChckOut>To){ //fourth case: period inside reservtion
// 			// 	let Yahas = +getNight(To, From) / +getNight(ChckOut,ChckIn);
// 			// 	valueVatTmp = pushArr(valueVatTmp, i,Yahas);
// 			// } //
// 		}
		
// 		for(let i=0; i<exData.length; i++){  //Income
// 			let AccDate = dateFormat(exData[i].AccDate, "yyyy-mm-dd");
			
// 			if(AccDate>=From && AccDate<=To){
// 				valueVatTmpEx = pushArrEx(valueVatTmpEx,i);
// 			}
// 		}
		
// 		setValueInc(valueVatTmp);
// 		setValuex(valueVatTmpEx);
// 	};
	
// 	const handleChange= (name,val) => {

// 		if(val===null){
// 		 	setValue({...value, [name]:null });
// 		}else{						
// 			setValue({...value, [name]: dateFormat(val,'dd-mmm-yyyy')});
// 		}
// 	};
// }

// export default VatCalculation;
// /*

 
			

// 	<PannelData content={ <Vat  style={{color:'#fff'}} /> } title='Vat Calculation'  />
				
//  return (
	 
// 		  <Grid container spacing={2} justifyContent="space-between"  >  
// 			 	<PannelData content={ <Dates  style={{color:'#fff'}} 
// 										  handleChange={handleChange}
// 										  value={value}
// 										  Calculate={Calculate} /> } title='Vat Calculation'  />
// 			 	<PannelData content={ <Income  valueInc={valueInc} /> }	title='Income' />
// 				<PannelData content={ <Expense  valuex={valuex} style={{color:'#fff'}} /> } title='Expenses' />
// 		  </Grid>  
	 
//   );
// 1
// */


