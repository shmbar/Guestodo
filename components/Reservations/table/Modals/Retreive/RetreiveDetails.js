import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button,	Grid} from '@material-ui/core';
import { getTokeetCredentials, getFees, getTaxes, getTokeetIdList } from 
	'../../../../../functions/functions.js';
import { AuthContext } from '../../../../../contexts/useAuthContext';
import { SelectContext } from '../../../../../contexts/useSelectContext';
import {RcContext} from '../../../../../contexts/useRcContext';
import { SettingsContext } from '../../../../../contexts/useSettingsContext';
import firebase from 'firebase/app';
import GridLoader from 'react-spinners/GridLoader'; // //https://www.react-spinners.com/
import { css } from '@emotion/core';
import CheckedIcon from '../../../../LandingPage/checked.png';
import { v4 as uuidv4 } from 'uuid';
import MonthPickerTokeet from '../../../../Subcomponents/MonthPickerTokeet';
import ConnectAptsTable from './ConnectAptsTable';
import TktReservationsTable from './TktReservationsTable'

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
	switch (x) {
		case 'airbnb':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Airbnb')[0]['id'];
			break;
		case 'vrboapi':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'HomeAway')[0]['id'];
			break;
		case 'hometogo':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'HomeAway')[0]['id'];
			break;
		case 'flipkey':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Flipkey')[0]['id'];
			break;
		case 'vrbo':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'HomeAway')[0]['id'];
			break;
		case 'expedia':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Expedia')[0]['id'];
			break;
		case 'booking.com':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Booking')[0]['id'];
			break;
		case 'airbnbapiv2':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Airbnb')[0]['id'];
			break;
		case 'tokeet':
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Tokeet')[0]['id'];
			break;
		default:
			tmp = settings.channels.filter((q) => q.RsrvChn === 'Tokeet')[0]['id'];
			break;
	}
	return tmp;
};

const useStyles = makeStyles((theme) => ({
	mainGrid: {
		padding: theme.spacing(4),
	},
	txt: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '18px',
	},
}));

