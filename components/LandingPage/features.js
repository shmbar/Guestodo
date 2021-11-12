import React from 'react';
import MMenu from './Menu/MainMenu';
import Footer from './Footer/footer';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button  } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import Typography from '@material-ui/core/Typography';

import ScndLotie from './Lotties/ScndLotie';
import dashboardPic from './Pics/dashboardPic.svg';
import CalendarPic from './Pics/CalendarPic.svg';
import ExpPic from './Pics/ExpPic.svg';
import vatPic from './Pics/vatPic.svg';
import revPic from './Pics/revPic.svg';
import mngFeePic from './Pics/mngFeePic.svg';
import profPic from './Pics/profPic.svg';
import Icon from '@material-ui/core/Icon';


import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        background: 'white',
        flexGrow: 1,
    },
    banner: {
        //backgroundImage:  `url(${bnr})`, //'url(https://source.unsplash.com/random)', //  ,
        backgroundSize: 'cover',
        display: 'block',
        marginTop: '82px',
     //   minHeight: '35em',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f2f6fa', //'#193E6D'
        [theme.breakpoints.down('md')]: {
            marginTop: '70px',
        },
    },
    padding: {
        padding: theme.spacing(4),
    },
    container: {
        marginTop: '4em',
    },
    containerBlue: {
      //  paddingTop: '5em',
		padding: '14em 0',
        [theme.breakpoints.down('sm')]: {
            padding: '4em 0'
        },
    },
    grnLine: {
        width: 100,
        height: 15,
        backgroundColor: '#5ec198',
		  [theme.breakpoints.down('sm')]: {
            margin: 'auto'
        },
    },
    containerBlueUpperText: {
        color: '#193e6d',
        fontFamily: '"Poppins", Sans-serif',
        fontSize: '2.5em',
        fontWeight: 600,
        lineHeight: '55px',
        letterSpacing: '0.2px',
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
        [theme.breakpoints.down('md')]: {
            lineHeight: '45px',
            fontSize: '25px',
        },
    },
    containerBlueBottomText: {
        color: '#193e6d',
        fontSize: '17px',
        fontWeight: 400,
        lineHeight: '32px',
        letterSpacing: '0.5px',
        fontFamily: '"Poppins", Sans-serif',
        textAlign: 'left',
        padding: '30px 50px 0px 0px',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
            padding: '30px 0',
        },
    },
	ttlFeatures: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '2.5em',
		fontWeight: 800,
		lineHeight: '0.4em',
		paddingTop: '15px',
		color: '#193e6d',
		marginBottom: '30px',
		textAlign: 'left',
		[theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        },
	},
	txtFeatures :{
		fontSize: '1.3em',
		fontWeight: 500,
		lineHeight: '32px',
		paddingTop: '40px',
		fontFamily: '"Poppins", Sans-serif',
		color: '#193e6d',
		textAlign: 'left',
		[theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        },
	},
	button: {
		width: '100%',
		height: '45px',
		textTransform: 'none',
		fontSize: '16px',
		fontFamily: '"Poppins", Sans-serif',
		background: '#5ec198',
		color: 'white'
  	},
	tailorMade: {
		background: '#193e6d',
		padding: '70px 0'
	},
	divWhite: {
    	backgroundColor: '#ffffff',
	},
	divGray: {
   	 backgroundColor: '#f2f6fa'
	},
	tailorMadeDiv: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: '50px',
		letterSpacing: '0.5px',
		fontFamily: '"Poppins", Sans-serif',
		[theme.breakpoints.down('sm')]: {
           	fontSize: '20px',
			paddingBottom: '25px'
        },
	},
	Div1:{
		fontSize: '50px',
		paddingBottom: '20px',
		[theme.breakpoints.down('sm')]: {
           	fontSize: '40px',
        },
	},
	ftr:{
		'&:hover':{
			textDecoration: 'none'
		}		
	},	
    cstmText :{
		fontSize: '1.4em',
		fontWeight: 500,
		lineHeight: '32px',
		paddingTop: '40px',
		fontFamily: '"Poppins", Sans-serif',
		textAlign: 'center',
		color: 'white'
	},


	
}));

