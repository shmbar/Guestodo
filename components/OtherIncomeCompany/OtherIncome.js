import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper,Grid}  from '@material-ui/core';
import Table from './table/Table';
import PannelData from '../Subcomponents/PannelData';
import {OiContext} from '../../contexts/useOiContext';
import {SelectContext} from '../../contexts/useSelectContext';
import {readDataDates} from '../../functions/functions';
import otherIncome from '../../logos/pics/otherIncome.png';
import balancedue from '../../logos/pics/balancedue.svg';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import MonthSelect from '../Subcomponents/MonthSelect';
import {AuthContext} from '../../contexts/useAuthContext';
import useWindowSize from '../../hooks/useWindowSize';

const logos = [{txt: 'Variable Expenses', img: otherIncome, width:'50px'},
				 	{txt: 'balancedue', img: balancedue, width:'50px'}
				  ];

const dateFormat = require('dateformat');

function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

export default function PaperSheet() {

 	const scrSize = useWindowSize();
	const {otherIncC, setOtherIncC} = useContext(OiContext);
	const [pnldata, setPnldata]=useState({totalExp:0, blnc:0});
	const {setLoading} = React.useContext(SettingsContext);
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

		useEffect(() => {
			
			const loadData=async()=>{
				setLoading(true);
					let listDataOtherInc = await readDataDates(uidCollection, 'otherIncomeCompany', date.year, date.month);
					let tmpotherIncC = listDataOtherInc.length ? listDataOtherInc : [];
				setOtherIncC(tmpotherIncC);
				
				setLoading(false);
			
		}
		
	loadData();

  },[setOtherIncC, setLoading,  date, uidCollection]);

  useEffect(() => {
			
	let Total=0; 
	let Blnc=0;

	for(let i=0; i<otherIncC.length;i++){
	
		Total+= (+otherIncC[i].Amnt);
		Blnc+= (+otherIncC[i].Blnc);
	}
	
	setPnldata({total:addCommas(Total),
			blnc:addCommas(Blnc)}	);

},[otherIncC]);
	
  return (
	  <>
	  <div className={classes.paddingSmall}>
		  <Grid container spacing={7} justifyContent="space-evenly"  >  
			 <PannelData  clsNum='1' txt='Total Revenue Amount' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
				 num={pnldata.total} img={logos[0]}/>
			 <PannelData  clsNum='2'  txt='Balance Due' ttl={date.month===12 ? `Total ${date.year}` : dateFormat(new Date(date.year, date.month+1, 0), "mmm-yyyy")}
				 num={pnldata.blnc}  img={logos[1]}/>
			
		  </Grid>  
	  </div>
	  
      	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root}>
				
				<Grid  container  spacing={2}>
					<Grid item sm={5}>
						<h4 className='ttlClr'>Company Extra Revenue</h4>
					</Grid>	
					<Grid item sm={7} >
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

