import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {addMsg} from '../../functions/functions';
import { v4 as uuidv4 } from 'uuid';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import Lottie from 'react-lottie';
import ScndLotie from '../LandingPage/Lotties/ScndLotie';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';


var CntrList = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
								'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands',
								'Colombia', 'Comoros', 'Democratic Republic of the Congo (Kinshasa)', 'Congo-Republic of(Brazzaville)', 'Cook Islands', 'Costa Rica', 'Côte D"ivoire (Ivory Coast)', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor (Timor-Leste)', 'Ecuador',
								'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Great Britain', 'Greece', 'Greenland',
								'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Holy See', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea Democratic People"s Rep. (North Korea)',
								'Korea Republic of (South Korea)', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Lao People"s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
								'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federal States of', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar, Burma', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand',
								'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian territories', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Island', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion Island', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
								'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia (Slovak Republic)', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland',
								'Syria, Syrian Arab Republic', 'Taiwan (Republic of China)', 'Tajikistan', 'Tanzania; officially the United Republic of Tanzania', 'Thailand', 'Tibet', 'Timor-Leste (East Timor)', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
								'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City State (Holy See)', 'Venezuela', 'Vietnam', 'Virgin Islands (British)', 'Virgin Islands (U.S.)'];


const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	mainItem: {
		paddingLeft: '10px',
		paddingRight: '10px',
		display: 'flex',
		paddingTop: '15px'
	},
	padding: {
		padding: theme.spacing(4),
	},
	cntctUs:{
		color: '#193e6d',
		fontSize: '28px',
		fontWeight: 600,
		fontFamily: '"Poppins", Sans-serif',
		paddingBottom: '15px'
	},
	btn:{
		background: '#193E6D',
		width: '100%',
		height: '50px',
		fontSize: '1.5rem',
		fontFamily: '"Poppins", Sans-serif!important',
	},
	NtGstMember: {
			color: 'grey',
			fontSize: '12px',
			fontFamily: 'Poppins, Sans-serif!important',
			marginTop: '20px',
	},
	customInpt: {
		fontSize: '18px',
		width: '100%',
		color: '#333333',
		padding: '0.8em',
		transition: 'border-color 0.2s, box-shadow 0.2s',
		borderRadius: '4px',
		fontFamily: '"Poppins", Sans-serif!important',
		'&:::placeholder': {
    		color: '#193e6d'
		},
		'&:enabled:focus': {
    		outline: '0 none',
    		outlineOffset: 0,
    		boxShadow: 'none !important',
    		borderColor: '#007ad9'
		}
	},
	lbl:{
    	fontFamily: '"Poppins", Sans-serif'
	},
	lnk: {
			color: 'blue',
			fontSize: '12px',
			fontFamily: 'Poppins, Sans-serif!important',
			marginTop: '10px',
			'&:hover': {
				cursor: 'pointer',
				color: '#0056b3',
				textDecoration: 'none',
			},
		},
	
}));

const defaultOptions = (x) => {
    return {
        loop: true,
        autoplay: true,
        animationData: x,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    };
};

