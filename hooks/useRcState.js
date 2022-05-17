import {useState} from 'react';
import {checkAvailableSlot, paymentStatus, readDataSlots, getFees, getTaxes} from '../functions/functions.js';


	/* const twoDig=(n) => {
		n += '';
		var x = n.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1].substring(0,2) : '';
	return	x1 + x2;
	} */



	const dateFormat = require('dateformat');	
		

	const useRcState = () =>{
		
	const [rcDataPrp, setRcDataPrp] = useState([]);
	const [value, setValue] = useState(null);
	const [displayDialog,setDisplayDialog]=useState(false);
	const [snackbar, setSnackbar] = useState(false);
	const [redValid, setRedValid] = useState(false);
	const [isSlotAvailable, setIsSlotAvailable] = useState(true);
	const [slotsTable, setSlotsTable] = useState([]);
	const [rcTable, setRcTable] = useState([]);
	const [calendarView, setCalendarView] = useState(true)
	const [displayRetrieveDialog,setDisplayRetrieveDialog]=useState(false);
	const [tokeetIdList,setTokeetIdList]=useState([]);
		
		
	const getNight=(end,start)=>{
		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	};
		
	
return {
	rcDataPrp, setRcDataPrp,
	selectValue: rowData => { 
		setValue(rowData);
		setDisplayDialog(true);
	},
	displayDialog,
	setDisplayDialog,
	value,
	setValue,
	snackbar,
	setSnackbar,
	redValid,
	setRedValid,
	isSlotAvailable,
	slotsTable, setSlotsTable,
	rcTable, setRcTable,
	setIsSlotAvailable,
	calendarView, setCalendarView,
	getFees, getTaxes,
	displayRetrieveDialog,setDisplayRetrieveDialog,
	tokeetIdList,setTokeetIdList,
	handleChange: async (uidCollection, e, settings, date) => {

	//	let ChnItem= value.RsrvChn!==''? settings.channels.filter(x => value.RsrvChn===x.id)[0] : ''
	//	let CmsnDescription = value.RsrvChn!==''? ChnItem['MngCmsn'] : '';
	//	let Cmsn = value.RsrvChn!=='' ? parseFloat(ChnItem['ChnCmsn'])/100 : '0';
	const vat= settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT']
	const eliminateVat = value.Vat ? (1 + parseFloat(vat)/100): 1;
	
	let clnFeeValue = settings.properties.filter(x=> x.id===value.PrpName)[0]['ClnFee'];
	clnFeeValue = value.clnFeeData===undefined ? (clnFeeValue*1>0 ? clnFeeValue*1 : 0) : value.clnFeeData.clnFee
		
	const RsrvAmount = (+e.target.value + +getFees(value, e.target.value) +
					  			+getTaxes(value, e.target.value, eliminateVat)) +
		  							clnFeeValue;

		if (e.target.name==='NetAmnt') {
		
			if(value.RsrvChn===''){
				setSnackbar( {open:true, msg: 'Choose channel first!', variant: 'warning'});
				return;
			}
		
			setValue({...value, [e.target.name]: e.target.value,
					  			'RsrvAmnt': RsrvAmount,
					 			'BlncRsrv': +(RsrvAmount-value.TtlPmnt),
					  			'PmntStts': paymentStatus(value.TtlPmnt, +RsrvAmount),
								'TtlRsrvWthtoutVat': 
								value.Vat===false ?  +e.target.value:
								+e.target.value/(1 + parseFloat(vat)/100)
						 }); 
		} else if (e.target.name==='CnclFee') {
			
			if(value.RsrvChn===''){
				setSnackbar( {open:true, msg: 'Choose channel first!', variant: 'warning'});
				return;
			}
			
				setValue({...value, [e.target.name]: e.target.value,
									//'NetAmnt': +e.target.value,  //save the original value of the reservation
						 			'RsrvAmnt': RsrvAmount,
					 				'BlncRsrv': +(RsrvAmount-value.TtlPmnt),
					  				'PmntStts': paymentStatus(value.TtlPmnt, +RsrvAmount),
						 			'TtlRsrvWthtoutVat': 
						 			value.Vat===false ?  +(e.target.value):
						 			+e.target.value/(1+parseFloat(vat)/100)
						 });
		} else if (e.target.name==='Passport' || e.target.name==='email' || e.target.name==='mobile' || e.target.name==='phone'
				  || e.target.name==='addrss' || e.target.name==='cntry') {
				
				let moshe={...value.dtls,[e.target.name]:e.target.value};
				setValue({...value,'dtls':moshe });
			
		} else if (e.target.name==='RsrvChn'){	
		
			let ChnItem= settings.channels.filter(x => e.target.value===x.RsrvChn)[0];
	//		let Cmsn = value.RsrvChn!=='' ? parseFloat(ChnItem['ChnCmsn'])/100 : '0';
			let RsrvAmount = +value.NetAmnt + +getFees(value, value.NetAmnt) +
					  			+getTaxes(value, value.NetAmnt, eliminateVat) +
				  				clnFeeValue;
			RsrvAmount = RsrvAmount.toFixed(2)
		
			value.NetAmnt!=='' ?	setValue({...value, [e.target.name]: ChnItem['id'],
										'BlncRsrv': +(+RsrvAmount-value.TtlPmnt),
										'PmntStts': paymentStatus(value.TtlPmnt, RsrvAmount),
										'TtlRsrvWthtoutVat': 
										value.Vat===false ?  +value.NetAmnt:
										+value.NetAmnt/(1+parseFloat(vat)/100)
				}) : setValue({...value, [e.target.name]: ChnItem['id']});	
		
		}else if (e.target.name==='AptName'){	
			setValue({...value, [e.target.name]:settings.apartments.filter(x=> 
		   x.AptName===e.target.value)[0]['id'] });	
			
			//load slots of the current year
			let slotsData = await readDataSlots(uidCollection, 'slots', date.year,
				null,settings.apartments.filter(x=> x.AptName===e.target.value)[0]['id'])

			setSlotsTable(slotsData.dates);
			setRcTable(slotsData.rc);
			
		
			let availORnotavail = (value.ChckIn!==null && value.ChckOut !==null && 
							   e.target.value!=='') ?
				await checkAvailableSlot(uidCollection, settings.apartments.filter(x=> 
							x.AptName===e.target.value)[0]['id'],
							value.Transaction, value.ChckIn, value.ChckOut)	:null;
	
				if(availORnotavail){
					setSnackbar( {open:true, msg: 'This apartment is already reserved for the selected dates', variant: 'warning'});
				}
				
				setIsSlotAvailable(!availORnotavail);
			
			
		}else if(e.target.name==='pStatus'){    //name==='RsrvCncl'

			const eliminateVat = value.Vat ? (1 + parseFloat(vat)/100): 1;
			
			const tmpAmnt = e.target.value!=='Cancelled' ? +value.NetAmnt + +getFees(value, value.NetAmnt) +
					  			+getTaxes(value, value.NetAmnt, eliminateVat) : +value.CnclFee + +getFees(value, value.CnclFee) +
					  			+getTaxes(value, value.CnclFee, eliminateVat)
		
			setValue({ ...value, [e.target.name]: e.target.value,
							'RsrvAmnt': +tmpAmnt,
							'BlncRsrv': +(tmpAmnt-value.TtlPmnt),
							'PmntStts': paymentStatus(value.TtlPmnt, +tmpAmnt), 
							'TtlRsrvWthtoutVat': e.target.value!=='Cancelled' ? (value.Vat===false  ?  +value.NetAmnt :
								 +value.NetAmnt/(1+parseFloat(vat)/100) ) : ( value.Vat===false ? +value.CnclFee : 
													  +value.CnclFee/(1+parseFloat(vat)/100) )
						});	 
	
		} else {
			
			setValue({...value, [e.target.name]:e.target.value });
			
		} 
	},
	handleChangePmnts: (e, id, settings) => {
		
		const date1=(e,k)=>{
			return (e.target.name==='P' && e.target.value!=='' && k===null) ? dateFormat(new Date(),'dd-mmm-yyyy') :  k
		}
		
			let rowNum=id;
			let newVal=[...value.Payments];
		
			newVal[rowNum]={...newVal[rowNum],[e.target.name]:
							e.target.name!=='PM' ? e.target.value :	settings.pmntMethods.filter(x=> x.item===e.target.value)[0]['id'],
							'Date':	date1(e, newVal[rowNum].Date) };

			let TotalPmnt = newVal.map(x=> parseFloat(x.P) || parseFloat(x.Advnc)).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);
			
			setValue({...value,'Payments':newVal, 'TtlPmnt':TotalPmnt,
					  'BlncRsrv': value.RsrvAmnt-TotalPmnt, 'PmntStts': paymentStatus(TotalPmnt, value.RsrvAmnt) });
		
	},
	
	handleChangeDetails: (x,y,e, clnFeeValue)=>{
		let tmp = (x==='add')? +value.dtls[y] +1 : +value.dtls[y] -1;
		tmp=tmp<0?0:tmp;
		let moshe={...value.dtls,[y]:tmp};
		const val = {...value, 'dtls' : moshe}
	
	//	const vat= settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT']
	//	const vatExisted = value.Vat ? (1 + parseFloat(vat)/100): 1;
		const RsrvAmount = +value.NetAmnt + +getFees(val, value.NetAmnt) +
					  			+getTaxes(val, value.NetAmnt) +clnFeeValue;
		
		setValue({...value,'dtls':moshe, 'RsrvAmnt': RsrvAmount, 'BlncRsrv': +(+RsrvAmount-value.TtlPmnt), });
	},
	handleChangeD: async (name,val, uidCollection) =>{
		
		if(val===null){
		 	setValue({...value, [name]:null });
		}else{
			let tmp = ((value.ChckOut!=null && val!=null) || (value.ChckIn!=null && val!=null))?
			 (name==='ChckIn') ? getNight(value.ChckOut, dateFormat(val,'dd-mmm-yyyy')) : getNight(dateFormat(val,'dd-mmm-yyyy'), value.ChckIn) : '';
			setValue({...value, [name]: dateFormat(val,'dd-mmm-yyyy'), 'NigthsNum' : tmp});

			let availORnotavail = (value.ChckIn!==null && name==='ChckOut' && value.AptName!=='') ?
				await checkAvailableSlot(uidCollection, value.AptName, value.Transaction, value.ChckIn,
			 val) :	(value.ChckOut!==null && name==='ChckIn' && value.AptName!=='') ?
				await checkAvailableSlot(uidCollection, 
			 value.AptName,value.Transaction, val, value.ChckOut):null
		
				if(availORnotavail){
					setSnackbar( {open:true, msg: 'This apartment is already reserved for the selected dates', variant: 'warning'});
				}
				setIsSlotAvailable(!availORnotavail);
			
		}
	},	
	handleChangeDNew: (start, end,settings) =>{
		
		let tmp = getNight(dateFormat(end,'dd-mmm-yyyy'), dateFormat(start,'dd-mmm-yyyy'))
		let clnFeeValue = settings.properties.filter(x=> x.id===value.PrpName)[0]['ClnFee'];
		clnFeeValue = value.clnFeeData===undefined ? (clnFeeValue*1>0 ? clnFeeValue*1 : 0) : value.clnFeeData.clnFee
		
		let newValue = {...value, 'ChckIn': dateFormat(start,'dd-mmm-yyyy'),
					  'ChckOut' : dateFormat(end,'dd-mmm-yyyy'),'NigthsNum' : tmp}
		
		
		const RsrvAmount = +newValue.NetAmnt + +getFees(newValue, newValue.NetAmnt) +
					  			+getTaxes(newValue, newValue.NetAmnt) + clnFeeValue;
	
	
			setValue({...newValue, 
					  'RsrvAmnt': RsrvAmount,
						'BlncRsrv': +(RsrvAmount-value.TtlPmnt),
						'PmntStts': paymentStatus(value.TtlPmnt, +RsrvAmount),
					 });
	},	
	handleChangeDPmnts: (name,val, id) =>{
		let rowNum=id;
		let newVal=[...value.Payments];
		
		if(val===null){
		   	newVal[rowNum]={...newVal[rowNum],[name]:null};
		}else{
			newVal[rowNum]={...newVal[rowNum],[name]:dateFormat(val,'dd-mmm-yyyy')};
		}
		
		setValue({...value,'Payments':newVal});
	},
	handleChangeTrueFalse: (name,vat, settings) => e => {
		
	const eliminateVat = e.target.checked ? (1 + parseFloat(vat)/100): 1;
	let clnFeeValue = settings.properties.filter(x=> x.id===value.PrpName)[0]['ClnFee'];
	clnFeeValue = value.clnFeeData===undefined ? (clnFeeValue*1>0 ? clnFeeValue*1 : 0) : value.clnFeeData.clnFee
		
	const RsrvAmount = (+value.NetAmnt + +getFees(value, value.NetAmnt) +
					  			+getTaxes(value, value.NetAmnt, eliminateVat))+
		  						clnFeeValue;
			
		if(name==='Vat'){
   	 		setValue({ ...value, [name]: e.target.checked,
					'RsrvAmnt': RsrvAmount,	
			 		'TtlRsrvWthtoutVat': 
			 		e.target.checked===false ?
					  (value.pStatus!=='Cancelled' ?  +value.NetAmnt : +value.CnclFee ) :
			 		( value.pStatus!=='Cancelled' ?
					 +value.NetAmnt/(1+parseFloat(vat)/100) : +value.CnclFee/(1+parseFloat(vat)/100) )
			 	 });
		}else{
			setValue({ ...value, [name]: e.target.checked})
		}	
  	},
	handleChangeTrueFalseFeesTaxes: (name,i, settings) => e =>{
		let tmp = value[name] 
		tmp[i]={...tmp[i], show: !tmp[i].show}
		
		const vat= settings.properties.filter(x=> x.id===value.PrpName)[0]['VAT']
		const eliminateVat = value.Vat ? (1 + parseFloat(vat)/100): 1;
		let clnFeeValue = settings.properties.filter(x=> x.id===value.PrpName)[0]['ClnFee'];  							
		clnFeeValue = value.clnFeeData===undefined ? (clnFeeValue*1>0 ? clnFeeValue*1 : 0) : value.clnFeeData.clnFee
		
		const RsrvAmount = value.pStatus!=='Cancelled' ?  +value.NetAmnt +
			+getFees(value, value.NetAmnt) + +getTaxes(value, value.NetAmnt, eliminateVat) + 
				clnFeeValue :
			+value.CnclFee + +getFees(value, value.CnclFee) + 
			  +getTaxes(value, value.CnclFee, eliminateVat) + 
				clnFeeValue;
								
		setValue({...value, [name]: tmp, 
					'RsrvAmnt': RsrvAmount,
					'BlncRsrv': +(RsrvAmount-value.TtlPmnt),
					'PmntStts': paymentStatus(value.TtlPmnt, +RsrvAmount),
			}); 
	},
	  
};
};

export default useRcState;

/* 	const clnCommas = (n)=>{ //Clean commas and validate numbers
		let cln=n.replace(/,/g,'');
		//return /^[0-9.]*$/.test( cln ) ? cln :  cln.substring(0, cln.length - 1);
		return n;
	} ; */