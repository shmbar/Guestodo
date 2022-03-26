import React, {useContext, useState} from 'react';
import {Button, Tooltip} from '@material-ui/core';
import Tab2Details from './Tab2Details';
import { withStyles } from '@material-ui/core/styles';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {addDataSettings, updateField, itemToId} from '../../../functions/functions.js';
import {AuthContext} from '../../../contexts/useAuthContext';
import { v4 as uuidv4 } from 'uuid';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './tabs.css'


const CustomToolTip = withStyles({
	tooltip: {
		fontSize: 13,
	},
})(Tooltip);

const dateFormat = require('dateformat');
 
const styles = theme => ({
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

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

	const cmsnNum = (n)=>{ //Clean commas and validate numbers
		return (/^\d+$/.test( n ) && n.length<=3) ? n :  n.substring(0, n.length - 1);
	} ;

const Tab2Modal = (props) =>{
	
	const {settings,settingsShows, setSettingsShows,  selectValueSettings, displayDialogSettings,
		  setDisplayDialogSettings, valueSettings,setValueSettings, setRedValid, updtShows, setPropertyList, setSettings} = useContext(SettingsContext);
	const {uidCollection} = useContext(AuthContext);
	const [valueTab, setValueTab] = useState(0);
	const [feesRedValid, setFeesRedValid] = useState(false)
	const [taxesRedValid, setTaxesRedValid] = useState(false)
	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialogSettings(false);	
	}
	
	 const handleChange = e => {
		 let tmp= (e.target.name=== 'ManagCommission') ?
			 	cmsnNum(e.target.value):e.target.value;
		 
		if(e.target.name === 'Owner'){
		 	selectValueSettings({...valueSettings, [e.target.name]: itemToId(settings.owners, e.target.value), 'Fund': ''});
		}else if(e.target.name === 'Fund'){
		 	selectValueSettings({...valueSettings, [e.target.name]: itemToId(settings.funds, e.target.value)  });
		}else {	
		 	selectValueSettings({...valueSettings, [e.target.name]:tmp })
		}	
	 };
 
	const handleChangeD = (name,val) =>{
		if(val===null){
		 	selectValueSettings({...valueSettings, [name]:null });
		}else{
			selectValueSettings({...valueSettings, [name]: dateFormat(val,'dd-mmm-yyyy') });
		}
	};
    
	// /**********************************/
	const handleSave= async(e) => { 
		let indx = settings.properties!=null ? settings.properties.findIndex(x=>x.id===valueSettings.id) : -1;
		let exstIntheList=false;
	
		//validation
		
		let fields=['Owner','PrpName','StartDate','Fund'/*'ManagCommission', , 'inclVat', 'addVat'*/];
		let fields1=['ManagCommission', 'inclVat', 'addVat'];
		let fields2=['FeeName', 'FeeType', 'FeeAmount','FeeModality'];
		let fields3=['TaxName', 'TaxType', 'TaxAmount','TaxTypeDscrp','TaxModality'];
		 
		
		let tmpTF=true;
		for(let i=0; i<fields.length; i++){
			if( valueSettings[fields[i]]==='' || valueSettings[fields[i]]===null || valueSettings[fields[i]]==null){
				 tmpTF=false; break;
			 }
		}
		
		for(let i=0; i<fields1.length; i++){
			if( valueSettings.Commissions[fields1[i]]==='' || valueSettings.Commissions[fields1[i]]===null || valueSettings.Commissions[fields1[i]]==null){
				 tmpTF=false; break;
			 }
		}
		
		for(let k=0; k<valueSettings.Fees.length; k++){
			for(let i=0; i<fields2.length; i++){
				let tmpInit = valueSettings.Fees[k][fields2[0]]==='';
				let tmpI = valueSettings.Fees[k][fields2[i]]==='';
				if( tmpInit!== tmpI){
					setFeesRedValid(true); 
					tmpTF=false; break;
				 }
			}
		}
			
		for(let k=0; k<valueSettings.Taxes.length; k++){
			for(let i=0; i<fields3.length; i++){
				let tmpInit = valueSettings.Taxes[k][fields3[0]]==='';
				let tmpI = valueSettings.Taxes[k][fields3[i]]==='';
				if( tmpInit!== tmpI){
					setTaxesRedValid(true); 
					tmpTF=false; break;
					
				 }
			}
		}
		
	
		
		if(	settings.funds.filter(x=> x.id===valueSettings.Fund)[0] == null ){
			selectValueSettings({...valueSettings, 'Fund': '' });
			tmpTF=false;
		}


		if(!tmpTF){
			setRedValid(true);
			props.setSnackbar( {open:true, msg: 'Please fill out the required fields', variant: 'warning'});
			return};
			
		
		let newArr=[];
		if(indx!==-1){ //update, id is in the list 
			//check if RsrvChn is the same as one of the rows
			for(let rw in settings.properties){
		 		if(settings.properties[rw].PrpName.toLowerCase()===valueSettings.PrpName.toLowerCase() &&
				   	settings.properties[rw].id!==valueSettings.id){
					exstIntheList=true;  // the channel exist and is valid, do not update/add	
				}else{
					newArr = settings.properties.map(x =>x.id===valueSettings.id ?
									  {...valueSettings, 'VAT': valueSettings.VAT==='' ? 0 : valueSettings.VAT}: x);
				}
			}
		}else{ //new, not in the list
			for(let rw in settings.properties){
		 		if(settings.properties[rw].PrpName.toLowerCase()===valueSettings.PrpName.toLowerCase() &&
				   	settings.properties[rw].show ){
		 			exstIntheList=true;  // the channel exist and is valid, do not update/add	
		 		}else if(settings.properties[rw].PrpName.toLowerCase()===valueSettings.PrpName.toLowerCase()
						 &&	!settings.properties[rw].show ){ //channel is deleted but in use
		 			newArr = settings.properties.map(x =>x.PrpName.toLowerCase()===valueSettings.PrpName.toLowerCase()
						   ? {...valueSettings, 'id': x.id, 'VAT': valueSettings.VAT==='' ? 0 : valueSettings.VAT}: x);
		 		}
			}
		}
		
		if(exstIntheList){
			props.setSnackbar( {open: true, msg: `Property ${valueSettings.PrpName} already exists!`, variant: 'error'}); 
			return;
		}
		//////////////////////////////
		
		let tmpValue = {...valueSettings, 'VAT': valueSettings.VAT==='' ? 0 : valueSettings.VAT};
		setValueSettings(tmpValue)
		let tmpApts = settings.apartments
	
		
		if(newArr.length!==0){ //just an update
			props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'properties', {'properties':newArr})),
		 			  	msg: `Property ${tmpValue.PrpName} has been updated!`, variant: 'success'}); 
			closeDialog();
			updtShows(uidCollection, tmpValue.Fund,true);
		}else{
			let tmpProperties = settings.properties!=null ? settings.properties: [];
			newArr = [...tmpProperties, tmpValue];
		 	props.setSnackbar( {open: (await addDataSettings(uidCollection, 'settings', 'properties', {'properties':newArr})),
		 			  	msg: 'New property has been added!', variant: 'success'});	
			
			closeDialog();
			
			let tmp = {...settingsShows, [tmpValue.id] : false, [tmpValue.Fund] : true};
			setSettingsShows(tmp)
		
			await updateField(uidCollection, 'settingsShows', 'shows', [tmpValue.id], false);
			await updateField(uidCollection, 'settingsShows', 'shows', [tmpValue.Fund], true);

		    
			///// Create automatically new apartment
			
				let aptObj={'StartDate': tmpValue.StartDate, 'EndDate':tmpValue.EndDate, id: uuidv4(), 'show' : true, 'PrpName' : tmpValue.id,
							'AptName' : tmpValue.PrpName + "_apartment"}

				tmpApts = tmpApts!=null ? [...tmpApts, aptObj]: [aptObj];
				updtShows(uidCollection, [tmpValue.id], false)
				await addDataSettings(uidCollection, 'settings', 'apartments', {'apartments':tmpApts})
	
			//////////////////////////////
		
		}
	
		let tmp ={...settings, 'properties': newArr, 'apartments': tmpApts};
		setSettings(tmp);
 		 
	 	const properties =  newArr.filter(x=> x.show ).map(x=>x.PrpName);
	 	setPropertyList(properties);

	 	
		
	};
	
	
    const footer = <div style={{width: '100%', textAlign: 'right'}}>
				<Button className='myFont' variant="outlined" type='submit' onClick={handleSave}  color="primary">Save</Button> 
			</div>;
 
	const handleChangeTabs = (event, newValue) => {
   		 	setValueTab(newValue);
  	};
	
	// , borderRight: '1px solid lightgrey'
	return (
		
   <div>
		  <Dialog  aria-labelledby="customized-dialog-title" open={displayDialogSettings} fullWidth={true} maxWidth='md' >  
          <DialogTitle  onClose={closeDialog} >
           <span style={{color: '#193e6d'}}>Property Details</span>
          </DialogTitle>
			
				
  <Tabs value={valueTab} onChange={handleChangeTabs} aria-label="simple tabs example">
    <Tab label="Details"   className={['element-class', 'tab', 'tabText'].join(" ")}/>
    <Tab label="Extra Fees"    className={['element-class', 'tab', 'tabText'].join(" ")}/>
    <Tab label="VAT"   className={['element-class', 'tab', 'tabText'].join(" ")}/>
	<CustomToolTip title="Applies to Adults only" placement="top">
	  	<Tab label="Taxes"    className={['element-class', 'tab', 'tabText'].join(" ")}/> 
	</CustomToolTip>
	<Tab label="Commission"  className={['element-class', 'tab', 'tabText'].join(" ")} />
	 <Tab label="Cleaning Fee" className={['tab', 'tabText'].join(" ")}/>
  </Tabs>

  <DialogContent dividers style={{minHeight: '230px'}}>
				<Tab2Details 
							 handleChange={handleChange}
							 handleChangeD={handleChangeD}
							 runFromOrders={props.runFromOrders}
							valueTab={valueTab}
							feesRedValid={feesRedValid}
							taxesRedValid={taxesRedValid}
				/>
			  </DialogContent>
          <DialogActions>
            {footer}
          </DialogActions>
        </Dialog>
			</div>
    );
    };

export default Tab2Modal;