function validateContact(values) {
  let errors = {};

  // Email Errors
  if (!values.email) {
    errors.email = "Email required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

	// Name Errors
  if (!values.fName) {
    errors.fName = "First name required";
  }

  if (!values.lName) {
    errors.lName = "Last name required";
  }

  if (!values.phone) {
    errors.phone = "Phone required";
  } else if (values.phone.length < 9) {
    errors.phone = "Phone number is too short";
  }
	
  if (!values.company) {
    errors.company = "Company name required";
  }
	
  if (!values.country) {
    errors.country = "Country required";
  }
	
	if (!values.phone) {
    errors.phone = "Phone required";
  }
	
  if (!values.ttlprps) {
    errors.ttlprps = "Total managed properties required";
  }
	
  return errors;
}


const CustomizedInputs = (props) => {
	const classes = useStyles();
	const [value, setValue] = useState({fName:'', lName: '', email: '', phone: '', company: '', country: '', ttlprps: null})
	const [submitting, setSubmitting] = useState(false);
	const theme = useTheme();
	let screenXS = useMediaQuery(theme.breakpoints.down('xs'));
	
	const sendMsg=(e)=>{
		e.preventDefault();
		
		if(Object.keys(	validateContact(value)	).length !== 0){
			setSubmitting(true)
			return;
		} 
		
		
		setValue({fName:'', lName: '', email: '', phone: '', company: '', country: '', ttlprps: null})
		async function Send() {
			let Id = uuidv4();
			props.setSnackbar({open: (await addMsg('bookdemo', Id, {...value, 'time': new Date(), 'id': Id})),
							   msg: 'Your Reqeust was successfully sent', variant: 'success'}) ;
		
		}
		Send();
		setSubmitting(false)
	}
	
	return (
			<div>
				<form className={classes.root} noValidate>
					
					<Grid container direction="row" spacing={6} justifyContent="space-around" >
						<Grid item xs={12} md={7} className={classes.padding}>
							<div className={classes.cntctUs}>Discover what GuesTodo can do for you</div>
							<Grid container direction="row" justifyContent="flex-start" spacing={5} style={{ paddingTop: '16px' }}>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.fName}
											onChange={(e) => setValue({...value, 'fName': e.target.value})} />
										<label htmlFor="in" className={classes.lbl}>First Name</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).fName}</p>}
								</Grid>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.lName}
											onChange={(e) => setValue({...value, 'lName': e.target.value})} />
										<label htmlFor="in" className={classes.lbl}>Last Name</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).lName}</p>}
								</Grid>
								<Grid item xs={12} md={6} >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.email}
											onChange={(e) => setValue({...value, 'email': e.target.value})} />
										<label htmlFor="in" className={classes.lbl}>Email</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).email}</p>}
								</Grid>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label">
										<InputText  id="phone"  className={classes.customInpt}
											value={value.phone} onChange={(e) => setValue({...value, 'phone': e.target.value})}></InputText>
										<label htmlFor="in" className={classes.lbl}>Phone Number</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).phone}</p>}
								</Grid>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.company}
											onChange={(e) => setValue({...value, 'company': e.target.value})} />
										<label htmlFor="in" className={classes.lbl}>Company Name</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).company}</p>}
								</Grid>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label" >
										<Dropdown inputId="dropdown" value={value.country} options={CntrList}  className={classes.customInpt}
											onChange={(e) => setValue({...value, 'country': e.target.value})} style={{ padding: '0.47em'}}/>
										<label htmlFor="in" className={classes.lbl}>Country</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).country}</p>}
								</Grid>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label">
										<InputNumber inputId="integeronly"  className={classes.customInpt} value={value.ttlprps} showButtons 
											onChange={(e) => setValue({...value, 'ttlprps': e.value})} style={{ padding: 0, height: '50px'}}/>    
										<label htmlFor="in" className={classes.lbl}>Total Managed Properties</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).ttlprps}</p>}
								</Grid>
							</Grid>
							
							
							
						
							<Grid container direction="row" justifyContent="flex-start" style={{ paddingTop: '36px' }} >
								<Grid item xs={12}  >
									
									<div style={{width: '100%', paddingTop: '15px' }}>
										<Button label="Book a Demo"  className={classes.btn} onClick={(e)=>sendMsg(e)}/>
										<Typography component="h1" variant="h4" className={classes.NtGstMember}>
											Your personal information will be kept confidential according to our 
											<Link to="/privacy" className={classes.lnk}>
												{' '}Privacy Policy.{' '}
											</Link> 
											Read our 
											<Link to="/terms" className={classes.lnk}>
												{' '}Terms of Services.
											</Link>
										
										</Typography>
									</div>
									{submitting && <p style={{color:'red'}}>{validateContact(value).msg}</p>}

								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12} md={5}  style={{alignSelf: 'center'}}>
							
							 {!screenXS && (
                                <Lottie
                                    options={defaultOptions(ScndLotie)}
                                    height='100%'
                                    width='100%'
                                />
                            )}
							
						</Grid>


					</Grid>

				</form>
				
			</div>
	);
}

export default CustomizedInputs;
