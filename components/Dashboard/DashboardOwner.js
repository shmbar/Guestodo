import React , {useState,useContext, useEffect} from 'react';
import {Chart} from 'primereact/chart';
import {Grid, Paper} from '@material-ui/core';
import LoadData from './SubComponents/LoadData';
import {SelectContext} from '../../contexts/useSelectContext';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {ExpCompare, RevenueCompare, PLCompare, ExpenseGroup, PieChart, OccupPrcnt} from './SubComponents/charts';
import PannelData from './SubComponents/PannelData';
import { makeStyles } from '@material-ui/core/styles';
//import 'chartjs-plugin-datalabels';
import {idToItem /*,  addDataSettings  addData */, readDataPerPropertyDates, /*readDataDates,*/ readDataSlots,setID,setPmnt} from '../../functions/functions.js';
import useWindowSize from '../../hooks/useWindowSize';

import Rsrv from '../../logos/pics/balancedue.svg';
import pernight from '../../logos/pics/pernight.svg';
import Gross from '../../logos/pics/Gross.png';
import Income from '../../logos/pics/Inc.png';
import Expense from '../../logos/pics/Exp.png';
import {AuthContext} from '../../contexts/useAuthContext';

//import {obj} from './obj';
//

const daysInMonth =  (month, year) => { 
				return new Date(year, month, 0).getDate(); 
} 

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

const logos = [{txt: 'Occupancy Percentage', img: Rsrv, width:'50px'},
				 	{txt: 'Average Price Per Night', img: pernight, width:'50px'},
				 	{txt: 'Number of Bookings', img: Rsrv, width:'50px'},
			   		{txt: 'Gross P&L', img: Gross, width:'50px'},
			   		{txt: 'Revenue & Extra Revenue Before Vat', img: Income, width:'50px'},
			   		{txt: 'Expenses', img: Expense, width:'50px'},
				  ];

const dateFormat = require('dateformat');	


