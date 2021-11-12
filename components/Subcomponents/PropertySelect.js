import React, {useContext, useState, useRef , useEffect} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {ClickAwayListener, Grow, Paper, Popper, MenuItem, 
		MenuList, Button} from '@material-ui/core';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import {SelectContext} from '../../contexts/useSelectContext';
import {idToItem} from '../../functions/functions.js';
import useWindowSize from '../../hooks/useWindowSize';


export default function OwnerSelect() {
  	const [open, setOpen] = useState(false);
	const {settings, propertyList} = useContext(SettingsContext);
	const anchorRef = useRef(null);
	const {propertySlct, setPropertySlct,setFundSlct, checkedCalendar, setMultiPropertySlct} = useContext(SelectContext);
	const scrSize = useWindowSize();	
	
	
	useEffect(()=>{
		
		if(Object.keys(checkedCalendar).length !== 0 && Object.values(checkedCalendar).includes(true)){
			
			//look for the first TRUE value
				const getFirstTruthyItem = (checkedCalendar) => Object.keys(checkedCalendar).find((i) => checkedCalendar[i] === true);
				setPropertySlct(settings.properties.filter(x=> x.PrpName===getFirstTruthyItem(checkedCalendar))[0]['id'])
				setFundSlct(settings.properties.filter((x) => x.PrpName === getFirstTruthyItem(checkedCalendar))[0]['Fund']	)
		}
			
	
	},[checkedCalendar, settings, setFundSlct, setPropertySlct])
	
	
	const handleMenuItemClick = (event, index) => {
		setPropertySlct(settings.properties.filter(x=> x.PrpName===propertyList[index])[0]['id'])
		setMultiPropertySlct([settings.properties.filter(x=> x.PrpName===propertyList[index])[0]['id']])
		setOpen(false);

		setFundSlct(settings.properties.filter(x=> x.PrpName===propertyList[index])[0]['Fund'])
  	};	
	
	const handleToggle = () => {
    	setOpen(prevOpen => !prevOpen);
  	};

  	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
		  return;
		}
    	setOpen(false);
  	};
	
  return (
	  <>
          <Button
			//color="inherit"
			style={{color: '#193E6D'}}
            size="large"
            aria-owns={open ? 'menu-list-grow' : undefined}
			ref={anchorRef}
            onClick={handleToggle}
          >  {	propertySlct==null ? (scrSize==='xs' ? 'Property' : 'Choose property') : idToItem(settings.properties, propertySlct, 'PrpName')}
            <ArrowDropDownIcon style={{marginLeft: '1rem'}}/>
          </Button>
       
        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
				  	{propertyList.map((option, index) => (
				 		<MenuItem
							key={index}
							onClick={event => handleMenuItemClick(event, index)}
                      	>
                        	{option}
                      	</MenuItem>
					))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
	</>	  
  );
}


/*

const getNight=(end,start)=>{
		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	};

	const loadData = async(property) => {

		/*
			const tmpIcalList = settings.apartments.filter(x=> x.PrpName===property).filter(x=> x.Ical!=null && x.Ical!=='')

			let icalData=[];

				setLoading(true);
				setRunFirstTime(true)

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
												 RsrvCncl : false, CnclFee:'', PrpName: property, 
												dtls : {adlts: '', chldrn:'', Passport:'', email:'', mobile: '', phone: '', addrss:'', cntry:''}})) : [];

		
				
					let listDataRC = await readDataPerPropertyDates(uidCollection, 'reservations', property, date.year, date.month);
					/*
						const listDataRCIcalTransactions = listDataRC.filter(x=> x.IcalTransaction).map(x=>x.IcalTransaction);
							for(let z in  tmpIcalData){ //check if there are duplicated reservations (incl icals)
								if(	!listDataRCIcalTransactions.includes(tmpIcalData[z].IcalTransaction) )	listDataRC.push( tmpIcalData[z] ) ;
							}
					
			 		setRcData({...rcData,'prp':listDataRC});
	
			//		let listDataEX = await readDataPerPropertyDates('expenses', property, date.year, date.month, 'AccDate');
			//		setExData({...exData,'prp':listDataEX});
		
		setLoading(false);
	};	

*/
