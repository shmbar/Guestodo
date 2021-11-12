import React, { useContext, useState } from 'react';
import {
    Grid,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Input,
    Paper,
    Container
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useFormValidation from './useFormValidation';
import validateLogin from './validateLogin';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/app';
import { SettingsContext } from '../../contexts/useSettingsContext';
import { css } from '@emotion/core';
import GridLoader from 'react-spinners/GridLoader'; // //https://www.react-spinners.com/
import { LogoutFromSystem } from '../../functions/functions';
import { useLocation } from 'react-router-dom';
import MMenu from '../LandingPage/Menu/MainMenu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Lottie from 'react-lottie';
import ScndLotie from '../LandingPage/Lotties/ScndLotie';
import SnackBar from '../Subcomponents/SnackBar';
import { Link } from 'react-router-dom';


const defaultOptions = (x) => {
    return {
        loop: true,
        autoplay: true,
        animationData: x,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    };
};

const override = css`
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -75px;
    display: block;
    border-color: red;
`;

export default function LoginToApp(props) {
    const { setLoading, loading } = useContext(SettingsContext);
    const location = useLocation();
	const theme = useTheme();
	let screenXS = useMediaQuery(theme.breakpoints.down('xs'));
	const [snackbar, setSnackbar] = useState({open: false, msg: '',
						 variant: ''});

    const useStyles = makeStyles((theme) => ({
        paper: {
            padding: theme.spacing(8),
            marginBottom: theme.spacing(4),
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
           marginTop: theme.spacing(1),
        },
        page: {
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#eee',
        },
        ttl: {
            color: '#193e6d',
            fontFamily: 'Poppins, Sans-serif',
        },
		termsWarn: {
            color: '#gray',
            fontFamily: 'Poppins, Sans-serif',
			textAlign: 'center',
			paddingTop: '1em'
        },
		txt2: {
			'&:hover': {
				cursor: 'pointer',
				color: '#0056b3',
				textDecoration: 'none',
			},
		},
    }));

    const classes = useStyles();

    let Initial = { name: location.state.name, email: location.state.email, password: '', password1: '' };

    const authenticateUser = async () => {
        const { name, email, password } = values;

        try {
            setLoading(true);
            let addAccount = firebase.functions().httpsCallable('addAccount');
            const uidNum = uuidv4();
            const tmpStirng = 'http://a.a.a/yayy--';
            const obj = {
                email: email,
                password: password,
                displayName: name,
                photoURL: tmpStirng.concat('_').concat(uidNum),
            };

            addAccount(obj).then(async (result) => {
                setLoading(false);

                if (result.data) {
					setSnackbar({open: true, msg: 'Email address already exists, try another one', variant: 'error'});
                } else {
                    firebase.auth().signInWithEmailAndPassword(email, password)
                        .then(async (userCredential) => {
                            await userCredential.user.sendEmailVerification();
							setSnackbar({open: true, msg: 'Please check your email for account verification', variant: 'warning'});
                        })
                        .then(async () => {
                            await LogoutFromSystem(email, password);
                        });
                }
            });
        } catch (err) {
            console.error('Authentication error', err);
        }  
    }; 

    const { handleChange, handleSubmit, values, errors, isSubmitting } = useFormValidation(
        Initial,
        validateLogin,
        authenticateUser
    );

	
	
    return (
        <div className={classes.page}>
            <MMenu />
            <div>
                <GridLoader
                    css={override}
                    sizeUnit={'px'}
                    size={50}
                    color={'#012c61'}
                    loading={loading}
                />
            </div>

			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
			
            <Container style={{ paddingTop: '14vh' }} maxWidth='md'>
                <Paper>
                    <Grid container direction='row'>
                        <Grid item xs={false} sm={6} style={{ alignSelf: 'center' }}>
                            {!screenXS && (
                                <Lottie
                                    options={defaultOptions(ScndLotie)}
                                    height='100%'
                                    width='100%'
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.paper}>
                                <Typography variant="h5" className={classes.ttl} noWrap>
                                    Create New Account
                                </Typography>
                                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                                    <TextField
                                        value={values.name}
                                        onChange={handleChange}
                                        margin="normal"
                                        fullWidth
                                        label="Company Name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
										
                                    />
                                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

                                    <TextField
                                        value={values.email}
                                        onChange={handleChange}
                                        //margin="normal"
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                    />
                                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

                                    <FormControl
                                        className={clsx(
                                            classes.withoutLabel,
                                            classes.marginBottom
                                        )}
                                        style={{ width: '100%' }}
                                    >
                                        <InputLabel htmlFor="adornment-password">
                                            Password
                                        </InputLabel>
                                        <Input
                                            value={values.password}
											type='password'
                                            onChange={handleChange}
                                            name="password"
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    {errors.password && (
                                        <p style={{ color: 'red' }}>{errors.password}</p>
                                    )}
									     <FormControl
                                        className={clsx(
                                            classes.textField,
                                            classes.withoutLabel,
                                            classes.marginBottom
                                        )}
                                        style={{ width: '100%' }}
                                    >
                                        <InputLabel htmlFor="adornment-password">
                                            Password Confirmation
                                        </InputLabel>
                                        <Input
                                            value={values.password1}
                                            onChange={handleChange}
											type='password'
                                            name="password1"
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
									 {errors.password1 && (
                                        <p style={{ color: 'red' }}>{errors.password1}</p>
                                    )}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        disabled={isSubmitting}
                                    >
                                        Sign Up
                                    </Button>
                                </form>
                             	<Typography variant="caption" display="block" gutterBottom className={classes.termsWarn}>
                                    By continuing, you are indicating that you accept our <Link to="/terms" className={classes.txt2}>Terms of Service</Link> and <Link to="/privacy" 
									className={classes.txt2}>Privacy Policy.</Link>
                                </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}