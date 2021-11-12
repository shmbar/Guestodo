import React from 'react';
import CookieConsent from "react-cookie-consent";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
	txt2: {
		color: 'Coral',
		'&:hover': {
			cursor: 'pointer',
			color: 'Orange',
			textDecoration: 'none',
		},
	},
}));


const SidebarDemo = () => {
	const classes = useStyles();
	const theme = useTheme();
	let sreenLG = useMediaQuery(theme.breakpoints.down('lg'));
	
	return(
		
		
		<CookieConsent
		//	debug={true} for developing
			buttonText="Accept Cookies"
			style={{ backgroundColor: '#0F52BA', color: 'white', opacity: '0.9', padding: sreenLG ? '8px': '8px 280px' }}
			buttonStyle={{ color: 'white',  border: '1px solid white', background: 'none', borderRadius: '4px', fontSize: '15px' }}
		//	extraCookieOptions={{ domain: "guestodo.com" }}
			cookieName="Guestodo" 
			expires={365}
			>
									<Typography
										variant="subtitle2"
										gutterBottom
										style={{ fontFamily: '"Poppins", Sans-serif' }}
									>
										If you continue to browse, we will use cookies that make our
										site work. For more information please refer to our{' '}
										<Link to="/privacy" className={classes.txt2}>
											Privacy Policy.
										</Link>
									</Typography>
							
					
		</CookieConsent>
	
	)
	
}

export default SidebarDemo;