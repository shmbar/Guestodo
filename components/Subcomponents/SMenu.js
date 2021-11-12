import React, {useState, useEffect, useContext, useRef} from 'react';
import {Grow, Tooltip, IconButton, ListItemText, ListItemIcon, Collapse, List,
	   Paper, Popper, MenuItem,MenuList, ClickAwayListener} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import {AuthContext} from '../../contexts/useAuthContext';
import {SelectContext} from '../../contexts/useSelectContext';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Properties from '../../logos/settings/Properties.svg';
import Channels from '../../logos/settings/Channels.svg';
import Permissions from '../../logos/settings/Permissions.svg';
import Expense from '../../logos/settings/Expense.svg';
import Owners from '../../logos/settings/Owners.svg';
import Funds from '../../logos/settings/Funds.svg';
import PmntMethods from '../../logos/settings/PmntMethods.svg';
import ExtraRevenue from '../../logos/settings/ExtraRevenue.svg';
import CompanySettings from '../../logos/settings/CompanySettings.svg';
import CompanyDetails from '../../logos/settings/CompanyDetails.svg';
import OwnerSettings from '../../logos/settings/OwnerSettings.svg';
import FinanceSettings from '../../logos/settings/FinanceSettings.svg';
import Vatpsttngs from '../../logos/settings/Vatpsttngs.svg';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

//import DownData from './DownData';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
   nested: {
    	paddingLeft: theme.spacing(4),
   },	
}));

const ownersMenuOptions = [ {txt: 'Owners', img: Owners, width:'24px'},
					  {txt: 'Funds', img: Funds, width:'24px'},
					 {txt: 'Properties', img: Properties, width:'24px'},
					 {txt: 'Channels', img: Channels, width:'24px'},
					 {txt: 'Extra Revenue', img: ExtraRevenue, width:'24px'},
					];

const expenseOptions = [ {txt: 'Property Expenses'},
							{txt: 'Recurring Expenses'}];

const companyMenuOptions = [ {txt: 'Company Details', img: CompanyDetails, width:'24px'},
							{txt: 'Company Expense', img: Expense, width:'24px'},
						     {txt: 'Company Extra Revenue', img: ExtraRevenue, width:'24px'}];


const financeMenuOptions = [ {txt: 'Payment Methods', img: PmntMethods, width:'24px'},
					 {txt: 'Vat', img: Vatpsttngs, width:'24px'}];


