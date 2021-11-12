import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import VatModalDetails from './VatModalDetails';
import IconButton from '@material-ui/core/IconButton';
import {VtContext} from '../../../../contexts/useVtContext';
import PMmodal from '../../../Settings/modals/listOfItems/PMmodal';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import {formValidation, delEmptyPaymentS} from '../../../../functions/formValidation';
import {addData, getNewTR} from '../../../../functions/functions.js';
import {AuthContext} from '../../../../contexts/useAuthContext';
import {readDataIncomeCompany, readDataIncExpCompany, addDPaymentsBatch, delDPaymentsBatch} from '../../../../functions/functions.js';
import { v4 as uuidv4 } from 'uuid';
import {SelectContext} from '../../../../contexts/useSelectContext';
import useWindowSize from '../../../../hooks/useWindowSize';

	const dateFormat = require('dateformat');	

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



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});


const VatModal = () =>{
	
  	const classes = useStyles();
	const scr = useWindowSize();
	let scrSize = (scr==='xs' || scr==='sm');
	
	const {vtDataC, setVtDataC, displayDialog, setDisplayDialog, value, setValue, setValueIncEx, setRedValid,
		  setSnackbar,} = useContext(VtContext);
	const {displayDialogSettings, runTab, settings, updtSettings} = useContext(SettingsContext);
    const {write, uidCollection} = useContext(AuthContext);					 						 				 
	const {date} = useContext(SelectContext);
	
	useEffect(()=>{
		
		const load=async()=>{
			 let tmpVT = await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'VT');
			setValue({...value, 'Transaction' : 'VT'.concat(tmpVT).concat('_' + uuidv4())});
		}
		
		if(value.Transaction==='')load();
	},[value, setValue, uidCollection])
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialog(false);
	}
	
	const pushArr=(valueVatTmp, val)=>{
		let tmp = {...valueVatTmp};
		let newTmp='';
	
		if(val.Vat===false){
					newTmp = ({...tmp, 'withVat': ((+tmp.withVat) + (+val.ExpAmntWthtoutVat))});
				}else{
					newTmp = ({...tmp, 'withoutVat': +tmp.withoutVat + (+val.ExpAmntWthtoutVat),
								 'Vat': +(+tmp.Vat + (+val.VatAmnt)).toFixed(2)   }); 
				}
		return newTmp;
	};
	
	
	const pushArrOtherIncome=(valueVatTmp, val)=>{
		let tmp = {...valueVatTmp};
		let newTmp='';
	
		if(val.Vat===false){
					newTmp = ({...tmp, 'withVat': ((+tmp.withVat) + (+val.IncAmntWthtoutVat))});
				}else{
					newTmp = ({...tmp, 'withoutVat': +tmp.withoutVat + (+val.IncAmntWthtoutVat),
								 'Vat': +(+tmp.Vat + (+val.VatAmnt)).toFixed(2)   }); 
				}
		return newTmp;
	};
	
	
	
	const pushArrEx=(valueVatTmpEx, val)=>{
		
		let tmp = {...valueVatTmpEx};
		let newTmp='';
		
	
		if(val.Vat===false){
				newTmp = ({...tmp, 'withVat': ((+tmp.withVat) + (+val.ExpAmntWthtoutVat))});
		}else{
				newTmp = ({...tmp, 'withoutVat': +tmp.withoutVat + (+val.ExpAmntWthtoutVat),
						   'Vat': +(+tmp.Vat + (+val.VatAmnt)).toFixed(2)		});
		}
	
		
		return newTmp;
	};
	
	const Calculate =async() =>{
		
		
		if(new Date(value.From) > new Date(value.To)){
			setSnackbar( {open:true, msg: 'Start date can not be bigger than End Date', variant: 'warning'});
			return;
		}
		
		let From = dateFormat(value.From, "yyyy-mm");
		let To = dateFormat(value.To, "yyyy-mm");
		
	
		let valueVatTmp={withVat:'', withoutVat:'', Vat:''};
		let valueVatTmpEx={withVat:'', withoutVat:'', Vat:''};
		
	
		let tmpDataIncomeMngmt =  await readDataIncomeCompany(uidCollection, 'expenses', From, To );  //Income Company
		for(let i=0; i<tmpDataIncomeMngmt.length; i++){  //Income
				valueVatTmp = pushArr(valueVatTmp, tmpDataIncomeMngmt[i]);
		}

		
		let tmpDataOtherIncome =  await readDataIncExpCompany(uidCollection, 'otherIncomeCompany', From, To ); //Other Income Company
		for(let i=0; i<tmpDataOtherIncome.length; i++){  //Income
				valueVatTmp = pushArrOtherIncome(valueVatTmp, tmpDataOtherIncome[i]);
		}
		
	
		let tmpDataExpIncome =  await readDataIncExpCompany(uidCollection, 'expensesCompany', From, To ); //Expenses
		for(let i=0; i<tmpDataExpIncome.length; i++){  //Expense
				valueVatTmpEx = pushArrEx(valueVatTmpEx,tmpDataExpIncome[i]);
		}

	
		 setValueIncEx(valueVatTmp,valueVatTmpEx);
	
	};
	
	
	const handleSave = async(e) => { 
		
		///validation
		let validation = formValidation(value,	['From','To']);
		
		if(!validation){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		if((Math.abs(value.VatPayRtrn) - +value.TtlPmnt)<0){
			setSnackbar( {open:true, msg: 'Total payment exceeds vat amount!', variant: 'warning'});
			return;
		}
		///////////////////
		let newPmnts = delEmptyPaymentS(value.Payments);
		let indx = vtDataC.findIndex(x=>x.Transaction===value.Transaction);
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Payments': newPmnts, 'm': dateFormat(value.From,'mm')};
	
	 	if(indx!==-1){ //Update the table
			const tmpArr = vtDataC.map(k =>
	 		   		k.Transaction===value.Transaction ? newObj : k  );
			setSnackbar( {open: (await addData(uidCollection, 'vatcalCompany',dateFormat(newObj.From,'yyyy'), newObj)), msg: 'Vat transaction has been updated!', variant: 'success'});
			setVtDataC(tmpArr);
			
			let pmtnsObj = newObj.Payments.map(x=>{
					return {...x, ExpInc: 'VAT',  VendChnnl: 'VAT Payment' , Date: new Date(x.Date), 'Transaction': newObj.Transaction, VatPayRtrn: newObj.VatPayRtrn}
			})
			
			let olPayments = vtDataC.filter(k => k.Transaction===value.Transaction)[0]['Payments'];
			
			await delDPaymentsBatch(uidCollection,'paymentsCompany',olPayments)
			await addDPaymentsBatch(uidCollection,'paymentsCompany',pmtnsObj)
			
			
		}else{ //add new data
			const tmpArr = [...vtDataC, newObj];
			setSnackbar( {open: (await addData(uidCollection, 'vatcalCompany',dateFormat(newObj.From,'yyyy'), newObj)), msg: 'New Vat transaction has been added!', variant: 'success'});
			
			
			
			if(	 dateFormat(newObj.From,'yyyy')===String(date.year)){
				let tmp = tmpArr.map(x => //for another two columns
			 		({...x, 'IncWithVat': x.valueInc.withVat , 'ExpWithVat': x.valuex.withVat})
					 )
				
				setVtDataC(tmp);
			}
			
			let pmtnsObj = newObj.Payments.map(x=>{
					return {...x, ExpInc: 'VAT',  VendChnnl: 'VAT Payment' , Date: new Date(x.Date), 'Transaction': newObj.Transaction, VatPayRtrn: newObj.VatPayRtrn}
			})
			
			await addDPaymentsBatch(uidCollection,'paymentsCompany',pmtnsObj)
			
		} 
	 	setDisplayDialog(false);
	 }
	
	const DialogHeader =  <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
				{scrSize ? 'Vat Details': 'Company Vat Details'}
            </Typography>
			  {write && <Button color="inherit" onClick={handleSave} >
              Save
            </Button>}
          </Toolbar>
        </AppBar>;

	return (
			
			  <Dialog fullScreen style={!scrSize? {left: '15em'}: {left: '0'}} open={displayDialog} onClose={closeDialog} TransitionComponent={Transition}>
				
					{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods ? settings.pmntMethods: []}
						updtSettings={updtSettings} lbl='Add new payment method'
					name='pmntMethods' snkbar='payment method' typelist='pmnts'
						ttl='Payment Methods'/> : null}
				
				{DialogHeader}
				<VatModalDetails Calculate={Calculate}	/>	
			  </Dialog>
    );
    };

export default VatModal;

      
	
	  
	 
      