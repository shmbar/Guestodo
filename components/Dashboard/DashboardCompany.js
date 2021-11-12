import React , {useState,useContext, useEffect} from 'react';
import {Chart} from 'primereact/chart';
import {Grid, Paper} from '@material-ui/core';
import LoadData from './SubComponents/LoadData';
import {ExpCompare, RevenueCompare, PLCompare, ExpenseGroup, PieChart} from './SubComponents/charts';
import {SelectContext} from '../../contexts/useSelectContext';
import {SettingsContext} from '../../contexts/useSettingsContext';
import PannelData from './SubComponents/PannelData';
import { makeStyles } from '@material-ui/core/styles';
//import 'chartjs-plugin-datalabels';
import Lists from './listOfItems/Lists';
import {readDataDashbordCompany,readDataDates,  readDatSettings, idToItem /*, addDataSettings, addData*/} from '../../functions/functions.js';
import useWindowSize from '../../hooks/useWindowSize';

import Rsrv from '../../logos/pics/balancedue.svg';
import pernight from '../../logos/pics/pernight.svg';
import Gross from '../../logos/pics/Gross.png';
import Income from '../../logos/pics/Inc.png';
import Expense from '../../logos/pics/Exp.png';
import {AuthContext} from '../../contexts/useAuthContext';
//import {obj} from './obj';

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

const logos = [{txt: 'Occupancy Percentage', img: Rsrv, width:'50px'},
				 	{txt: 'Average Price Per Night', img: pernight, width:'50px'},
				 	{txt: 'Number of Bookings', img: Rsrv, width:'50px'},
			   		{txt: 'Gross P&L', img: Gross, width:'50px'},
			   		{txt: 'Commissions and Extra Revenue', img: Income, width:'50px'},
			   		{txt: 'Expenses', img: Expense, width:'50px'},
				  ];

const dateFormat = require('dateformat');	


