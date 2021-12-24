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
import {addData, getNewTR, readDataPropsDatesRange, addDPaymentsBatch,
		delDPaymentsBatch, getFees, getTaxes} from '../../../../functions/functions.js';
import useWindowSize from '../../../../hooks/useWindowSize';
import {AuthContext} from '../../../../contexts/useAuthContext';
import {SelectContext} from '../../../../contexts/useSelectContext';
import { v4 as uuidv4 } from 'uuid';

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
	
	const {vtData, setVtData, displayDialog, setDisplayDialog, value, setValue, setValueIncEx,
		   setRedValid,  setSnackbar} = useContext(VtContext);
	const {displayDialogSettings, runTab, settings, updtSettings} = useContext(SettingsContext);
    const {write, uidCollection} = useContext(AuthContext);					 						 
	const {fundSlct} = useContext(SelectContext);
	
	
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
		const vatProperty = settings.properties.filter(x=> x.id===val.PrpName)[0]['VAT'];
		
		if(val.Vat===false){
			newTmp = ({...tmp, 'withVat': +(+tmp.withVat + (+val.NetAmnt + 
								+getFees(val, val.NetAmnt ))).toFixed(2)});
		}else{
			newTmp = ({...tmp, 'withoutVat': +(+tmp.withoutVat +
				   (+val.TtlRsrvWthtoutVat + +getFees(val, val.NetAmnt )/
					(1 + parseFloat(vatProperty)/100))).toFixed(2),
			   		'Vat': +(+tmp.Vat + (+val.RsrvAmnt - +val.TtlRsrvWthtoutVat -
							getFees(val, val.NetAmnt )/(1 + parseFloat(vatProperty)/100) -
							+getTaxes(val, val.NetAmnt ))).toFixed(2)
			});
		}
		return newTmp;
	};
	
	const pushArrEx=(valueVatTmpEx, val)=>{
		
		let tmp = {...valueVatTmpEx};
		let newTmp='';
		
		if(val.ExpType==='Channel advance commission'){
			newTmp = {...tmp, 'withVat': +((+tmp.withVat) + (+val.ExpAmntWthtoutVat)).toFixed(2)};
		}else{
				if(val.Vat===false){
					newTmp = ({...tmp, 'withVat': +((+tmp.withVat) +
					(+val.ExpAmntWthtoutVat)).toFixed(2)});
				}else{
					newTmp = ({...tmp, 'withoutVat': +(+tmp.withoutVat + 
			  		 (+val.ExpAmntWthtoutVat)).toFixed(2),
				   'Vat': +tmp.Vat + +(val.VatAmnt).toFixed(2)		
						});
				}
		}
		
		return newTmp;
	};
	
	
	const pushArrOi=(valueVatTmp, val)=>{
		
		let tmp = {...valueVatTmp};
		let newTmp='';
		
		if(val.Vat===false){
			newTmp = ({...tmp, 'withVat': +((+tmp.withVat) + (+val.IncAmntWthtoutVat)).toFixed(2)});
		}else{
			newTmp = ({...tmp, 'withoutVat': +(+tmp.withoutVat + (+val.IncAmntWthtoutVat)).toFixed(2),
					   'Vat': +tmp.Vat + +(val.VatAmnt).toFixed(2)		
					});
		}
		
		return newTmp;
	};
	
	
	const Calculate = async() =>{
		
		
		if(new Date(value.From) > new Date(value.To)){
			setSnackbar( {open:true, msg: 'Start date can not be bigger than the End Date', variant: 'warning'});
			return;
		}
		
		let From = dateFormat(value.From, "yyyy-mm");
		let To = dateFormat(value.To, "yyyy-mm");
		
		let ListOfProperties = settings.properties ? settings.properties.filter(x =>
				x.Fund===fundSlct ? x :null).map(x=>x.id) :['nothing'];
				
		let listDataRC = await readDataPropsDatesRange(uidCollection, 'reservations', 
						   ListOfProperties, From, To);
		let listDataEX =[]; //termportary 
			//await readDataPropsDatesRange(uidCollection, 'expenses', ListOfProperties,From, To);
		let listDataOI = await readDataPropsDatesRange(uidCollection, 'otherIncome',
						   ListOfProperties, From, To);
		
		let valueVatTmp={withVat:'', withoutVat:'', Vat:''};
		let valueVatTmpEx={withVat:'', withoutVat:'', Vat:''};
		
		for(let i=0; i<listDataRC.length; i++){  //Income
			let ChckIn = dateFormat(listDataRC[i].ChckIn, "yyyy-mm");
			let val=listDataRC[i];
			
			if(ChckIn>=From && ChckIn<=To && val.pStatus!=='Tentative' ){
				valueVatTmp = pushArr(valueVatTmp, val /*,Yahas*/);
			}
		}
		
		for(let i=0; i<listDataEX.length; i++){  //Expense
			let AccDate = dateFormat(listDataEX[i].AccDate, "yyyy-mm");
			let val = listDataEX[i];
			
			if(AccDate>=From && AccDate<=To){
				valueVatTmpEx = pushArrEx(valueVatTmpEx, val);
			}
		}
	
		for(let i=0; i<listDataOI.length; i++){  //Other Income
			let AccDate = dateFormat(listDataOI[i].AccDate, "yyyy-mm");
			let val = listDataOI[i];
			
			if(AccDate>=From && AccDate<=To){
				valueVatTmp = pushArrOi(valueVatTmp, val);
			}
		}
		
		setValueIncEx(valueVatTmp, value.inputVat);
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
		let newPmnts = delEmptyPaymentS(value.Payments).map(x=> ({...x, 'P': (x.P==='') ? '' :	
							  +(+x.P).toFixed(2) }));
		let indx = vtData.findIndex(x=>x.Transaction===value.Transaction);
		let newObj = {...value, 'LstSave': dateFormat(Date(),'dd-mmm-yyyy'), 'Payments': newPmnts,
					  'm': dateFormat(value.From,'mm')};
	
	 	if(indx!==-1){ //Update the table
			const tmpArr = vtData.map(k =>
	 		   		k.Transaction===value.Transaction ? newObj : k  );
			setSnackbar( {open: (await addData(uidCollection, 'vatcal', dateFormat(newObj.From,'yyyy'), 
							   newObj)), msg: 'Vat transaction has been updated!',
						  variant: 'success'});
			setVtData(tmpArr);
			
	
			let pmtnsObj = newObj.Payments.map(x=>{
					return {...x, ExpInc: 'VAT',  VendChnnl: 'VAT Payment' , Date: new Date(x.Date),
							'Transaction': newObj.Transaction,
							'Fund':newObj.Fund, VatPayRtrn: newObj.VatPayRtrn}
			})
			
			let olPayments = vtData.filter(k => k.Transaction===value.Transaction)[0]['Payments'];
			
			await delDPaymentsBatch(uidCollection,'payments',olPayments)
			await addDPaymentsBatch(uidCollection,'payments',pmtnsObj)
			
			
		}else{ //add new data
			const tmpArr = [...vtData, newObj];
			setSnackbar( {open: (await addData(uidCollection, 'vatcal', dateFormat(newObj.From,'yyyy'),  newObj)), msg: 'New Vat transaction has been added!',
						  variant: 'success'});

			let tmp = tmpArr.map(x => //for another two columns
			 		({...x, 'IncWithVat': x.valueInc.withoutVat , 'ExpWithVat': x.valuex.withoutVat})
					 )
			
			setVtData(tmp);
			
			
			let pmtnsObj = newObj.Payments.map(x=>{
					return {...x, ExpInc: 'VAT',  VendChnnl: 'VAT Payment' , Date: new Date(x.Date),
							'Transaction': newObj.Transaction,
							'Fund':newObj.Fund, VatPayRtrn: newObj.VatPayRtrn}
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
            	Vat Details
            </Typography>
			  {write && <Button color="inherit" onClick={handleSave} >
              Save
            </Button>}
          </Toolbar>
        </AppBar>;

	return (
			
			  <Dialog fullScreen style={!scrSize? {left: '15em'}: {left: '0'}} open={displayDialog} onClose={closeDialog} TransitionComponent={Transition}>
				
					{runTab === 'PM' && displayDialogSettings ? <PMmodal list={settings.pmntMethods ? settings.pmntMethods : []}
						updtSettings={updtSettings} lbl='Add new payment method'
					name='pmntMethods' snkbar='payment method' typelist='pmnts'
						ttl='Payment Methods'/> : null}
				
				{DialogHeader}
				<VatModalDetails Calculate={Calculate}	/>	
			  </Dialog>
    );
    };

export default VatModal;

  
	 
      