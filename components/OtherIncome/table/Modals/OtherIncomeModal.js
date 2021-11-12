import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import OtherIncomeModalDetails from './OtherIncomeModalDetails';
import IconButton from '@material-ui/core/IconButton';
import {OiContext} from '../../../../contexts/useOiContext';
import PMmodal from '../../../Settings/modals/listOfItems/PMmodal';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import SnackBar from '../../../Subcomponents/SnackBar';
import {formValidation, delEmptyPaymentS} from '../../../../functions/formValidation';
import {addData, updateField, getNewTR, addDPaymentsBatch, delDPaymentsBatch} from '../../../../functions/functions.js';
import { v4 as uuidv4 } from 'uuid';
import {SelectContext} from '../../../../contexts/useSelectContext';
import {AuthContext} from '../../../../contexts/useAuthContext';
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

const OtherIncomeModal = (props) =>{
	
  	const classes = useStyles();
	const scr = useWindowSize();
	let scrSize = (scr==='xs' || scr==='sm');
	
	const {displayDialog, setDisplayDialog, setRedValid, value, setValue,  otherInc, setOtherInc ,
		   snackbar, setSnackbar} = useContext(OiContext);
	const {displayDialogSettings, runTab, settings, updtSettings,
		   	setSettingsShows, settingsShows} = useContext(SettingsContext);
	const {date, propertySlct} = useContext(SelectContext);
	const {uidCollection, write} = useContext(AuthContext);
	
	useEffect(()=>{
		
		const load=async()=>{
			 let tmpOI = await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'OI');
			setValue({...value, 'Transaction' : 'OI'.concat(tmpOI).concat('_' + uuidv4())});
		}
		
		if(value.Transaction==='')load();
	},[value, setValue, uidCollection])
	
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialog(false);
	}
	
	const updateSettingsShows = async()=>{
		
		let pmnts = value.Payments.map(x=>x.PM);
		let incomeID = value.incType;
	
		///payments
	 	let obj = {};
		for(let i in pmnts){
			if(pmnts[i]!==''){
				obj[pmnts[i]]=true;
			}
		}
	 	
		if(obj.length!==0){
			for(let key in obj) {
				await updateField(uidCollection, 'settingsShows', 'shows', [key], true)
			}		
		}
		//////
		
		//vendor+extype+ property + apartment + owner
			let tmp = {...settingsShows, ...obj, [incomeID] : true};
			setSettingsShows(tmp)
		
			await updateField(uidCollection, 'settingsShows', 'shows', [incomeID], true)
	}
	
	const handleSave = async() => { 
		
		///validation
		
		let validation = formValidation(value,
						['incType', 'AccDate', 'Amnt']);
		
		if(!validation){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		
		if(value.Blnc<0){
			setSnackbar( {open:true, msg: 'Total payment exceeds expense amount!', variant: 'warning'});
			return;
		}
		///////////////////
		let newPmnts = delEmptyPaymentS(value.Payments);
		let indx = otherInc.findIndex(x=>x.Transaction===value.Transaction);
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Payments': newPmnts, 'Amnt': +(+value.Amnt).toFixed(2), 'VatAmnt': +(+value.Amnt - +value.IncAmntWthtoutVat).toFixed(2),
					 'm': dateFormat(value.AccDate,'mm')};
	
	//	const tmpExtraCmsn = settings.properties.filter(x => value.PrpName===x.id)[0]['ExtraRevCommission']; //Management Commission
		const tmpMngCmsnVatYesNo = settings.properties.filter(x => value.PrpName===x.id)[0]['inclVat']; 
		if(tmpMngCmsnVatYesNo==null){
			setSnackbar( {open:true, msg: 'Property management commission settings are not defined', variant: 'warning'});
			return;
		}
		const tmpMngCmsnAddVatYesNo = settings.properties.filter(x=>value.PrpName===x.id)[0]['addVat'];
		if(tmpMngCmsnAddVatYesNo==null){
			setSnackbar( {open:true, msg: 'Property management commission settings are not defined', variant: 'warning'});
			return;
		}
		
		
		
		
	 	if(indx!==-1){ //Update the table
			const tmpArr = otherInc.map(k =>
	 		   		k.Transaction===value.Transaction ? newObj : k  );
			setSnackbar( {open: (await addData(uidCollection, 'otherIncome',dateFormat(newObj.AccDate,'yyyy'),newObj)), msg: 'Income has been updated!', variant:
						  'success'});
			updateSettingsShows();
			setOtherInc(tmpArr);
			
			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'ExpInc': 'Extra Revenue',  VendChnnl: value.incType, 'Date': new Date(x.Date), 'Transaction': value.Transaction,
								'Fund': settings.properties.filter(x=>x.id===propertySlct)[0]['Fund']}
			})
			
			let olPayments = otherInc.filter(k => k.Transaction===value.Transaction)[0]['Payments'];
			
			await delDPaymentsBatch(uidCollection,'payments',olPayments)
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
			
		}else{ //add new data
			
			
		//	let MngTRexCmsn = 'EX'.concat( await getNewTR(uidCollection, 'lastTR', 'lastTR', 'EX')).concat('_' + uuid()); //Management Commission transaction
		//	const tmpObj = {...newObj, 'MngTRexCmsn': MngTRexCmsn} //new Object incl commission transactions
		//	let tmpArrAdd = [...otherInc, tmpObj];
	//		createCommissionExpense( MngTRexCmsn, tmpExtraCmsn, tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo); 
			
			
			
			
			
			setSnackbar( {open: (await addData(uidCollection, 'otherIncome',dateFormat(newObj.AccDate,'yyyy'),newObj)), msg: 'New Income has been added!', variant:
						  'success'});
			
			updateSettingsShows()

				if(	(date.month!==12 && dateFormat(String(date.year).concat('-').concat(date.month+1),'yyyy-mm') === dateFormat(newObj.AccDate,'yyyy-mm')) ||
			   			(date.month===12 && dateFormat(newObj.AccDate,'yyyy')===String(date.year))){
					const tmpArr = [...otherInc, newObj];
					setOtherInc(tmpArr);
				}

			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'ExpInc': 'Extra Revenue',  VendChnnl: value.incType, 'Date': new Date(x.Date), 'Transaction': value.Transaction,
								'Fund': settings.properties.filter(x=>x.id===propertySlct)[0]['Fund']}
			})
			
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)	
			
		} 
	 	setDisplayDialog(false);
	 }
	
	
