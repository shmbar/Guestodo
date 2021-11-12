import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper,Grid}  from '@material-ui/core';
import {Dialog, DialogContent, Slide, IconButton, Typography }  from '@material-ui/core';
import Table from './table/Table';
import {SettingsContext} from '../../contexts/useSettingsContext';
import {SelectContext} from '../../contexts/useSelectContext';
import PannelData from '../Subcomponents/PannelData';
import {readDataIncomeCompany, readDataIncExpCompany, convId2Item} from '../../functions/functions.js';
import MRangePickerPL from '../Subcomponents/MRangePickerPL'
import Gross from '../../logos/pics/Gross.png';
import Income from '../../logos/pics/Inc.png';
import Expense from '../../logos/pics/Exp.png';
import {AuthContext} from '../../contexts/useAuthContext';
import useWindowSize from '../../hooks/useWindowSize';
import {Chart} from 'primereact/chart';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { Exp, Rev, PL } from './charts';

//import Grid from '@material-ui/core/Grid';
const dateFormat = require('dateformat');	

const logos = [{txt: 'Gross', img: Gross, width:'50px'},
				 	{txt: 'Income', img: Income, width:'50px'},
				 	{txt: 'Expense', img: Expense, width:'50px'},
				  ];

function addComma(x) {
		var parts = Math.round(x).toString().split('.');
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}


	const MngmIncome = (val, d)=>{
	
			let newObj={ExpInc: d.type, VendChnnl: val.PrpName, AccDate:val.AccDate,
					   Transaction: '', Income: +d.Cmsn,
						Expense:''}    
			return newObj;
	}

	const othrInc = (val)=>{

			let newObj={ExpInc: 'Extra Revenue', VendChnnl: val.incType, AccDate:val.AccDate,
					   Transaction: val.Transaction, Income: +val.IncAmntWthtoutVat,
						Expense:''}    
			return newObj;
	}
	
	
	const EX = (y)=>{
			let newObj={ExpInc:y.ExpType, VendChnnl: y.vendor, AccDate: y.AccDate,
					   Transaction: y.Transaction, Income:'', Expense: y.ExpAmntWthtoutVat}
						
					//	y.ExpType ==='Channel advance commission' ? y.ExpAmntWthtoutVat:
					//	y.AmntWihtoutVat}    
			return newObj;
	}
	
const Transition = React.forwardRef(function Transition(props, ref) {
		return <Slide direction="left" ref={ref} {...props} />;
});

function getUnique(arr, comp) {
			  const unique = arr
				   .map(e => e[comp])
				 // store the keys of the unique objects
				.map((e, i, final) => final.indexOf(e) === i && i)
				// eliminate the dead keys & store unique objects
				.filter(e => arr[e]).map(e => arr[e]);
			   return unique;
}

