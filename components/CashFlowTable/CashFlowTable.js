import React, {useState, useEffect, useContext}  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import useWindowSize from '../../hooks/useWindowSize';
import {SelectContext} from '../../contexts/useSelectContext';
import {convId2Item,readDataCashFlow, readDataMoneyTransferforCashFlow } from '../../functions/functions.js';
import {AuthContext} from '../../contexts/useAuthContext';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import Income from '../../logos/pics/Income.png';
import Expense from '../../logos/pics/Expense.png';
import {setBalance, EX,OI,CF,VT,RC,MngPmnt, ChnnlPmnt} from './funcs'
import DatePicker from '../Subcomponents/rangeDatePicker';


const dateFormat = require('dateformat');

const logos = [	 	{txt: 'Income', img: Income, width:'50px'},
				 	{txt: 'Expense', img: Expense, width:'50px'},
				  ];

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

export default function CashFlowTable(props) {

	const scrSize = useWindowSize();
  
	const [tableData, setTableData]=useState([]);
	const [pnldata, setPnldata]=useState({cost:0, receiving:0});
	const {fundSlct} = useContext(SelectContext);
	const {setLoading, settings} = useContext(SettingsContext);
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
		
		const loadData = async()=>{
			
			
			setLoading(true);

				//let ListOfProperties = settings.properties ? settings.properties.filter(x =>
				//	x.Fund===fundSlct ? x :null).map(x=>x.id) : [];
				
				let AgrArr = [];
				let tableArr=[];
				
				 for (var i = dateFormat(dates.start, 'yyyy'); i <= dateFormat(dates.end, 'yyyy'); i++) {
					 let tmpPayments =  await readDataCashFlow(uidCollection, 'payments',fundSlct, i, dates.start, dates.end) 
					 let tmpMoneyTransfer =  await readDataMoneyTransferforCashFlow(uidCollection, 'cashflow',fundSlct, i, dates.start, dates.end) 
			
				/*	let start = Years[i].toString().concat('-').concat('01')
					let end = Years[i].toString().concat('-').concat('12')

					let listDataRC = ListOfProperties.length ? await readDataPropsDatesRange(uidCollection, 'reservations', ListOfProperties, start, end) : [];
					let listDataEX = ListOfProperties.length ? await readDataPropsDatesRange(uidCollection, 'expenses', ListOfProperties, start, end): [];
					let listDataVT = await readDataPerFundVAT(uidCollection, 'vatcal', fundSlct, Years[i]);
					let tmpVAT = listDataVT.map(x => 
						({...x, 'IncWithVat': x.valueInc.withoutVat , 'ExpWithVat': x.valuex.withoutVat}))	
					let listDataCf = await readDataPerFundCashFlow(uidCollection, 'cashflow', fundSlct, Years[i], null);  //for cashflow data (not fot vat)
					let listDataOI = ListOfProperties.length ? await readDataPropsDatesRange(uidCollection, 'otherIncome', ListOfProperties, start, end) : [];

					AgrArr = [...AgrArr, listDataRC,listDataEX,tmpVAT,listDataCf, listDataOI];
					*/
					 AgrArr = [...AgrArr, ...tmpPayments, ...tmpMoneyTransfer];
					 
				}
				
				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			
				for(let i in AgrArr){
					let ent = AgrArr[i].Transaction.substring(0,2);
					let tmp;
					
					

					if(ent==='RC'){
							if(AgrArr[i].P!=='' && +AgrArr[i].P!==0){
								tmp = RC(AgrArr[i], settings.pmntMethods );
							}else{
								continue;
							}
						
							const tmpChnlCmsnPrcntg = settings.channels.filter(x => x.id===AgrArr[i].RsrvChn)[0]['ChnCmsn']; //Channel Commission
							if(tmpChnlCmsnPrcntg!==''){  //payment commission
								let channelCommision = parseFloat(tmpChnlCmsnPrcntg)/100;
								channelCommision  = AgrArr[i].ChnPrcnt!=null? AgrArr[i].ChnPrcnt*1/100 : channelCommision;	
								let tmpVT = AgrArr[i].PrpName!=null? settings.properties.filter(x=> x.id===AgrArr[i].PrpName)[0]['VAT']: settings.vat	
								let tmpChannelPayment = ChnnlPmnt (AgrArr[i], channelCommision, tmpVT, settings.pmntMethods );
								tableArr.push(tmpChannelPayment);
							} 
						}
					
					
					if(ent==='EX'){
							if(AgrArr[i].P!=='' && AgrArr[i].ExpType!=='Channel advance commission' &&
							   AgrArr[i].ExpType!=='Management commission'){
								tmp = EX(AgrArr[i], settings.pmntMethods );
						}	
					}
					
					if(ent==='CF'){
							tmp = CF(AgrArr[i], settings.pmntMethods);
					}
					
					if(ent==='VT'){
						tmp =  VT(AgrArr[i], settings.pmntMethods);
					}
					
					if(ent==='OI'){
						tmp = OI(AgrArr[i], settings.pmntMethods);
					}
					
					if( AgrArr[i].ExpType==='Management commission'){
						tmp = MngPmnt(AgrArr[i], 'owner', settings.pmntMethods);
					}		
						
						
					tableArr.push(tmp);
					
				}
				
			
				let shauli = tableArr.sort((a,b)=>{
					return new Date(b.OpDate) - new Date(a.OpDate)
				})
				
				let BalancedShauli = setBalance(shauli, settings.funds.filter(x=> x.id===fundSlct)[0]['IntCshFlBnce']);
		
				BalancedShauli = convId2Item(BalancedShauli, ['ExpInc','VendChnnl'], settings)
			
				setTableData(BalancedShauli);
			

			/////////////////////////////////////////////////////////////////////	

				let rcv=0;
				let pmnt=0;

				for(let i=0; i<BalancedShauli.length;i++){
					rcv+= (+BalancedShauli[i].receiving);
					pmnt+= (+BalancedShauli[i].cost);
				}

				setPnldata({cost:addCommas(pmnt), receiving:addCommas(rcv)});

			setLoading(false); 
		}
	
 	(fundSlct!==null && dates.start!==null && dates.end!==null && dates.start!==dates.end)  && loadData();
	

	},[dates,fundSlct, setLoading, settings, uidCollection]);
	

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
						<h4 className='ttlClr'>Cash Flow</h4>
					</Grid>
					<Grid item style={{padding: '0px 0px 7px 0px'}}>
						<DatePicker dates={dates} setDates={setDates}/>
					</Grid>
				</Grid>
				  
					<div >
						<Table tableData={tableData} setTableData={setTableData} setPnldata={setPnldata}/>
					</div>
			
		  	</Paper>
		</div>	  
	  </>
  );
}
