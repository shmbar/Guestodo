import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import OrderModalDetails from './OrderModalDetails';
import IconButton from '@material-ui/core/IconButton';
import {RcContext} from '../../../../contexts/useRcContext';
import Tab4Modal from '../../../Settings/modals/Tab4Modal';
import Tab2Modal from '../../../Settings/modals/Tab2Modal';
import Tab3Modal from '../../../Settings/modals/Tab3Modal';
import PMmodal from '../../../Settings/modals/listOfItems/PMmodal';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import SnackBar from '../../../Subcomponents/SnackBar';
import {formValidation, checkDates, delEmptyPaymentS} from '../../../../functions/formValidation';
import {addData, updateField, delData, getNewTR, deleteSlots, addSlots, updateSlots, addDPaymentsBatch, delDPaymentsBatch} from '../../../../functions/functions.js';
import {AuthContext} from '../../../../contexts/useAuthContext';
import { v4 as uuidv4 } from 'uuid';
import GridLoader from 'react-spinners/GridLoader';  // //https://www.react-spinners.com/
import {SelectContext} from '../../../../contexts/useSelectContext';
import { css } from '@emotion/core';
import useWindowSize from '../../../../hooks/useWindowSize';

import './modals.css';

const override = css`
	position: fixed;
	left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -75px;
    display: block;
    border-color: red;
`;

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
	},
 btn:{
	 fontSize:'16px',
	 background: '#3F4E8C',
	 marginLeft: '10px',
	 textTransform: 'none'
 }
}));

const dateFormat = require('dateformat');	

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
})


