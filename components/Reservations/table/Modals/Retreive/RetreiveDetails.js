import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Tabs, Tab, Box, Paper } from '@material-ui/core';
import { getTokeetCredentials, getFees, getTaxes, getTokeetIdList, addDataSettings } from 
	'../../../../../functions/functions.js';
import { AuthContext } from '../../../../../contexts/useAuthContext';
import { SelectContext } from '../../../../../contexts/useSelectContext';
import {RcContext} from '../../../../../contexts/useRcContext';
import { SettingsContext } from '../../../../../contexts/useSettingsContext';
import firebase from 'firebase/app';
import GridLoader from 'react-spinners/GridLoader'; // //https://www.react-spinners.com/
import { css } from '@emotion/core';
import { v4 as uuidv4 } from 'uuid';

import TokeetShort from '../../../../../logos/chnlsPics/TokeetShort.png'
import GettingStarted from './GettingStarted.js';
import TabStep1 from './TabStep1.js';
import TabStep2 from './TabStep2.js';
import TabStep3 from './TabStep3.js';

const override = css`
	position: fixed;
	left: 50%;
	top: 50%;
	z-index: 10000;
	margin: -75px 0 0 -75px;
	display: block;
	border-color: red;
`;

export const getNights = (end, start) => {
	const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getIdChannel = (x, settings) => {
	let tmp;
	
	if(x==='airbnb' || x==='airbnbapiv2'){
		tmp = settings.channels.filter((q) => q.RsrvChn === 'Airbnb')[0]['id'];
		return tmp;
	}else if(x==='vrboapi' || x==='hometogo' || x==='homeaway' || x==='vrbo'){
		tmp = settings.channels.filter((q) => q.RsrvChn === 'HomeAway')[0]['id'];
		return tmp;
	}else if(x==='flipkey'){
		tmp = settings.channels.filter((q) => q.RsrvChn === 'Flipkey')[0]['id'];
		return tmp;
	}else if(x==='expedia' || x==='Expedia.com'){
		tmp = settings.channels.filter((q) => q.RsrvChn === 'Expedia')[0]['id'];
		return tmp;
	}else if(x==='booking.com' || x==='Booking.com'){
		tmp = settings.channels.filter((q) => q.RsrvChn === 'Booking')[0]['id'];
		return tmp;
	}else if(x==='tokeet'){
		tmp = settings.channels.filter((q) => q.RsrvChn === 'Tokeet')[0]['id'];
		return tmp;
	}else{
		tmp = settings.channels.filter((q) => q.RsrvChn === 'Tokeet')[0]['id'];
		return tmp;
	}

};

const getRsrvPrice=(x)=>{
	
	let inqSourse = x.inquiry_source;
	let tmp;
	switch (inqSourse) {
		case 'airbnb':
			tmp = x.abb_price!=null? x.abb_price.payout: 0;
			break;
		case 'Expedia.com':
			tmp = x.expedia_price.before_taxes
			break;
		case 'Booking.com':
			tmp = x.bdc_price.before_taxes
			break;
		case 'homeaway':
			tmp = x.booking_engine.base
			break;
		case 'tokeet':
			tmp = x.booking_engine.base
			break;
		default:
			tmp = 0;
			break;
	}
	return tmp;
}



const useStyles = makeStyles((theme) => ({
	mainGrid: {
		padding: theme.spacing(4),
	},
	txt: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '18px',
	},
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		minHeight: 340,
	  },
	  tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,


	  },
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;
  
	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`vertical-tabpanel-${index}`}
		aria-labelledby={`vertical-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box p={3}>
			<div>{children}</div>
		  </Box>
		)}
	  </div>
	);
  }

const RetreiveDetails = () => {
const classes = useStyles();
	const { /*write,*/ uidCollection } = useContext(AuthContext);
	const { date } = useContext(SelectContext);
	const {tokeetIdList, setTokeetIdList } = useContext(RcContext);
	const {loading, setLoading, settings, setSettings } = useContext(SettingsContext);
	const [authorized, setAuthorized] = useState(false);
	const [lastTokenTime, setLastTokenTime] = useState(0);
	const [assignApts, setAssignApts] = useState(settings.tokeetSets!=null? settings.tokeetSets: []);
	const [arrApts, setArrApts] = useState([]);
	//const [tokeetRsrvs, setTokeetRsrvs] = useState([]);
	const [gstdAptsArr, setGstdAptsArr] = useState([]);
	const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
	const dateFormat = require('dateformat');

	const [valueTab, setValueTab] = useState(settings.tokeetSets!=null? settings.tokeetSets.filter(x=>x.checked).length>0 ? 3: 2 : 0 );

	const handleChange1 = (event, newValue) => {
		setValueTab(newValue);
	  };


	useEffect(() => {
		const isTokenExist = async () => {
			const token = await firebase
				.firestore()
				.collection(uidCollection)
				.doc('tokens')
				.get()
				.then((doc) => {
					return doc.data();
				});

			setAuthorized(token!=null? token.access_token == null ? false : true: false);
			setLastTokenTime(token!=null? token.date: null);
		};

		isTokenExist();

		const properties =
			settings.properties != null
				? settings.properties.filter((x) => x.show).map((x) => x.id)
				: [];
		let arrApts1 = [];

		for (let i in properties) {
			let prp = {
				id: properties[i],
				val: 'prp',
				name: settings.properties.filter((x) => x.id === properties[i])[0]['PrpName'],
			};
			arrApts1.push(prp);

			let apts = settings.apartments.filter((x) => properties[i] === x.PrpName && x.show);
			for (let k in apts) {
				let ap = { id: apts[k].id, val: 'apt', name: apts[k].AptName };
				arrApts1.push(ap);
			}
		}
		setArrApts(arrApts1);
	}, [uidCollection, settings]);
	
	const checkTokeetSets = (dt) => {
		let S;
		const setsTmp = settings.tokeetSets;

		S = dt.map((x) => {
			let aa = setsTmp != null ? setsTmp.filter((k) => k.TokeetId === x.pkey) : [];

			let tmp = {
				TokeetApt: x.name,
				TokeetId: x.pkey,
				GstdApt: aa.length ? aa[0]['GstdApt'] : '',
				GstdAptID: aa.length ? aa[0]['GstdAptID'] : '',
				checked: aa.length ? aa[0]['checked'] : false,
			};
			return tmp;
		});

		return S;
	};

	const runAuth = async () => {
		const client_idTmp = await getTokeetCredentials('client_id');

		const response_type = 'code';
		const scope = 'inquiries,rentals, calendars'; //'guests,inquiries,rentals,invoices';
		const client_id = client_idTmp.client_id;
		const redirect_uri =
			'https://us-central1-guestodo.cloudfunctions.net/tokeetAPI/auth-callback';
			
		const tokeetURL = 'https://papi.tokeet.com/dialog/?';

		let p = new URLSearchParams();
		p.append('response_type', response_type);
		p.append('scope', scope);
		p.append('client_id', client_id);
		p.append('redirect_uri', redirect_uri);
		p.append('state', uidCollection);

		window.location.href = tokeetURL + p;
	};

	const getTokeetApartments = async () => {
		setLoading(true);
		setGstdAptsArr([]);
		const nowTime = Date.now();

		if (nowTime - lastTokenTime > 3600000) {
			let newToken = await firebase.functions().httpsCallable('newToken');
			await newToken(uidCollection).then(async (result) => {
				//console.log(result.data);
			});

			let getAptsTokeet = await firebase.functions().httpsCallable('getAptsTokeet');
			await getAptsTokeet({uidCollection: uidCollection})
				.then(async (result) => {
				//console.log(result.data);

				setAssignApts(checkTokeetSets(result.data.rental.data));
				setLoading(false);
			});
		} else {
			let getAptsTokeet = await firebase.functions().httpsCallable('getAptsTokeet');
			await getAptsTokeet({uidCollection: uidCollection})
				.then(async (result) => {
				//console.log(result.data);
				
				setAssignApts(checkTokeetSets(result.data.rental.data));
				setLoading(false);
			});
		}
	
	};

	const getTokeetReservs = async () => {
		setLoading(true);
		let tmpTktReservs=null;
		let tmpCalendars=null;
		
		const TokeetRentalsIdList = assignApts.filter((x) => x.checked).map((y) => y.TokeetId);
	
		const nowTime = Date.now();

		if (nowTime - lastTokenTime > 3600000) {
			let newToken = await firebase.functions().httpsCallable('newToken');
			await newToken(uidCollection).then(async (result) => {
				//console.log(result.data);
			});

			let getDataTokeet = await firebase.functions().httpsCallable('getDataTokeet');
			await getDataTokeet({
				uidCollection: uidCollection,
				start: new Date(startDate).getTime() / 1000,
				rentals:TokeetRentalsIdList
			}).then(async (result) => {
				//console.log(result.data);

				tmpTktReservs = result.data.inquiry.data;
				tmpCalendars = result.data.calendarRsrvs.data;
				setLoading(false);
			});
		} else {
			let getDataTokeet = await firebase.functions().httpsCallable('getDataTokeet');
			
			await getDataTokeet({
				uidCollection: uidCollection,
				start: new Date(startDate).getTime() / 1000,
				rentals:TokeetRentalsIdList
			}).then(async (result) => {
				//console.log(result.data);
				
				tmpTktReservs = result.data.inquiry.data;
				tmpCalendars = result.data.calendarRsrvs.data;
				setLoading(false);
			});
		}

		const tokeetIdList = await getTokeetIdList(uidCollection);
		setTokeetIdList(tokeetIdList.map((a) => a.tokeetID));
	
		return {tmpTktReservs:tmpTktReservs , tmpCalendars:	tmpCalendars.filter(x=> TokeetRentalsIdList.includes(x.rental_id))};
	};
	
	const handleChange = (e, row) => {
		setAssignApts(
			assignApts.map((x, k) =>
				x.TokeetId !== row.TokeetId	? x	: {
							...x,
							GstdApt: e.target.value,
							GstdAptID: settings.apartments.filter(
								(x) => x.AptName === e.target.value)[0]['id'],
							checked: true
					  }
			)
		);
	};
	
	const handleChangeChecked = (row) => {
		setAssignApts(assignApts.map((x, k) => (x.TokeetId !== row.TokeetId ? x :
					{ ...x, checked: !x.checked})));
	};

	const importLines = async () => {
		setLoading(true);

		let tktData = await getTokeetReservs();
		let tktReservs = tktData.tmpTktReservs.filter(x=> x.booked!==0)
		tktReservs = [...tktReservs,...tktData.tmpCalendars]

		let newArr = [];
		for (let k in tktReservs) {
			let a = tktReservs[k];
			let Nrsrv = a.check_in ? true: false; // Normal reservation or hold resservation
			
			let GstAptName = assignApts.filter((x) => x.TokeetId === a.rental_id)[0]['GstdApt'];
			let set1 = settings.apartments.filter((x) => x.AptName === GstAptName)[0];

			const AptID = set1['id'];
			const PrpName = set1['PrpName'];

			let Vat =
				+settings.properties.filter((x) => x.id === set1['PrpName'])[0]['VAT'] === 0
					? false
					: true;

			let vat = settings.properties.filter((x) => x.id === PrpName)[0]['VAT'];
			let ChnPrcnt1 = settings.channels.filter(
				(x) => getIdChannel(a.inquiry_source, settings) === x.id
			)[0]['ChnCmsn'];
			
			const basePrice = Nrsrv ? getRsrvPrice(a): 0;
			
			let netAmnt = (+basePrice / (1 + +vat / 100 - +ChnPrcnt1 / 100)) *
					(1 + vat / 100)
			
			let tmpObj = {
				ChckIn: Nrsrv ? dateFormat(new Date(+a.check_in * 1000), 'dd-mmm-yyyy'):
						dateFormat(new Date(+a.start * 1000), 'dd-mmm-yyyy'), 
				ChckOut: Nrsrv ? dateFormat(new Date(+a.check_out * 1000), 'dd-mmm-yyyy'):
						dateFormat(new Date(+a.end * 1000), 'dd-mmm-yyyy'),
				Transaction: '',
				Payments: [{ P: '', Date: null, PM: '', id: uuidv4() }],
				Vat: Vat,
				PrpName: PrpName,
				RsrvChn: Nrsrv ? getIdChannel(a.inquiry_source, settings): getIdChannel(a.source, settings),
				NetAmnt: netAmnt,
				CnclFee: '',
				ChnPrcnt: settings.channels.filter(
					(x) => getIdChannel(Nrsrv ? a.inquiry_source: a.source, settings) === x.id
				)[0]['ChnCmsn'],
				Fees: settings.properties
					.filter(
						(x) =>
							x.id === settings.apartments.filter((x) => x.id === AptID)[0]['PrpName']
					)[0]
					['Fees'].map((x) => ({ ...x, show: true })),
				Taxes: settings.properties
					.filter(
						(x) =>
							x.id === settings.apartments.filter((x) => x.id === AptID)[0]['PrpName']
					)[0]
					['Taxes'].map((x) => ({ ...x, show: true })),
				NigthsNum: Nrsrv ? getNights(+a.check_out * 1000, +a.check_in * 1000):
							getNights(+a.end * 1000, +a.start * 1000),
				TtlPmnt: '',
				GstName: Nrsrv ? a.guest_details.name: a.title,
				AptName: AptID,
				pStatus: 'Confirmed',
				dtls: {
					adlts: Nrsrv ? a.num_adults: '',
					chldrn: Nrsrv ? a.num_child: '',
					Passport: '',
					email: Nrsrv ? a.guest_details.email: '',
					mobile: '',
					phone: '',
					addrss: '',
					cntry: '',
				},
				//	LstSave: dateFormat(Date(), 'dd-mmm-yyyy'),
				PmntStts: 'Unpaid',
				m: Nrsrv ? dateFormat(new Date(+a.check_in * 1000), 'mm'):dateFormat(new Date(+a.start * 1000), 'mm'),
				TtlRsrvWthtoutVat: Vat === false? netAmnt : netAmnt / (1 + parseFloat(vat) / 100),
				tokeet: {
					tokeetID: a.pkey,
					TokeetApt: assignApts.filter((x) => x.TokeetId === a.rental_id)[0]['TokeetApt'],
					TokeetAmntOriginal: +basePrice,
				},
			};
			
			const eliminateVat = Vat ? 1 + parseFloat(vat) / 100 : 1;

			let tmpAMount =
				+tmpObj.NetAmnt +
				+getFees(tmpObj, +tmpObj.NetAmnt) +
				+getTaxes(tmpObj, +tmpObj.NetAmnt, eliminateVat);

			tmpObj = { ...tmpObj, RsrvAmnt: tmpAMount, BlncRsrv: tmpAMount };

			newArr.push(tmpObj);
		}
	
	
		setGstdAptsArr(newArr.filter(x=> (x.m*1-1)===startDate.getMonth())); //show only the reservations of the selected month

		setLoading(false);
	};

	const clr = async() => {
		setGstdAptsArr([]);

		let tmmpAr = assignApts.map((y, k) => ({
			...y,
			GstdApt: '',
			checked: false,
			GstdAptID: '',
		}));
		setAssignApts(tmmpAr);


		setSettings({ ...settings, tokeetSets: tmmpAr });
		await addDataSettings(uidCollection, 'settings', 'tokeetSets', { tokeetSets: tmmpAr });
	};
	
	const moveToStep3=async()=>{
		setLoading(true);
			setGstdAptsArr([]);
			await setSettings({ ...settings, tokeetSets: assignApts });
			await addDataSettings(uidCollection, 'settings', 'tokeetSets', { tokeetSets: assignApts });

			setValueTab(3)
		setLoading(false);
	}
	return (
		<div className={classes.mainGrid}>
			<div>
				<GridLoader
					css={override}
					sizeUnit={'px'}
					size={50}
					color={'#012c61'}
					loading={loading}
				/>
			</div>
 
		<Paper className={classes.root}>

			<div style={{paddingTop: '35px'}}>
				<div style={{textAlign: 'center'}}>
					<img src={TokeetShort} alt='Tokeet' width={70}/>
				</div>
				<Tabs
					orientation="vertical"
					variant="scrollable"
					value={valueTab}
					onChange={handleChange1}
					className={classes.tabs}
				>
				
					<Tab label="Getting Started"  />
					<Tab label="Step 1"  />
					<Tab label="Step 2"  disabled={!authorized}/>
					<Tab label="Step 3"  disabled={!authorized}/>
				
			</Tabs>


			</div>
			

			<TabPanel value={valueTab} index={0}>
					<GettingStarted settings={settings}/>
			</TabPanel>
			<TabPanel value={valueTab} index={1}>
					<TabStep1 runAuth={runAuth} authorized={authorized}/>
			</TabPanel>
			<TabPanel value={valueTab} index={2}>
					<TabStep2	getTokeetApartments={getTokeetApartments}
								moveToStep3={moveToStep3}
								handleChange={handleChange}
								assignApts={assignApts}
								arrApts={arrApts}
								gstdAptsArr={gstdAptsArr}
								uidCollection={uidCollection}
								clr={clr}
								handleChangeChecked={handleChangeChecked}
						/>
			</TabPanel>
			<TabPanel value={valueTab} index={3}>
					<TabStep3 	
								date={date} startDate={startDate}
								setStartDate={setStartDate} 
								importLines={importLines}
								handleChange={handleChange}
								assignApts={assignApts}
								arrApts={arrApts}
								gstdAptsArr={gstdAptsArr}
								uidCollection={uidCollection}
								tokeetIdList={tokeetIdList}
								clr={clr}
								
						/>
			</TabPanel>

			</Paper>
    	</div>

	);
};

export default RetreiveDetails;