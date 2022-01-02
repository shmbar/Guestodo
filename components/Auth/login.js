import React, { useState, useEffect } from 'react';
import {
	Button,
	TextField,
	Grid,
	Typography,
	FormControl,
	InputLabel,
	Input,
	InputAdornment,
	IconButton,
	Paper,
	Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Login } from '../../functions/functions';
import useFormValidation from './useFormValidation';
import validateLogin from './validateLogin';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import clsx from 'clsx';
import { LogoutFromSystem } from '../../functions/functions.js';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import MMenu from '../LandingPage/Menu/MainMenu';
import Lottie from 'react-lottie';
import FtrsLotie from '../LandingPage/Lotties/Features';
import firebase from 'firebase/app';
import SnackBar from '../Subcomponents/SnackBar';
import Divider from '@material-ui/core/Divider';
//import fetch from 'node-fetch';

const defaultOptions = (x) => {
	return {
		loop: true,
		autoplay: true,
		animationData: x,
		rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
	};
};



const Initial = { email: '', password: '', showPassword: false };

export default function LoginToApp(props) {
	const [loginError, setLoginError] = useState(false);
	const reg = { name: '', email: '' };
	const theme = useTheme();
	let screenXS = useMediaQuery(theme.breakpoints.down('xs'));
	const [snackbar, setSnackbar] = useState({ open: false, msg: '', variant: '' });
	 
	const useStyles = makeStyles((theme) => ({
		'@global': {
			body: {
				backgroundColor: theme.palette.common.white,
			},
		},
		paper: {
			padding: theme.spacing(8),
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			[theme.breakpoints.down('sm')]: {
				padding: theme.spacing(2),
			},
			[theme.breakpoints.down('xs')]: {
				padding: theme.spacing(4),
			},
		},
		form: {
			width: '100%', // Fix IE 11 issue.
			marginTop: theme.spacing(1),
		},
		submit: {
			margin: theme.spacing(3, 0, 2),
			background: '#193e6d',
		},
		withoutLabel: {
			marginTop: theme.spacing(2),
		},
		marginBottom: {
			marginBottom: theme.spacing(1),
		},
		page: {
			width: '100%',
			minHeight: '100vh',
			backgroundColor: '#eee',
		},
		ttl: {
			color: '#193e6d',
			fontSize: '20px',
			fontFamily: 'Poppins, Sans-serif!important',
		},
		welcome: {
			color: '#193e6d',
			fontSize: '30px',
			fontFamily: 'Poppins, Sans-serif!important',
			paddingBottom: '10px',
		},
		NtGstMember: {
			color: '#193e6d',
			fontSize: '15px',
			fontFamily: 'Poppins, Sans-serif!important',
			marginTop: '20px',
		},
		txt1: {
			color: '#007bff',
			fontSize: '15px',
			fontFamily: 'Poppins, Sans-serif!important',
		//	marginTop: '10px',
			'&:hover': {
				cursor: 'pointer',
				color: '#0056b3',
				textDecoration: 'none',
			},
		},
		txt2: {
			color: 'gray',
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

	const classes = useStyles();

	useEffect(() => {
		const logOut = () => {
			sessionStorage.clear();
			LogoutFromSystem();
		};
		if (!sessionStorage.getItem('isLogged')) logOut();
		
	}, []);

	

	const authenticateUser = async () => {
		const { email, password } = values;

		try {
			await Login(email, password);

			if (!firebase.auth().currentUser.emailVerified) {
				setSnackbar({
					open: true,
					msg: 'Your account is not verified. Please check your email',
					variant: 'warning',
				});
			} else {
				sessionStorage.setItem('isLogged', true);
				await props.history.push('/owners');
			}
		} catch (err) {
			console.error('Authentication error', err);
			setLoginError(err.message);
		}
	};

	
	const {
		handleChange,
		handleSubmit,
		values,
		errors,
		isSubmitting,
		handleClickShowPassword,
		handleMouseDownPassword,
	} = useFormValidation(Initial, validateLogin, authenticateUser);

	const resetPass = (props) => {
		if (values.email === '') {
			setSnackbar({ open: true, msg: 'Please fill your email address', variant: 'warning' });
		} else {
			firebase
				.auth()
				.sendPasswordResetEmail(values.email)
				.then(() => {
					setSnackbar({
						open: true,
						msg: 'Password reset email sent',
						variant: 'success',
					});
				})
				.catch((error) => {});
		}
	};

	return (
		<div className={classes.page}>
			<MMenu />

			<SnackBar
				msg={snackbar.msg}
				snackbar={snackbar.open}
				setSnackbar={setSnackbar}
				variant={snackbar.variant}
			/>

			<Container style={{ paddingTop: '14vh' }} maxWidth="md">
				<Paper>
					<Grid container direction="row">
						<Grid item xs={false} sm={6} style={{ alignSelf: 'center' }}>
							{!screenXS && (
								<Lottie
									options={defaultOptions(FtrsLotie)}
									height="100%"
									width="100%"
								/>
							)}
						</Grid>
						<Grid item xs={12} sm={6} className={classes.paper}>
							<Typography component="h1" variant="h4" className={classes.welcome}>
								Welcome
							</Typography>
							<Typography component="h1" variant="h4" className={classes.ttl}>
								Sign In
							</Typography>
							<form className={classes.form} onSubmit={handleSubmit} noValidate>
								<TextField
									value={values.email}
									onChange={handleChange}
									margin="normal"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
								/>
								{errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

								<FormControl
									className={clsx(
										classes.textField,
										classes.withoutLabel,
										classes.marginBottom
									)}
									style={{ width: '100%' }}
								>
									<InputLabel htmlFor="adornment-password">Password</InputLabel>
									<Input
										type={values.showPassword ? 'text' : 'password'}
										value={values.password}
										onChange={handleChange}
										name="password"
										autoComplete="current-password"
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
												>
													{values.showPassword ? (
														<Visibility />
													) : (
														<VisibilityOff />
													)}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
								{errors.password && (
									<p style={{ color: 'red' }}>{errors.password}</p>
								)}
								{loginError && <p style={{ color: 'red' }}>{loginError}</p>}
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									disabled={isSubmitting}
								>
									Sign In
								</Button>
							</form>

							<Typography
								component="h1"
								variant="h4"
								className={classes.txt1}
								gutterBottom
								onClick={() => resetPass(values.name)}
							>
								Forgot Password?
							</Typography>
					
							<Typography component="h1" variant="h4" className={classes.NtGstMember}>
								Not a Guestodo member yet?
							</Typography>

							<Typography component="h1" variant="h4" gutterBottom>
								<Link
									to={{ pathname: '/signup', state: reg }}
									className={classes.txt1}
								>
									Create New Account
								</Link>
							</Typography> 
							<div style={{ display: 'inline-flex' }}>
								<Link to="/terms" className={classes.txt2}>
									Terms of Services{' '}
								</Link>
								<Divider
									orientation="vertical"
									style={{ marginLeft: '10px', marginRight: '10px', height: '70%', marginTop: '8px' }}
								/>
								<Link to="/privacy" className={classes.txt2}>
									Privacy Policy{' '}
								</Link> 
							</div>
						</Grid>
					</Grid>
				</Paper>
					
			</Container>
		</div>
	);
}