/*	const createCommissionExpense =async(MngTRexCmsn, tmpExtraCmsn, tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo)=>{
	
			let tmpMngCmsnVal = MngCmsnObj(tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo, tmpExtraCmsn, MngTRexCmsn );
	
		console.log(	tmpMngCmsnVal	)
		//	await addData(uidCollection, 'expenses', dateFormat(value.ChckIn,'yyyy'), tmpMngCmsnVal)
		
	} */
	
/*	const MngCmsnObj=(tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo, tmpExtraCmsn, MngTRexCmsn )=>{
		
		const vt = settings.vat.substring(0, settings.vat.length - 1)/100; 
		const tmpAmnt = tmpMngCmsnVatYesNo==='Yes' ? value.Amnt: value.IncAmntWthtoutVat; 
		
		console.log(tmpAmnt)
		console.log(tmpExtraCmsn)
		console.log(vt)
		
		
		
		let FullAmount = tmpMngCmsnAddVatYesNo==='Yes' ? +(tmpAmnt*tmpExtraCmsn/100).toFixed(2) + +(vt*tmpAmnt*tmpExtraCmsn/100).toFixed(2):(+tmpAmnt*tmpExtraCmsn/100).toFixed(2); //For expense Table
		
	//	console.log(FullAmount)
		
		return {'LstSave' : dateFormat(Date(),'dd-mmm-yyyy'), 'ExpType': 'Extra Rev. commission',
					 	'vendor': settings.CompDtls.cpmName, 'Transaction': MngTRexCmsn, 'AccDate': value.AccDate,
					 	'PrpName': value.PrpName, 'CostType': 'Variable Cost', 'TtlPmnt': 0,
					 	'Amnt': +FullAmount,
						'AmntWihtoutVat': +(+tmpAmnt*tmpExtraCmsn/100).toFixed(2),
						'BlncExp': +FullAmount - 0,  // 0 means totall payment
						'OI': value.Transaction,	'RsrvAmnt': tmpAmnt,
					  	'RsrvAmntDesc': !value.Vat || tmpMngCmsnVatYesNo==='No' ? 'NoVat': 'YesVat',
					  	'Vat': tmpMngCmsnAddVatYesNo==='Yes' ? true:false,
						'VatAmnt': tmpMngCmsnAddVatYesNo==='Yes' ? +(vt*tmpAmnt*tmpExtraCmsn/100).toFixed(2):0, //for Company Revenue table
						'CmsnVat': +(+tmpAmnt*tmpExtraCmsn/100).toFixed(2) + +(tmpMngCmsnAddVatYesNo==='Yes' ? (vt*tmpAmnt*tmpExtraCmsn/100).toFixed(2):''),
					 	'ExpAmntWthtoutVat' : (+tmpAmnt*tmpExtraCmsn/100).toFixed(2), 
						'm': dateFormat(value.AccDate,'mm')}
								
	} */
	
    const DialogHeader =  <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
				{scrSize ? 'Extra Revenue': 'Extra Revenue Details'}
            </Typography>
			  {write &&  <Button color="inherit" onClick={handleSave} > 
              Save
            </Button> }
          </Toolbar>
        </AppBar>;

	return (
			<>
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			  <Dialog fullScreen style={!scrSize? {left: '15em'}: {left: '0'}} open={displayDialog}
				  onClose={closeDialog} TransitionComponent={Transition}>
					{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods ? settings.pmntMethods : []}
								updtSettings={updtSettings} lbl='Add new payment method'
								typelist='pmnts'
								ttl='Payment Methods'
								name ='pmntMethods' snkbar='payment method' /> : null}
					{runTab === 'incTypeCompany' && displayDialogSettings ? <PMmodal list={settings.incType ? settings.incType : []}
								 updtSettings={updtSettings} lbl='Add new income type' name ='incType'
								 snkbar='income type'
								 ttl='Other Income Type'/> : null}
			
				{DialogHeader}
				<OtherIncomeModalDetails 	/>	
			  </Dialog>
		</>
    );
    };

export default OtherIncomeModal;

      
	
	  
	 
      