const Dashboard = () => {
	const scrSize = useWindowSize();

	const {date, propertySlct} = useContext(SelectContext);
	const [pnldata, setPnldata]=useState({OccupancyPercentage:null, AveragePrice:0, NumBookings:0, Profit: 0, ProfitPercentage:0, Expenses:0, Revenue:0, ChnPie:null,
										  RevCmpr:null, ExpCmpr: null, PLCmpr: null, Occpnc: null,  ExpensesGroup: null});
	const {settings, expOwner, loading, setLoading} = useContext(SettingsContext);
	const {uidCollection, admn} = useContext(AuthContext);

	let  cur = settings.length===0 ? "Currency" : settings.CompDtls.currency ;

	const useStyles = makeStyles(theme => ({
		root: {
			padding: scrSize==='xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
		},
		paper: {
		  padding: theme.spacing(1.5),
		  textAlign: 'left',
		  color: theme.palette.text.secondary,
		  height: '100%'
		},
		paddingSmall:{
		  padding: theme.spacing(2.6),
		  paddingTop: scrSize==='xs' ? theme.spacing(5) : theme.spacing(4),
	  	},
	 	paddingLoadData:{
			paddingTop: scrSize==='xs' && theme.spacing(3),
		}
	}));

	const classes = useStyles();

	useEffect(()=>{
		
		const runData = async()=>{
		setLoading(true)
	//	setSnackbar( {open: true, msg: "All charts don't include Vat", variant: 'warning'});
			let listDataRC; let listDataRCprevYr;
			let listDataEX;	let listDataEXprevYr;
			let listDataOi;	let listDataOiprevYr;
			let OccupCurrentYear = [];
			let OccupPrevYear = [];
		
			
			let apts = settings!=null ? settings.apartments.filter(x=> x.PrpName===propertySlct).map(q=> q.id) : [];

				if(propertySlct===null){ // Was decided not to load data in default not to confuse the user
					listDataRC = 		[] //admn ? await readDataDates(uidCollection, 'reservations', date.year, date.month) : [];
					listDataRCprevYr = 	[] //admn ? await readDataDates(uidCollection, 'reservations', date.year-1, date.month):[];
					listDataEX = 		[] //admn ? await readDataDates(uidCollection,  'expenses', date.year, date.month): [];
					listDataEXprevYr = 	[] //admn ? await readDataDates(uidCollection, 'expenses', date.year-1, date.month): [];
					listDataOi = 		[] //admn ? await readDataDates(uidCollection, 'otherIncome', date.year, date.month) : [];
					listDataOiprevYr = 	[] //admn ? await readDataDates(uidCollection, 'otherIncome', date.year-1, date.month):[];
				}else{
					listDataRC =		await readDataPerPropertyDates(uidCollection, 'reservations', propertySlct, date.year, date.month);
					listDataRCprevYr =	await readDataPerPropertyDates(uidCollection,'reservations', propertySlct, date.year-1, date.month);
					listDataEX = 		await readDataPerPropertyDates(uidCollection, 'expenses', propertySlct, date.year, date.month);
					listDataEXprevYr = 	await readDataPerPropertyDates(uidCollection, 'expenses', propertySlct, date.year-1, date.month);
					listDataOi = 		await readDataPerPropertyDates(uidCollection, 'otherIncome', propertySlct, date.year, date.month);
					listDataOiprevYr = 	await readDataPerPropertyDates(uidCollection,'otherIncome', propertySlct, date.year-1, date.month);
					for(let i in apts){
						let tmp =  await readDataSlots(uidCollection, 'slots', date.year, date.month, apts[i]);
						OccupCurrentYear = [...OccupCurrentYear, ...tmp.dates]
						
						tmp =  await readDataSlots(uidCollection, 'slots', date.year-1,  date.month, apts[i]);
						OccupPrevYear = [...OccupPrevYear, ...tmp.dates]
					}
				}

		
				let tmpRcDataDsh = [...listDataRC, ...listDataRCprevYr]
				let tmpExDataDsh = [...listDataEX, ...listDataEXprevYr]
				let tmpOtherIncDsh = [...listDataOi, ...listDataOiprevYr]
			
			let nightsNum=0;
			let reservs=0;
			let otherInc=0;
			let revenue=0;
			let expenses=0;
			
			let ChannelsListArray = [...new Set(tmpRcDataDsh.filter(y=> dateFormat(y.ChckIn,'yyyy')===date.year.toString())
												.map(x=> x.RsrvChn))].reduce((o, key) => ({ ...o, [key]: 0}), {});

			let MonthsRevenewCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let MonthsRevenewPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let MonthsOthIncCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let MonthsOthIncPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let MonthsExpCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let MonthsExpPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let PLCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let PLPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let OccpncPrcntgCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let OccpncPrcntgPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});	
	
			let ExpGroup = expOwner.reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			
				for(let i=0; i<tmpRcDataDsh.length;i++){
					
					
					if(dateFormat(tmpRcDataDsh[i].ChckIn,'yyyy')===date.year.toString()){
						nightsNum+= tmpRcDataDsh[i].NigthsNum;
						reservs+= (+tmpRcDataDsh[i].RsrvAmnt);
						revenue+= (+tmpRcDataDsh[i].TtlRsrvWthtoutVat);
						
						let chn = tmpRcDataDsh[i].RsrvChn;
						ChannelsListArray[chn] = +ChannelsListArray[chn] + +tmpRcDataDsh[i].TtlRsrvWthtoutVat;
					}
					
					let Mn = dateFormat(tmpRcDataDsh[i].ChckIn,'m'); //Revenue comparison graph
					if(	dateFormat(tmpRcDataDsh[i].ChckIn,'yyyy')===date.year.toString()	){
						MonthsRevenewCurrentYear[Mn] = +MonthsRevenewCurrentYear[Mn] + +(+tmpRcDataDsh[i].TtlRsrvWthtoutVat).toFixed(2);
					} else if(	dateFormat(tmpRcDataDsh[i].ChckIn,'yyyy')===(date.year-1).toString() ){
						MonthsRevenewPrevYear[Mn] = +MonthsRevenewPrevYear[Mn] + +(+tmpRcDataDsh[i].TtlRsrvWthtoutVat).toFixed(2);
				 	}
				}
			
				
				for(let i=0; i<tmpOtherIncDsh.length;i++){
					
					if(dateFormat(tmpOtherIncDsh[i].AccDate,'yyyy')===date.year.toString()){
						otherInc+= (+tmpOtherIncDsh[i].IncAmntWthtoutVat);
					}
				
					let Mn = dateFormat(tmpOtherIncDsh[i].AccDate,'m') //other Income comparison graph
					if(	dateFormat(tmpOtherIncDsh[i].AccDate,'yyyy')===date.year.toString()	){
						MonthsOthIncCurrentYear[Mn] = +MonthsOthIncCurrentYear[Mn] + +(+tmpOtherIncDsh[i].IncAmntWthtoutVat).toFixed(2);
					} else if(	dateFormat(tmpOtherIncDsh[i].AccDate,'yyyy')===(date.year-1).toString() ){
						MonthsOthIncPrevYear[Mn] = +MonthsOthIncPrevYear[Mn] + +(+tmpOtherIncDsh[i].IncAmntWthtoutVat).toFixed(2);
				 	}
				}
			
			
				for(let i=0; i<tmpExDataDsh.length;i++){
					if(dateFormat(tmpExDataDsh[i].AccDate,'yyyy')===date.year.toString()){
						expenses+= (+tmpExDataDsh[i].ExpAmntWthtoutVat);
					}
					
					let Mn = dateFormat(tmpExDataDsh[i].AccDate,'m'); //Expense comparison graph
					if(	dateFormat(tmpExDataDsh[i].AccDate,'yyyy')===date.year.toString()	){
						MonthsExpCurrentYear[Mn] = +MonthsExpCurrentYear[Mn] + +(+tmpExDataDsh[i].ExpAmntWthtoutVat).toFixed(2);
						
						let exFeeChannel = tmpExDataDsh[i].ExpType==='Channel advance commission'  //true or false
						let exFeeManagement = tmpExDataDsh[i].ExpType==='Management commission' //true or false
					
						let exGroup = (!exFeeChannel && !exFeeManagement) ? settings.exType==null? [] : settings.exType.filter(z=> z.id===tmpExDataDsh[i].ExpType)[0]['exGroup'] :
										exFeeChannel ? 'Taxes & Fees': 'Management Company Fee';
						ExpGroup[exGroup] = +ExpGroup[exGroup] + +(+tmpExDataDsh[i].ExpAmntWthtoutVat).toFixed(2);
						
						
					}else if(	dateFormat(tmpExDataDsh[i].AccDate,'yyyy')===(date.year-1).toString() ){
						MonthsExpPrevYear[Mn] = +MonthsExpPrevYear[Mn] + +(+tmpExDataDsh[i].ExpAmntWthtoutVat).toFixed(2);
				 	}
				}
	
				
				for (let i in OccupCurrentYear){
					let Mn = OccupCurrentYear[i].substring(2,4)*1
					OccpncPrcntgCurrentYear[Mn] = +OccpncPrcntgCurrentYear[Mn] + 1;  //calculate occupancy
				}
			
				for (let i in OccupPrevYear){
					let Mn = OccupPrevYear[i].substring(2,4)*1
					OccpncPrcntgPrevYear[Mn] = +OccpncPrcntgPrevYear[Mn] + 1;  //calculate occupancy
				}
				
				for (let i = 1; i <=12 ; i++) {
				  	PLCurrentYear[i] = MonthsRevenewCurrentYear[i] + MonthsOthIncCurrentYear[i] - MonthsExpCurrentYear[i];
					PLPrevYear[i] = MonthsRevenewPrevYear[i] + MonthsOthIncPrevYear[i] - MonthsExpPrevYear[i];
			
					OccpncPrcntgCurrentYear[i] = propertySlct!==null ?  (OccpncPrcntgCurrentYear[i]/(daysInMonth(i, date.year)*apts.length)*100).toFixed(2):[] 
					OccpncPrcntgCurrentYear[i] = isNaN(OccpncPrcntgCurrentYear[i]) ? 0 : OccpncPrcntgCurrentYear[i];
					
					OccpncPrcntgPrevYear[i] = propertySlct!==null ? (OccpncPrcntgPrevYear[i]/(daysInMonth(i, date.year)*apts.length)*100).toFixed(2):[]	
					OccpncPrcntgPrevYear[i] = isNaN(OccpncPrcntgPrevYear[i]) ? 0 : OccpncPrcntgPrevYear[i];
				}
				
				

			let AveragePrice = reservs!==0 ?addCommas(reservs/nightsNum): 0;

			let ProfitPercentage = (revenue===0 && otherInc===0) ? 0 : ((revenue + otherInc - expenses)/(revenue+otherInc)*100).toFixed(2);
			let Profit = (revenue===0 && otherInc===0) ? 0 : (revenue + otherInc - expenses).toFixed(2);

			ProfitPercentage = isNaN(ProfitPercentage) ? 0 : ProfitPercentage;
			Profit = isNaN(Profit) ? 0 : addCommas(Profit);

			revenue = revenue!==0 ? revenue: 0;
			otherInc = otherInc!==0 ? otherInc: 0;
			expenses = expenses!==0 ? addCommas(expenses): 0;

		
			let tmpObj={}; //show real channels names instead of id's
			for (let k of Object.keys(ChannelsListArray)) {
   					 tmpObj = {...tmpObj, [ idToItem(settings.channels, k, 'RsrvChn') ]: ChannelsListArray[k]}
				}

				
			setPnldata({OccupancyPercentage:OccupPrcnt(OccpncPrcntgCurrentYear, OccpncPrcntgPrevYear, date ).obj,  AveragePrice:AveragePrice,
						Profit: Profit, ProfitPercentage: ProfitPercentage,
						Expenses: expenses, Revenue:addCommas(revenue + otherInc),
						ExpCmpr: ExpCompare(MonthsExpCurrentYear, MonthsExpPrevYear, date).obj,
						RevCmpr: RevenueCompare(MonthsRevenewCurrentYear ,MonthsRevenewPrevYear, MonthsOthIncCurrentYear, MonthsOthIncPrevYear, date ).obj,
						PLCmpr: PLCompare(PLCurrentYear,PLPrevYear, date).obj,
						ExpensesGroup: ExpenseGroup(expOwner, ExpGroup, 1).obj,
						ChnPie:PieChart(tmpObj, '').obj, /*Occpnc: Occupancy, */
				});

			setLoading(false);
		}

		runData();

	},[  date, settings , uidCollection, expOwner,admn, propertySlct, setLoading])
	
	const runAA=async()=>{
		console.log('start run Id')
	//await	setID(uidCollection, 'vatcalCompany_2021')
	
	//await setPmnt(uidCollection, 'vatcalCompany_2021', settings, 'paymentsCompany')
		
   
	}

	
	return (
	<div className={classes.paddingLoadData}>
		
		<LoadData flx={scrSize==='xs' ? 'center' : 'flex-end' }	/>   
		<div className={classes.paddingSmall}>
			<Grid container spacing={7} justifyContent="space-between"  >  
				<PannelData txt={logos[1].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.AveragePrice}` } img={logos[1]} prc='' />
				<PannelData txt={logos[3].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.Profit}` } img={logos[3]} prc={`${addCommas(pnldata.ProfitPercentage)} %`}/>
				<PannelData txt={logos[4].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.Revenue}` } img={logos[4]}	 prc='' />
				<PannelData txt={logos[5].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.Expenses}` } img={logos[5]}	 prc='' />
		  	</Grid>
		</div>  

			<Grid container spacing={2} justifyContent="space-around"  style={{paddingTop: '16px' }}>   
				<Grid item xs={12} sm={4}  >
					<Paper className={classes.paper}>
          				<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.PLCmpr} options={PLCompare('','','', cur).options}/>
					</Paper>
		  		</Grid>
				<Grid item xs={12} sm={4} >
					<Paper className={classes.paper}>
          				<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.RevCmpr} options={RevenueCompare('','','','','', cur).options}/>
					</Paper>
		  		</Grid>
				<Grid item xs={12} sm={4} >
					<Paper className={classes.paper}>
	 					<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.ExpCmpr} options={ExpCompare('','','', cur).options} /> 
					</Paper>
		  		</Grid>
				
		  	</Grid>
			
			<Grid container spacing={2} justifyContent="space-around" style={{paddingTop: '8px'}}>
			 	<Grid item xs={12} sm={4} >
					<Paper className={classes.paper}>
          				<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.ExpensesGroup} options={ExpenseGroup(expOwner,'','', cur).options}/>
					</Paper>
		  		</Grid>
				<Grid item xs={12} sm={4} >
					<Paper className={classes.paper}>
          				<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.OccupancyPercentage} options={OccupPrcnt('','','').options}/>
					</Paper>
		  		</Grid>  
				<Grid item xs={12} sm={4}  >
					<Paper className={classes.paper}>
          				<Chart type="doughnut" style={{minHeight:'250px', height:'20vh', width:'50vh'}} data={loading ?{}:pnldata.ChnPie} options={PieChart('','Reservations Per Channel').options}/>
					</Paper>
		  		</Grid>
		  	</Grid>
						<button style={{width: '50px', height: '50px'}}onClick={runAA}></button>
	</div>
	)
	
}

