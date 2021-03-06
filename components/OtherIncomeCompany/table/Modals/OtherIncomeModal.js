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
import useWindowSize from '../../../../hooks/useWindowSize';;

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
	
	const {displayDialog, setDisplayDialog, setRedValid, value, setValue,  otherIncC, setOtherIncC ,
		   snackbar, setSnackbar} = useContext(OiContext);
	const {displayDialogSettings, runTab, settings, updtSettings,
		   	setSettingsShows, settingsShows} = useContext(SettingsContext);
	const {date} = useContext(SelectContext);
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
		let incomeID = value.incType
	
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
		let indx = otherIncC.findIndex(x=>x.Transaction===value.Transaction);
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Payments': newPmnts, 'Amnt': +(+value.Amnt).toFixed(2), 'VatAmnt': +(+value.Amnt - +value.IncAmntWthtoutVat).toFixed(2),
					 'm': dateFormat(value.AccDate,'mm')};
			
	 	if(indx!==-1){ //Update the table
			const tmpArr = otherIncC.map(k =>
	 		   		k.Transaction===value.Transaction ? newObj : k  );
			setSnackbar( {open: (await addData(uidCollection, 'otherIncomeCompany',dateFormat(newObj.AccDate,'yyyy'),newObj)), msg: 'Income has been updated!', variant:
						  'success'});
			updateSettingsShows();
			setOtherIncC(tmpArr);
			
			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'ExpInc': 'Extra Revenue',  VendChnnl: value.incType, 'Date': new Date(x.Date), 'Transaction': value.Transaction}
			})
			
			let olPayments = otherIncC.filter(k => k.Transaction===value.Transaction)[0]['Payments'];
			
			await delDPaymentsBatch(uidCollection,'paymentsCompany',olPayments)
			await addDPaymentsBatch(uidCollection,'paymentsCompany',pmtnsObj)
			
		}else{ //add new data
			
			setSnackbar( {open: (await addData(uidCollection, 'otherIncomeCompany',dateFormat(newObj.AccDate,'yyyy'),newObj)), msg: 'New Income has been added!', variant:
						  'success'});
			
			updateSettingsShows()
				if(	(date.month!==12 && dateFormat(String(date.year).concat('-').concat(date.month+1),'yyyy-mm') === dateFormat(newObj.AccDate,'yyyy-mm')) ||
			   			(date.month===12 && dateFormat(newObj.AccDate,'yyyy')===String(date.year))){
					const tmpArr = [...otherIncC, newObj];
					setOtherIncC(tmpArr);
				}

			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'ExpInc': 'Extra Revenue',  VendChnnl: value.incType, 'Date': new Date(x.Date), 'Transaction': value.Transaction}
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
				{scrSize ? 'Extra Revenue': 'Company Extra Revenue Details'}
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
					{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods ? settings.pmntMethods : []}
								updtSettings={updtSettings} lbl='Add new payment method'
								typelist='pmnts'
								ttl='Payment Methods'
								name ='pmntMethods' snkbar='payment method' /> : null}
					{runTab === 'incTypeCompany' && displayDialogSettings ? <PMmodal list={settings.incTypeCompany ? settings.incTypeCompany : []}
								 updtSettings={updtSettings} lbl='Add new income type' name ='incTypeCompany'
								 snkbar='income type'
								 ttl='Other Income Type'/> : null}
			
				{DialogHeader}
				<OtherIncomeModalDetails 	/>	
			  </Dialog>
		</>
    );
    };

export default OtherIncomeModal;

      
	
	  
	 
      