const DashboardCompany = () => {
	const scrSize = useWindowSize();

	const {date} = useContext(SelectContext);
	const [pnldata, setPnldata]=useState({Profit: 0, ProfitPercentage:0, Expenses:0, Revenue:0, ChnPie:null,
										  RevCmpr:null, ExpCmpr: null, PLCmpr: null, ExpensesGroup: null});
	const [tasks, setTasks] = useState([]);
	const {settings, setLoading, expCompany, loading } = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);
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
			
			setLoading(true);
			
		
				let listDataCommssion = await readDataDashbordCompany(uidCollection,'expenses', date.year, date.month );
				let listDataCommssionprevYr = await readDataDashbordCompany(uidCollection,'expenses', date.year-1, date.month );
				let cmsn = [...listDataCommssion, ...listDataCommssionprevYr]
				
			
				let listDataOI = await readDataDates(uidCollection,'otherIncomeCompany', date.year, date.month );
				let listDataOIprevYr = await readDataDates(uidCollection,'otherIncomeCompany', date.year-1, date.month );
				let oi = [...listDataOI, ...listDataOIprevYr]
			

				let listDataEX =  await readDataDates(uidCollection,  'expensesCompany', date.year, date.month);
				let listDataEXprevYr =  await readDataDates(uidCollection, 'expensesCompany', date.year-1, date.month);
				let exp = [...listDataEX, ...listDataEXprevYr]
			
				let listTasks = await readDatSettings(uidCollection, 'tasks');
				setTasks(listTasks.length ? listTasks[0]['tasks'] : []);
			
		
			console.log('run once')
			setLoading(false);
		
	
			
			let commission=0;
			let otherInc=0;
			let expenses=0;

			let propertiessArray = [...new Set(listDataCommssion.map(y=>y.PrpName))].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
															   let MonthsCmsnCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let MonthsCmsnPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let MonthsOthIncCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let MonthsOthIncPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let MonthsExpCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let MonthsExpPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let PLCurrentYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			let PLPrevYear=['1','2','3','4','5','6','7','8','9','10','11','12'].reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			let ExpGroup = expCompany.reduce((o, key) => ({ ...o, [key]: 0}), {});
			
			
				for(let i=0; i<cmsn.length;i++){
					
					if(dateFormat(cmsn[i].AccDate,'yyyy')===date.year.toString()){
						
						commission+= (+cmsn[i].ExpAmntWthtoutVat);
						
						let tmpPrpName = cmsn[i].PrpName;
						propertiessArray[tmpPrpName] = +propertiessArray[tmpPrpName] + +cmsn[i].ExpAmntWthtoutVat;
					}
				
					let Mn = dateFormat(cmsn[i].AccDate,'m'); //Revenue comparison graph
					if(	dateFormat(cmsn[i].AccDate,'yyyy')===date.year.toString()	){
						MonthsCmsnCurrentYear[Mn] = +MonthsCmsnCurrentYear[Mn] + +(+cmsn[i].ExpAmntWthtoutVat).toFixed(2);
					} else if(	dateFormat(cmsn[i].AccDate,'yyyy')===(date.year-1).toString() ){
						MonthsCmsnPrevYear[Mn] = +MonthsCmsnPrevYear[Mn] + +(+cmsn[i].ExpAmntWthtoutVat).toFixed(2);
				 	}
				}
			
				for(let i=0; i<oi.length;i++){
					
					if(dateFormat(oi[i].AccDate,'yyyy')===date.year.toString()){
						otherInc+= (+oi[i].IncAmntWthtoutVat);
					}
				
					let Mn = dateFormat(oi[i].AccDate,'m') //other Income comparison graph
					if(	dateFormat(oi[i].AccDate,'yyyy')===date.year.toString()	){
						MonthsOthIncCurrentYear[Mn] = +MonthsOthIncCurrentYear[Mn] + +(+oi[i].IncAmntWthtoutVat).toFixed(2);
					} else if(	dateFormat(oi[i].AccDate,'yyyy')===(date.year-1).toString() ){
						MonthsOthIncPrevYear[Mn] = +MonthsOthIncPrevYear[Mn] + +(+oi[i].IncAmntWthtoutVat).toFixed(2);
				 	}
				}
			
			
				for(let i=0; i<exp.length;i++){
					if(dateFormat(exp[i].AccDate,'yyyy')===date.year.toString()){
						expenses+= (+exp[i].ExpAmntWthtoutVat);
					}
					
					let Mn = dateFormat(exp[i].AccDate,'m'); //Expense comparison graph
					if(	dateFormat(exp[i].AccDate,'yyyy')===date.year.toString()	){
						MonthsExpCurrentYear[Mn] = +MonthsExpCurrentYear[Mn] + +(+exp[i].ExpAmntWthtoutVat).toFixed(2);
					
						let exGroup = settings.exTypeCompany.filter(z=> z.id===exp[i].ExpType)[0]['exGroup'];
						ExpGroup[exGroup] = +ExpGroup[exGroup] + +(+exp[i].ExpAmntWthtoutVat).toFixed(2);
						
					}else if(	dateFormat(exp[i].AccDate,'yyyy')===(date.year-1).toString() ){
						MonthsExpPrevYear[Mn] = +MonthsExpPrevYear[Mn] + +(+exp[i].ExpAmntWthtoutVat).toFixed(2);
				 	}
				
				}
			
			
				for (let i = 1; i <=12 ; i++) {
				  	PLCurrentYear[i] = MonthsCmsnCurrentYear[i] + MonthsOthIncCurrentYear[i] - MonthsExpCurrentYear[i];
					PLPrevYear[i] = MonthsCmsnPrevYear[i] + MonthsOthIncPrevYear[i] - MonthsExpPrevYear[i];
				
				}
		
			let ProfitPercentage = (commission===0 && otherInc===0) ? 0 : ((commission + otherInc - expenses)/(commission+otherInc)*100).toFixed(2);
			let Profit = (commission===0 && otherInc===0) ? 0 : (commission + otherInc - expenses).toFixed(2);

			ProfitPercentage = isNaN(ProfitPercentage) ? 0 : ProfitPercentage;
			Profit = isNaN(Profit) ? 0 : addCommas(Profit);

			commission = commission!==0 ? commission: 0;
			otherInc = otherInc!==0 ? otherInc: 0;
			expenses = expenses!==0 ? addCommas(expenses): 0;

			
			let tmpObjOwners={}; //show real owners names instead of id's
			for (let val of Object.keys(propertiessArray)) {
				let tmpOwnerID = settings.properties.filter(x=> x.id===val)[0]['Owner'];
				tmpObjOwners = {...tmpObjOwners, [ idToItem(settings.owners, tmpOwnerID, 'item') ]: propertiessArray[val]}
			}
			

			setPnldata({Profit: Profit, ProfitPercentage: ProfitPercentage,
						Expenses: expenses, Revenue:addCommas(commission + otherInc),
						ExpCmpr: ExpCompare(MonthsExpCurrentYear, MonthsExpPrevYear, date).obj,
						RevCmpr: RevenueCompare(MonthsCmsnCurrentYear ,MonthsCmsnPrevYear, MonthsOthIncCurrentYear, MonthsOthIncPrevYear, date ).obj,
						PLCmpr: PLCompare(PLCurrentYear,PLPrevYear, date).obj,
						ExpensesGroup: ExpenseGroup(expCompany, ExpGroup, 2).obj,
						ChnPie:PieChart(tmpObjOwners, '').obj,
					  });
		}

		runData();
	},[date, settings , uidCollection, expCompany, setLoading])
	
	
	return (
	<div className={classes.paddingLoadData}>
		
		<LoadData flx={scrSize==='xs' ? 'center' : 'flex-end' }	/>  
		<div className={classes.paddingSmall}>
			<Grid container spacing={7} justifyContent="space-between"  >  
				<PannelData txt={logos[3].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.Profit}` } img={logos[3]} prc={`${addCommas(pnldata.ProfitPercentage)} %`}/>
				<PannelData txt={logos[4].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.Revenue}` } img={logos[4]}	 prc='' />
				<PannelData txt={logos[5].txt} ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					num={`${pnldata.Expenses}` } img={logos[5]}	 prc='' />
		  	</Grid>
		</div>   
		  
			<Grid container spacing={2} justifyContent="space-around"  style={{paddingTop: '16px'}}>  
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
          				<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.ExpCmpr} options={ExpCompare('','','', cur).options}/>
					</Paper>
		  		</Grid>
		  	</Grid>
			
			<Grid container spacing={2} justifyContent="space-around" style={{paddingTop: '8px'}}>
			 	<Grid item xs={12} sm={7} >
					<Paper className={classes.paper}>
          				<Chart type="bar" style={{minHeight:'240px'}} data={loading ?{}:pnldata.ExpensesGroup} options={ExpenseGroup(expCompany,'','', cur).options}/>
					</Paper>
		  		</Grid>
				 <Grid item xs={12} sm={5}  >
					<Paper className={classes.paper}>
          				<Chart type="doughnut" style={{minHeight:'250px'}} data={loading ?{}:pnldata.ChnPie} options={PieChart('','Revenue Per Owner').options}/>
					</Paper>
		  		</Grid>
		  	</Grid> 
			
			<Grid container spacing={2} className={classes.gr} style={{paddingTop: '8px'}}>
				<Grid item xs={12} md={7}  > 
						<Lists list={tasks} />
				</Grid>
				
     		</Grid>
			
			
	</div>
	)
	
	
}

export default DashboardCompany;

