import React, {useContext, useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';
import Table from '../Reservations/table/Table';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import {RcContext} from '../../contexts/useRcContext';


import Calendar from './Calendar/Calendar';

import rsrv from '../../logos/pics/rsrv.svg';
import pernight from '../../logos/pics/pernight.svg';
import balancedue from '../../logos/pics/balancedue.svg';
import {SelectContext} from '../../contexts/useSelectContext';
import MonthSelect from '../Subcomponents/MonthSelect';
import useWindowSize from '../../hooks/useWindowSize';
import {AuthContext} from '../../contexts/useAuthContext';
import {readDataPerPropertyDates, isSlotAvailale, readData, readDataMultiPropertyDates} from '../../functions/functions.js';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import Switcher from '../Subcomponents/Switcher/Switcher.js';


import './Orders.css';

const logos = 	[	{txt: 'Total', img: rsrv, width:'50px'},
					{txt: 'Average', img: pernight, width:'50px'},
					{txt: 'Balance Due', img: balancedue, width:'50px'},
				];

const dateFormat = require('dateformat');

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

export default function PaperSheet() {

	const scrSize = useWindowSize();
	const [pnldata, setPnldata]=useState({avg:0, ttlrsrv:0, ttlblnxrsrv:0});
	const {setRcDataPrp,rcDataPrp, calendarView, setCalendarView,} = useContext(RcContext);
	const {date,setDate, propertySlct, multiPropertySlct} = useContext(SelectContext);
	const {uidCollection} = useContext(AuthContext);
	const {setLoading, settings} = useContext(SettingsContext);

	const useStyles = makeStyles(theme => ({
		root: {
		  padding: scrSize==='xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
		  display: 'grid'
		},
		  pd:{
			  paddingLeft: '0px!important',
			  paddingRight: '0px!important',
		  },
		paddingSmall:{
			padding: theme.spacing(2.6),
			paddingTop: scrSize==='xs' ? theme.spacing(5) : theme.spacing(4),
		},
	  }));

	  const classes = useStyles();

	
	useEffect(() => {
	
		const loadData= async()=>{
			let listDataRC=[];
			setLoading(true);
				
				if(!calendarView){ //calendar
					
				 listDataRC = await readDataPerPropertyDates(uidCollection, 'reservations', propertySlct, date.year, date.month);
				
				}else{
				
				 listDataRC = await readDataMultiPropertyDates(uidCollection, 'reservations', multiPropertySlct, date.year, date.month);
				 let aptList = settings.apartments.filter(x=> multiPropertySlct.includes(x.PrpName)).map(y=> y.id);
					
				
					for(let i in aptList){
						let tmp11=  await isSlotAvailale(uidCollection, aptList[i], new Date(date.year,date.month,1)) //reservation number
	
						if (tmp11!=='available'){
						
							let trnsc = await readData(uidCollection, 'reservations', date.month!== 0 ? date.year: date.year-1, tmp11)
							listDataRC = trnsc===undefined? listDataRC : [...listDataRC,trnsc]
						}	
					}  
				}
		
				
				setRcDataPrp(listDataRC);
			setLoading(false);
		}
	
	
		(propertySlct!=null ||  multiPropertySlct.length!==0) && loadData()
	

  },[setLoading, setRcDataPrp, date, uidCollection, propertySlct, multiPropertySlct, calendarView, settings]);
	

  useEffect(() => {
	
		let nightsNum=0;
		let reservs=0;
		let blnxrsrv=0;
		

			for(let i=0; i<rcDataPrp.length;i++){
				nightsNum+= rcDataPrp[i].Transaction!=null ? (rcDataPrp[i].pStatus==='Tentative' ? 0 : +rcDataPrp[i].NigthsNum) : 0;
				reservs+= (rcDataPrp[i].pStatus==='Tentative' ? 0 : +rcDataPrp[i].RsrvAmnt);
				blnxrsrv+= (rcDataPrp[i].pStatus==='Tentative' ? 0 : +rcDataPrp[i].BlncRsrv);
			}
		
		setPnldata({avg:reservs!==0 ?addCommas(reservs/nightsNum): 0,
				ttlrsrv:addCommas(reservs), ttlblnxrsrv:addCommas(blnxrsrv)}	);

},[rcDataPrp]);
	
	
	
	
 const setSwitcherToCalendar=()=>{
	 setCalendarView(!calendarView)
	 if(date.month===12)setDate({...date,'month': new Date().getMonth()})
 }

  return (
	  <div>
		
	  	{!calendarView  && <div className={classes.paddingSmall}>
		   	<Grid container spacing={7} justifyContent="space-between" >  
				<PannelData  clsNum='2' txt='Reservation Amount' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={pnldata.ttlrsrv} img={logos[0]}/>
				<PannelData  clsNum='1' txt='Reservation Amount Per Night' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={pnldata.avg} img={logos[1]}/>
				<PannelData clsNum='3'   txt='Balance Due' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={pnldata.ttlblnxrsrv} img={logos[2]} />
		  	</Grid>  
	  	</div> }
	  
	 
	  	<div style={{margin:'5px', float: 'right', paddingTop:'10px'}}>
			  	<Switcher  id="newsletter" onChange={setSwitcherToCalendar}  />
	  	</div>

		<div style={{padding: '60px 0px 10px 0px'}}>
		  	<Paper className={classes.root} >
			  	
			 	<Grid  container  spacing={2}>
					<Grid item sm={3}>
						<h4 className='ttlClr'>Reservations</h4>
					</Grid>	
					<Grid item sm={9} >
						<Grid container  spacing={2} justifyContent="flex-end"  alignItems="center" style={{margin:"auto"}}>
							<Grid item >
								<MonthSelect allMonths={!calendarView}/>
							</Grid>
						</Grid>
					</Grid>	
				</Grid>	 
				
		 	{ !calendarView  ? <Table />:	<Calendar />  }
				
		  	</Paper>
		</div>	 
	 
	  
	  </div>
  );
}

