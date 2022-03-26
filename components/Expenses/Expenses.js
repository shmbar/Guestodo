import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import {ExContext} from '../../contexts/useExContext';
import {getUnique, idToItem, readDataPerPropertyDates,readData} from '../../functions/functions.js';
import {SelectContext} from '../../contexts/useSelectContext';
import {AuthContext} from '../../contexts/useAuthContext';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import Exp from '../../logos/pics/Exp.png';
import balancedue from '../../logos/pics/balancedue.svg';
import MonthSelect from '../Subcomponents/MonthSelect';
import useWindowSize from '../../hooks/useWindowSize';

const logos = [{txt: 'Variable Expenses', img: Exp, width:'50px'},
				 	{txt: 'balancedue', img: balancedue, width:'50px'}
				  ];

const dateFormat = require('dateformat');	

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

const prepareTreeTable = (listDataEX,pmnts, settings) =>{
	let exDataTmp = listDataEX.map(x=> ({...x, 'tmpCol': x.PrpName.concat(dateFormat(x.AccDate,
					"mmm-yyyy")).concat(x.vendor).concat(x.ExpType),
				'AptName' :  x.AptName!=='All'? settings.apartments.filter(y=> 
				y.id===x.AptName)[0]['AptName'] : x.AptName,
				'ExpType': (x.ExpType==='Channel advance commission' ||
				x.ExpType==='Management commission') ? x.ExpType:
				idToItem(settings.exType, x.ExpType, 'item' ),
				'vendor': (x.ExpType!=='Channel advance commission') ? x.vendor :	
				idToItem(settings.channels, x.vendor, 'RsrvChn'),
				Amnt: +x.Amnt, ExpAmntWthtoutVat: +x.ExpAmntWthtoutVat, TtlPmnt:+x.TtlPmnt}))
				.filter(x=> (x.ExpType!=='Management commission' || +x.Amnt!==0)) 
			//omit the commissions with amount===0	
	

	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	const sumVals = (val) =>{
		
		let tmpD = {'Amnt': 0, 'ExpAmntWthtoutVat': 0,'BlncExp': '', 'TtlPmnt': 0, 'VatAmnt': 0, CleanAmount: 0, ExpAmnt:0};
		
	
		tmpD.LstSave = '';
		tmpD.ExpType = val.ExpType;
		tmpD.vendor = val.vendor;
		tmpD.Transaction = '';
		tmpD.AccDate = val.AccDate;
		tmpD.AptName = '';
		
		
		
		for(let z in exDataTmp){ //sum amount per property and date
		
			if(exDataTmp[z].tmpCol===val.tmpCol){
			
				tmpD.Amnt =  +tmpD.Amnt + +exDataTmp[z].Amnt;
				tmpD.ExpAmntWthtoutVat =  +tmpD.ExpAmntWthtoutVat + +exDataTmp[z].ExpAmntWthtoutVat;
				tmpD.BlncExp =  +tmpD.BlncExp + +exDataTmp[z].BlncExp;
				tmpD.TtlPmnt = +tmpD.TtlPmnt + +exDataTmp[z].TtlPmnt;
				tmpD.VatAmnt = +tmpD.VatAmnt + +exDataTmp[z].VatAmnt;   
				
				if(exDataTmp[z].ExpType==='Management commission' && exDataTmp[z].CleanAmount!=null){
					tmpD.CleanAmount =  +tmpD.CleanAmount + +exDataTmp[z].CleanAmount;
					tmpD.ExpAmnt =  +tmpD.ExpAmnt + +exDataTmp[z].ExpAmnt;
					
				}else{
					tmpD.CleanAmount='';
					tmpD.ExpAmnt='';
				}
			}
		}
		
		 let tmp = pmnts.filter(x => x.key === val.PrpName.concat(dateFormat(val.AccDate, "mmm-yyyy")) )[0];
		 let TotalPmnt = (val.ExpType==='Management commission' &&  tmp!=null) ? tmp['val'] : null;

		 tmpD.TtlPmnt = TotalPmnt!==null ? TotalPmnt : tmpD.TtlPmnt
		 tmpD.BlncExp =  TotalPmnt!==null ? (tmpD.Amnt - TotalPmnt) : tmpD.BlncExp
		
		
		return 	tmpD;
	}
	///////////////////////////////////////////////
	const addVals = (val) =>{	
		let tmp = exDataTmp.map(x=> x.ExpType==="Management commission" ? ({...x, 'TtlPmnt': '', 'BlncExp': ''}) : x);
		tmp = tmp.filter(c=> c.tmpCol===val.tmpCol).map((x,i)=> ({'key': i, 'data': x }));
		tmp = tmp.map(x=> { delete x.data.tmpCol
						return	x; })		
		return tmp;	 
	}
	
	///////////////////////////////////////////////
	let tmpNewArr = getUnique(exDataTmp,'tmpCol'); //sorting duplicates

	let newArr = tmpNewArr.map((x,i)=>({'key': x.tmpCol, 'data': sumVals(x), 'children' : addVals(x) }));
	return newArr;
}



