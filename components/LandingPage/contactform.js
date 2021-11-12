import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import contactPic  from './Pics/contactPic.svg';
import {addMsg} from '../../functions/functions';
import { v4 as uuidv4 } from 'uuid';

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
	subColor: {
		color: '#999999'
	},
	padding: {
		padding: theme.spacing(4),
	},
	cntctUs:{
		color: '#193e6d',
		fontSize: '28px',
		fontWeight: 600,
		fontFamily: '"Poppins", Sans-serif'
	},
	btn:{
		background: '#193E6D',
		borderRadius: '20px',
		width: '100%'
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
}
	
}));

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
    errors.fName = "Name required";
  }

  if (!values.sbjct) {
    errors.sbjct = "Subject required";
  }
	
   if (!values.msg) {
    errors.msg = "Message required";
  } else if (values.msg.length < 6) {
    errors.msg = "Message is too short";
  }
	
  return errors;
}


const CustomizedInputs = (props) => {
	const classes = useStyles();
	const [value, setValue] = useState({fName:'', email: '', sbjct: '', msg: ''})
	const [submitting, setSubmitting] = useState(false);
	
	const sendMsg=(e)=>{
		e.preventDefault();
		
		if(Object.keys(	validateContact(value)	).length !== 0){
			setSubmitting(true)
			return;
		} 
		
	//	addMsg(uuid(), tmpData);
		setValue({fName:'', email: '', sbjct : '', msg : ''})
		async function Send() {
			let Id = uuidv4();
			props.setSnackbar({open: (await addMsg(Id, {...value, 'time': new Date(), 'id': Id})), msg: 'Your message was successfully sent', variant: 'success'}) ;
		}
		Send();
		setSubmitting(false)
	}
	
	return (
			<div>
				<form className={classes.root} noValidate>
					
					<Grid container direction="row" spacing={6} justifyContent="space-around" >
						<Grid item xs={12} md={7} className={classes.padding}>
							<div className={classes.cntctUs}>Contact Us</div>
							<Grid container direction="row" justifyContent="flex-start" spacing={5} style={{ paddingTop: '16px' }}>
								<Grid item xs={12} md={6}  >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.fName} onChange={(e) => setValue({...value, 'fName': e.target.value})} />
										<label htmlFor="in" className={classes.lbl}>Full Name</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).fName}</p>}
								</Grid>
								<Grid item xs={12} md={6} >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.email} onChange={(e) => setValue({...value, 'email': e.target.value})} />
										<label htmlFor="in" className={classes.lbl}>Email</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).email}</p>}
								</Grid>
							</Grid>
							<Grid container direction="row" justifyContent="flex-start" style={{ paddingTop: '36px' }} >
								<Grid item xs={12} >
									<span className="p-float-label">
										<InputText id="in" className={classes.customInpt} value={value.sbjct} onChange={(e) => setValue({...value, 'sbjct': e.target.value})}  />
										<label htmlFor="in" className={classes.lbl}>Subject</label>
									</span>
									{submitting && <p style={{color:'red'}}>{validateContact(value).sbjct}</p>}
								</Grid>
							</Grid>
							<Grid container direction="row" justifyContent="flex-start" style={{ paddingTop: '36px' }} >
								<Grid item xs={12}  >
									<div >
										<InputTextarea rows={5} cols={30} autoResize={true} placeholder="Insert Your Message" className={classes.customInpt} 
											value={value.msg} onChange={(e) => setValue({...value, 'msg': e.target.value})} ></InputTextarea>
									</div>
									<div style={{width: '150px', float: 'right', paddingTop: '15px' }}>
										<Button label="Send"  className={classes.btn} onClick={(e)=>sendMsg(e)}/>
									</div>
									{submitting && <p style={{color:'red'}}>{validateContact(value).msg}</p>}

								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={12} md={5} /* className={classes.padding} */ style={{alignSelf: 'center'}}>
							
							<img src={contactPic} alt='' width='100%' />
							
						</Grid>


					</Grid>

				</form>
				
			</div>
	);
}

export default CustomizedInputs;
