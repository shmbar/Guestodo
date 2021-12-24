import React, {useState, useEffect, useContext, useRef} from 'react';
import {FullCalendar} from 'primereact/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {getNewTR, idToItem} from '../../../functions/functions.js';

import {RcContext} from '../../../contexts/useRcContext';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import OrdersModal from '../table/Modals/OrdersModal';
import {SelectContext} from '../../../contexts/useSelectContext';
import SnackBar from '../../Subcomponents/SnackBar';
import AddRsrvDialog from './AddRsrvDialog';
import { v4 as uuidv4 } from 'uuid';
import {AuthContext} from '../../../contexts/useAuthContext';

/*
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
*/
//import '@fullcalendar/list/main.css';
//import '@fullcalendar/resource-timeline/main.css';

import './Calendar.css';

const dateFormat = require('dateformat');	


function nextDay(date){
		let nextD = new Date(dateFormat(date,'dd-mmm-yyyy'));
		return nextD.setDate(nextD.getDate() + 1);
}

// function lastDay(date){
// 		let lastD = new Date(dateFormat(date,'dd-mmm-yyyy'));
// 		return lastD.setDate(lastD.getDate() - 1);
// 	}

const getNight=(end,start)=>{
		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	};

const Calendar =()=> {

	const {rcDataPrp, selectValue, displayDialog, snackbar, setSnackbar} = useContext(RcContext);
	const [events, setEvents] = useState([]);
	const {chnnlslogo, settings} = useContext(SettingsContext);
	const {propertySlct, date} = useContext(SelectContext);
	const [open, setOpen] = useState(false);
	const [dates /*,setDates*/] = useState({start:null, end:null});
	const {uidCollection} = useContext(AuthContext);	
	
	
	let calendarRef = useRef();
	
	function findImg(txt,y){
		return	chnnlslogo.filter(x=> x.brnd===txt)[0]!==undefined ?
				chnnlslogo.filter(x=> x.brnd===txt)[0][y] : chnnlslogo[chnnlslogo.length-1][y]
	}
	
	useEffect(()=>{
				let tmpRC = rcDataPrp.map(x=> ({id: x.Transaction, title: idToItem(settings.apartments,x.AptName, 'AptName').concat(' - ').concat(x.GstName), start: dateFormat(x.ChckIn,'yyyy-mm-dd'), end: dateFormat(nextDay(x.ChckOut) ,'yyyy-mm-dd'),
								   backgroundColor: '#e8f4f8', imageurl: x.RsrvChn, textColor: 'black', dt: x}))
				calendarRef.calendar.gotoDate(new Date(date.year,date.month,1));
				setEvents(tmpRC);
				
		
	},[rcDataPrp,date, settings.apartments])

	
	let basicOptions= {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin/*, resourceTimelinePlugin*/],
				defaultView: 'dayGridMonth',
                defaultDate: dateFormat(new Date(date.year-1, date.month, 17),'yyyy-mm-dd'),
                header: {
                    left:false,// 'prev,next',
                    center: 'title',
                    right: false, //'dayGridMonth,timeGridWeek,timeGridDay'  //resourceTimelineMonth
                },
                editable: true,
				selectable: true,
				eventRender: (info) => {
					if (info.event.extendedProps.imageurl) {
						let chName = idToItem(settings.channels,info.event.extendedProps.imageurl, 'RsrvChn');
						info.el.firstChild.innerHTML = "<div><img src='" + findImg(chName,'img') + "' width='" +
								findImg(chName,'width') + "' style=padding-right:20px; >" + info.event.title + "</div>";	
					}
				},
				eventClick: async(info) => {
					let tmpRC = await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'RC');
					let newOrder = info.event.extendedProps.dt.Transaction!=null ? info.event.extendedProps.dt : {...info.event.extendedProps.dt, 'Transaction':  'RC'.concat(tmpRC).concat('_' + uuidv4())};
					selectValue(newOrder);
				},
				dateClick: (info) => {
				//select
				//	const endDate = getNight(info.end, info.start)>1 ? lastDay(info.end) : info.end;
				
				//	setDates({start: dateFormat(info.start,'dd-mmm-yyyy'), end: dateFormat(endDate,'dd-mmm-yyyy')});
					
				//	setOpen(true);
					
					
				}
	}
	
	const openModalRsrv= async()=>{
		if(propertySlct===null){
			setOpen(false);
			setSnackbar({open: true, msg: 'Choose property',
						 variant: 'warning'});
			return;
		}else{
			setOpen(false);
			let tmpRC = await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'RC');
			let tmpObj = {ChckIn : dates.start,  ChckOut: dates.end,  'Transaction':  'RC'.concat(tmpRC).concat('_' + uuidv4()), Payments:[{P:'', Date:null, PM:''}], Vat:true,
					 				  PrpName:propertySlct,	RsrvCncl:false, RsrvChn:'', NetAmnt:'', CnclFee:'', NigthsNum: getNight(dates.end,dates.start), 
						  				RsrvAmnt:'', TtlPmnt:'', BlncRsrv:'', GstName:'', AptName:'',
					 				  dtls : {adlts: '', chldrn:'', Passport:'', email:'', mobile: '', phone: '', addrss:'', cntry:''} }
			selectValue(tmpObj);
		}
	}
		
	
        return (
            <div>
				<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
				<AddRsrvDialog open={open} setOpen={setOpen} handleDelete={openModalRsrv}
					title='Place new reservation' 
						/>
				
                <div className="content-section introduction">
                    <div className="feature-intro">
                
                    </div>
                </div>

                <div className="content-section implementation">
                    <FullCalendar ref={(el) => calendarRef = el} events={events} options={basicOptions}  />
                </div>
				{ displayDialog ?  <OrdersModal  />: null}
            </div>
        );
	
		
   
}

 export default Calendar;


