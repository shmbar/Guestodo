import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper,Grid}  from '@material-ui/core';
import Table from './table/Table';
import PannelData from '../Subcomponents/PannelData';
import {ExContext} from '../../contexts/useExContext';
//import Exp from '../../logos/Exp.png';
import {readDataDates, getUnique, idToItem} from '../../functions/functions';
import Exp from '../../logos/pics/Exp.png';
import balancedue from '../../logos/pics/balancedue.svg';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import {SelectContext} from '../../contexts/useSelectContext';
import {AuthContext} from '../../contexts/useAuthContext';
import useWindowSize from '../../hooks/useWindowSize';

import MonthSelect from '../Subcomponents/MonthSelect';

const logos = [{txt: 'Variable Expenses', img: Exp, width:'50px'},
				 	{txt: 'balancedue', img: balancedue, width:'50px'}
				  ];
const dateFormat = require('dateformat');

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

export default function PaperSheet() {
  
	const scrSize = useWindowSize();
	const {exDataC, setExDataC} = useContext(ExContext);
	const [dataTable, setDataTable]= useState([]);
	const [pnldata, setPnldata]=useState({totalExp:0, blnc:0});
	const {setLoading, settings} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
	const {uidCollection} = useContext(AuthContext);
	
	const useStyles = makeStyles(theme => ({
		root: {
		  padding: scrSize==='xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
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

	const prepareTreeTable = (listDataEX, settings) =>{
		
	let exDataTmp = listDataEX.map(x=> ({...x, 'tmpCol': dateFormat(x.AccDate, "mmm-yyyy")
						   .concat(x.vendor).concat(x.ExpType),'ExpType':  	idToItem(settings.exTypeCompany, x.ExpType, 'item' ),
							'vendor':  x.vendor, Amnt: +x.Amnt})).filter(x=> +x.Amnt!==0)  //omit the commissions with amount===0	

////////////////////////////////////////////////////////////
	const sumVals = (val) =>{
		
		let tmpD = {'Amnt': 0, 'ExpAmntWthtoutVat': 0,'BlncExp': '', 'TtlPmnt': 0, 'VatAmnt': 0};
		
	
		tmpD.LstSave = '';
		tmpD.ExpType = val.ExpType;
		tmpD.vendor = val.vendor;
		tmpD.Transaction = '';
		tmpD.AccDate = val.AccDate;

		
		for(let z in exDataTmp){ //sum amount per property and date
		
			if(exDataTmp[z].tmpCol===val.tmpCol){
			
				tmpD.Amnt =  +tmpD.Amnt + +exDataTmp[z].Amnt*1;
				tmpD.ExpAmntWthtoutVat =  +tmpD.ExpAmntWthtoutVat + +exDataTmp[z].ExpAmntWthtoutVat;
				tmpD.BlncExp =  +tmpD.BlncExp + +exDataTmp[z].BlncExp;
				tmpD.TtlPmnt = +tmpD.TtlPmnt + +exDataTmp[z].TtlPmnt;
				tmpD.VatAmnt = +tmpD.VatAmnt + +exDataTmp[z].VatAmnt;   
			}
		}
		
		// let tmp = pmnts.filter(x => x.key === val.PrpName.concat(dateFormat(val.AccDate, "mmm-yyyy")) )[0];
		 // let TotalPmnt = (val.ExpType==='Management commission' &&  tmp!=null) ? tmp['val'] : null;

		 // tmpD.TtlPmnt = TotalPmnt!==null ? TotalPmnt : tmpD.TtlPmnt
		 // tmpD.BlncExp =  TotalPmnt!==null ? (tmpD.Amnt - TotalPmnt) : tmpD.BlncExp
	
		return 	tmpD;
	}
	///////////////////////////////////////////////
	const addVals = (val) =>{	
		let tmp = exDataTmp.map(x=>  x);
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
	
	useEffect(() => {
		
		const loadData=async()=>{
			setLoading(true);
	
				let listDataEXCompany = await readDataDates(uidCollection, 'expensesCompany', date.year, date.month);
			
				listDataEXCompany = listDataEXCompany.map(x=> ({...x, 'tmpCol': dateFormat(x.AccDate, "mmm-yyyy")
				   .concat(x.vendor).concat(x.ExpType)	}))
		
				setExDataC(listDataEXCompany);
			
				let newArrTmp = prepareTreeTable(listDataEXCompany,settings)
				setDataTable(newArrTmp);
			
			
			setLoading(false);
	
		}			
		loadData();
		
  },[setExDataC, setLoading, date,  uidCollection, settings]);

  useEffect(() => {
	
	let newArrTmp = prepareTreeTable(exDataC, settings)
	setDataTable(newArrTmp);
	  
	let Total=0;
	let Blnc=0;
	
	for(let i=0; i<newArrTmp.length;i++){
		Total+= (+newArrTmp[i].data.Amnt);
		Blnc+= (+newArrTmp[i].data.BlncExp);  
	}
	setPnldata({totalExp:addCommas(Total),
			blnc:addCommas(Blnc)}	);

},[exDataC, settings]);
	
	
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
						<h4 className='ttlClr'>Company Expenses</h4>
					</Grid>	
					<Grid item sm={9} >
						<Grid container  spacing={2} justifyContent="flex-end"  alignItems="center" style={{margin:"auto"}}>
							<Grid item >
								<MonthSelect allMonths={true}/>
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
	<Table  dataTable={dataTable}/>
*/
