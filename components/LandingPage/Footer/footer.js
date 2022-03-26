import React from 'react';
import './footer.css';
import {Link} from 'react-router-dom';
import {Typography, Divider, Grid}   from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';
import Container from '@material-ui/core/Container';

import Logo from '../Menu/Logo.svg';

function Copyright() {
  return (
    <Typography variant="body2" align="center" style={{color: '#5ec198'}}>
		{' © '}
		{new Date().getFullYear() }
		{' GuesTodo  '}
		  <span className='privacy'>
		  	<Link to='/privacy' className='privacy'>Privacy Policy</Link>
		  </span>
		 
    </Typography>
  );
}

const bnfts=['Flexibility','User-friendly',	'Automation','Easy Access'];
const ftrs=['Dashboard','Management Fee','Profitability', 'VAT']
const Footer=()=>{
	
return (
	<footer /* className="footer-distributed" */>
		<Divider />
			<Container maxWidth="lg" style={{padding: '40px 0'}}>
				<Grid   container   direction="row"   justifyContent="center" >
					<Grid item xs={12} md={3} className='logoFooter'>
						<div style={{textAlign: 'center'}}><img src={Logo} alt='Guestodo' width={200} /></div>
						<p className='textBelowLogo'>From now on, Optimize with GuesTodo</p>
					</Grid>
					<Grid item xs={3} md={3}>
						<p className='footerTtl'>Benefits</p>
						<div style={{paddingTop: '10px'}}>
							{bnfts.map((x,i)=>{
								return(
									<div key={i} className='bnft'>{x}</div>
								)
							})}
						</div>
					</Grid>
					<Grid item xs={3} md={3}>
						<p className='footerTtl'>Features</p>
						<div style={{paddingTop: '10px'}} id='ftr'>
							{ftrs.map((x,i)=>{
								return(
									<Link key={i} to='/features'><div  className='bnft'>{x}</div> </Link>
								)
							})}
						</div>
					</Grid>
					<Grid item xs={3} md={3}>
						<p className='footerTtl'>Contact</p>
						<div style={{paddingTop: '10px', textAlign: 'center'}} id='ftr'>
							<EmailIcon style={{color: '#193e6d', marginRight: '10px'}} className='footerEmail'/>
							<span style={{color: '#193e6d',
									userSelect: 'text'}}>info@guestodo.com</span>
							<Link to='/terms'><div  className='bnft' >Terms of Service</div> </Link>
							<Link to='/contact'><div  className='bnft' >Write Us</div> </Link>
							<Link to={{ pathname: "https://www.facebook.com/guestodo" }} 
								target="_blank">
								<FacebookIcon style={{color: '#193e6d', marginTop: '10px'}} />
							</Link>
							<LinkedInIcon style={{color: '#193e6d', marginTop: '10px'}}/>
						</div>
					</Grid>
				</Grid>
				
		</Container>
		<Divider />
		<div style={{textAlign: 'center', padding: '20px 0'}}>
				<Copyright />
		</div>
				
	</footer>
 	
  );
}
	
 

export default Footer;
