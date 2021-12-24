import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from './table/Table';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import PannelData from '../Subcomponents/PannelData';
import Grid from '@material-ui/core/Grid';
import {VtContext} from '../../contexts/useVtContext';
//import Vatp from '../../logos/Vatp.png';
import YearSelect from '../Subcomponents/YearSelect';
import {SelectContext} from '../../contexts/useSelectContext';
import useWindowSize from '../../hooks/useWindowSize';
import {readDataPerFundVAT} from '../../functions/functions.js';
import Income from '../../logos/pics/Income.png';
import Expense from '../../logos/pics/Expense.png';
import {AuthContext} from '../../contexts/useAuthContext';
import balancedue from '../../logos/pics/balancedue.svg';


const logos = [	 	{txt: 'Income', img: Income, width:'50px'},
				 	{txt: 'Expense', img: Expense, width:'50px'},
			   		{txt: 'Balance Due', img: balancedue, width:'50px'}
				  ];



	function addCommas(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

export default function PaperSheet() {

	const scrSize = useWindowSize();
	const [pnldata, setPnldata]=useState({Vat:0, Blnc:0});
	const {vtData, setVtData} = useContext(VtContext);
	const {date, fundSlct} = useContext(SelectContext);
	const {uidCollection} = useContext(AuthContext);
	const {setLoading} = React.useContext(SettingsContext);

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
	
		const loadData = async()=>{
			setLoading(true);

			let listDataVT = await readDataPerFundVAT(uidCollection, 'vatcal', fundSlct, date.year);
			let tmp = listDataVT.map(x => 
				({...x, 'IncWithVat': x.valueInc.withoutVat , 'ExpWithVat': x.valuex.withoutVat}))	
			setVtData(tmp);	
			setLoading(false);
		}

		if(fundSlct!==null)loadData();
	
	},[date, fundSlct, uidCollection, setLoading, setVtData])

	useEffect(()=>{
		let totalBlnc=0;
		let VatToBeReturned=0;
		
		for(let i=0; i<vtData.length;i++){
			totalBlnc+= +vtData[i].BlncVat;
			VatToBeReturned+= +vtData[i].VatPayRtrn;  
		}
		
		setPnldata({Vat: VatToBeReturned, Blnc:addCommas(totalBlnc)  });

	},[vtData])


  return (
	  <>
	  <div className={classes.paddingSmall}>
		  <Grid container spacing={7} justifyContent="space-evenly"  >  
			 <PannelData clsNum='1' txt={pnldata.Vat<0 ? 'Total Vat To Be Returned': 'Total Vat To Be Paid'} ttl={`Total ${date.year}`}
				 num={addCommas(Math.abs(pnldata.Vat))}	img={pnldata.Vat<0 ? logos[0] : logos[1]} />
			<PannelData clsNum='3' txt='Balance Due' ttl={`Total ${date.year}`} num={pnldata.Blnc} 
				 img={logos[2]}/>
			
		  </Grid>  
	  </div>
	  
      	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root}>
				<div style={{width:'100%',display: 'inline-flex'}}>
				  	<h4 className='ttlClr'>VAT</h4>
					<Grid container  spacing={2} justifyContent="flex-end">
						<Grid item style={{padding: '15px'}}>	
							<YearSelect />
						</Grid>
					</Grid>
				</div>	
		  	
					<div >
						<Table  />
					</div>
			
		  	</Paper>
		</div>	  
	  </>
  );
}

/*
	 <div className='moshe'>
					 	 <img src={Vatp} alt='Reservation' width='25px' />
				 	 </div>	
					 
					  let ReservationAmntWithVat=0;
		let ExpenseAmountWithVat=0;
					 
		ReservationAmntWithVat+= vtData[i].valueInc.withoutVat;
			ExpenseAmountWithVat+= (+vtData[i].valuex.withoutVat);			 
					 
					  <PannelData clsNum='2' txt='Revenue Amount with Vat' ttl={`Total in ${Yr}`} num={pnldata.Rsrv}
				  img={logos[0]}/>
		   	<PannelData clsNum='3' txt='Expense Amount with Vat' ttl={`Total in ${Yr}`} num={pnldata.Expnse} 
				 img={logos[1]}/>
				 
				
*/