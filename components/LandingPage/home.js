import React, { useState, useEffect } from 'react';
import { Grid, Container } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import MMenu from './Menu/MainMenu';
import CheckedIcon from './checked.png';
import Footer from './Footer/footer';
import Button from '@material-ui/core/Button';
import quote from './Pics/quote.svg';
import idanPic from './Pics/idanPic.jpg';
import nirPic from './Pics/nirPic.jpg';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import Faqs from './faqs';
import Lottie from 'react-lottie';

import frstPage1 from './Pics/frstPage1.svg';
import BenefitsPic from './Pics/BenefitsPic.svg';
import ServicesPic from './Pics/ServicesPic.svg';

import FtrsLotie from './Lotties/Features';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import firebase from 'firebase/app';

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
		marginTop: '83px',
		//  minHeight: '46em',
		backgroundAttachment: 'fixed',
		backgroundRepeat: 'no-repeat',
		backgroundColor: '#193E6D', //'#193E6D'
		[theme.breakpoints.down('md')]: {
			marginTop: '70px',
		},
	},
	containerBlue: {
		//	paddingTop: '6em'
		padding: '160px 0',
		[theme.breakpoints.down('sm')]: {
			//       paddingTop: '4em',
			padding: '30px 0',
		},
	},
	large: {
		width: theme.spacing(10),
		height: theme.spacing(10),
		margin: '0 10px',
	},
	containerBlueUpperTextFirstPage: {
		color: '#ffffff',
		fontSize: '50px',
		fontWeight: '600',
		lineHeight: '76px',
		letterSpacing: '0.5px',
		fontFamily: '"Poppins", Sans-serif',
		textAlign: 'left',
		[theme.breakpoints.down('md')]: {
			fontSize: '40px',
			lineHeight: '55px',
			textAlign: 'center',
			width: '100%',
		},
	},
	containerBlueTextFirstPage1: {
		color: 'rgba(255, 255, 255, 0.85)',
		fontWeight: 400,
		lineHeight: '32px',
		letterSpacing: '0.5px',
		fontFamily: '"Poppins", Sans-serif',
		padding: '30px 0px 0px 0px',
		fontSize: '20px',
		textAlign: 'left',
		[theme.breakpoints.down('md')]: {
			padding: '30px 0 0 0',
			textAlign: 'center',
			width: '100%',
		},
	},
	containerBlueBottomTextFirstPage: {
		fontWeight: 600,
		lineHeight: '32px',
		letterSpacing: '0.5px',
		fontFamily: '"Poppins", Sans-serif',
		padding: '35px 0',
		fontSize: '21px',
		color: '#5ec198',
		textAlign: 'left',
		[theme.breakpoints.down('md')]: {
			padding: '30px 0 0 0',
			textAlign: 'center',
			width: '100%',
		},
	},
	ttlbeforeText: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '3.2em',
		fontWeight: 800,
		lineHeight: '0.4em',
		color: '#193e6d',
		textAlign: 'center',
		[theme.breakpoints.down('sm')]: {
			lineHeight: '1.2em',
		},
	},
	greenLine: {
		textAlign: 'center',
		marginTop: '50px',
		background: 'rgb(94, 193, 152)',
		height: '4px',
		width: '60px',
	},
	textAfterGreenLine: {
		textAlign: 'center',
		paddingTop: '40px',
		fontSize: '1.2em',
		color: '#193e6d',
		fontFamily: '"Poppins", Sans-serif',
		lineHeight: '2.4em',
	},
	divGray: {
		backgroundColor: '#f2f6fa',
	},
	srvicesTtl: {
		color: '#193e6d',
		fontFamily: '"Poppins", Sans-serif',
		fontWeight: 600,
		fontSize: '1.2em',
	},
	srvicesTxt: {
		color: '#193e6d',
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '1.1em',
	},
	tailorMade: {
		background: '#193e6d',
		padding: '70px 0',
	},
	tailorMadeDiv: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: '28px',
		letterSpacing: '0.5px',
		fontFamily: '"Poppins", Sans-serif',
		[theme.breakpoints.down('sm')]: {
			fontSize: '20px',
		},
	},
	btn: {
		marginTop: '30px',
		padding: '7px 21px',
		border: '1px solid #ffff',
		color: '#ffffff',
		fontSize: '15px',
	},
	btnRegister: {
		width: '100%',
		height: '45px',
		borderWidth: '0px 0px 0px 0px',
		borderRadius: '2px 2px 2px 2px',
		display: 'block',
		background: '#5ec198',
		color: 'white',
		fontSize: '16px',
		alignItems: 'center',
		textAlign: 'center',
	},
	inpt: {
		borderWidth: '0px 0px 0px 0px',
		borderRadius: '2px 2px 2px 2px',
		height: '45px',
		fontSize: '16px',
		padding: '5px 14px',
		width: '100%',
		fontFamily: '"Poppins", Sans-serif!important',
		'&::placeholder': {
			fontFamily: '"Poppins", Sans-serif',
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

const LandingPage = () => {
	const classes = useStyles();
	const theme = useTheme();
	let sreenSM = useMediaQuery(theme.breakpoints.down('sm'));
	let sreenMD = useMediaQuery(theme.breakpoints.down('md'));
	const [reg, setReg] = useState({ name: '', email: '' });

	useEffect(() => {
		firebase.analytics().logEvent('select_content', {
			content_type: 'image',
			content_id: 'P12453',
			items: [{ name: 'Kittens' }],
		});
	}, []);

	const containerBlueTextUp = 'Property Management Finance Solution';
	const containerBlueTextMid = (
		<>
			An Innovative Financial Management Software for vacation rental properties. GuesTodo is
			an intuitive financial application designed to aid short term rental property managers
			and owners on how to better manage their business.
		</>
	);
	const containerBlueTextMid2 = ''; //'Get rid of your complex Excel spreadsheets! Streamline your property management operations and reduce your overhead expenditures!'
	const containerBlueTextBottom = (
		<>
			Take advantage of our <span style={{ textDecoration: 'underline' }}> free</span> trial.
			No credit card required!
		</>
	);
	const whatWeDoText = (
		<>
			GuesTodo simplifies vacation rental property management through its unique customized
			real time data transparency ability. It provides easy access to organized financial
			figures in real-time. No more pulling numbers from a dozen different places. GuesTodo
			maximizes your income potential and helps you achieve your financial targets!
		</>
	);

	const servicesText = (
		<>
			If you wish to spend less time on performing routine tasks and get focused on growing
			your business, our{' '}
			<span style={{ fontWeight: 'bold' }}>Financial Property Manager application</span> is
			here to achieve that goal. Here are some of the advantages of using GuesTodo.
		</>
	);

	const gtdWasDesigned = (
		<>
			<b>GuesTodo Property Management application </b>was conceptualized by a team of
			financial experts who specialized in real estate investments. They identified the need
			for a <b>SMART</b> financial management software that would provide efficient but simple
			technology in managing vacation rental properties. Tracking reservations, monitoring
			occupancy rates, supervising maintenance costs, updating overhead expenditures against
			budget could be complicated and overwhelming. GuesTodo was conceived for these reasons.
			The app offers a quick fix solution for the property management challenges.
		</>
	);

	const firstRecomnd =
		'I’ve been working all these years with my excel templates to estimate my monthly fees until I found GuesTodo. Using Guestodo application has helped me get focused on my business, expand my portfolio and increase the revenue of my business.';

	const tlrMade1 = 'A custom made app for poperty management individualized needs.';
	const tlrMade2 = (
		<>Get focused and grow your business. Don't waste your time on menial tasks.</>
	);

	const scndRecomnd =
		'Since I’ve started using GuesTodo , I’ve become more productive and efficient. The app has allowed me to provide the financial data which the property owners required from me. GuesTodo provided an environment rich with relevant information available at an instant.';

	const srvcs = [
		{
			ttl: 'Financial Data',
			txt:
				'GuesTodo provides a comprehensive summary and detailed financial reports in real-time so you have accurate data to make clear and sound decisions for your business.',
		},
		{
			ttl: 'Automatic Calculations',
			txt:
				'GuesTodo automatically computes management and channel commissions, calculates VAT requirements, tracks and monitors transactions automatically so your numbers are always up to date. Our tracking capabilities mean complete transparency for property managers.',
		},
		{
			ttl: 'Tracking Reservations and Payments',
			txt:
				'GuesTodo records and monitors every business transaction made including fees, payments, and deposits. Never miss out on an important transaction again!',
		},
		{
			ttl: 'Reports',
			txt:
				'Stay on top of everything that’s going on in your property management business with easy-to-read and regular reports. GuesTodo provides simple yet comprehensive business information.',
		},
		{
			ttl: 'Property Management',
			txt:
				'GuesTodo consolidates business information and transactions of all your properties while simultaneously monitors each property’s individual performance.',
		},
	];

	const bnfts = [
		{
			ttl: 'Flexibility ',
			txt:
				'GuesTodo is a highly customizable financial app created to respond to your individual business needs.',
		},
		{
			ttl: 'User-friendly',
			txt:
				'GuesTodo is an easy to use software with the “ON THE GO” property set up definition for simple and swift data entry encoding.',
		},
		{
			ttl: 'Automation ',
			txt:
				'GuesTodo gets rid of lengthy spreadsheets and complicated manual computations. The app transitions you to an accurate and efficient accounting software.',
		},
		{
			ttl: 'Easy Access',
			txt:
				'GuesTodo gives you peace of mind knowing that your data is stored in the cloud. The app can be accessed anytime and anywhere through your mobile devices.',
		},
		{
			ttl: 'Transparency ',
			txt:
				'GuesTodo provides your landlords full control of their properties by giving them a comprehensive overview of all relevant financial data.',
		},
		{
			ttl: 'Guidance',
			txt:
				'GuesTodo provides simple instructions during operation. The App aids you with didactic prompts to facilitate easy navigation through your financial data with confidence.',
		},
	];

	const GetAvatar = ({ name, company, pic }) => {
		return (
			<ListItem>
				<ListItemAvatar>
					<Avatar className={classes.large} src={pic} />
				</ListItemAvatar>
				<ListItemText primary={name} secondary={company} />
			</ListItem>
		);
	};

	const containerBlueUpperTextFirstPage1 = (
		<Grid item className={classes.containerBlueUpperTextFirstPage}>
			{containerBlueTextUp}
		</Grid>
	);
	const containerBlueTextMid1 = (
		<Grid item className={classes.containerBlueTextFirstPage1}>
			{containerBlueTextMid}
		</Grid>
	);
	const containerBlueTextFirstPage1 = (
		<Grid item className={classes.containerBlueTextFirstPage1}>
			{' '}
			{containerBlueTextMid2}{' '}
		</Grid>
	);
	const containerBlueBottomTextFirstPage1 = (
		<Grid item className={classes.containerBlueBottomTextFirstPage}>
			{containerBlueTextBottom}
		</Grid>
	);
	return (
		<div style={{ background: 'white' }}>
			<MMenu />

			<div className={classes.banner}>
				<Container maxWidth="lg">
					{sreenMD && !sreenSM ? (
						<Grid container direction="column" className={classes.containerBlue}>
							{containerBlueUpperTextFirstPage1}
							{containerBlueTextMid1}
							<Grid container direction="row" style={{ paddingTop: '20px' }}>
								<Grid item xs={12} md={6}>
									<Grid container direction="column">
										{containerBlueTextFirstPage1}
										{containerBlueBottomTextFirstPage1}
									</Grid>
								</Grid>
								<Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
									<Lottie
										options={defaultOptions(FtrsLotie)}
										height="80%"
										width="80%"
									/>
								</Grid>
							</Grid>
						</Grid>
					) : (
						<Grid container direction="row" className={classes.containerBlue}>
							<Grid item xs={12} md={6}>
								<Grid container direction="column">
									{containerBlueUpperTextFirstPage1}
									{containerBlueTextMid1}
									{containerBlueTextFirstPage1}
									{containerBlueBottomTextFirstPage1}
								</Grid>
							</Grid>
							<Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
								<Lottie
									options={defaultOptions(FtrsLotie)}
									height={sreenSM ? '60%' : '100%'}
									width={sreenSM ? '60%' : '100%'}
								/>
							</Grid>
						</Grid>
					)}
				</Container>
			</div>

			<Container maxWidth="lg">
				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
					style={sreenSM ? { padding: '40px 0' } : { padding: '80px' }}
				>
					<div className={classes.ttlbeforeText}>What we do</div>
					<div className={classes.greenLine}></div>
					<div className={classes.textAfterGreenLine}>{whatWeDoText}</div>
				</Grid>
			</Container>

			<div className={classes.divGray}>
				<Container maxWidth="lg">
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
						style={sreenSM ? { padding: '40px 0' } : { padding: '80px 30px 80px 30px' }}
					>
						<div className={classes.ttlbeforeText}>What We Offer</div>
						<div className={classes.greenLine}></div>
						<div
							className={classes.textAfterGreenLine}
							style={sreenSM ? {} : { padding: '40px 80px 0px 80px' }}
						>
							{servicesText}
						</div>
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
							style={{ paddingTop: '40px' }}
						>
							<Grid item xs={12} md={6}>
								{srvcs.map((x, i) => {
									return (
										<div
											style={{ paddingTop: '2em', display: 'inline-flex' }}
											key={i}
										>
											<div style={{ paddingRight: '10px' }}>
												<img src={CheckedIcon} alt="123" width="35px" />
											</div>
											<div>
												<span className={classes.srvicesTtl}>{x.ttl}</span>
												<span className={classes.srvicesTxt}>
													{' '}
													- {x.txt}
												</span>
											</div>
										</div>
									);
								})}
							</Grid>
							<Grid item xs={12} md={6}>
								<div
									style={
										sreenSM
											? { paddingTop: '20px', textAlign: 'center' }
											: { padding: '10px', textAlign: 'center' }
									}
								>
									<img
										src={ServicesPic}
										alt="Services"
										width={sreenSM ? '60%' : '100%'}
									/>
								</div>
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</div>

			<div>
				<Container maxWidth="lg">
					{!sreenSM ? (
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
							style={sreenSM ? { padding: '40px 0' } : { padding: '80px 20px' }}
						>
							<Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
								<img src={frstPage1} alt="People" width="80%" />
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								className={classes.textAfterGreenLine}
								style={
									sreenSM
										? { textAlign: 'center', paddingTop: 0 }
										: { textAlign: 'left', paddingTop: 0 }
								}
							>
								{gtdWasDesigned}
							</Grid>
						</Grid>
					) : (
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
							style={sreenSM ? { padding: '40px 0' } : { padding: '80px' }}
						>
							<Grid
								item
								xs={12}
								md={6}
								className={classes.textAfterGreenLine}
								style={sreenSM ? { textAlign: 'center' } : { textAlign: 'left' }}
							>
								{gtdWasDesigned}
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								style={sreenSM ? { padding: '40px', textAlign: 'center' } : {}}
							>
								<img
									src={frstPage1}
									alt="People"
									width={sreenSM ? '50%' : '100%'}
								/>
							</Grid>
						</Grid>
					)}
				</Container>
			</div>

			<div className={classes.divGray}>
				<Container maxWidth="lg">
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
						style={
							sreenSM ? { padding: '70px 0' } : { padding: '80px 140px 80px 140px' }
						}
					>
						<img src={quote} alt="434" width="50" />
						<div className={classes.textAfterGreenLine}>{firstRecomnd}</div>
						<div style={{ paddingTop: '30px' }}>
							<GetAvatar name="Idan Chen" company="Green2Blue" pic={idanPic} />
						</div>
					</Grid>
				</Container>
			</div>

			<div className={classes.tailorMade}>
				<Container maxWidth="lg" className={classes.tailorMadeDiv}>
					<div style={{ fontWeight: '700' }}>{tlrMade1}</div>
					<div>{tlrMade2}</div>
					<Link to={{ pathname: '/freedemo', state: reg }}>
						<Button variant="outlined" className={classes.btn}>
							FREE DEMO
						</Button>
					</Link>
				</Container>
			</div>

			<div className={classes.divWhite}>
				<Container maxWidth="lg">
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
						style={sreenSM ? { padding: '40px 0' } : { padding: '80px 30px 80px 30px' }}
					>
						<div className={classes.ttlbeforeText}>Benefits</div>
						<div className={classes.greenLine}></div>
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
							style={{ paddingTop: '40px' }}
						>
							<Grid item xs={12} md={6}>
								{bnfts.map((x, i) => {
									return (
										<div
											style={{ paddingTop: '2em', display: 'inline-flex' }}
											key={i}
										>
											<div style={{ paddingRight: '10px' }}>
												<img src={CheckedIcon} alt="123" width="35px" />
											</div>
											<div>
												<span className={classes.srvicesTtl}>{x.ttl}</span>
												<span className={classes.srvicesTxt}>
													{' '}
													- {x.txt}
												</span>
											</div>
										</div>
									);
								})}
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								style={{ alignSelf: 'center', textAlign: 'center' }}
							>
								<img
									src={BenefitsPic}
									alt="Benefits"
									width={sreenSM ? '50%' : '100%'}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</div>

			<div className={classes.divGray}>
				<Container maxWidth="lg">
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
						style={
							sreenSM ? { padding: '70px 0' } : { padding: '80px 140px 80px 140px' }
						}
					>
						<img src={quote} alt="434" width="50" />
						<div className={classes.textAfterGreenLine}>{scndRecomnd}</div>
						<div style={{ paddingTop: '30px' }}>
							<GetAvatar
								name="Nir Azulai"
								company="Nir Azulai Management"
								pic={nirPic}
							/>
						</div>
					</Grid>
				</Container>
			</div>

			<div className={classes.divWhite}>
				<Container maxWidth="lg">
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
						style={sreenSM ? { padding: '80px 0' } : { padding: '80px 30px 80px 30px' }}
					>
						<div className={classes.ttlbeforeText}>Frequently Asked Questions</div>
						<div className={classes.greenLine}></div>
						<Faqs />
					</Grid>
				</Container>
			</div>

			<div
				className={classes.tailorMade}
				style={
					sreenSM
						? { padding: '30px 0', fontWeight: '600' }
						: { padding: '50px 0', fontWeight: '600' }
				}
			>
				<Container maxWidth="md" className={classes.tailorMadeDiv}>
					<div
						style={
							sreenSM
								? { fontSize: '40px', paddingBottom: '20px' }
								: { fontSize: '65px', paddingBottom: '20px' }
						}
					>
						Register Today!
					</div>
					<Grid
						container
						spacing={3}
						direction="row"
						justifyContent="center"
						alignItems="center"
					>
						<Grid item xs={12} md={4}>
							<input
								placeholder="Full Name"
								className={classes.inpt}
								value={reg.name}
								onChange={(e) => setReg({ ...reg, name: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<input
								placeholder="Email"
								className={classes.inpt}
								value={reg.email}
								onChange={(e) => setReg({ ...reg, email: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12} md={4} id="ftr">
							<Link to={{ pathname: '/freedemo', state: reg }}>
								<button className={classes.btnRegister}>Start My Free Trial</button>
							</Link>
						</Grid>
					</Grid>
				</Container>
			</div>

			<Footer />
		</div>
	);
};

export default LandingPage;