import React, { useContext, useEffect, useCallback} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton,Drawer,AppBar,Button,Toolbar,List,
	   CssBaseline,Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {RcContext} from '../contexts/useRcContext';
import {ExContext} from '../contexts/useExContext';
import {CfContext} from '../contexts/useCfContext';
import {VtContext} from '../contexts/useVtContext';
import {OiContext} from '../contexts/useOiContext';
import {SettingsContext} from '../contexts/useSettingsContext'; 
import {AuthContext} from '../contexts/useAuthContext'; 
import {SelectContext} from '../contexts/useSelectContext';

import Reservations from './Reservations/Orders';
import Expenses from './Expenses/Expenses';
import ExpensesCompany from './ExpensesCompany/ExpensesCompany';
import OtherIncomeCompany from './OtherIncomeCompany/OtherIncome';
import OtherIncome from './OtherIncome/OtherIncome';
import CashFlow from './CashFlow/CashFlow';
import CompanyIncome from './CompanyIncome/CompanyIncome';
import CashFlowCompany from './CashFlowCompany/CashFlowCompany';
import DashboardOwner from './Dashboard/DashboardOwner';
import DashboardCompany from './Dashboard/DashboardCompany';
import CashFlowTable from './CashFlowTable/CashFlowTable';
import VatCompany from './VatCalCompany/VatCompany';
import PLCompany from './PLCompany/PLCompany';
import CashFlowTableCompany from './CashFlowTableCompany/CashFlowTableCompany';
import useWindowSize from '../hooks/useWindowSize';
import Vat from './VatCal/Vat';
import PL from './PL/PL';

import Guide from './Subcomponents/settingsGuide'

import GridLoader from 'react-spinners/GridLoader';  // //https://www.react-spinners.com/
import { css } from '@emotion/core';
import {LogoutFromSystem, readDatSettings, itemToId} from '../functions/functions';
import Tab1 from './Settings/Tab1';
import Tab2 from './Settings/Tab2';
import TabExpType from './Settings/TabExpType';
import Tab4 from './Settings/Tab4';
import Tab5 from './Settings/Tab5';
import Tab6 from './Settings/Tab6';
import Tab7 from './Settings/Tab7';
import TabCompanyExpType from './Settings/TabCompanyExpType';
import TabRecuurringExp from './Settings/TabRecuurringExp';
import Tab9OtherIncomeCompany from './Settings/Tab9OtherIncomeCompany';
import Tab10OtherIncome from './Settings/Tab10OtherIncome';
import CompanyDetails from './Settings/CompanyDetails';
import VatModal from './Settings//modals/VatModal';

import MainMenu from './Subcomponents/MainMenu';
import PropertySelect from './Subcomponents/PropertySelect';
import PropertySelectAll from './Subcomponents/PropertySelectAll';
import SMenu from './Subcomponents/SMenu';
import FundSelect from './Subcomponents/FundSelect';
import TimeOut from './Subcomponents/Idle/timeOut';
import Logo from './LandingPage/Menu/Logo.svg';

const drawerWidth = 220;

