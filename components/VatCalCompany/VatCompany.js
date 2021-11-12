import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import {VtContext} from '../../contexts/useVtContext';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import {readDataDates,addCommas} from '../../functions/functions';
import {SelectContext} from '../../contexts/useSelectContext';
import Income from '../../logos/pics/Income.png';
import Expense from '../../logos/pics/Expense.png';
import balancedue from '../../logos/pics/balancedue.svg';
import YearSelect from '../Subcomponents/YearSelect';
import {AuthContext} from '../../contexts/useAuthContext';
import useWindowSize from '../../hooks/useWindowSize';

const logos = [	 	{txt: 'Income', img: Income, width:'50px'},
				 	{txt: 'Expense', img: Expense, width:'50px'},
			   		{txt: 'Balance Due', img: balancedue, width:'50px'}	
				  ];



export default function PaperSheet() {

 	 const scrSize = useWindowSize();
	const [pnldata, setPnldata]=useState({Vat:0, Blnc:0});
	const {vtDataC,setVtDataC} = useContext(VtContext);
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

	useEffect(()=>{
	
		const loadData=async()=>{
			setLoading(true);
		
				let listDataVatCompany = await readDataDates(uidCollection,'vatcalCompany', date.year, null);
		
				let tmpvtDataC = listDataVatCompany.length ? listDataVatCompany.map(x => 
						({...x, 'IncWithVat': x.valueInc.withoutVat , 'ExpWithVat': x.valuex.withoutVat})):[];
				setVtDataC(tmpvtDataC);		
						
			setLoading(false);
		}
		
	loadData();

	},[date, setLoading, setVtDataC,  uidCollection])

	useEffect(()=>{
	
		let totalBlnc=0;
		let VatToBeReturned=0;
		
		for(let i=0; i<vtDataC.length;i++){
			totalBlnc+= +vtDataC[i].BlncVat;
			VatToBeReturned+= +vtDataC[i].VatPayRtrn;  
		}
		
		setPnldata({Vat:VatToBeReturned, Blnc:addCommas(totalBlnc)  }	);
	
	},[vtDataC])
	
  return (
	  <>
	  <div className={classes.paddingSmall}>
		  <Grid container spacing={7} justifyContent="space-evenly"  >  
			 <PannelData clsNum='1' txt={pnldata.Vat<0 ? 'Total Vat To Be Returned': 'Total Vat To Be Paid'} ttl={`Total ${date.year}`}
				 num={addCommas(Math.abs(pnldata.Vat))}	img={pnldata.Vat<0 ? logos[0] : logos[1]} />
			<PannelData clsNum='3' txt='Balance Due' ttl={`Total ${date.year}`} num={pnldata.Blnc} 
				 img={logos[2]} />
			
		  </Grid>  
	  </div>
	  
      	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root}>
				<Grid  container  spacing={2}>
					<Grid item sm={5}>
						<h4 className='ttlClr'>Company Vat</h4>
					</Grid>	
					<Grid item sm={7} >
						<Grid  container  spacing={2} justifyContent='flex-end' alignItems="center" style={{margin:"auto"}}>
							<YearSelect />
						</Grid>	
					</Grid>	
				</Grid>	

				<div >
					<Table  />
				</div>
			
		  	</Paper>
		</div>	  
	  </>
  );
}