const RetreiveDetails = () => {
	const classes = useStyles();
	const { /*write,*/ uidCollection } = useContext(AuthContext);
	const { date } = useContext(SelectContext);
	const {tokeetIdList,setTokeetIdList} = useContext(RcContext);
	const { loading, setLoading, settings } = useContext(SettingsContext);
	const [authorized, setAuthorized] = useState(false);
	const [lastTokenTime, setLastTokenTime] = useState(0);
	const [assignApts, setAssignApts] = useState([]);
	const [arrApts, setArrApts] = useState([]);
	const [TokeetApts, setTokeetApts] = useState([]);
	const [gstdAptsArr, setGstdAptsArr] = useState([]);
	const [startDate, setStartDate] = useState(null);

	const dateFormat = require('dateformat');

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

			setAuthorized(token.access_token == null ? false : true);
			setLastTokenTime(token.date);
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

	const runAuth = async () => {
		const client_idTmp = await getTokeetCredentials('client_id');

		const response_type = 'code';
		const scope = 'guests,inquiries,rentals,invoices';
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

	const getData = async () => {
		setLoading(true);
		setGstdAptsArr([]);
		const nowTime = Date.now();

		if (nowTime - lastTokenTime > 3600000) {
			let newToken = await firebase.functions().httpsCallable('newToken');
			await newToken(uidCollection).then(async (result) => {
				console.log(result.data);
			});

			let getDataTokeet = await firebase.functions().httpsCallable('getDataTokeet');
			await getDataTokeet({
				uidCollection: uidCollection,
				start: new Date(startDate).getTime() / 1000,
			}).then(async (result) => {
				console.log(result.data);
				setAssignApts(
					result.data.rental.data.map((x) => ({
						TokeetApt: x.name,
						TokeetId: x.pkey,
						GstdApt: '',
						connectIcn: true
					}))
				);
				setTokeetApts(result.data.inquiry.data);
				setLoading(false);
			});
		} else {
			let getDataTokeet = await firebase.functions().httpsCallable('getDataTokeet');
			await getDataTokeet({
				uidCollection: uidCollection,
				start: new Date(startDate).getTime() / 1000,
			}).then(async (result) => {
				console.log(result.data);
				setAssignApts(
					result.data.rental.data.map((x) => ({
						TokeetApt: x.name,
						TokeetId: x.pkey,
						GstdApt: '',
						connectIcn: true
					}))
				);
				setTokeetApts(result.data.inquiry.data);
				setLoading(false);
			});
		}
		
		const tokeetIdList = await getTokeetIdList(uidCollection)
		setTokeetIdList(tokeetIdList.map(a => a.tokeetID))
	};

	const handleChange = (e, i) => {
		setAssignApts(assignApts.map((x, k) => (k !== i ? x : { ...x, GstdApt: e.target.value })));
	};

	const importLine = async (i) => {
		setLoading(true);
		let tmpData = TokeetApts.filter((x) => x.rental_id === assignApts[i].TokeetId);
		const tmpTokeetId = gstdAptsArr.map((x) => x.tokeetID);
		tmpData = tmpData.filter((x) => !tmpTokeetId.includes(x.pkey));

		let newArr = [];
		for (let k in tmpData) {
			let a = tmpData[k];
			
			const Apt = settings.apartments
			.filter((x) => x.AptName === assignApts[i].GstdApt)[0]['id'];
			
			const PrpName = settings.apartments.filter((x) =>
				   x.AptName === assignApts[i].GstdApt)[0]['PrpName'];
			
			let Vat = +settings.properties.filter((x) =>
						x.id ===settings.apartments.filter(
							(x) => x.AptName === assignApts[i].GstdApt)[0]['PrpName']
					)[0]['VAT'] === 0? false: true;
			
			let vat= settings.properties.filter(x=> x.id===PrpName)[0]['VAT']
				
			let tmpObj = {
				ChckIn: dateFormat(new Date(+a.check_in * 1000), 'dd-mmm-yyyy'),
				ChckOut: dateFormat(new Date(+a.check_out * 1000), 'dd-mmm-yyyy'),
				Transaction: '',
				Payments: [{ P: '', Date: null, PM: '', id: uuidv4() }],
				Vat:Vat,
				PrpName:PrpName,
				RsrvChn: getIdChannel(a.inquiry_source, settings),
				NetAmnt: a.booking_engine.base,
				CnclFee: '',
				ChnPrcnt: '',
				Fees: settings.properties
					.filter(
						(x) =>
							x.id === settings.apartments.filter((x) => x.id === Apt)[0]['PrpName']
					)[0]
					['Fees'].map((x) => ({ ...x, show: true })),
				Taxes: settings.properties
					.filter(
						(x) =>
							x.id === settings.apartments.filter((x) => x.id === Apt)[0]['PrpName']
					)[0]
					['Taxes'].map((x) => ({ ...x, show: true })),
				NigthsNum: getNights(+a.check_out * 1000, +a.check_in * 1000),
				TtlPmnt: '',
				GstName: a.guest_details.name,
				AptName: Apt,
				pStatus: 'Tentative',
				dtls: {
					adlts: a.num_adults,
					chldrn: a.num_child,
					Passport: '',
					email: a.guest_details.email,
					mobile: '',
					phone: '',
					addrss: '',
					cntry: '',
				},
			//	LstSave: dateFormat(Date(), 'dd-mmm-yyyy'),
				PmntStts: 'Unpaid',
				m: dateFormat(new Date(+a.check_in * 1000), 'mm'),
				TtlRsrvWthtoutVat: 	Vat===false ?  +a.booking_engine.base:
								+a.booking_engine.base/(1 + parseFloat(vat)/100),
				tokeetID: a.ref_id,
				TokeetApt: assignApts[i].TokeetApt
			};
			
			let tmpAMount = +tmpObj.NetAmnt + 
					+getFees(tmpObj, +tmpObj.NetAmnt) +
					+getTaxes(tmpObj, +tmpObj.NetAmnt);
			
			tmpObj={...tmpObj,RsrvAmnt: tmpAMount , BlncRsrv: tmpAMount}
			
			newArr.push(tmpObj);
		}

		let tmpArr = [...gstdAptsArr, ...newArr];
		setGstdAptsArr(tmpArr);
		setAssignApts(assignApts.map((x,k)=> k===i? {...x, connectIcn: false}: x) )
		setLoading(false);
	};
	
	const clrLine = (i) => {
		let tmpData = TokeetApts.filter((x) => x.rental_id === assignApts[i].TokeetId);
		const tmpTokeetIdArr = tmpData.map((x) => x.pkey);
		
		let newArr = gstdAptsArr.filter((x) => !tmpTokeetIdArr.includes(x.tokeetID));
		setGstdAptsArr(newArr);
		
		let tmmpAr = assignApts.map((y,k)=> k===i? {...y, GstdApt: '', connectIcn: true}: y )
		setAssignApts(tmmpAr)
	};

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
			<Grid container direction="row" justifyContent="flex-start"
				alignItems="baseline">
				<Grid item>
					<p className={classes.txt}>1. Authorize yourself to retrieve Tokeet data:
					</p>
				</Grid>
				<Grid item style={{ paddingLeft: '20px', display: 'inline-flex' }}>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => runAuth()}
						disabled={authorized}
					>
						Get Authorization
					</Button>
					{authorized && (
						<div style={{ alignSelf: 'center', paddingLeft: '10px' }}>
							<img src={CheckedIcon} alt="123" width="20px" />
						</div>
					)}
				</Grid>
			</Grid>
			<Grid container direction="row" justifyContent="flex-start">
				<Grid item>
					<p className={classes.txt} style={{ marginTop: 'revert' }}>
						2. Download data
					</p>
				</Grid>
				<Grid item style={{ paddingLeft: '10px' }}>
					<MonthPickerTokeet
						date={date} //handleChangeD={handleChangeD}
						startDate={startDate}
						setStartDate={setStartDate}
					/>
				</Grid>
				<Grid item style={{ paddingLeft: '20px', alignSelf: 'center' }}>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => getData()}
						disabled={startDate === null}
					>
						Tokeet data
					</Button>
				</Grid>
			</Grid>
			
			<Grid  container  direction="row" justifyContent="space-between" 
				alignItems="center">
				<Grid item xs={12} style={{paddingBottom: '20px'}}>
				 	<ConnectAptsTable 
						 importLine={importLine}
						 clrLine={clrLine}
						 handleChange={handleChange}
						 assignApts={assignApts}
						 arrApts={arrApts}
				 	/>
				</Grid>
				<Grid item xs={12}>
				<TktReservationsTable
					gstdAptsArr={gstdAptsArr}
					uidCollection={uidCollection}
					tokeetIdList={tokeetIdList}
					/>
				</Grid>
			</Grid>
			
			
		</div>
	);
};

export default RetreiveDetails;