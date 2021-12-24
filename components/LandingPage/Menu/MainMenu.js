import React , {useState} from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import {Link, NavLink} from 'react-router-dom';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import {Sidebar} from 'primereact/sidebar';
import clsx from 'clsx';

import Logo from './Logo.svg';


const useStyles=makeStyles(theme=>({
	logo:{
		paddingBottom: 14,
		width:200,
		[theme.breakpoints.down('md')]: {
      		width:150,
			paddingBottom: 12,
    	},
	},
	fnt:{
		fontSize: '1.2em',
		color: '#193E6D',
		padding: '0 1rem',
		fontFamily: '"Poppins", Sans-serif',
		'&:hover':{
			textDecoration: 'none',
			color: '#b27300'
		},
		[theme.breakpoints.down('md')]: {
      		fontSize: '1em',
    	},
	},
	reg:{
		borderRadius: 30,
		padding: '8px',
		background: '#5EC198',
		color: 'white'
	},
	activeLink:{
		color: '#5EC198',
	},
	activeLinkReg:{ color: 'white'},
	toolbar: {
		top:0,
		zIndex:1,
		display: 'flex',
		width: '100%',
		position: 'fixed',        
		background: 'white',
		padding: '12px 0',
		boxShadow: '0px 3px 16px 0px rgba(0,0,0,0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('md')]: {
      		padding: '12px 0',
    	},
	},
	hamburger :{
		margin: 'auto',
		paddingLeft:'15px',
		paddingRight: '30px'
	},
	toolbar_navigation: {
		display: 'flex'
	},
	spacer:{flex:1},
	toolbarNavigationMin:{
		position: 'relative',
		width: '220px',
		margin: '20px',
		'&:hover':{
			color: '#b27300'
		}
	},
	sidebar:{
		width: '18em',
		background: '#193e6d'
	},
	ul:{
			listStyle: 'none',
			margin: 0,
			padding: 0
	},
	toolbar_navigation_items:{
		lineHeight: '1.8',
		display:'block',
		textDecoration:'none',
		fontSize: '18px',
		padding: '1em 1.52em',
		fontWeight: 600,
		color: 'white',
		'&:hover':{
			color: '#b27300',
			textDecoration: 'none',
		},
		
	}
	
	
})
)


const MainMenu=()=>{
	
	const theme = useTheme();
	let screenSM = useMediaQuery(theme.breakpoints.down('sm'));
	let screenMD = useMediaQuery(theme.breakpoints.down('md'));
	const [visibleLeft, setVisibleLeft] = useState(false);
	const reg ={name: '', email:''};
	const classes = useStyles();
	
	const list = [{lnk:'home', ttl: 'Home'},
				 {lnk:'features', ttl: 'Features'},
				 {lnk:'contact', ttl: 'Contact'},
				 {lnk:'pricing', ttl: 'Pricing'},
				 {lnk:'login', ttl: 'Login'},
				 {lnk:'freedemo', ttl: 'Book a Demo'},
				// {lnk:'signup', ttl: 'Register'}
				  ]
	
 	const openSideBAr=()=>{
		setVisibleLeft(!visibleLeft)
	}
	
	const ToolBarNavMin=()=>{ 
	return	<nav className={classes.toolbarNavigationMin}>
					<ul className={classes.ul}>
						{
							list.map((itm,i)=>(
								<li key={i} className={classes.li}>
									<Link to={{pathname:`/${itm.lnk}`, 'state': reg	}} className={classes.toolbar_navigation_items}>{itm.ttl}</Link>
								</li>
							))
						}
					</ul>
			</nav>
	}
	
return (
		<div>
			<Sidebar visible={visibleLeft} baseZIndex={1000000} onHide={() => setVisibleLeft(false)} className={classes.sidebar}>
				<ToolBarNavMin />
			</Sidebar> 
			<header className={classes.toolbar}>
				 <Container maxWidth={screenMD ? 'md': 'lg'}>
					<nav className={classes.toolbar_navigation}>
					{	<img src={Logo} alt='Guestodo'  className={classes.logo} />}
						<div className={classes.spacer} />
						{screenSM && 
							<div className={classes.hamburger}><MenuRoundedIcon fontSize='large' onClick={openSideBAr}/></div>
						}
						{!screenSM && 
							<div style={{margin: 'auto'}}>
								<NavLink  exact activeClassName={classes.activeLink} to='/home' className={classes.fnt} underline='none'>Home</NavLink>
								<NavLink  exact activeClassName={classes.activeLink} to='/features'  className={classes.fnt}>Features</NavLink>
								<NavLink  exact activeClassName={classes.activeLink} to='/contact' className={classes.fnt}>Contact</NavLink>
							    <NavLink  exact activeClassName={classes.activeLink} to='/pricing' className={classes.fnt}>Pricing</NavLink>
								<NavLink  exact activeClassName={classes.activeLink} to='/login' className={classes.fnt}>Login</NavLink>
							 	<NavLink  exact activeClassName={classes.activeLinkReg} to={{pathname:'/freedemo', 'state': reg }} 
										className={clsx(classes.fnt, classes.reg)}	 >Book a Demo</NavLink>
							{/*	<NavLink  exact activeClassName={classes.activeLinkReg} to={{pathname:'/signup', 'state': reg }} 
										className={clsx(classes.fnt, classes.reg)}	 >Register</NavLink> */}
							</div>
						}
						
					</nav>
				</Container>
  				
			</header>
		</div>
 	
  );
}
	
 

export default MainMenu;
