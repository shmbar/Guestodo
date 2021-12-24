import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, List, ListItem, Checkbox, ListItemText, ListItemIcon, Dialog, DialogContent, Slide, IconButton, Typography, Grid } from '@material-ui/core';
import Table from './table/Table';
import { SettingsContext } from '../../contexts/useSettingsContext';
import { SelectContext } from '../../contexts/useSelectContext';
import SnackBar from '../Subcomponents/SnackBar';
import PannelData from '../Subcomponents/PannelData';
import MRangePickerPL from '../Subcomponents/MRangePickerPL'
import { convId2Item, readDataPropsDatesRange, addCommas, getFees } from '../../functions/functions.js';
import useWindowSize from '../../hooks/useWindowSize';
import { AuthContext } from '../../contexts/useAuthContext';
import { Chart } from 'primereact/chart';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Exp, Rev, PL } from './charts';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

import Gross from '../../logos/pics/Gross.png';
import Income from '../../logos/pics/Inc.png';
import Expense from '../../logos/pics/Exp.png';

const dateFormat = require('dateformat');

const logos = [{ txt: 'Gross', img: Gross, width: '50px' },
{ txt: 'Income', img: Income, width: '50px' },
{ txt: 'Expense', img: Expense, width: '50px' },
];




const RC = (x, vatProperty) => {

	const Income = +(+x.TtlRsrvWthtoutVat + +getFees(x, x.NetAmnt )/(x.Vat ? 
				(1 + parseFloat(vatProperty)/100) : 1)).toFixed(2)
	
	let newObj = {
		ExpInc: 'Guest Payment', VendChnnl: x.RsrvChn, PrpName: x.PrpName, AccDate: x.ChckIn,
		Transaction: x.Transaction, Income: Income, Expense: ''
	}
	return newObj;
}



const EX = (y) => {
	let newObj = {
		ExpInc: y.ExpType, VendChnnl: y.vendor, PrpName: y.PrpName, AccDate: y.AccDate,
		Transaction: y.Transaction, Income: '', Expense: +y.ExpAmntWthtoutVat
	}

	return newObj;
}

