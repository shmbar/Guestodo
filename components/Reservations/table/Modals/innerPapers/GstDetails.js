import React, { useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Email from '@material-ui/icons/Email';
import Remove from '@material-ui/icons/Remove';
import Mobile from '@material-ui/icons/StayCurrentPortrait'; 
import Phone from '@material-ui/icons/Phone';
import Home from '@material-ui/icons/Home'; 
import Passport from '@material-ui/icons/ChromeReaderMode';  
import Face from '@material-ui/icons/Face';  
import {RcContext} from '../../../../../contexts/useRcContext';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';
import {AuthContext} from '../../../../../contexts/useAuthContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
  //  margin: theme.spacing(1),
	width: '100%',
    minWidth: 120,
  }
}));

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

let CntrMenu = CntrList.map(s=>{
				return <MenuItem key={s} value={s}>{s}</MenuItem>
		});


const GstDetails = () =>{
	const classes = useStyles();
	const {value,handleChangeDetails,handleChange} = useContext(RcContext);
	const {settings} = useContext(SettingsContext);
	const {write, uidCollection} = useContext(AuthContext);					 						 				 
	
	
	return (
			<Grid container spacing={7}>
					<Grid item xs={12} md={10}>
						<TextField
						value={value.GstName}
					//	onChange={props.handleChange}
					//	required
						name="GstName"
						label="Guest Name"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<Face />
							</InputAdornment>
						  ),
						}}		
					  />
					</Grid>
					<Grid item xs={12} md={3}>
						<TextField
						value={value.dtls.adlts}
						onChange={handleChangeDetails}
					//	required
						
						name="adlts"
						label="Adults"
						fullWidth
						 InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
								 {write && <IconButton
								edge="end"
								onClick={e=>handleChangeDetails('add', 'adlts')}
							  >
								<Add />
							  </IconButton> }
								{write &&   <IconButton
								edge="end"
								onClick={e=>handleChangeDetails('minus', 'adlts')}
							  >
								<Remove />
							  </IconButton> }
							</InputAdornment>
						  ),
						}}	
					  />
					</Grid>
					<Grid item xs={12} md={3}>
						<TextField
						value={value.dtls.chldrn}
						onChange={handleChangeDetails}
					//	required
						name="chldrn"
						label="Children"
						fullWidth
						InputProps={{
						 endAdornment: (
							 <InputAdornment position="end">
								 {write && <IconButton
								edge="end"
								onClick={e=>handleChangeDetails('add', 'chldrn',e)}
								
							  >
								<Add />
							  </IconButton> }
							{write &&  <IconButton
								edge="end"
								onClick={e=>handleChangeDetails('minus', 'chldrn',e)}
							
							  >
								<Remove />
							  </IconButton> }
							</InputAdornment>
						  ) ,
						}}
					  />
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
						value={value.dtls.Passport}
						onChange={e=>write && handleChange(uidCollection, e, settings )}
					//	required
						name="Passport"
						label="Passport"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<Passport />
							</InputAdornment>
						  ),
						}}		
					  />
					</Grid>
					<Grid item xs={12} md={7}>
						<TextField
						value={value.dtls.email}
						onChange={e=> write && handleChange(uidCollection, e, settings )}
					//	required
						name="email"
						label="Email Address"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<Email />
							</InputAdornment>
						  ),
						}}		
					  />
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
						value={value.dtls.mobile}
						onChange={e=> write && handleChange(uidCollection, e, settings )}
					//	required
						name="mobile"
						label="Mobile Number"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<Mobile />
							</InputAdornment>
						  ),
						}}	
					  />
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
						value={value.dtls.phone}
						onChange={e=> write && handleChange(uidCollection, e,settings )}
					//	required
						name="phone"
						label="Phone Number"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<Phone />
							</InputAdornment>
						  ),
						}}	
					  />
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
						value={value.dtls.addrss}
						onChange={e=> write && handleChange(uidCollection, e,settings )}
					//	required
						name="addrss"
						label="Address"
						fullWidth
						InputProps={{
						 endAdornment: (
							<InputAdornment position="end">
							 	<Home />
							</InputAdornment>
						  ),
						}}		
					  />
					</Grid>
					<Grid item xs={12} md={6}>
						  	<FormControl className={classes.formControl}>
							<InputLabel htmlFor="cntry">Country</InputLabel>
								<Select
									value={value.dtls.cntry}  
									onChange={e=>write && handleChange(uidCollection ,e,settings )}
									inputProps={{
										name: 'cntry'
									}}
									fullWidth
									>
									{CntrMenu}
								</Select>
							</FormControl>
					</Grid>
				</Grid>
    );
    };

export default GstDetails;

