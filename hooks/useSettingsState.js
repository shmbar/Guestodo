import {useState} from 'react';
import useLocalStorageState from './useLocalStorageState';
import {updateField, addDataSettings} from '../functions/functions.js';

//import Mastercard from '../logos/pmntmethods/Mastercard.png';
import PayPal from '../logos/pmntmethods/PayPal.png';
import Visa from '../logos/pmntmethods/Visa.png';
import Cash from '../logos/pmntmethods/Cash.png';
//import Diners from '../logos/pmntmethods/Diners.png';
//import AmerExpress from '../logos/pmntmethods/AmerExpress.png';
import DefaultPmnt from '../logos/pmntmethods/DefaultPmnt.png';
import MoneyTrnsfr from '../logos/pmntmethods/MoneyTrnsfr.png';

import BookingShort from '../logos/chnlsPics/BookingShort.png';
import AirbnbShort from '../logos/chnlsPics/AirbnbShort.png';
import TripadvisorShort from '../logos/chnlsPics/TripadvisorShort.png';
import AgodaShort from '../logos/chnlsPics/AgodaShort.png';
import FlipkeyShort from '../logos/chnlsPics/FlipkeyShort.png';
import ExpediaShort from '../logos/chnlsPics/ExpediaShort.png';
import HomeAwayShort from '../logos/chnlsPics/HomeAwayShort.png';
import Tokeet from '../logos/chnlsPics/TokeetShort.png';
import DefaultChannelShort from '../logos/chnlsPics/DefaultChannelShort.png';

const pmntsLogo = [{txt: 'Cash', img: Cash, width:'30px'},
				 	{txt: 'Credit Card', img: Visa, width:'30px'},
				  	{txt: 'PayPal', img: PayPal, width:'30px'},
				   	{txt: 'Money Transfer', img: MoneyTrnsfr, width:'30px'},
					{txt: 'DefaultPmnt', img: DefaultPmnt, width:'25px'}];

const   chnnlslogo=  [{brnd: 'Booking', img: BookingShort, width:'25px'},
				 {brnd: 'Airbnb', img: AirbnbShort, width: '25px'},
				 {brnd: 'Tripadvisor', img: TripadvisorShort, width: '25px'},
				 {brnd: 'Agoda', img: AgodaShort, width: '25px'},
				 {brnd: 'Flipkey', img: FlipkeyShort, width: '28px'},
				 {brnd: 'Expedia', img: ExpediaShort, width: '25px'},
				 {brnd: 'HomeAway', img: HomeAwayShort, width: '25px'},
				 {brnd: 'Tokeet', img: Tokeet, width: '22px'},	  
			  	 {brnd: 'DefaultChannel', img: DefaultChannelShort, width: '25px'}
				  ];
const expOwner = ['Insurance',
				 'Taxes & Fees',
				 'Repairs, Maintenance & Cleaning',
				 'Sales & Marketing',
				 'General & Administrative',
				 'Towels, Sheets & other Supplies',
				 'Payroll & Contractor Fees',
				 'Water, Electric & HVAC bills',
				 'Management Company Fee',
				 'Other'];


const expCompany = ['Insurance',
				  'Taxes & Fees',
				  'Maintenance & Cleaning',
				  'Sales & Marketing',
				  'General & Administrative',
				  'Furniture & other Supplies',
				  'Payroll & Contractor Fees',
				  'Water & Electric',
				  'Management App',
				  'Rent',
				  'Other'];

const roles = { a:'Property Manager',b: 'House Stuff', c: 'Property Owner',d :'Accounting'};

const useSettingsState = (props) =>{
	
	const [settings, setSettings] = useLocalStorageState('settings',[]);
	const [settingsShows, setSettingsShows] = useLocalStorageState('settingsShows',[]);
	const [loading, setLoading] = useState(false);
	
	const [valueSettings, setValueSettings] = useState(null);	
	const [displayDialogSettings,setDisplayDialogSettings]=useState(false);
	const [displayVat,setDisplayVat]=useState(false);
	const [valueSettingsApt, setValueSettingsApt] = useState(null);	
	const [displayDialogSettingsApt,setDisplayDialogSettingsApt]=useState(false);
	
	const [runTab,setRunTab] = useState('');
	const [redValid, setRedValid] = useState(false);
	
	const [ownerList, setOwnerList] = useState([]);
	const [propertyList, setPropertyList] = useState([]);
	const [fundList, setFundList] = useState([]);
	const [openMenu, setOpenMenu] = useState(true);
	const [cshFlowTableCompany, setCshFlowTableCompany]=useState([]); // run once, to save reads
	const [isFirstTime,setIsFirstTime] = useState(false)
	const [recStart, setRecStart] = useState(null)
	const [recEnd, setRecEnd] = useState(null)
	const [subscriptionPlan, setSubscriptionPlan] = useState(null)
	
return {
	settings,
	setSettings,
	cshFlowTableCompany, setCshFlowTableCompany,
	recStart, setRecStart,
	recEnd, setRecEnd,
	subscriptionPlan, setSubscriptionPlan,
	updtShows: async(uidCollection,id,value) =>{
		let tmp = {...settingsShows, [id] : value};
		await setSettingsShows(tmp) //update localstorage
		
		Object.entries(settingsShows).length === 0 ? 
			await addDataSettings(uidCollection,  'settingsShows','shows', { [id]:value })	: //for first setup in case there are no settingsShows
			await updateField(uidCollection, 'settingsShows', 'shows', id, value);	 //update server
	},
	setSettingsShows,
	// updtTR: async(z) => {
	// 	let tmp = {...lastTR, [z] : +lastTR[z] + 1 }
	// 	setLastTR(tmp);  //update localstorage
	
	// 	await updateField('lastTR', 'lastTR', z, tmp[z]);	 //update server
	// },
	// lastTR,
	// setLastTR,
	updtSettings: (name,value)=>{
		let tmp ={...settings, [name]: value};
		setSettings(tmp);
	},
	updtSettingsTwo: (name1,value1, name2, value2)=>{
		let tmp ={...settings, [name1]: value1, [name2]: value2};
		setSettings(tmp);
	},
	settingsShows,
	valueSettings,
	setValueSettings,
	valueSettingsApt,
	displayDialogSettings,
	setDisplayDialogSettings,
	displayDialogSettingsApt,
	setDisplayDialogSettingsApt,
	runTab,
	setRunTab,
	redValid,
	setRedValid,
	loading, setLoading,
	selectValueSettings: rowData => { 
		setValueSettings(rowData);
		setDisplayDialogSettings(true);
	},
	selectValueSettingsApt: rowData => { 
		setValueSettingsApt(rowData);
		setDisplayDialogSettingsApt(true);
	},
	pmntsLogo,
	chnnlslogo,
	displayVat,setDisplayVat ,
	ownerList, setOwnerList,
	propertyList, setPropertyList, 
	fundList, setFundList,
	openMenu, setOpenMenu,
	expOwner, expCompany,
	isFirstTime, setIsFirstTime,
	roles
};
};


export default useSettingsState;