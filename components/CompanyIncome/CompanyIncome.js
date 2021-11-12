import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {SelectContext} from '../../contexts/useSelectContext';
import SnackBar from '../Subcomponents/SnackBar';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';

import Income from '../../logos/pics/Inc.png';
import Expense from '../../logos/pics/Exp.png';
import cmsn from '../../logos/pics/cmsn.png';
import balancedue from '../../logos/pics/balancedue.svg';
import {readDataIncomeCompany, readData, idToItem, getUnique, paymentStatus} from '../../functions/functions.js';
import {AuthContext} from '../../contexts/useAuthContext';
import MRangePickerPL from '../Subcomponents/MRangePickerPL'
import useWindowSize from '../../hooks/useWindowSize';
import { v4 as uuidv4 } from 'uuid';

//import Grid from '@material-ui/core/Grid';
const dateFormat = require('dateformat');	

const logos = [{txt: 'Commission Before Vat', img: cmsn, width:'50px'},
				 	{txt: 'Reservation Amount Include Vat', img: Income, width:'50px'},
				 	{txt: 'Reservation Amount  Excluding Vat', img: Expense, width:'50px'},
			   {txt: 'Balance Due', img: balancedue, width:'50px'},
				 
			  ];

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}



export default function PaperSheet() {
	  
	const scrSize = useWindowSize();
	const [data,setData] = useState([]);
	const {settings, setLoading} = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const {valuePL, setValuePL, date} = useContext(SelectContext);
	const [pnldata, setPnldata]=useState({ttlbfrvat:0, ttlincl:0 , ttlexcl:0,blnc:0});
	const [dataTable, setDataTable]=useState([]);
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

	useEffect(()=>{
	
		let From =dateFormat(valuePL.From, "yyyy-mm");
		let To =dateFormat(valuePL.To, "yyyy-mm");
		
		const loadData=async()=>{
			setLoading(true)
			
			let tmpData = await readDataIncomeCompany(uidCollection,'expenses', From, To );
			tmpData = tmpData.filter(x=> +x.Amnt!==0);
		
			tmpData = tmpData.map(x=> ({...x, 'tmpCol': x.PrpName.concat(dateFormat(x.AccDate, "mmm-yyyy")), 'date' :
						dateFormat(x.AccDate, "mmm-yyyy"), 'PrpName': settings.properties.filter(y=>y.id===x.PrpName)[0]['PrpName'],
						'Owner':	idToItem(settings.owners,settings.properties.filter(y=>y.id===x.PrpName)[0]['Owner'], 'item')   }))
			
			
			let tmpNewArr=getUnique(tmpData,'tmpCol')
			
			
			const sumVals = (val, pmnts) =>{
			
				
				let tmpD = {'AmntInclVat': 0, 'AmntExcllVat': 0,'TtlPmnt': '', 'Blnc': '',
							'PmntStts': '',  'Cmsn':'', 'VatAmnt':0, 'CmsnVat':''};
				
				
				tmpD.Payments =pmnts.filter(x=>x.tmpCol===val.tmpCol)[0]['pmnts']['Payments'];
				const TotalPmnt = tmpD.Payments.map(x=> +(+x.P).toFixed(2)).filter(x=> x>0)
								.reduce((a, b) => a + b, 0);
			
				tmpD.PrpName = val.PrpName;
				tmpD.Owner = val.Owner;
				tmpD.date = val.date;
				tmpD.TtlPmnt =TotalPmnt;
				
				
				for(let z in tmpData){ //sum amount per property and date
				
					if(tmpData[z].tmpCol===val.tmpCol){
						if(tmpData[z].RsrvAmntDesc==='YesVat'){
							tmpD.AmntInclVat = +tmpD.AmntInclVat + +tmpData[z].RsrvAmnt;
						}else{
							tmpD.AmntExcllVat= +tmpD.AmntExcllVat + +tmpData[z].RsrvAmnt;
						}
					
						tmpD.Cmsn =  +tmpD.Cmsn + +tmpData[z].AmntWihtoutVat;
						tmpD.VatAmnt =  +tmpD.VatAmnt + +tmpData[z].VatAmnt;
						tmpD.CmsnVat =  +tmpD.CmsnVat + +tmpData[z].CmsnVat;
						tmpD.Blnc = +(+tmpD.CmsnVat).toFixed(2) - +TotalPmnt;
						tmpD.PmntStts = paymentStatus(TotalPmnt, +tmpD.CmsnVat);
					}
				}
	
				return 	tmpD;
			}
			
			
			const addVals = (val) =>{
				
				let tmpDD = tmpData.filter(c=> c.tmpCol===val.tmpCol).map(v=> ({...v,
							'AmntInclVat': v.RsrvAmntDesc==='YesVat' ? v.RsrvAmnt: 0,													
							'AmntExcllVat': v.RsrvAmntDesc==='NoVat' ? v.RsrvAmnt: 0, 'Cmsn': v.AmntWihtoutVat,
							'TtlPmnt': '', 'Blnc': '', 'PmntStts':'' }));
			
				return tmpDD.map((x,i)=> ({'key': i, 'data': x}))
				 
			}
			
			let pmnts=[{}];
			for(let x in tmpNewArr){
				pmnts[x]={};
				const tmpAA = await readData(uidCollection, 'incomeCompany', dateFormat(tmpNewArr[x].AccDate,'yyyy'), tmpNewArr[x].tmpCol);
				pmnts[x].pmnts=  tmpAA!=null ? tmpAA: {'Payments':[{'Date': null, 'P': '', 'PM': '', id : uuidv4()}] }
				pmnts[x].tmpCol= tmpNewArr[x].tmpCol;
			}
			
			let newArr = await tmpNewArr.map(x=>({'key': x.tmpCol, 'data': sumVals(x, pmnts), 'children' : addVals(x) }));
			
			setDataTable(newArr.map(x=> x.data)) //for excel download
			setData(newArr)
			setLoading(false)
		}	
			
		loadData();
		
	},[valuePL, settings, setLoading, uidCollection])
	
	useEffect(()=>{
		let TotalIncmBeforeVat=0;
		let TotalAmntInclVat=0;
		let TotalAmntExclVat=0
		let TotalBlnc=0
		
		for(let i=0; i<data.length;i++){
			TotalIncmBeforeVat+= (+data[i].data.Cmsn);
			TotalAmntInclVat+= (+data[i].data.AmntInclVat);
			TotalAmntExclVat+= (+data[i].data.AmntExcllVat);
			TotalBlnc+= (+data[i].data.Blnc);
		
		}
		
		setPnldata({ttlbfrvat:addCommas(TotalIncmBeforeVat),ttlincl:addCommas(TotalAmntInclVat),
					ttlexcl:addCommas(TotalAmntExclVat), blnc:addCommas(TotalBlnc)});

	},[data])
	
	
  return (
	  <>
	   	<div className={classes.paddingSmall}>
		  <Grid container spacing={7} justifyContent="space-between"  >  
			 	<PannelData  clsNum='1' txt={logos[0].txt} ttl={'Total'} num={`${pnldata.ttlbfrvat}`}  img={logos[0]} />
			 	<PannelData  clsNum='2' txt={logos[1].txt} ttl={'Total'} num={`${pnldata.ttlincl}` } 	img={logos[1]}/>
				<PannelData clsNum='3'   txt={logos[2].txt} ttl={'Total'} num={`${pnldata.ttlexcl}`}	img={logos[2]}/>
			 	<PannelData clsNum='3'   txt={logos[3].txt} ttl={'Total'} num={`${pnldata.blnc}`} 	img={logos[3]}/>  
		  </Grid>  
	  	</div>
	  
      	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root} style={{paddingBottom:'30px'}}>
				
				<Grid  container  spacing={2}>
					<Grid item sm={3}>
						<h4 className='ttlClr'>Company Commission</h4>
					</Grid>	
					<Grid item sm={9} >
						<Grid container  spacing={2} justifyContent="flex-end"  alignItems="center" style={{margin:"auto"}}>
							<Grid item >	
								<MRangePickerPL	valuePL={valuePL} setValuePL={setValuePL}  date={date}/>
							</Grid>
						</Grid>
					</Grid>	
				</Grid>	
				
				<div>
				 	<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
								variant={snackbar.variant}/>
					<Table data={data} setData={setData} setSnackbar={setSnackbar} dataTable={dataTable}/>
				</div>
		  	</Paper>
		</div>	  
	  </>
  );
}