export default function PaperSheet() {

	const scrSize = useWindowSize();
	const {settings, setLoading} = useContext(SettingsContext);
	const {valuePL, setValuePL, plData, setPlData, filteredData,setFilteredData, date} = useContext(SelectContext);
	const {uidCollection} = useContext(AuthContext);
	const [open, setOpen] = React.useState(false);
	const [currentData, setCurrentData] = useState([]);
	const [showCols, setShowCols] = useState('');
	
	let  cur = settings.length===0 ? "Currency" : settings.CompDtls.currency ;
	
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

		const styles = (theme) => ({
  root: {
    	margin: 0,
		padding: theme.spacing(2),
  },
  closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
  },
});
	
	const classes = useStyles();
	
	const DialogTitle = withStyles(styles)((props) => {
	  const { children, classes, onClose, ...other } = props;
	  return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
		  <Typography variant="h5" style={{padding: '5px 7px 0px 8px'}} className='ttlClr1'>{children}</Typography>
		  {onClose ? (
			<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
			  <CloseIcon />
			</IconButton>
		  ) : null}
		</MuiDialogTitle>
	  );
	});

	useEffect(()=>{
		
		const loadData=async()=>{
		
			const sumVals = (tmpData, val, type) =>{

					let tmpD = {'Cmsn':'', 'type': type};


					for(let z in tmpData){ //sum amount per property and date
						if(tmpData[z].tmpCol===val.tmpCol){
							tmpD.Cmsn =  +tmpD.Cmsn + (+tmpData[z].AmntWihtoutVat || +tmpData[z].IncAmntWthtoutVat);
						}
					}
					return 	tmpD;
			}	
		
		setLoading(true);
			
		let tableArr=[];

		
			let From =dateFormat(valuePL.From, "yyyy-mm");
			let To =dateFormat(valuePL.To, "yyyy-mm");
		
			////////////////////////////////
		
			let tmpData = await readDataIncomeCompany(uidCollection, 'expenses', From, To ); //Management Commission
			tmpData = tmpData.filter(x=> +x.Amnt!==0).map(x=> ({...x, 'tmpCol': x.PrpName.concat(dateFormat(x.AccDate, "mmm-yyyy"))}))

			let tmpNewArr=getUnique(tmpData,'tmpCol')
		
			for (let i in tmpNewArr){
				let totalCMSNperMonth=sumVals(tmpData, tmpNewArr[i], 'Management commission');
				tableArr.push(MngmIncome(tmpNewArr[i], totalCMSNperMonth ));
			}	
		/////////////////////////////////
			
			let tmpDataOtherIncome =  await readDataIncExpCompany(uidCollection, 'otherIncomeCompany', From, To ); //Other Income
	
			for (let i in tmpDataOtherIncome){
				tableArr.push(othrInc(tmpDataOtherIncome[i] ));
			}	
			
		// ///////////////////////////////	
			
			let tmpDataExpense =  await readDataIncExpCompany(uidCollection, 'expensesCompany', From, To ); //Other Income
	
			for (let i in tmpDataExpense){
				tableArr.push(EX(tmpDataExpense[i] ));
			}	
	
			
			tableArr = tableArr.sort((a,b)=>{  //sort
			return new Date(a.AccDate) - new Date(b.AccDate)
			})
		
		
		
			let inc=0; let exp=0;
			for (let i = 0; i < tableArr.length; i++) {
				inc += +tableArr[i].Income;
				exp += +tableArr[i].Expense;
			}
		
			setPlData(convId2Item(tableArr, ['VendChnnl', 'ExpInc'], settings));
			setFilteredData({inc:inc, exp: exp})
		
			setLoading(false);
		}
		
		setPlData([]);
		loadData();
		
	},[valuePL, setPlData, settings, setFilteredData, setLoading, uidCollection ])
	
	const handleClose = () => {
		setOpen(false);
	  };

	
  return (
	  <>
	  <div style={{textAlign: 'right'}}>
	  		<MRangePickerPL	valuePL={valuePL} setValuePL={setValuePL} date={date}/>
	  </div>
	  
	   	<div className={classes.paddingSmall}>
		  <Grid container spacing={7} justifyContent="space-between"  >  
			 <PannelData  clsNum='1' txt='Gross P&L' ttl={'Total'} num={plData.length>0 ?
					  	`${addComma(+filteredData.inc - (+filteredData.exp))}`: '0'}  img={logos[0]} />
			 <PannelData  clsNum='2' txt='Revenue & Extra Revenue Before Vat' ttl={'Total'} num={`${addComma(+filteredData.inc)}` } 
				 			img={logos[1]}/>
			 <PannelData clsNum='3'   txt='Expense' ttl={'Total'} num={`${addComma(+filteredData.exp)}`} 
				 		img={logos[2]}/>
		  </Grid>  
	  	</div>
	  
	  	<div style={{paddingTop: '60px'}}>
		  	<Grid container spacing={2} justifyContent="space-around" style={{ paddingTop: '16px' }}>
					<Grid item xs={12} sm={4}>
						<Paper className={classes.root} style={{ paddingBottom: '30px' }}>
							<Chart type="bar" style={{ minHeight: '240px' }} data={PL(plData, date, cur, setCurrentData, setOpen, setShowCols).obj} 
										options={PL(plData, date, cur, setCurrentData, setOpen, setShowCols).options} />
						</Paper>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Paper className={classes.root} style={{ paddingBottom: '30px' }}>
							<Chart type="bar" style={{ minHeight: '240px' }} data={Rev(plData, date, cur, setCurrentData, setOpen, setShowCols).obj} 
										options={Rev(plData, date, cur, setCurrentData, setOpen, setShowCols).options} />
						</Paper>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Paper className={classes.root} style={{ paddingBottom: '30px' }}>
							<Chart type="bar" style={{ minHeight: '240px' }} data={Exp(plData, date, cur, setCurrentData, setOpen, setShowCols).obj} 
										options={Exp(plData, date, cur, setCurrentData, setOpen, setShowCols).options} />
						</Paper>
					</Grid>
				</Grid>
	  
		  
	   	</div>
	  	<div style={{paddingTop: '60px'}}>
		  
		 <Dialog open={open}	TransitionComponent={Transition}	keepMounted		onClose={handleClose} 	fullWidth={true} maxWidth='lg'	>
			 <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          			<span className='ttlClr'>{showCols==='Expense' ? 'Expenses Breakdown': showCols==='Income' ? 'Revenue Breakdown' : 'P&L Breakdown'}</span>
        </DialogTitle>
        <DialogContent>
			<Table currentData={currentData} showCols={showCols}/>
        </DialogContent>
      </Dialog>  
	  
		</div>	  
	 	
     
	  </>
  );
}


/*

 	<div style={{paddingTop: '60px'}}>
		  	<Paper className={classes.root} style={{paddingBottom:'30px'}}>
				<Grid  container  spacing={2}>
					<Grid item sm={3}>
						<h4 style={{padding: '12px 12px 0px 12px', color: 'cornflowerblue'}}>Company P&L</h4>
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
					<Table />
				</div>
		  	</Paper>
		</div>	  

*/