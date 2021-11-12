import React, {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {List, Divider} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
//import DashboardIcon from '@material-ui/icons/Dashboard';
import {AuthContext} from '../../contexts/useAuthContext';
import {SelectContext} from '../../contexts/useSelectContext';
import clsx from 'clsx';

import Rsrv from '../../logos/main/Rsrv.svg';
import Exp from '../../logos/main/Exp.svg';
import Montrnsf from '../../logos/main/Montrnsf.svg';
import Vatp from '../../logos/main/Vatp.svg';
import Commissions from '../../logos/main/Commissions.svg';
import ExtraRevenue from '../../logos/main/ExtraRevenue.svg';
import Pl from '../../logos/main/Pl.svg';
import Cashtable from '../../logos/main/Cashtable.svg';
import Dashbrd from '../../logos/main/Dashbrd.svg';
import MProp from '../../logos/main/MProp.svg';
import MCompany from '../../logos/main/MCompany.svg';
import MFund from '../../logos/main/MFund.svg';

 const   logoProperty=  [	{txt: 'Reservations', img: Rsrv, width:'22px'},
				 			{txt: 'Expenses', img: Exp, width:'24px'},
						 	{txt: 'Extra Revenue  ', img: ExtraRevenue, width:'24px'},
							{txt: 'P&L', img: Pl, width:'20px'}	];

 const   LogoCashTable =  [ {txt: 'Vat', img: Vatp, width:'24px'},
						   {txt: 'Money Transfer', img: Montrnsf, width:'20px'},
						   {txt: 'Cash Flow', img: Cashtable, width:'24px'}  	];

const   LogoCompany =  [ 	 {txt: 'Dashboard ', img: Dashbrd, width:'24px'},
							{txt: 'Commissions', img: Commissions, width:'24px'},
							{txt: 'Expenses ', img: Exp, width:'24px'},
						   {txt: 'Money Transfer ', img: Montrnsf, width:'20px'},
						   {txt: 'Extra Revenue ', img: ExtraRevenue, width:'24px'},
					   		{txt: 'Vat ', img: Vatp, width:'24px'},
					   		{txt: 'P&L ', img: Pl, width:'20px'},
					   		{txt: 'Cash Flow ', img: Cashtable, width:'24px'} ];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  header:{
	color: 'white',
  	fontSize: '15px',
  },	
  nested: {
	paddingLeft: theme.spacing(4),
  },
  clickedItemclr:{
	background: '#5EC198'	//'steelblue',
  },
  iconstyle:{
	color:'white',
    minWidth:theme.spacing(5),
  }	
}));