const othrInc = (val) => {

	let newObj = {
		ExpInc: 'Extra Revenue', VendChnnl: val.incType, PrpName: val.PrpName, AccDate: val.AccDate,
		Transaction: val.Transaction, Income: +val.IncAmntWthtoutVat,
		Expense: ''
	}
	return newObj;
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

export default function PaperSheet() {

	const scrSize = useWindowSize();

	const { settings, setLoading, loading } = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const { valuePL, setValuePL, propertySlct, plData, setPlData, filteredData, setFilteredData, date } = useContext(SelectContext);
	const { uidCollection } = useContext(AuthContext);
	const [checked, setChecked] = useState([])
	const [open, setOpen] = React.useState(false);
	const [currentData, setCurrentData] = useState([]);
	const [showCols, setShowCols] = useState('');
	const [vatProperty, setVatProperty] = useState(null);
	
	let cur = settings.length === 0 ? "Currency" : settings.CompDtls.currency;
	const useStyles = makeStyles(theme => ({
		root: {
			padding: scrSize === 'xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
		},
		pd: {
			paddingLeft: '0px!important',
			paddingRight: '0px!important',
		},
		paddingSmall: {
			padding: theme.spacing(2.7),
			paddingTop: scrSize === 'xs' ? theme.spacing(5) : theme.spacing(4),
		},
		root1: {
			width: '100%',
			//maxWidth: 360,
			backgroundColor: theme.palette.background.paper,
		},
	}));

	const styles = (theme) => ({
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

	const handleToggle = (value) => () => {
		let newArr1 = checked.map(x => x.id !== value.id ? x : { ...x, 'slcted': !x.slcted })
		setChecked(newArr1)
	};

	const classes = useStyles();
	let propList = <List className={classes.root1}>
		{checked.map(v => {

			return (
				<ListItem key={v.id} role={undefined} dense button onClick={handleToggle(v)} disabled={v.id === propertySlct}>
					<ListItemIcon>
						<Checkbox edge="start" checked={v.slcted} tabIndex={-1} disableRipple />
					</ListItemIcon>
					<ListItemText primary={v.PrpName} className='txtFont' />
				</ListItem>
			);
		})}
	</List>

	const DialogTitle = withStyles(styles)((props) => {
		const { children, classes, onClose, ...other } = props;
		return (
			<MuiDialogTitle disableTypography className={classes.root} {...other}>
				<Typography variant="h5" style={{ padding: '5px 7px 0px 8px' }} className='ttlClr1'>{children}</Typography>
				{onClose ? (
					<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				) : null}
			</MuiDialogTitle>
		);
	});


	useEffect(() => {
		const setCheckedLstFirstTime = () => {

			let owner = settings.properties.filter(z => z.id === propertySlct)[0]['Owner']
			
			const vatTmp= settings.properties.filter(x=> x.id===propertySlct)[0]['VAT']
			setVatProperty(vatTmp)
			let propertiesArr = settings.properties ? settings.properties.filter(x => x.Owner === owner) : [];
			let newArr = propertiesArr.map(q => ({
				'id': q.id, 'PrpName': q.PrpName, 'slcted': q.id === propertySlct
			}));
			newArr.sort((x, y) => (x.slcted === y.slcted) ? 0 : x.slcted ? -1 : 1);

			setChecked(newArr)
		}

		if (propertySlct !== null) {
			setCheckedLstFirstTime()
		} else {
			setSnackbar({ open: true, msg: 'Choose property', variant: 'warning' });
		}
		
	}, [propertySlct, settings])

	useEffect(() => {

		const loadData = async () => {
			setLoading(true);
			///////////////////////////////////////////////////////
			let From = dateFormat(valuePL.From, "yyyy-mm");
			let To = dateFormat(valuePL.To, "yyyy-mm");

			let ListOfProperties = checked.filter(z => z.slcted).map(x => x.id)

			ListOfProperties = ListOfProperties.length ? ListOfProperties : ['nothing'];
			let listDataRC = await readDataPropsDatesRange(uidCollection, 'reservations', ListOfProperties, From, To);

			let listDataEX = await readDataPropsDatesRange(uidCollection, 'expenses', ListOfProperties, From, To);

			let listDataOtherInc = await readDataPropsDatesRange(uidCollection, 'otherIncome', ListOfProperties, From, To)

			///////////////////////////////////////////////////////

			let tableArr = [];

			for (let i = 0; i < listDataRC.length; i++) {  //Income
				let ChckIn = dateFormat(listDataRC[i].ChckIn, "yyyy-mm");

				if (ChckIn >= From && ChckIn <= To && listDataRC[i].pStatus!=='Tentative') {
					tableArr.push(RC(listDataRC[i], vatProperty));
				}
			}

			for (let i = 0; i < listDataEX.length; i++) {  //Expense
				if (listDataEX[i].ExpType === 'Management commission' && (+listDataEX[i].Amnt === 0 || listDataEX[i].Amnt === '')) { continue; }
						//remove empty amounts
				let AccDate = dateFormat(listDataEX[i].AccDate, "yyyy-mm");
				if (AccDate >= From && AccDate <= To) tableArr.push(EX(listDataEX[i]));
			}

			for (let i in listDataOtherInc) { //Other Income
				tableArr.push(othrInc(listDataOtherInc[i]));
			}
			
			tableArr = tableArr.sort((a, b) => {  //sort
				return new Date(a.AccDate) - new Date(b.AccDate)
			});

			//////////////////////////////////////////////////////////

			setLoading(false);

			let inc = 0; let exp = 0;
			for (let i = 0; i < tableArr.length; i++) {
				inc += +tableArr[i].Income;
				exp += +tableArr[i].Expense;
			}

			setPlData(convId2Item(tableArr, ['PrpName', 'VendChnnl', 'ExpInc'], settings));

			setFilteredData({ inc: inc, exp: exp })

		}

		if (checked.length !== 0) {
			setPlData([]);
			loadData()
		}

	}, [uidCollection, valuePL, setPlData, settings, setFilteredData, setLoading, checked, vatProperty])


	const handleClose = () => {
		setOpen(false);
	};

	//const getColorArray = Object.values(monthsArr).map(x => x > 0 ? '#45afed' : 'rgba(217, 97, 97, 0.75)')
	
	return (
		<>
			<div style={{ textAlign: 'right' }}>
				<MRangePickerPL valuePL={valuePL} setValuePL={setValuePL} date={date} />
			</div>

			<div className={classes.paddingSmall}>
				<Grid container spacing={7} justifyContent="space-between"  >
					<PannelData clsNum='1' txt='Gross P&L' ttl={'Total'} num={plData.length > 0 ?
						`${addCommas(+filteredData.inc - (+filteredData.exp))}` : '0'} img={logos[0]} />
					<PannelData clsNum='2' txt='Revenue & Extra Revenue Before Vat' ttl={'Total'} num={`${addCommas(+filteredData.inc)}`}
						img={logos[1]} />
					<PannelData clsNum='3' txt='Expense' ttl={'Total'} num={`${addCommas(+filteredData.exp)}`}
						img={logos[2]} />
				</Grid>
			</div>




		<div style={{ paddingTop: '60px' }}>

				<Grid container spacing={2} justifyContent="space-around" style={{ paddingTop: '16px' }}>
					<Grid item xs={12} sm={4}>
						<Paper className={classes.root} style={{ paddingBottom: '30px' }}>
							<Chart type="bar" style={{ minHeight: '240px' }} data={PL(plData, date, cur, setCurrentData, setOpen, setShowCols).obj} 
										options={PL(plData, date, cur, setCurrentData, setOpen, setShowCols).options} />
						</Paper>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Paper className={classes.root} style={{ paddingBottom: '30px' }}>
							<Chart type="bar" style={{ minHeight: '240px' }} data={Rev(plData, date, cur, setCurrentData, setOpen, setShowCols).obj} 
										options={Rev(plData, date, cur, setCurrentData, setOpen, setShowCols).options} />
						</Paper>
					</Grid> 
					<Grid item xs={12} sm={4}>
						<Paper className={classes.root} style={{ paddingBottom: '30px' }}>
							<Chart type="bar" style={{ minHeight: '240px' }} data={loading ?{}:Exp(plData, date, cur, setCurrentData, setOpen, setShowCols).obj} 
										options={Exp(plData, date, cur, setCurrentData, setOpen, setShowCols).options} />
						</Paper>
					</Grid>
				</Grid>




				{checked.length > 1 &&
					<div style={{ paddingTop: '30px', width: 'fit-content'}}>
						<Paper style={{ padding: '8px 32px 0px 32px' }}>
							<Typography variant="h5" className='ttlClr' >
									Would you like to include more properties of the same owner?
							</Typography>

							{propList}
						</Paper>
					</div>
				}



			</div>

			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant} />




			<div style={{ paddingTop: '60px' }}>

				<Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} fullWidth={true} maxWidth='lg'>
					<DialogTitle id="customized-dialog-title" onClose={handleClose} >
						<span className='ttlClr'>{showCols==='Expense' ? 'Expenses Breakdown': showCols==='Income' ? 'Revenue Breakdown' : 'P&L Breakdown'} </span>
        		</DialogTitle>
					<DialogContent>
						<Table currentData={currentData} showCols={showCols}/>
					</DialogContent>
				</Dialog>

			</div>
			
		</>
	);
}

