import React, {useState, useEffect, useContext}  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import {convId2Item, readDataCashFlow, readDataMoneyTransferforCashFlow, addCommas} from '../../functions/functions';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import {AuthContext} from '../../contexts/useAuthContext';
import useWindowSize from '../../hooks/useWindowSize';

import Income from '../../logos/pics/Income.png';
import Expense from '../../logos/pics/Expense.png';
import {setBalance, EX,OI,CF,VT,MngPmnt} from '../CashFlowTable/funcs'
import DatePicker from '../Subcomponents/rangeDatePicker';

const dateFormat = require('dateformat');


const logos = [	 	{txt: 'Income', img: Income, width:'50px'},
				 	{txt: 'Expense', img: Expense, width:'50px'},
				  ];


const PaperSheet = () =>{
  
	const scrSize = useWindowSize();
	const [pnldata, setPnldata]=useState({cost:0, receiving:0});
	const {setLoading, settings, cshFlowTableCompany, setCshFlowTableCompany} = useContext(SettingsContext);
	//cshFlowTableCompany, setCshFlowTableCompany to run once, save reads
	const {uidCollection} = useContext(AuthContext);
	const [dates, setDates] = useState({start:null, end: null})

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

	useEffect(() => {
		
		const loadData=async()=>{
			setLoading(true);
			
			let AgrArr = [];
			let tableArr=[];
			
				for (var i = dateFormat(dates.start, 'yyyy'); i <= dateFormat(dates.end, 'yyyy'); i++) {
					
					 let tmpPayments =  await readDataCashFlow(uidCollection, 'paymentsCompany',null, i, dates.start, dates.end) //fund=null
					 let tmpMoneyTransfer =  await readDataMoneyTransferforCashFlow(uidCollection, 'cashflowCompany', null, i, dates.start, dates.end) 
					  
					 AgrArr = [...AgrArr, ...tmpPayments, ...tmpMoneyTransfer];
				}
			
				for(let i in AgrArr){
					let ent = AgrArr[i].Transaction.substring(0,2);
					let tmp;
					
					if(ent==='EX'){
						tmp = EX(AgrArr[i], settings.pmntMethods );
					}
					
					if(ent==='OI'){
						tmp = OI(AgrArr[i], settings.pmntMethods );
					}			
					
					if(ent==='VT'){
						tmp =  VT(AgrArr[i] , settings.pmntMethods );
					}
					
					if(ent==='CF'){	
						tmp = CF(AgrArr[i] , settings.pmntMethods, settings.CompDtls.cpmName);
					}
				
					if( AgrArr[i].ExpType==='Management commission'){
						tmp = MngPmnt(AgrArr[i], 'company', settings.pmntMethods);
					}		
					
					tableArr.push(tmp);
				
				}
			
			
			let shauli = tableArr.sort((a,b)=>{
					return new Date(b.OpDate) - new Date(a.OpDate)
			})

			let BalancedShauli = setBalance(shauli, settings.CompDtls!=null && settings.CompDtls.initCF!=null ? settings.CompDtls.initCF: 0);
			BalancedShauli = convId2Item(BalancedShauli, ['ExpInc','VendChnnl'], settings)

			setCshFlowTableCompany(BalancedShauli);
			
			setLoading(false);
		}
		
		if(dates.start!==null && dates.end!==null && dates.start!==dates.end){
			loadData();
		}else{
			setCshFlowTableCompany([])
		}
		
	
	},[dates, setLoading, uidCollection, settings, setCshFlowTableCompany]);
	
	useEffect(() => {
		let rcv=0;
		let pmnt=0;
		   
		for(let i=0; i<cshFlowTableCompany.length;i++){
		   rcv+= (+cshFlowTableCompany[i].receiving);
		   pmnt+= (+cshFlowTableCompany[i].cost);
		   }
	   
		setPnldata({cost:addCommas(pmnt), receiving:addCommas(rcv)});

	},[cshFlowTableCompany])



  return (
	  <>
	  	<div className={classes.paddingSmall}>
		  	<Grid container spacing={7} justifyContent="space-evenly"  >  
			 	<PannelData clsNum='2' txt='Money Received' ttl={`Total`} num={pnldata.receiving}
					 img={logos[0]}/>
			 	<PannelData clsNum='3'  txt='Payments' ttl={`Total`} num={pnldata.cost}
					 img={logos[1]} />
		  	</Grid>  
	  	</div>
	  
		<div style={{paddingTop: '60px'}}>
			<Paper className={classes.root}>
				<Grid  container direction="row"  justifyContent="space-between" alignItems="center">
					<Grid item>
						<h4 className='ttlClr'>Company Cash Flow</h4>
					</Grid>
					<Grid item style={{padding: '0px 0px 7px 0px'}}>
						<DatePicker dates={dates} setDates={setDates}/>
					</Grid>
				</Grid>
				
				<Table  tableData={cshFlowTableCompany} /*setTableData={setTableData}*/ setPnldata={setPnldata}/>
			</Paper>
		</div>	  
	  </>
  );
}

export default PaperSheet;