const Features = () => {
    const classes = useStyles();
    const theme = useTheme();

    const reg = { name: '', email: '' };
    let smScreen = useMediaQuery(theme.breakpoints.down('sm'));
    let sreenSM = useMediaQuery(theme.breakpoints.down('sm'));
	
    const containeBlueTextUp = (
        <>
			<Typography	variant="h3" gutterBottom	style={{ fontFamily: '"Poppins", Sans-serif', paddingBottom: '25px' }}>
				Has property management become a messy challenge for you?
			</Typography>
			<Typography	variant="h4" gutterBottom	style={{ fontFamily: '"Poppins", Sans-serif', paddingBottom: '20px' }}>
				<span style={{fontSize: '2.6rem', fontWeight: 600}}>GuesTodo</span> provides the best solutions for your needs.
			</Typography>
			 <Typography	variant="h5" gutterBottom	style={{ fontFamily: '"Poppins", Sans-serif' }}>
				Manage your property business at your fingertips.
			</Typography>
        </>
    );
	
    const containeBlueTextDown = (
        <>
			<Typography	variant="h5" gutterBottom	style={{ fontFamily: '"Poppins", Sans-serif', padding: '0px ​45px 15px 45px' }}>
				Whether you are a single property landlord or a property management company,
				<span style={{fontWeight: 600}}> GuesTodo </span> integrates smart bookkeeping, audits and inventories so that remote management of your income and revenue is possible.
			</Typography>
			<Typography	variant="h5" gutterBottom	style={{ fontFamily: '"Poppins", Sans-serif' , paddingBottom: '25px'}}>
				The app tabulates and organizes data for your convenience. 
			</Typography>
		 	<div style={smScreen ? {} : { padding: '0 150px' }} >
				<Link to={{ pathname: '/signup', state: reg }} className={classes.ftr} >
					<Button  variant="contained"  className={classes.button}  endIcon={<Icon>send</Icon>}>Start My Free Trial</Button>			 
				</Link>
			</div>
        </>
    );

    let textContent = [
        {
            ttl: 'Calendar',
            img: CalendarPic,
            width: sreenSM ? '50%' : '70%',
            txt: (
                <>
                    <b>Want to manage your cash flow?</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo Calendar</b> monitors your property occupancy rates and tracks down
                    payments made on the web in real time. The app verifies and reviews payments
                    that were uploaded into the system.
                </>
            ),
        },

        {
            ttl: 'Management Fee',
            img: mngFeePic,
            width: sreenSM ? '50%' : '80%',
            txt: (
                <>
                    <b>Want to have a peace of mind?</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo app </b>automatically computes and posts management fees to the
                    company income table once a reservation is made. The app tracks every
                    transaction made whether it's paid or not. The app screens, sorts and records
                    all transactions made to ensure transparency and safety.
                </>
            ),
        },

        {
            ttl: 'Expenses',
            img: ExpPic,
            width: sreenSM ? '40%' : '55%',
            txt: (
                <>
                    <b>Want to make data-driven business judgements?</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo app</b> equips you with relevant business data. The app
                    specifically records overhead expenses including cash-outflow according to each
                    category such as maintenance, utilities, fees, supplies and other miscellaneous
                    expenses.
                </>
            ),
        },
        {
            ttl: 'VAT',
            img: vatPic,
            width: sreenSM ? '60%' : '80%',
            txt: (
                <>
                    <b>Want to automate your VAT calculation at your fingertips?</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo app</b> formulates your VAT computation requirements at an instant.
                    The app calculates your VAT payments on a monthly basis. It also determines
                    whether reservations and purchases made are VAT inclusive. The app records all
                    VAT data payments made and other relevant VAT information on each specific
                    property.
                </>
            ),
        },

        {
            ttl: 'Revenue',
            img: revPic,
            width:sreenSM ? '50%' : '70%',
            txt: (
                <>
                    <b>Want to stay informed at all times?</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo app</b> maximizes your data revenue collection. The app discloses
                    reservations that are VAT inclusive. <b>GuesTodo app</b> enables you to add
                    additional services offered in your business such as expenditures,
                    transportation, entertainment tickets and other adventure perks.{' '}
                </>
            ),
        },

        {
            ttl: 'Dashboard',
            img: dashboardPic,
            width: sreenSM ? '50%' : '80%',
            txt: (
                <>
                    <b>Want to avoid surprises?</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo app</b> automatically displays your financial summary. The financial
                    spreadsheet unveils the occupancy chart, analytics and statistics on a monthly
                    and annual basis. Comprehensive data is accessible to make a comparative
                    analysis of your present performance against historical figures.{' '}
                </>
            ),
        },

        {
            ttl: 'Profitability',
            img: profPic,
            width: sreenSM ? '40%' : '60%',
            txt: (
                <>
                    <b>Huge savings and value!</b>
                    <br></br>
                    <p></p>
                    <b>GuesTodo app</b> gets you focused on your set goals and targets. The app
                    increases your productivity performance and saves you time, money and effort.
                </>
            ),
        },
    ];

    const defaultOptions = (x) => {
        return {
            loop: true,
            autoplay: true,
            animationData: x,
            rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
        };
    };

    let LeftToRight = (x) => (
        <>
            <Grid container item xs={12} md={6}  direction="column" justifyContent="center"  style={sreenSM ? { paddingBottom: '30px' } : {}}   >
				<Grid item  className={classes.ttlFeatures}>
					{x.ttl}
				</Grid>
				<Grid item  className={classes.grnLine}>
				</Grid>
				<Grid item  className={classes.txtFeatures}>
					{x.txt}
				</Grid>
            </Grid>
            <Grid item xs={12} md={6}  style={sreenSM ? {textAlign: 'center'}: {textAlign: 'end', alignSelf: 'center'}}>
               <img src={x.img} alt="Mypicture" width={x.width}  />
            </Grid>
        </>
    );

    let RightToLeft = (x) => (
        <>
            <Grid item xs={12}  md={6} style={sreenSM ? {textAlign: 'center'}: {textAlign: 'start', alignSelf: 'center'}}>
               <img src={x.img} alt="Mypicture" width={x.width} />
            </Grid>
            <Grid container item xs={12} md={6} direction="column" justifyContent="center" style={sreenSM ? { paddingBottom: '30px' } : {}} >
                <Grid item  className={classes.ttlFeatures}>
					{x.ttl}
				</Grid>
				<Grid item  className={classes.grnLine}>
				</Grid>
                <Grid item  className={classes.txtFeatures}>
					{x.txt}
				</Grid>   
            </Grid>
        </>
    );

    let contentFeatures = textContent.map((x, i) => {
        return (
            <div key={i} className={i % 2 ? classes.divWhite : classes.divGray}>
                <Container maxWidth="lg">
                    <Grid  container direction='row'
                        style={  sreenSM
                                ? { width: '100%', padding: '50px 0' }
                                : { width: '100%', padding: '90px 0' }
                        }
                    >
                        {i % 2 === 0 ? LeftToRight(x) : RightToLeft(x)} 
                    </Grid>
                </Container>
            </div>
        );
    });

    let contentFeaturesMin = textContent.map((x, i) => {
        return (
            <div key={i} className={i % 2 ? classes.divWhite : classes.divGray}>
                <Container maxWidth="lg">
                    <Grid
                        container
                        /* spacing={8} */ style={
                            sreenSM
                                ? { width: '100%', padding: '50px 0' }
                                : { width: '100%', padding: '90px 0' }
                        }
                    >
                        {LeftToRight(x)}
                    </Grid>
                </Container>
            </div>
        );
    });

    return (
        <div /*p={props.smScreen ?1:7} */>
            <MMenu />
            <div className={classes.banner}>
                <Container maxWidth="lg">
                    <Grid
                        container
                        /*spacing={smScreen ? 0:6}*/ className={classes.containerBlue}
                        direction="row"
                    >
                        <Grid item xs={12} md={7} className={classes.containerBlueUpperText} style={{ alignSelf: 'center' }}>
                                    {containeBlueTextUp}
                        </Grid>
                        <Grid item xs={12} md={5} style={{ alignSelf: 'center' }}>
                            <Lottie
                                options={defaultOptions(ScndLotie)}
                                height={sreenSM ? '60%' : '100%'}
                                width={sreenSM ? '60%' : '100%'}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </div>
	
			<div style={{backgroundColor: '#193e6d'}}>
				<Container maxWidth='lg' >
					<Grid container direction="column" alignItems="center"  style={sreenSM ? {padding: '40px 0'} : {padding: '70px 0'}} className={classes.cstmText}>
							 {containeBlueTextDown}
					</Grid>
				</Container>
			</div>
			
               {sreenSM ? contentFeaturesMin: contentFeatures  } 

            <div className={classes.tailorMade} style={{ padding: '50px 0', fontWeight: '600' }}>
                <Container maxWidth="sm" className={classes.tailorMadeDiv} > 
                    <div style={smScreen ? {paddingBottom: '20px'}: {}}>IT’S MONEY TIME!</div>
                    <div style={smScreen ? {} : { padding: '0 150px' }} >
                        <Link to={{ pathname: '/signup', state: reg }} className={classes.ftr} >
							<Button  variant="contained"  className={classes.button}  endIcon={<Icon>send</Icon>}>Start My Free Trial</Button>			 
						</Link>
                    </div>
                    <div style={{ paddingTop: '30px' }}>
                        <p style={{ fontSize: '20px' }}>
                            And take advantage of GuesTodo’s extraordinary financial component.
                        </p>
                    </div>
                </Container>
            </div>

            <Footer />
        </div>
    );
};

export default Features;