const override = css`
	position: fixed;
	left: 50%;
    top: 50%;
    z-index: 10000;
    margin: -75px 0 0 -75px;
    display: block;
    border-color: red;
`;

	
const Main =(props) =>{
 
	const scr = useWindowSize();
	let scrSize = (scr==='xs' || scr==='sm');
	const {setRcDataPrp, calendarView} = useContext(RcContext);
	const {setExDataPrp} = useContext(ExContext);
	const {setCfData} = useContext(CfContext);
	const {setVtData} = useContext(VtContext);
	const {setOtherInc} = useContext(OiContext);
	
	const {loading, displayVat, settings, setOwnerList, setPropertyList, setFundList, openMenu,
		 setOpenMenu,setSettings, setSettingsShows,setCshFlowTableCompany} = useContext(SettingsContext);
	const {admn, uid, uidCollection, user, stuff}  = useContext(AuthContext);
	const {setValueOwner, setPropertySlct, setFundSlct, page, setPage, setCheckedCalendar} = useContext(SelectContext);
	
	
	const useStyles = makeStyles(theme => ({
		root: {
		  display: 'flex',
		  backgroundColor: '#eee',
		  width: '100%',
		  minHeight: '100vh'
		  
		},
		appBar: {
		  zIndex: theme.zIndex.drawer + 1,
		  transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		  }),
			backgroundColor: 'white',
		},
		appBarShift: {
		  marginLeft: drawerWidth,
		 // width: `calc(100% - ${drawerWidth}px)`,
		  transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		  }),
		},
		menuButton: {
		  marginRight: 10,
		  marginLeft: 20,
		},
		hide: {
		  display: 'none',
		},
		drawer: {
		  width: drawerWidth,
		  flexShrink: 0,
		  whiteSpace: 'nowrap',
		},	
		drawerOpen: {
		  width: drawerWidth,
		  background: '#193E6D',
		  transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		  }),
		},
		drawerClose: {
		  transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		  }),
		  overflowX: 'hidden',
		  background: '#193E6D',  
		  width: theme.spacing(7) + 1,
		  [theme.breakpoints.up('sm')]: {
			width: theme.spacing(7) + 1,
		  },
		},
		toolbar: {
		  display: 'flex',
		  alignItems: 'center',
		  justifyContent: 'flex-end',
		  padding: '0 8px',
		  ...theme.mixins.toolbar,  
		},
	  loginButton:{
		  width:'100%',
	  //	textAlign:'right'
		  },  
		content: {
		  flexGrow: 1,
		  padding: scrSize ? theme.spacing(1) : theme.spacing(4),
		},
	}));

	const classes = useStyles();

		
	const setInitials=useCallback(async(sets)=>{
		
			let Shows = (await readDatSettings(uidCollection, 'settingsShows')).reduce((a, c) => ({...a, ...c}),
						Object.create(null));	
			setSettingsShows(Shows);  
		
			const owners = sets.owners!=null  ? (admn || stuff ? sets.owners.filter(x=> x.show ).map(x=>x.item) :
													sets.owners.findIndex(x=> x.id === uid)!==-1 ? [uid] : [] )
											: [];
	
			const properties =  sets.properties!= null ? (admn || stuff ? sets.properties.filter(x=> x.show ).map(x=>x.PrpName) :
									sets.properties.filter(x=> (x.Owner === (owners[0])) &&
									x.show).map(y=>y.PrpName)) : [];

			
			setCheckedCalendar({...properties.reduce((o, key) => ({ ...o, [key]: false}), {}), 'All' :false})
		
			if(properties.length!==1){
				setPropertyList(properties);
			}else{
				setPropertySlct(sets.properties.filter(x=> x.PrpName===properties[0])[0]['id']);
				setFundSlct(	sets.funds.filter(y=> y.Owner===sets.properties.filter(x=> x.PrpName===properties[0])[0]['Owner'])[0]['id']	);
			}
			
			const funds = sets.funds==null ? []: (admn || stuff )? sets.funds.filter(x=> x.show ).map(x=>x.item) :
					sets.funds.filter(x=> (x.Owner === uid ) &&  x.show).map(y=>y.item)

			if(funds.length!==1){
				setFundList(funds);
			}else{
				setFundSlct(itemToId(sets.funds,funds[0]));
			}

			setPage(/*'Permissions' */  'DashboardOwner'  /*'Reservations'*/)
		
	},[ admn, stuff, setSettingsShows, uid, uidCollection ,setFundSlct, setFundList, setPage, setPropertyList, setPropertySlct, setCheckedCalendar])
		
		
	
	
		
	useEffect(()=>{
		
		const setAllSettings= async() => {
				console.log('settings');
				
	//			setLoading(true)
				
				let sets = (await readDatSettings(uidCollection, 'settings')).reduce((a, c) => ({...a, ...c}),
				Object.create(null));
			
			
				
				if(JSON.stringify(sets) === '{}'){ //in case empty setting or serve problem
					alert('Network problem has occured. Please refresh or press "F5"');
					return;
				}

			
				setSettings(sets);
				setInitials(sets) 
		}
		
		setAllSettings();
		
		
	},[user, setSettings, uidCollection, setInitials ]);
	
	useEffect(()=>{
		
		scrSize	&& setOpenMenu(false)
	
	},[scrSize, setOpenMenu])

	function handleDrawerOpen() {
    	setOpenMenu(true);
  	}

	const logOut=()=>{
		localStorage.clear();
		LogoutFromSystem();
		setRcDataPrp([]);
		setExDataPrp({'exData': [], 'pmnts': []});
		setCfData([]);
		setVtData([]);
		setOtherInc([]);
		setPropertySlct(null);
		setValueOwner(null); //set valueOwner to null
		setFundSlct(null);
		setPropertyList([]);
		setOwnerList([]);
		setFundList([]);
		setCshFlowTableCompany([]);
		setSettings([]);
		setSettingsShows([]);
		setPage('');
		props.history.push('/login');
	}

  function handleDrawerClose() {
    setOpenMenu(false);
  }

  return (
    <div className={classes.root}>
		
      <CssBaseline />
      <AppBar   position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: openMenu})}   >
        <Toolbar>
			 {!scrSize && <div style={{paddingBottom: '12px'}}>
				<img src={Logo} alt={''} width={120} /* style={{color: 'gray'}} *//>
			</div>}
			<IconButton	color="inherit"	aria-label="Open drawer" onClick={handleDrawerOpen} edge="start"
				className={clsx(classes.menuButton, {
				  [classes.hide]:openMenu})}
	  		>
				<MenuIcon style={{color: '#193E6D'}} />
			</IconButton>
		 	
			 
			<IconButton onClick={handleDrawerClose} color="inherit" edge="start"
					className={clsx(classes.menuButton, {
				  [classes.hide]:!openMenu})}
			>
			 	<ChevronLeftIcon style={{color: '#193E6D'}}/>
			</IconButton>
			<Typography variant="h6" noWrap style={{color:'#193E6D', overflow: 'initial', /*fontFamily: 'MyFont', */fontSize: '20px'}} /*className='demotext'*/>
			  {!scrSize && (settings.CompDtls!=null ? settings.CompDtls.cpmName : '')}
			 
          </Typography>
			
			{(settings.length!==0 && !scrSize )&&	<Typography variant="h6" noWrap style={{color:'#193E6D', overflow: 'initial', fontSize: '20px'}}>
				 {(settings.owners.length===0 && page!=='Owners') && <Guide txt='Property owners data is empty. Click here to set owners.' page='Owners' setPage={setPage}/> }
				 {(settings.owners.length!==0 && settings.funds.length===0 && page!=='Funds') && <Guide txt='Funds data is empty. Click here to set funds.' page='Funds' setPage={setPage}/> }
				 {(settings.owners.length!==0 && settings.funds.length!==0 && 	settings.properties.length===0 	&&	page!=='Properties') &&
						<Guide txt='Properties data is empty. Click here to set properties.' page='Properties' setPage={setPage}/>}
						</Typography>
			}
			
			<div   className={classes.loginButton} style={{justifyContent: 'flex-end', display: 'inline-flex'}} >
				<TimeOut />
				{(page==='DashboardOwner' || (page==='Reservations' && !calendarView) || page==='Expenses' ) && <PropertySelect />}
				{(page==='Reservations' && calendarView) && 	<PropertySelectAll /> }
				{(page==='P&L' || page==='Extra Revenue  ') && <PropertySelect /> }
				{(page==='Money Transfer' || page==='Cash Flow' || page==='Vat') && <FundSelect />}
				<SMenu/>
				
				<Button color="inherit" onClick={logOut}style={{color: '#193E6D'}}>
				  		Log Out
				</Button>
			</div>
        </Toolbar>
      </AppBar>
		 
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openMenu,
          [classes.drawerClose]: !openMenu,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openMenu,
            [classes.drawerClose]: !openMenu,
          }),
        }}
        open={openMenu }
	  	style={scrSize && !openMenu ? {display: 'none'}: {display:scrSize ? 'contents' : 'block'}}  //!fllScrn &&  
	//	onMouseEnter={() => handleDrawerOpen()}
	//	onMouseLeave={() => handleDrawerClose()} 
      >
		<div className={classes.toolbar} /> 
       	<List>	   
			<MainMenu draweropen={openMenu} setOpenDrawer={setOpenMenu} fllScrn={scrSize}/>
		</List>
        
	  </Drawer>
		
      <main className={classes.content} >
		 
		<div>
		  	<GridLoader
				  css={override}
				  sizeUnit={"px"}
				  size={50}
				  color={'#012c61'}
				  loading={loading}
			/>
		</div> 
        <div className={classes.toolbar} />
		  
      		{page==='Reservations' && <Reservations /> }
		  	{page==='Expenses' && <Expenses />}
		  	{page==='Money Transfer' && <CashFlow />}
		  	{page==='Vat' && <Vat />}
		  	{page==='Cash Flow' && <CashFlowTable />}
		  	{page==='P&L' && <PL />}
		  	{page==='Owners' && <Tab1 />}
		  	{page==='Property Expenses' && <TabExpType />}
		  	{page==='Properties' && <Tab2 />}
		  	{page==='Channels' && <Tab4 />}
			{page==='Permissions' && <Tab5 />}
		  	{page==='Payment Methods' && <Tab6 />}
		  	{page==='Funds' && <Tab7 />}
		  	{page==='Company Expense' && <TabCompanyExpType />}
		  	{page==='Expenses ' && <ExpensesCompany />}
		  	{page==='Money Transfer ' && <CashFlowCompany />}
		  	{page==='Company Extra Revenue' && <Tab9OtherIncomeCompany />}
		  	{page==='Extra Revenue ' && <OtherIncomeCompany />}
		  	{page==='Extra Revenue' && <Tab10OtherIncome />}
		  	{page==='Extra Revenue  ' && <OtherIncome />}
		    {page==='Commissions' && <CompanyIncome />}
		  	{page==='Vat ' && <VatCompany />}
		  	{page==='P&L ' && <PLCompany />}
		  	{page==='Company Details' && <CompanyDetails />}
		  	{page==='Cash Flow ' && <CashFlowTableCompany />}
		  	{page==='DashboardOwner' && <DashboardOwner /> }
		  	{page==='Dashboard ' && <DashboardCompany /> }
			{page==='Recurring Expenses' && <TabRecuurringExp /> }
		  
		  
      </main>
		  {displayVat && <VatModal />}
    </div>
  );
}

export default Main;



/*

	


*/