const OrdersModal = (props) =>{

  	const classes = useStyles();
	const scr = useWindowSize();
	let scrSize = (scr==='xs' || scr==='sm');

	const {rcDataPrp, setRcDataPrp,value,setValue,displayDialog, setDisplayDialog,
		   	setRedValid, snackbar, setSnackbar, isSlotAvailable} = useContext(RcContext);
	const {displayDialogSettings, runTab, settings, updtSettings,
		   settingsShows, setSettingsShows, displayDialogSettingsApt, setLoading, loading} = useContext(SettingsContext);
	const {write, uidCollection} = useContext(AuthContext);					 						 				 
	const {date} = useContext(SelectContext);
	
	 const [valueTab, setValueTab] = React.useState(0);

 	 function handleChangeTab(newValue) {
    	setValueTab(newValue);
 	 }
	
	useEffect(()=>{
		
		const load=async()=>{
			 let tmpRC = await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'RC');
			setValue({...value, 'Transaction' : 'RC'.concat(tmpRC).concat('_' + uuidv4())});
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
		let channelID = value.RsrvChn;
		let prprtyID = value.PrpName;
		let aptID = value.AptName;
		
		
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
		
		//channel + property + apartment + owner
			let tmp = {...settingsShows, ...obj, [channelID] : true, [prprtyID] : true, [aptID] : true, [ownerID]: true};
			setSettingsShows(tmp)
		
			await updateField(uidCollection, 'settingsShows', 'shows', [ownerID], true)
			await updateField(uidCollection, 'settingsShows', 'shows', [channelID], true)
			await updateField(uidCollection, 'settingsShows', 'shows', [prprtyID], true)
			await updateField(uidCollection, 'settingsShows', 'shows', [aptID], true)
	}
	
	///////////////////////////////////////////////////////////////
	
	const createCmsnObj=(ChnlTRex, tmpChnlCmsnPrcntg)=>{
	
		return {'LstSave' : dateFormat(Date(),'dd-mmm-yyyy'), 'ExpType': 'Channel advance commission',
					 'vendor': value.RsrvChn, 'Transaction': ChnlTRex, 'AccDate': value.ChckIn,
					 'PrpName': value.PrpName, 'AptName': value.AptName, 'CostType': 'Variable Cost',
					 'TtlPmnt': value.Vat ? (+value.TtlPmnt/(1+parseFloat(settings.vat)/100)*tmpChnlCmsnPrcntg/100) : //omit the Vat from payment
					  ((+value.TtlPmnt)*tmpChnlCmsnPrcntg/100).toFixed(2),
					 'Amnt': +(+value.TtlRsrvWthtoutVat*tmpChnlCmsnPrcntg/100).toFixed(2), 'BlncExp': '', 'RC': value.Transaction, 'VatAmnt': 0,
					'ExpAmntWthtoutVat' : +(+value.TtlRsrvWthtoutVat*tmpChnlCmsnPrcntg/100).toFixed(2), 'GstName' : value.GstName,
					'm': dateFormat(value.ChckIn,'mm')}
	}
	
	const MngCmsnObj=(tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo, tmpMngCmsn, MngTRexCmsn )=>{
		
		const vt = settings.vat.substring(0, settings.vat.length - 1)/100; 
		const tmpAmnt = tmpMngCmsnVatYesNo==='Yes' ? value.RsrvAmnt: value.TtlRsrvWthtoutVat; //Reservation Amount
		let FullAmount = tmpMngCmsnAddVatYesNo==='Yes' ? +(tmpAmnt*tmpMngCmsn/100).toFixed(2) + +(vt*tmpAmnt*tmpMngCmsn/100).toFixed(2):(+tmpAmnt*tmpMngCmsn/100).toFixed(2); //For expense Table
		
		return {'LstSave' : dateFormat(Date(),'dd-mmm-yyyy'), 'ExpType': 'Management commission',
					 	'vendor': settings.CompDtls.cpmName, 'Transaction': MngTRexCmsn, 'AccDate': value.ChckIn,
					 	'PrpName': value.PrpName, 'AptName': value.AptName, 'CostType': 'Variable Cost', 'TtlPmnt': 0,
					 	'Amnt': +FullAmount,
						'AmntWihtoutVat': +(+tmpAmnt*tmpMngCmsn/100).toFixed(2),
						'BlncExp': +FullAmount - 0,  // 0 means totall payment
						'RC': value.Transaction,	'RsrvAmnt': tmpAmnt,
					  	'RsrvAmntDesc': !value.Vat || tmpMngCmsnVatYesNo==='No' ? 'NoVat': 'YesVat',
					  	'Vat': tmpMngCmsnAddVatYesNo==='Yes' ? true:false,
						'VatAmnt': tmpMngCmsnAddVatYesNo==='Yes' ? +(vt*tmpAmnt*tmpMngCmsn/100).toFixed(2):0, //for Company Revenue table
						'CmsnVat': +(+tmpAmnt*tmpMngCmsn/100).toFixed(2) + +(tmpMngCmsnAddVatYesNo==='Yes' ? (vt*tmpAmnt*tmpMngCmsn/100).toFixed(2):''),
					 	'ExpAmntWthtoutVat' : (+tmpAmnt*tmpMngCmsn/100).toFixed(2), 'GstName' : value.GstName,
						'm': dateFormat(value.ChckIn,'mm')}
	}
	
	////////////////////////////////////////////////////////////////
	
	const handleSave = async() => { 
	
		//validation
		let validation = formValidation(value,
						['GstName','RsrvChn','ChckIn','ChckOut', 'AptName','NetAmnt']);
		
		if(value.pStatus==='Cancelled' && value.CnclFee===''){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Cancellation amount is missing', variant: 'warning'});
			return};

		if(settings.vat==null){
			setSnackbar( {open:true, msg: 'Vat is missing', variant: 'warning'});
			return};
		
		if(settings.CompDtls==null){
			setSnackbar( {open:true, msg: 'Company details are missing', variant: 'warning'});
			return};
		
		
		if(!validation){
			setRedValid(true);
			setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
		
		let datesValidation = checkDates(settings, value);
		if(!datesValidation){
			setSnackbar( {open:true, msg: 'Check in date does not align with the property dates!',
						  variant: 'warning'});
			return};
		
		if(value.BlncRsrv<0){
			setSnackbar( {open:true, msg: 'Total payment exceeds reservation amount!', variant: 'warning'});
			return;
		}
		
		if(!isSlotAvailable){
			setSnackbar( {open:true, msg: 'This apartment is already reserved for the selected dates!', variant: 'warning'});
			return;
		}

		
		setLoading(true)
		
		///////////////////
		let newPmnts = delEmptyPaymentS(value.Payments).map(x=> ({...x, 'P': (x.P==='') ? '' :	+(+x.P).toFixed(2) }));
		const indx = rcDataPrp.findIndex(x=>x.Transaction===value.Transaction);
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Payments': newPmnts, 'm': dateFormat(value.ChckIn,'mm')};
	
		//const tmpChnlCmsn = settings.channels.filter(x => value.RsrvChn===x.id)[0]['MngCmsn']; 
		const tmpChnlCmsnPrcntg = settings.channels.filter(x => value.RsrvChn===x.id)[0]['ChnCmsn']; //Channel Commission
		const tmpChnlCmsn = tmpChnlCmsnPrcntg!=='' ? true: false; //if not empty then true
		newObj = {...newObj, 'ChnPrcnt' : tmpChnlCmsnPrcntg};
		const tmpMngCmsn = settings.properties.filter(x => value.PrpName===x.id)[0]['ManagCommission']; //Management Commission
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
		
		//if to add Vat to the management commission or not
		
		let ChnlTRex = value.ChnlTRex; //Channel commission transaction => if exists
		let MngTRexCmsn = value.MngTRexCmsn;  //Management commission transaction => if exists
		
		let oldVal = rcDataPrp.filter(k => k.Transaction===value.Transaction)[0];
		let startDold;
		let endDold;
		
		if(oldVal!=null){
			startDold = oldVal.ChckIn
			endDold = oldVal.ChckOut
		}
		
		let tmpArrUpdate = rcDataPrp.map(k => //update the list of reservations
	 		   		k.Transaction===value.Transaction ? newObj : k);
	
		if(indx!==-1){ //Update the table
			if(!tmpChnlCmsn){ // no channel commission, update reservation and delete channel commission
				
				if(ChnlTRex!==undefined){ //ChnlTRex exists => delete it
					delete newObj.ChnlTRex;
					await delData(uidCollection, 'expenses', dateFormat(newObj.ChckIn,'yyyy'),ChnlTRex); //delete commission from server

				}	
				//update management commission only if the reservaion is confirmed or cancelled
				if(newObj.pStatus!=='Tentative'){
					let tmpMngCmsnVal = MngCmsnObj(tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo, tmpMngCmsn, MngTRexCmsn )
					await addData(uidCollection, 'expenses',dateFormat(value.ChckIn,'yyyy'), tmpMngCmsnVal)
				}
				

			}else{ //should be commission => normal update
					if(ChnlTRex===undefined){ //ChnlTRex doesn't exist
						newObj.ChnlTRex = 'EX'.concat( await getNewTR(uidCollection, 'lastTR', 'lastTR', 'EX')).concat('_' + uuidv4()); //create new commission transaction
					}

					if(newObj.pStatus!=='Tentative')updateCommissionExpense(newObj.ChnlTRex, newObj.MngTRexCmsn, tmpChnlCmsnPrcntg, tmpMngCmsn, tmpMngCmsnVatYesNo,
										tmpMngCmsnAddVatYesNo)
			}
			
			
			setSnackbar( {open: (await addData(uidCollection, 'reservations',dateFormat(newObj.ChckIn,'yyyy'), newObj)), msg: 'Order has been updated!',
						  variant: 'success'});
			
			if(value.pStatus==='Confirmed'){ //Reservation is active
				//in case apt is changed, find the previous apt
				
				let oldApt = rcDataPrp.filter(k => k.Transaction===value.Transaction)[0]['AptName'];
				updateSlots(uidCollection, oldApt, value.AptName,value.Transaction, value.ChckIn,value.ChckOut, startDold , endDold)
			}else if(value.pStatus==='Cancelled'){
				deleteSlots(uidCollection, value.AptName , value.Transaction, value.ChckIn, value.ChckOut)
			}
			
			setRcDataPrp(tmpArrUpdate);
			
			
			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'RsrvChn': value.RsrvChn, 'Date': new Date(x.Date), 'Transaction': newObj.Transaction,
							'Fund': settings.properties.filter(x=>x.id===value.PrpName)[0]['Fund'], ChnPrcnt: newObj.ChnPrcnt, Vat: newObj.Vat, 
							ChnlTRex: !tmpChnlCmsn ? '': newObj.ChnlTRex}
			})
			let olPayments = rcDataPrp.filter(k => k.Transaction===value.Transaction)[0]['Payments'];
			
			await delDPaymentsBatch(uidCollection,'payments',olPayments)
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
			
			
			updateSettingsShows(); 
		//	setLoading(false)
		}else{ //add new data
				if(!tmpChnlCmsn){  //no channel commission,
					MngTRexCmsn = 'EX'.concat( await getNewTR(uidCollection, 'lastTR', 'lastTR', 'EX')).concat('_' + uuidv4()); //Management Commission transaction
					const tmpObj = {...newObj, 'MngTRexCmsn': MngTRexCmsn} //new Object incl commission transactions
					let tmpArrAdd = [...rcDataPrp, tmpObj];
					//tmpArrAdd=tmpArrAdd.filter(x=> !(x.IcalTransaction===tmpObj.IcalTransaction && x.Transaction==null)); //filter out the ical after adding
					setSnackbar( {open: (await addData(uidCollection, 'reservations',dateFormat(tmpObj.ChckIn,'yyyy'), tmpObj)), msg: 'New Order has been added!',
							  variant: 'success'});
					updateSettingsShows(); 

					if(	(date.month!==12 && dateFormat(String(date.year).concat('-').concat(date.month+1),'yyyy-mm') === dateFormat(tmpObj.ChckIn,'yyyy-mm')) ||
							((date.month===12 && dateFormat(tmpObj.ChckIn,'yyyy')===dateFormat(String(date.year),'yyyy')))){	
						setRcDataPrp(tmpArrAdd);
					}

					if(tmpObj.pStatus!=='Tentative')createCommissionExpense(false, MngTRexCmsn, tmpChnlCmsnPrcntg, tmpMngCmsn,
																			tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo); 
					//do nothing for channel commission , managemnt transaction, management commisson, include or not include vat
				}else{
					ChnlTRex = await 'EX'.concat( await  getNewTR(uidCollection, 'lastTR', 'lastTR', 'EX')).concat('_' + uuidv4()); //value.tmpChanneCommissionTR;  //channel Advance Commission transaction
					MngTRexCmsn =await 'EX'.concat( await getNewTR(uidCollection, 'lastTR', 'lastTR', 'EX')).concat('_' + uuidv4()); //value.tmpMngCommissionTR; //Management Commission transaction
					const tmpObj = {...newObj, 'ChnlTRex': ChnlTRex, 'MngTRexCmsn': MngTRexCmsn} //new Object incl commission transactions

					let tmpArrAdd = [...rcDataPrp, tmpObj ];
					//tmpArrAdd=tmpArrAdd.filter(x=> !(x.IcalTransaction===tmpObj.IcalTransaction && x.Transaction==null)); //filter out the ical after adding


					setSnackbar( {open: (await addData(uidCollection, 'reservations',dateFormat(tmpObj.ChckIn,'yyyy'), tmpObj)), msg: 'New Order has been added!',
							  variant: 'success'});
					updateSettingsShows(); 


					if((date.month!==12	&& dateFormat(String(date.year).concat('-').concat(date.month+1),'yyyy-mm') === dateFormat(tmpObj.ChckIn,'yyyy-mm')) ||
							((date.month===12 && dateFormat(tmpObj.ChckIn,'yyyy')===dateFormat(String(date.year),'yyyy')))){	
						setRcDataPrp(tmpArrAdd);
					}

					if(tmpObj.pStatus!=='Tentative')createCommissionExpense(ChnlTRex, MngTRexCmsn, tmpChnlCmsnPrcntg, tmpMngCmsn, tmpMngCmsnVatYesNo,
																			tmpMngCmsnAddVatYesNo); 
					//channel transacton, managemnt transaction, management commisson, include or not include vat

				}
			
			if(value.pStatus!=='Cancelled'){ //Reservation is active
				addSlots(uidCollection, value.AptName,value.Transaction, value.ChckIn,value.ChckOut)
			}
			
			
			//Payments
			let pmtnsObj = value.Payments.map(x=>{
					return {...x, 'RsrvChn': value.RsrvChn, 'Date': new Date(x.Date), 'Transaction': value.Transaction,
							'Fund': settings.properties.filter(x=>x.id===value.PrpName)[0]['Fund'], ChnPrcnt: newObj.ChnPrcnt, Vat: value.Vat,
							ChnlTRex: !tmpChnlCmsn ? '': ChnlTRex}
			})
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
										   
		} 
		setLoading(false)
	 	setDisplayDialog(false);
		setRedValid(false);
	
	 }
	
	
	const updateCommissionExpense=async(ChnlTRex, MngTRexCmsn, tmpChnlCmsnPrcntg, tmpMngCmsn, tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo)=>{
			
			let tmpChannelCmsnVal= createCmsnObj(ChnlTRex, tmpChnlCmsnPrcntg);
			let tmpMngCmsnVal = MngCmsnObj(tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo, tmpMngCmsn, MngTRexCmsn )
		
			await addData(uidCollection, 'expenses',dateFormat(value.ChckIn,'yyyy'), tmpChannelCmsnVal)
			await addData(uidCollection, 'expenses',dateFormat(value.ChckIn,'yyyy'), tmpMngCmsnVal)

	}
	
	const createCommissionExpense =async(ChnlTRex, MngTRexCmsn, tmpChnlCmsnPrcntg, tmpMngCmsn, tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo)=>{
	
			let tmpChannelCmsnVal = ChnlTRex!==false && createCmsnObj(ChnlTRex, tmpChnlCmsnPrcntg);
			let tmpMngCmsnVal = MngCmsnObj(tmpMngCmsnVatYesNo, tmpMngCmsnAddVatYesNo, tmpMngCmsn, MngTRexCmsn );
	
			if( ChnlTRex!==false){ await addData(uidCollection, 'expenses',dateFormat(value.ChckIn,'yyyy'), tmpChannelCmsnVal) }
			await addData(uidCollection, 'expenses', dateFormat(value.ChckIn,'yyyy'), tmpMngCmsnVal)
		
	}

	
	const DialogHeader =  <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
			<Typography variant="h6" className={classes.title}>
				<Button color="inherit"  className={classes.btn} onClick={()=>handleChangeTab(0)} >
              		Reservation Details
				</Button>	
				<Button color="inherit"  className={classes.btn} onClick={()=>handleChangeTab(1)} >
              		Guest Details
				</Button>
            </Typography>
			  
		  	<div>
					<GridLoader
						  css={override}
						  sizeUnit={"px"}
						  size={50}
						  color={'#012c61'}
						  loading={loading}
					/>
			</div> 
			  
			  {write && <Button color="inherit"  onClick={handleSave}>
              Save
            </Button>}
          </Toolbar>
        </AppBar>;
	
	
	const checkCommission=()=>{
		 let notNewForm = settings.channels==null ? false : settings.channels.filter(x=> x.id===value.RsrvChn)[0]!==undefined //not new form
	
		 if(notNewForm && value.NetAmnt!==''){ //value.NetAmnt!=='' link from ical
			const ChnCmsnExist = value.ChnlTRex!=null;
			const actualCommission =  +settings.channels.filter(x=> x.id===value.RsrvChn)[0]['ChnCmsn']*1; 
			const savedCommission = value.ChnPrcnt!=null ? value.ChnPrcnt*1 : value.ChnPrcnt;
		
			//const tmpChnlCmsn = settings.channels.filter(x => value.RsrvChn===x.id)[0]['MngCmsn']; 
			if(savedCommission!== actualCommission && actualCommission!=='' && ChnCmsnExist && savedCommission!=null){
				setSnackbar( {open: true, msg: `Channel Service Fee has been changed from 
				${Math.round(savedCommission)}% to ${actualCommission}%` , variant: 'warning'});
			}
		 }
	}
	
	return (
		<>
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar} variant={snackbar.variant}/>
			  <Dialog fullScreen style={!scrSize? {left: '15em'}: {left: '0'}} open={displayDialog}
				  onClose={closeDialog} TransitionComponent={Transition} TransitionProps={{ onEntered: checkCommission}}>
				{runTab === 'Tab4' && displayDialogSettings ? <Tab4Modal setSnackbar={setSnackbar} /> : null}
				{runTab === 'Tab2' && displayDialogSettings ? <Tab2Modal setSnackbar={setSnackbar}
					  runFromOrders={true} /> : null}
				{runTab === 'TabApt' && displayDialogSettingsApt ? <Tab3Modal setSnackbar={setSnackbar}
					   runFromOrders={true} /> : null}
				{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods ? settings.pmntMethods : []}
						updtSettings={updtSettings}
						name='pmntMethods'
						lbl='Add new payment method'
						typelist='pmnts'
						ttl='Payment Methods'
						snkbar='payment method'/> : null}
			
			{DialogHeader}
				<OrderModalDetails 	valueTab={valueTab}/>	
			  </Dialog>
		</>
    );
    };

export default OrdersModal;