const MainMenu = (props) => {

	const classes = useStyles();
  	const [open, setOpen] = useState({property:false, owner:false, cashtable: false, company:false});
	const {acnt, PropMangr} = useContext(AuthContext);	
	const {page, setPage, date,setDate} = useContext(SelectContext);

	
 useEffect(()=>{
		if(props.draweropen===false)setOpen({property:false, owner:false, cashtable: false})
 },[props.draweropen, setOpen])	
	
  const handleClick = (x) => {
	 props.setOpenDrawer(true)
	 switch(x) {
    	case 'property':
      		return setOpen(	{property:!open.property, owner:false, cashtable: false, company:false}	);
    	// case 'owner':
    	// return setOpen(	{property:false, owner: !open.owner, cashtable: false, company:false}	);
	    case 'cashtable':
      		return setOpen(	{property:false, owner:false, cashtable: !open.cashtable, company:false});
		 case 'company':
      		return setOpen(	{property:false, owner:false, cashtable: false, company:!open.company});	 
		 default:
      		return null;
  		}    
  };

	const handleItem = (item) => {
		
		if(item==='Reservations' && date.month===12){
		   	 setDate({'month': new Date().getMonth(), 'year': new Date().getFullYear()})
		}
	
		setPage(item);
		
		if(props.fllScrn)props.setOpenDrawer(false)
	}
	
  return (
 <>
	
	<ListItem button onClick={()=>handleItem("DashboardOwner")} className={clsx(page==='DashboardOwner' && classes.clickedItemclr)}>
		<ListItemIcon className={classes.iconstyle} >
	  		<img src={Dashbrd}  alt="Dashboard"  width='24px' />
		</ListItemIcon>
		<ListItemText classes={{primary:classes.header}} primary="Dashboard"  />
  	</ListItem> 
	
  	<ListItem button onClick={()=>handleClick('property')}>
		<ListItemIcon className={classes.iconstyle} >
	  		<img src={MProp}  alt="Properties"  width='24px' />
		</ListItemIcon>
			<ListItemText classes={{primary:classes.header}} primary="Property"  />
		{open.property ? <ExpandLess className={classes.header} /> : <ExpandMore className={classes.header} />}
  	</ListItem>
  	<Collapse in={open.property} timeout="auto" unmountOnExit>		
  		<List component="div" disablePadding>
			{logoProperty.map((text, index) => (
				<ListItem button key={index} className={clsx(classes.nested, page===text.txt && classes.clickedItemclr)} onClick={()=>handleItem(text.txt)}>  
						<ListItemIcon className={classes.iconstyle} ><img src={text.img}
									  alt={text.txt}  width={text.width} />
						</ListItemIcon>   
				  <ListItemText primary={text.txt} classes={{primary:classes.header}} />
				</ListItem>
		  	))}
		  </List>
  	</Collapse>

	<ListItem button onClick={()=>handleClick('cashtable')}>
		<ListItemIcon className={classes.iconstyle} >
	  		<img src={MFund}  alt="Fund"  width='24px' />
		</ListItemIcon>
			<ListItemText classes={{primary:classes.header}} primary="Fund"  />
		{open.cashtable ? <ExpandLess className={classes.header} /> : <ExpandMore className={classes.header} />}
  	</ListItem>
  	<Collapse in={open.cashtable} timeout="auto" unmountOnExit>		
  		<List component="div" disablePadding>
			{LogoCashTable.map((text, index) => (
				<ListItem button key={index} className={clsx(classes.nested, page===text.txt && classes.clickedItemclr)} onClick={()=>handleItem(text.txt)}>  
						<ListItemIcon className={classes.iconstyle} ><img src={text.img}
									  alt={text.txt}  width={text.width} />
						</ListItemIcon>   
				  <ListItemText primary={text.txt} classes={{primary:classes.header}} />
				</ListItem>
		  	))}
			
		</List>
  	</Collapse>
  	<Divider  style={{background:'white', marginLeft: '15px',marginRight: '15px'}}/>
	
	{(acnt || PropMangr) && <ListItem button onClick={()=>handleClick('company')}>
		<ListItemIcon className={classes.iconstyle} >
	  		<img src={MCompany}  alt="Company"  width='24px' />
		</ListItemIcon>
			<ListItemText classes={{primary:classes.header}} primary="Company"    primaryTypographyProps={{ style: { whiteSpace: "normal" } }} />
		{open.company ? <ExpandLess className={classes.header} /> : <ExpandMore className={classes.header} />}
  	</ListItem> }
	  
	  
  	<Collapse in={open.company} timeout="auto" unmountOnExit>		
  		<List component="div" disablePadding>
			{LogoCompany.map((text, index) => (
				<ListItem button key={index} className={clsx(classes.nested, page===text.txt && classes.clickedItemclr)} onClick={()=>handleItem(text.txt)}>  
						<ListItemIcon className={classes.iconstyle} ><img src={text.img}
									  alt={text.txt}  width={text.width} />
						</ListItemIcon>   
				  <ListItemText primary={text.txt} classes={{primary:classes.header}} />
				</ListItem>
		  	))}
			
		</List>
  	</Collapse> 
	</>  
  );
}

export default MainMenu;


