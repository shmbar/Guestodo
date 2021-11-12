import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import {CfContext} from '../../contexts/useCfContext';
import {SelectContext} from '../../contexts/useSelectContext';

import {SettingsContext} from '../../contexts/useSettingsContext'; 
import {readDataDates} from '../../functions/functions';
import MonthSelect from '../Subcomponents/MonthSelect';

import Income from '../../logos/pics/Income.png';
import Expense from '../../logos/pics/Expense.png';
import {AuthContext} from '../../contexts/useAuthContext';
import useWindowSize from '../../hooks/useWindowSize';

const logos = [{txt: 'Deposit', img: Income, width:'50px'},
			   {txt: 'Withdrawal', img: Expense, width:'50px'}
				  ];
const dateFormat = require('dateformat');

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

export default function PaperSheet() {
  
	const scrSize = useWindowSize();
	const {cfDataC, setCfDataC } = useContext(CfContext);
	const {setLoading} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
	const [pnldata, setPnldata]=useState({avg:0, ttlrsrv:0, ttlblnxrsrv:0});
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

	useEffect(() => {
		
			const loadData=async()=>{
				setLoading(true);
			
					let listDataCFCompany = await readDataDates(uidCollection, 'cashflowCompany', date.year, date.month);
					let tmpcfDataC = listDataCFCompany.length ? listDataCFCompany : [];
					setCfDataC(tmpcfDataC);
					
				setLoading(false);
			
			}
		
		loadData();
  },[setCfDataC,setLoading, date,  uidCollection ]);
	
  useEffect(() => {
		
		let TotalWithdrawal=0;
		let TotalDeposit=0;
		
		for(let i=0; i<cfDataC.length;i++){
			TotalWithdrawal+= cfDataC[i].WithdrDepst==='Withdrawal' ?(+cfDataC[i].Amnt) : 0;
			TotalDeposit+= cfDataC[i].WithdrDepst==='Deposit' ?(+cfDataC[i].Amnt) : 0;    
		}
		setPnldata({Withdrawal:addCommas(TotalWithdrawal),
				Deposit:addCommas(TotalDeposit)}	);

},[cfDataC]);



  return (
	  <>
	  <div className={classes.paddingSmall}>
		  <Grid container spacing={7} justifyContent="space-evenly"  >  
			 <PannelData clsNum='1' txt='Deposit Amount' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
				 num={pnldata.Deposit} img={logos[0]} />
			 <PannelData  clsNum='2'  txt='Withdrawal Amount' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
			   	num={pnldata.Withdrawal}img={logos[1]} />
		  </Grid>  
	  </div>
	  
      	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root}>
				
				<Grid  container  spacing={2}>
					<Grid item sm={3}>
						<h4 className='ttlClr'>Company Money Transfer</h4>
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
					<Table  />
				</div>
			
		  	</Paper>
		</div>	  
	  </>
  );
}

/*
	   <div className='moshe'>
					  <img src={Montrnsf} alt='Money Transfer' width='25px' />
				  </div>
*/