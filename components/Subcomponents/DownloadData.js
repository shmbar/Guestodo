import React, {useContext, useState, useRef, useEffect } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {ClickAwayListener, Grow, Paper, Popper, MenuItem, 
		MenuList, Button} from '@material-ui/core';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import firebase from 'firebase/app';
import {RcContext} from '../../contexts/useRcContext';
import {ExContext} from '../../contexts/useExContext';
import {SelectContext} from '../../contexts/useSelectContext';
import {readDataPerPropertyDates} from '../../functions/functions.js';



const getNight=(end,start)=>{
		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	};

export default function OwnerSelect() {
  	const [open, setOpen] = useState(false);
	const {setLoading, propertyList, settings} = React.useContext(SettingsContext);
	const anchorRef = useRef(null);
	const [runFirstTime, setRunFirstTime] = useState(false)
	const {rcData, setRcData} = useContext(RcContext);
	const {exData, setExData} = useContext(ExContext);
	const {propertySlct, setPropertySlct, date,setDate} = useContext(SelectContext);
	
	const dateFormat = require('dateformat');	
	console.log('2323')
	useEffect(()=>{
	
  	const setInitialList = async() => {
	
		const tmpIcalList = settings.apartments.filter(x=> x.PrpName===propertySlct).filter(x=> x.Ical!=null && x.Ical!=='')
		
		let icalData=[];
			
			setLoading(true);
			setRunFirstTime(true)
			setDate({...date, 'run': false})
		
				//load Ical and set a list of Icals
			if(tmpIcalList.length){
				const fetchIcal = await firebase.functions().httpsCallable('fetchIcal');
			
				for(let i in tmpIcalList){
					await fetchIcal(tmpIcalList[i].Ical).then(result=> {
						let tmp = result.data.map(x => ({...x,'RsrvChn': tmpIcalList[i].RsrvChn, 'AptName' : tmpIcalList[i].AptName}));
						icalData.push(tmp)
					});	
				}	
			}	
			
				//Prepare the Ical list for table/callendar
				let tmpIcalData = icalData.length!==0 ? icalData[0].map(x=> ({GstName: x.summary, ChckIn: dateFormat(x.start, 'dd-mmm-yyyy') , ChckOut: dateFormat(x.end,'dd-mmm-yyyy') ,
											  IcalTransaction: x.uid, AptName: x.AptName, RsrvChn: x.RsrvChn, BlncRsrv: '', RsrvAmnt: '', TtlPmnt: '', NigthsNum: getNight(x.end,x.start),
											  TtlRsrvWthtoutVat:'', PmntStts: 'Unpaid',	Payments:[{P:'', Date:null, PM:''}], Vat: true, NetAmnt:'',
										  	 RsrvCncl : false, CnclFee:'', PrpName: propertySlct, 
											dtls : {adlts: '', chldrn:'', Passport:'', email:'', mobile: '', phone: '', addrss:'', cntry:''}})) : [];
				
		
					let listDataRC = await readDataPerPropertyDates('reservations', propertySlct, date.year, date.month, 'ChckIn');
					const listDataRCIcalTransactions = listDataRC.filter(x=> x.IcalTransaction).map(x=>x.IcalTransaction);
						for(let z in  tmpIcalData){ //check if there are duplicated reservations (incl icals)
							if(	!listDataRCIcalTransactions.includes(tmpIcalData[z].IcalTransaction) )	listDataRC.push( tmpIcalData[z] ) ;
						}
					
			 		setRcData({...rcData,'prp':listDataRC});
	
					let listDataEX = await readDataPerPropertyDates('expenses', propertySlct, date.year, date.month, 'AccDate');
					setExData({...exData,'prp':listDataEX});
			
		setLoading(false);
	};	
		
		if(propertySlct!==null && !runFirstTime)setInitialList();
		if(propertySlct!==null && date.run)setInitialList();
		
		console.log(propertySlct)
		
		
	},[dateFormat, exData, rcData, setExData, setLoading, setRcData, date, propertySlct, settings,runFirstTime, setDate])




	
  return '1234'
}
