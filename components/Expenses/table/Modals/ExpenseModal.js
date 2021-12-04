import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExpenseModalDetails from './ExpenseModalDetails';
import IconButton from '@material-ui/core/IconButton';
import {ExContext} from '../../../../contexts/useExContext';
import Tab2Modal from '../../../Settings/modals/Tab2Modal';
import Tab3Modal from '../../../Settings/modals/Tab3Modal';
import TabExpTypeModal from '../../../Settings/modals/TabExpTypeModal';
import PMmodal from '../../../Settings/modals/listOfItems/PMmodal';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import SnackBar from '../../../Subcomponents/SnackBar';
import {formValidation, delEmptyPaymentS} from '../../../../functions/formValidation';
import {addData, updateField, getNewTR, addRecurringExpense, addDPaymentsBatch, delDPaymentsBatch} from '../../../../functions/functions.js';
import {AuthContext} from '../../../../contexts/useAuthContext';
import {SelectContext} from '../../../../contexts/useSelectContext';
import { v4 as uuidv4 } from 'uuid';
import useWindowSize from '../../../../hooks/useWindowSize';


	const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'sticky',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
	color: 'white',  
  },
	bgr:{
		background:'#eee'
	}
}));
const dateFormat = require('dateformat');	

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ExpenseModal = (props) =>{
	
  	const classes = useStyles();
	const scr = useWindowSize();
	let scrSize = (scr==='xs' || scr==='sm');


	const {displayDialog, setDisplayDialog, setRedValid, value, exDataPrp, setValue,
		   setExDataPrp, snackbar, setSnackbar, recEnd, recStart} = useContext(ExContext);
	const {displayDialogSettings, runTab, settings, updtSettings,
		   	setSettingsShows, settingsShows, displayDialogSettingsApt} = useContext(SettingsContext);
	const {write, uidCollection} = useContext(AuthContext);					 						 				 
	const {date, propertySlct} = useContext(SelectContext);
	
	useEffect(()=>{
		
		const load=async()=>{
			 let tmpEX = await getNewTR(uidCollection,'lastTR', 'lastTR', 'EX');
			setValue({...value, 'Transaction' : 'EX'.concat(tmpEX).concat('_' + uuidv4())});
		}
		
		if(value.Transaction==='')load();
	
	},[value, setValue, uidCollection])
	
	
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialog(false);
	}
	
	const updateSettingsShows = async()=>{
		
		let ownerID = settings.properties.filter(x=> x.id===value.PrpName)[0]['Owner']; //id
		let pmnts = value.Payments.map(x=>x.PM);
		let prprtyID = value.PrpName;
		let aptID = value.AptName;
		let expenseID =value.ExpType;
		
		
		///payments
	 	let obj = {};
		for(let i in pmnts){
			if(pmnts[i]!==''){
				obj[pmnts[i]]=true;
			}
		}
	 	
		if(obj.length!==0){
			for(let key in obj) {
				await updateField(uidCollection,'settingsShows', 'shows', [key], true)
			}		
		}
		//////
		
		//vendor+extype+ property + apartment + owner
			let tmp = {...settingsShows, ...obj, [expenseID] : true, [prprtyID] : true,
					   								[aptID] : true, [ownerID]: true};
			setSettingsShows(tmp)
		
			await updateField(uidCollection,'settingsShows', 'shows', [ownerID], true)
			await updateField(uidCollection, 'settingsShows', 'shows', [expenseID], true)
			await updateField(uidCollection, 'settingsShows', 'shows', [prprtyID], true)
			await updateField(uidCollection, 'settingsShows', 'shows', [aptID], true)
	}
	
	
	
	const handleSave = async() => { 
		
		let indx = exDataPrp.exData.findIndex(x=>x.Transaction===value.Transaction);
		///validation
		
		let validation = formValidation(value,
						['ExpType','vendor', !value.recCost && 'AccDate', 'AptName','Amnt']);
	
		if(settings.CompDtls==null){
			setSnackbar( {open:true, msg: 'Company details are missing', variant: 'warning'});
			return};
		
		
		if(!validation){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		
		if(value.BlncExp<0){
			setSnackbar( {open:true, msg: 'Total payment exceeds expense amount!', variant: 'warning'});
			return;
		}
	
		if(value.recCost && recStart===null ){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Recurring month is missing', variant: 'warning'});
			return;
		}
		
		
		if(value.recCost && recEnd!==null && new Date(recStart)>= new Date(recEnd)){ //recc
			setSnackbar( {open:true, msg: 'Recurring dates are wrong!', variant: 'warning'});
			return;
		}
		
		if(value.recCost && indx===-1 && new Date(new Date().getFullYear(), new Date().getMonth(), 1) > new Date(recStart)){ //recc
			setSnackbar( {open:true, msg: 'Recurring cost can not start before current month', variant: 'warning'});
			return;
		}
		
		///////////////////
		
		let newPmnts = delEmptyPaymentS(value.Payments).map(x=> ({...x, 'P': (x.P==='') ? '' :	+(+x.P).toFixed(2) }));
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Payments': newPmnts, 'VatAmnt': +(+value.Amnt - +value.ExpAmntWthtoutVat).toFixed(2),
					  'Amnt' : +(+value.Amnt).toFixed(2), 'm': dateFormat(value.AccDate,'mm')};
			
	 	if(indx!==-1){ //Update the table
			const tmpArr = exDataPrp.exData.map(k =>
	 		   		k.Transaction===value.Transaction ? newObj : k  );			
			
			setSnackbar( {open: (await addData(uidCollection, 'expenses', dateFormat(newObj.AccDate,'yyyy'),  newObj)), msg: 'Expense has been updated!', variant:
						  'success'});
			updateSettingsShows();
			setExDataPrp({...exDataPrp, 'exData' :tmpArr});
			
			
			
			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'ExpInc': value.ExpType,  'VendChnnl': value.vendor, 'Date': new Date(x.Date), 'Transaction': value.Transaction,
								'Fund': settings.properties.filter(x=>x.id===propertySlct)[0]['Fund']}
			})
			
			let olPayments = exDataPrp.exData.filter(k => k.Transaction===value.Transaction)[0]['Payments'];
			
			await delDPaymentsBatch(uidCollection,'payments',olPayments)
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
			
			
		}else{ //add new data
			
			const fromNextMonthAndOn = value.recCost===true && new Date(new Date().getFullYear(), new Date().getMonth(), 1) < new Date(recStart) ? true: false
		
			if(value.recCost){
				let objTmp={...newObj,
					recTransaction:  uuidv4(),
					uidCollection: uidCollection,
					startDate:  dateFormat(	new Date(recStart), 'dd-mmm-yyyy'),
					recEnd: recEnd===null? '25-Dec-2099':dateFormat(recEnd,"dd-mmm-yyyy"),
					TtlPmnt: '', BlncExp: newObj.Amnt,
					PmntStts: 'Unpaid',
					Payments: [{P: '', Date: null, PM: '', id:uuidv4() }]
				}	
				delete objTmp.AccDate  //complete on the server
				delete objTmp.Transaction  //complete on the server
				delete objTmp.LstSave		//complete on the server
				delete objTmp.m			//complete on the server
				delete objTmp.BlncRsrv
				delete objTmp.recCost
				
				
				await addRecurringExpense(objTmp)
				
				newObj = !fromNextMonthAndOn ? {...newObj, recTransaction: objTmp.recTransaction, 'AccDate' : dateFormat(new Date(recStart),'dd-mmm-yyyy')} : newObj;
			}
			
			
			if(!value.recCost){ //make expense
				setSnackbar( {open: (await addData(uidCollection, 'expenses', dateFormat(newObj.AccDate,'yyyy'),  newObj)),
							  msg: 'New Expense has been added!', variant:
						  'success'})} 
			else if(value.recCost &&  dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1),'dd-mm-yyyy') === dateFormat(new Date(recStart),
																																		   'dd-mm-yyyy')){ 
				//recurring expense that happens in current month
					
				setSnackbar( {open: (await addData(uidCollection, 'expenses', dateFormat(newObj.AccDate,'yyyy'),  newObj)), msg: 'New Expense has been added!', 
							  variant: 'success'})
			} 
				
				
			const tmpDate=dateFormat(String(date.year).concat('-').concat(date.month+1),'yyyy-mm');
			
			if((!value.recCost &&  date.month!==12 && tmpDate === dateFormat(newObj.AccDate,'yyyy-mm'))  ||
				(!value.recCost && date.month===12 && dateFormat(newObj.AccDate,'yyyy')===String(date.year))){

				const tmpArr = [...exDataPrp.exData, newObj]
				setExDataPrp({...exDataPrp, 'exData' :tmpArr});
			}
			
			if(	(value.recCost && date.month!==12 && tmpDate ===dateFormat(recStart,'yyyy-mm')) ||
				(value.recCost && date.month===12 && dateFormat(recStart,'yyyy')===String(date.year))){

				const tmpArr = [...exDataPrp.exData, newObj]
				setExDataPrp({...exDataPrp, 'exData' :tmpArr});
			}
			
			updateSettingsShows()
			
			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'ExpInc': value.ExpType,  'VendChnnl': value.vendor, 'Date': new Date(x.Date), 'Transaction': value.Transaction,
								'Fund': settings.properties.filter(x=>x.id===propertySlct)[0]['Fund']}
			})
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
			
		}
			
			
	 	setDisplayDialog(false);
		
	 }
	
    const DialogHeader =  <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
				{scrSize ? 'Expenses Details': 'Property Expenses Details'}
            </Typography>
		  		{write && <Button color="inherit" onClick={handleSave} >
              Save
            </Button>}
          </Toolbar>
        </AppBar>;

	return (
			<>
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			  <Dialog fullScreen style={!scrSize? {left: '15em'}: {left: '0'}} open={displayDialog}
				  onClose={closeDialog} TransitionComponent={Transition}>
					{runTab === 'Tab2' && displayDialogSettings ? <Tab2Modal setSnackbar={setSnackbar}
								  runFromOrders={true}/> : null}
					{runTab === 'TabApt' && displayDialogSettingsApt ? <Tab3Modal setSnackbar={setSnackbar}
								  runFromOrders={true}/> : null}
					{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods}
								updtSettings={updtSettings} lbl='Add new payment method'
								typelist='pmnts'
								ttl='Payment Methods'
								name ='pmntMethods' snkbar='payment method' /> : null}
					{runTab === 'ExpType' && displayDialogSettings ? <TabExpTypeModal setSnackbar={setSnackbar}
								  runFromOrders={true}/> : null}
		
				{DialogHeader}
				<ExpenseModalDetails 	/>	
			  </Dialog>
		</>
    );
    };

export default ExpenseModal;

      