export default Dashboard;

		
/*
		const uploadDataSettings = async(uidCollection) =>{
			
			let sets = obj
		
			console.log(	sets.owners	);
		
			
			await addDataSettings(uidCollection,'settings',  'owners', {owners:	sets.owners}	)
		
			await addDataSettings(uidCollection,'settings',  'funds',{funds:sets.funds})
		
			await addDataSettings(uidCollection,'settings',  'properties',{properties:sets.properties})
			
			await addDataSettings(uidCollection,'settings',  'apartments',{apartments:sets.apartments})
			
			await addDataSettings(uidCollection,'settings',  'channels', {channels: sets.channels})
			
			await addDataSettings(uidCollection,'settings',  'exType', {exType: sets.exType})
			
			// set manually CompanyDetails and Vat
			
			await addDataSettings(uidCollection,'settings',  'exTypeCompany', {exTypeCompany : sets.exTypeCompany})
			
			await addDataSettings(uidCollection,'settings',  'incType', {incType:  sets.incType 	})
			
			await addDataSettings(uidCollection,'settings',  'incTypeCompany', {incTypeCompany:sets.incTypeCompany	})
			
			await addDataSettings(uidCollection,'settings',  'pmntMethods', {pmntMethods:sets.pmntMethods	})
		}


		const uploadData = async(uidCollection) =>{
		
		console.log(obj)	
		
	/*	let zz = obj.expensesCompany_2021
		for(let i in zz){await addData(uidCollection, 'expensesCompany', dateFormat(zz[i].AccDate, 'yyyy'), zz[i] )	} 
		
		let zz = obj.cashflowCompany_2021
		for(let i in zz){await addData(uidCollection, 'cashflowCompany', dateFormat(zz[i].TransactionDate, 'yyyy'), zz[i])} 
		
		let zz = obj.cashflow_2021
		for(let i in zz){await addData(uidCollection, 'cashflow', dateFormat(zz[i].TransactionDate, 'yyyy'), zz[i])	} 
		
		let zz = obj.expenses_2021
		for(let i in zz){await addData(uidCollection, 'expenses', dateFormat(zz[i].AccDate, 'yyyy'), zz[i] )} 
		
		let zz = obj.incomeCompany_2021
		for(let i in zz){
				let dt = zz[i].Transaction.substring(zz[i].Transaction.length-4, zz[i].Transaction.length).toString();
				await addData(uidCollection, 'incomeCompany', dt, zz[i])
		} 
		
		let zz = obj.otherIncomeCompany_2021
		for(let i in zz){
			await addData(uidCollection, 'otherIncomeCompany', dateFormat(zz[i].AccDate, 'yyyy'), zz[i])
		}  
		
		let zz = obj.otherIncome_2021
		for(let i in zz){await addData(uidCollection, 'otherIncome', dateFormat(zz[i].AccDate, 'yyyy'), zz[i])	} 
		
		let zz = obj.reservations_2021
		for(let i in zz){await addData(uidCollection, 'reservations', dateFormat(zz[i].ChckIn, 'yyyy'), zz[i])	} 
		
		let zz = obj.vatcalCompany_2021
		for(let i in zz){await addData(uidCollection, 'vatcalCompany',  dateFormat(zz[i].From, 'yyyy'), zz[i])	} 
		
		
		let zz = obj.vatcal_2021
		for(let i in zz){await addData(uidCollection, 'vatcal',  dateFormat(zz[i].From, 'yyyy'), zz[i])	} */
		
		
		
		
		
			
			
			
	//} 
			
			
	