export default function PaperSheet() {
	
  	const scrSize = useWindowSize();
	const {setExDataPrp, exDataPrp} = useContext(ExContext);
	const [dataTable, setDataTable]= useState([]);
	const [pnldata, setPnldata]=useState({totalExp:0, blnc:0});
	const {date,propertySlct} = useContext(SelectContext);
	const {uidCollection} = useContext(AuthContext);
	const {settings, setLoading} = useContext(SettingsContext);
	
	const useStyles = makeStyles(theme => ({
		root: {
		  padding: scrSize==='xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
		},
		  pd:{
			  paddingLeft: '0px!important',
			  paddingRight: '0px!important',
		  },
		paddingSmall:{
			padding: theme.spacing(2.8),
			paddingTop: scrSize==='xs' ? theme.spacing(5) : theme.spacing(4),
		},
	  }));

	const classes = useStyles();
	
	useEffect(() => {

	const setData=async()=>{	

		setLoading(true);

		let listDataEX = await readDataPerPropertyDates(uidCollection, 'expenses', propertySlct, date.year, date.month);
			
			listDataEX = listDataEX.map(x=> ({...x, 'tmpCol': x.PrpName.concat(dateFormat(x.AccDate, "mmm-yyyy"))
					   .concat(x.vendor).concat(x.ExpType)
						})).filter(x=> (x.ExpType!=='Management commission' || +x.Amnt!==0))  //omit the commissions with amount===0
		
			let tmpNewArr = getUnique(listDataEX,'tmpCol'); //sorting duplicates
		
			let pmnts=[];  // downloading the management fees

				for(let x in tmpNewArr){
					if(tmpNewArr[x].ExpType=== "Management commission"){
						const tmpColumn = tmpNewArr[x].PrpName.concat(dateFormat(tmpNewArr[x].AccDate, "mmm-yyyy"))   
						const tmpData =  await readData(uidCollection, 'incomeCompany', date.year , tmpColumn);
						if(tmpData!=null)pmnts.push({ 'key' : tmpColumn, 'val' : tmpData.Payments.map(x=> +(+x.P).toFixed(2))
													  .filter(x=> x>0).reduce((a, b) => a + b, 0) })
					}
				}
			
			setExDataPrp({'exData': listDataEX, 'pmnts':pmnts});

	////////////////////////////////////////////////
		let newArrTmp = prepareTreeTable(listDataEX,pmnts, settings)
		setDataTable(newArrTmp);
		setLoading(false);
	}	

	propertySlct!=null && setData()
		
  },[uidCollection, settings, setLoading, propertySlct, date, setExDataPrp ]);

  
useEffect(() => {

		let newArrTmp = prepareTreeTable(exDataPrp.exData,exDataPrp.pmnts, settings)
		setDataTable(newArrTmp);
		
		let Exp=0;
		let Blnc=0;

		if(newArrTmp.length){
			for(let i=0; i<newArrTmp.length;i++){
				Exp+= (+newArrTmp[i].data.Amnt) ;
				Blnc+= (+newArrTmp[i].data.BlncExp);
			}
		}
		setPnldata({totalExp:addCommas(Exp), blnc:addCommas(Blnc)}	);
		
  },[exDataPrp, settings ]);
	
  return (
	  <>
		  <div className={classes.paddingSmall}>
			  <Grid container spacing={7} justifyContent="space-evenly"  >  
				 <PannelData  clsNum='1' txt='Total Expenses Amount' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					 num={pnldata.totalExp} img={logos[0]}/>
				 <PannelData  clsNum='2'  txt='Balance Due' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
					 num={pnldata.blnc} img={logos[1]}/>

			  </Grid>  
		  </div>
	  
      	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root}>
				
				<Grid  container  spacing={2}>
				 	<Grid item sm={3}>
						<h4 className='ttlClr'>Expenses</h4>
					</Grid>
					<Grid item sm={9}>
						<Grid container  spacing={2} justifyContent="flex-end"  alignItems="center" style={{margin:"auto"}}>
							<Grid item  >
								<MonthSelect allMonths={true} />
							</Grid>
						</Grid>
					</Grid>
				</Grid>	
				 
					<div>
						<Table  dataTable={dataTable}/>
					</div>
			
		  	</Paper>
		</div>	 
	  </>
  );
}

/*
	 <div className='moshe'>
					  <img src={Exp} alt='Expenses' width='25px' />
				  </div>
*/