const SMenu=(props)=> {
  	const classes = useStyles();
  	const [open, setOpen] = useState({OwnerSettings:false, CompanySettings:false, FinanceSettings: false});
  	const [openMenu, setOpenMenu] = useState(false)
	const anchorRef = useRef(null);
	const {setValueSettings, settings, setDisplayVat} = useContext(SettingsContext);
	const {admn, user, PropMangr} = useContext(AuthContext);		
	const {setPage} = useContext(SelectContext);
	
	//const [serverData, setServerData] = useState(null);

  const handleToggle = () => {
    setOpenMenu(prevOpen => !prevOpen);
  };
	
  const closeMenu = () => {
    	//setAnchorEl(null);
	  setOpenMenu(false);
  	};
	  
  const handleClose = event => {
	 setOpenMenu(false);
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenMenu(false);
    }
  }
	
	const setPageAndCloseMenu=(x)=>{
		if(x==='Vat'){
			setValueSettings({vat: settings.vat!=null ? settings.vat.substr(0, settings.vat.length - 1) : ''})
			setDisplayVat(true)
		}else{
			closeMenu();
			setPage(x)
		}
		
	}
	
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(openMenu);
  useEffect(() => {
    if (prevOpen.current === true && openMenu === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = openMenu;
  }, [openMenu]);

	
	 const handleClickCollapse = (x) => {
	
		 switch(x) {
			case 'OwnerSettings':
				return setOpen(	{OwnerSettings:!open.OwnerSettings, CompanySettings:false, FinanceSettings: false, ExpNestSettings: false}	);
			case 'CompanySettings':
				return setOpen(	{OwnerSettings:false, CompanySettings: !open.CompanySettings, FinanceSettings: false, ExpNestSettings: false}	);
			case 'FinanceSettings':
				return setOpen(	{OwnerSettings:false, CompanySettings:false, FinanceSettings: !open.FinanceSettings, ExpNestSettings: false});
			case 'ExpNestSettings':
				return setOpen(	{OwnerSettings:true, CompanySettings:false, FinanceSettings:false, ExpNestSettings: !open.ExpNestSettings });
			 default:
				return null;
			}    
  };
	
	
		const subMenu =(x)=> x.map((s,i)=>{
			return <MenuItem key={i} onClick={() => setPageAndCloseMenu(s.txt)} className={classes.nested}>
						<ListItemIcon >
							<img src={s.img} alt={s.txt} width={s.width} style={{color: 'gray'}}/>
						</ListItemIcon>
						<ListItemText primary={s.txt} />
					</MenuItem>
		});
	
		const subMenuSettings =(x)=> x.map((s,i)=>{
			return <MenuItem key={i} onClick={() => setPageAndCloseMenu(s.txt)}>
						<ListItemText primary={s.txt} inset={true} style={{ paddingLeft: '85px'}}/>
					</MenuItem>
		});
	
		
	
	const settingsMenu = <div>
			  
		<MenuItem onClick={()=>handleClickCollapse('OwnerSettings')}>
				<ListItemIcon>
				  	<img src={OwnerSettings} alt={'Property Settings'} width='24px' style={{color: 'gray'}}/>
				</ListItemIcon>
				<ListItemText primary="Property Settings" />
				{open.OwnerSettings ? <ExpandLess /> : <ExpandMore />}
      	</MenuItem>
			<Collapse in={open.OwnerSettings} timeout="auto" unmountOnExit>
				<List  component="div" disablePadding>
					{subMenu(ownersMenuOptions)}
					<MenuItem  className={classes.nested} onClick={()=>handleClickCollapse('ExpNestSettings')}>
						<ListItemIcon >
							<img  src={Expense} alt={'Expense Settings'} width='24px' style={{color: 'gray'}}/>
						</ListItemIcon>
						<ListItemText primary={'Expenses'} />
						{open.ExpNestSettings ? <ExpandLess style={{marginRight: '35px'}} /> : <ExpandMore style={{marginRight: '35px'}} />}
					</MenuItem>
				</List >
			</Collapse>
			
			<Collapse in={open.ExpNestSettings} timeout="auto" >
				<List  component="div" >
					{subMenuSettings(expenseOptions)}
					
				</List >
			</Collapse>
			  
			  
			  
		<MenuItem onClick={()=>handleClickCollapse('CompanySettings')}>
				<ListItemIcon>
				  	<img src={CompanySettings} alt={'Company Settings'} width='24px' style={{color: 'gray'}}/>
				</ListItemIcon>
				<ListItemText primary="Company Settings" />
				{open.CompanySettings ? <ExpandLess /> : <ExpandMore />}
      	</MenuItem>
			<Collapse in={open.CompanySettings} timeout="auto" unmountOnExit>
				<List  component="div" disablePadding>
					{subMenu(companyMenuOptions)}
				</List >
			</Collapse>
		<MenuItem onClick={()=>handleClickCollapse('FinanceSettings')}>
				<ListItemIcon>
				  	<img src={FinanceSettings} alt={'Finance Settings'} width='24px' style={{color: 'gray'}}/>
				</ListItemIcon>
				<ListItemText primary="Finance Settings" />
				{open.FinanceSettings ? <ExpandLess /> : <ExpandMore />}
      	</MenuItem>
			<Collapse in={open.FinanceSettings} timeout="auto" unmountOnExit>
				<List  component="div" disablePadding>
					{subMenu(financeMenuOptions)}
				</List >
			</Collapse>
			  
	  	{user.user.email==='is@is.is' && <MenuItem onClick={/*setData*/null} disabled>
				<ListItemIcon>
					<CloudDownloadIcon />
				</ListItemIcon>
				<ListItemText primary="Download data" />
		</MenuItem>	}	
			  
		{(admn && PropMangr) &&
		  	<MenuItem onClick={() => setPageAndCloseMenu('Permissions')}>
				<ListItemIcon>
					<img src={Permissions} alt={'Permissions'} width='24px' style={{color: 'gray'}}/>
				</ListItemIcon>
				<ListItemText primary="Permissions" />
			</MenuItem>	
		}
	  </div>
	
  return (
    <>
	  {admn &&
	   <Tooltip title='Account Settings'  placement="bottom">
 				<IconButton className={classes.margin} style={{color:'#193E6D'}} 
 				onClick={handleToggle} ref={anchorRef}
					>
 					<SettingsIcon />
 				</IconButton>
		</Tooltip>  }
        <Popper open={openMenu} anchorEl={anchorRef.current} transition disablePortal placement="bottom-end" style={{width:'300px'}}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }} 
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList onKeyDown={handleListKeyDown}>
                   {settingsMenu}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
	  
    </>
  );
}

export default SMenu;

