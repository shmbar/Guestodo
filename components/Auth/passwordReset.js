import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, Typography, Paper, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../LandingPage/Menu/Logo.svg';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useHistory } from "react-router-dom";
import SnackBar from '../Subcomponents/SnackBar';

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3),
        fontFamily: 'Poppins, Sans-serif!important',
        marginTop: theme.spacing(2),
    },
    fnt: {
        fontFamily: 'Poppins',
    },
    logo: {
        paddingBottom: 14,
        width: 120,
        [theme.breakpoints.down('md')]: {
            width: 120,
            paddingBottom: 12,
        },
    },
    btn: {
        paddingTop: theme.spacing(2),
    },
}));



const PasswordReset = (props) => {
    const [txt, setTxt] = useState('');
    const [txt1, setTxt1] = useState('');
    const [reseted, setReseted] = useState(false);
    const classes = useStyles();
	let history = useHistory();
	const [snackbar, setSnackbar] = useState(false);
	const [eml,setEml] = useState('');
	const [op,setOp] = useState('')
	
	
	useEffect(()=>{
		
		const handleVerifyEmail = (auth, actionCode, continueUrl, lang) =>{
			  auth.applyActionCode(actionCode).then((resp) => {
			  }).catch((error) => {
				console.log(error)
			  });
		}
		
		firebase.auth().verifyPasswordResetCode(getParameterByName('oobCode'))
                .then((email) => {
                   setEml(email)
		});
		
	  switch (	getParameterByName('mode')	) {
		case 'resetPassword':
		  // Display reset password handler and UI.
		  setOp('resetPassword')
		  break;
		case 'verifyEmail':
		  // Display email verification handler and UI.
		  handleVerifyEmail(firebase.auth(),getParameterByName('oobCode'),'http://www.guestodo.com', 'en' );
		  setOp('verifyEmail')
		  break;
		default:
      	// Error: invalid mode.
  	}
		
	},[])
	
	
    const save = () => {
		
		if ( !/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(txt)) {
            setSnackbar({ open: true, msg: 'Password must be at least 8 characters including one digit and one capital letter',  variant: 'warning' });
            return;
        }
		
        if (txt !== txt1) {
            setSnackbar({ open: true, msg: 'Passwords are not the same', variant: 'warning' });
            return;
        }

        const handleResetPassword = async (auth, actionCode, continueUrl, lang) => {
            await auth
                .verifyPasswordResetCode(actionCode)
                .then(async (email) => {
                    const newPassword = txt;

                    await auth
                        .confirmPasswordReset(actionCode, newPassword)
                        .then((resp) => {
                            setReseted(true);

                            // Password reset has been confirmed and new password updated.
                            // TODO: Display a link back to the app, or sign-in the user directly
                            // if the page belongs to the same domain as the app:
                            // auth.signInWithEmailAndPassword(accountEmail, newPassword);
                            // TODO: If a continue URL is available, display a button which on
                            // click redirects the user back to the app via continueUrl with
                            // additional state determined from that URL's parameters.
                        })
                        .catch((error) => {
                            // Error occurred during confirmation. The code might have expired or the
                            // password is too weak.
                        });
                })
                .catch((error) => {
                    // Invalid or expired action code. Ask user to try to reset the password
                    // again.
                });
        };

       
        handleResetPassword(firebase.auth(),getParameterByName('oobCode'),'http://www.guestodo.com', 'en' );
    };

	
	const goBack=()=>{
		history.push('/login')
	}
	
	
	const resetPassUI =  <Paper className={classes.paper}>
							<Grid container direction="column">
								<Grid item>
									<img src={Logo} alt="Guestodo" className={classes.logo} />
								</Grid>
								<Grid item>
									<Typography
										variant="h6"
										paragraph
										className={classes.fnt}
										style={{ fontWeight: 600 }}
									>
										{!reseted ? 'Reset your password' : 'Password changed'}
									</Typography>
								</Grid>
								<Grid item>
									<Typography
										variant="subtitle1"
										className={classes.fnt}
										paragraph
										style={{ paddingTop: 10 }}
									>
										{!reseted
											? `for ${eml}`
											: 'You can now sign in with your new password'}
									</Typography>
								</Grid>
								{!reseted && (
									<Grid item>
										<TextField
											value={txt}
											onChange={(e) => setTxt(e.target.value)}
											//fullWidth
											type="password"
											label="New Password"
											helperText="8 characters, including one digit and one capital letter."
										/>
									</Grid>
								)}
								{!reseted && (
									<Grid item>
										<TextField
											value={txt1}
											onChange={(e) => setTxt1(e.target.value)}
											//fullWidth
											type="password"
											label="Password Confirmation"
											helperText="8 characters, including one digit and one capital letter."
										/>
									</Grid>
								)}
								<Grid item className={classes.btn}>
									 {!reseted ? 
										<Button variant="contained" color="primary" onClick={save}>
											Save
										</Button>
										:
										<Button variant="contained" color="primary" onClick={goBack}>
											Back to Guestodo
										</Button>
									 }
								</Grid>
							</Grid>
           			</Paper>
	
		  
	const emailVerifyUI =  <Paper className={classes.paper}>
							<Grid container direction="column">
								<Grid item>
									<img src={Logo} alt="Guestodo" className={classes.logo} />
								</Grid>
								<Grid item>
									<Typography
										variant="h6"
										paragraph
										className={classes.fnt}
										style={{ fontWeight: 600 }}
									>
										Your email has been verified
									</Typography>
								</Grid>
								<Grid item>
									<Typography
										variant="subtitle1"
										className={classes.fnt}
										paragraph
										style={{ paddingTop: 10 }}
									>
										You can now sign in with your new account
									</Typography>
								</Grid>
								
							
								<Grid item className={classes.btn}>
										<Button variant="contained" color="primary" onClick={goBack}>
											Back to Guestodo
										</Button>
								</Grid>
							</Grid>
           			</Paper>
	
    return (
        <Container maxWidth="xs">
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
							variant={snackbar.variant} />
				{op==='resetPassword' ? resetPassUI : emailVerifyUI }
           
        </Container>
    );
};

export default PasswordReset;

/*

Password changed
You can now sign in with your new password


*/