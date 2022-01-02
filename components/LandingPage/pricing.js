import React, { useState } from 'react';
import { Container, Grid } from '@material-ui/core';
import MMenu from './Menu/MainMenu';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'primereact/button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
//import FormControl from '@material-ui/core/FormControl';
//import Select from '@material-ui/core/Select';
//import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Slider from '@material-ui/core/Slider';
import CheckedIcon from './checked.png';
import { Link } from 'react-router-dom';
import Footer from './Footer/footer';

const marks = [
	{
		value: 5,
	},
	{
		value: 100,
	},
];

const AnnualDiscount = '15%';
const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: '#193E6D',
		marginTop: '80px',
		padding: '30px 0',
		[theme.breakpoints.down('md')]: {
			marginTop: '70px',
		},
	},
	containerBlueUpperText: {
		color: '#193e6d',
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '36px',
		fontWeight: 600,
		lineHeight: '55px',
		letterSpacing: '0.2px',
		textAlign: 'left',
		[theme.breakpoints.down('md')]: {
			lineHeight: '45px',
		},
		[theme.breakpoints.down('sm')]: {
			fontSize: '25px',
		},
	},
	txt: {
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '18px',
	},
	inptNumber: {
		height: '39px',
		width: '60px',
		borderRight: 'none',
		borderLeft: 'none',
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		borderTop: '1px solid rgba(0, 0, 0, 0.12)',
		textAlign: 'center',
	},
	tglBTN1: {
		width: '50px',
		background: '#5EC198',
	},
	tglBTN2: {
		width: '190px',
	},
	leftBTN: {
		borderTopLeftRadius: '22px',
		borderBottomLeftRadius: '22px',
		borderTopRightRadius: '0',
		borderBottomRightRadius: '0',
		height: '40px',
	},
	rightBTN: {
		borderTopRightRadius: '22px',
		borderBottomRightRadius: '22px',
		borderTopLeftRadius: '0',
		borderBottomLeftRadius: '0',
		height: '40px',
	},
	select: {
		width: '250px',
	},
	select1: {
		border: '1px solid rgba(0, 0, 0, 0.12)',
		height: '40px',
		borderRadius: '22px',
		textAlign: 'center',
	},
	divGray: {
		backgroundColor: '#f2f6fa',
	},
	fnt: {
		fontFamily: '"Poppins", Sans-serif',
		color: 'rgba(0, 0, 0, 0.54)',
	},
	srvicesTxt: {
		color: '#193e6d',
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '1.1em',
	},
	btn1:{
		background: '#193E6D',
		width: '100%',
		height: '50px',
		fontSize: '1.5rem',
		fontFamily: '"Poppins", Sans-serif!important',
		color: 'white'
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

const Pricing = () => {
	const classes = useStyles();
	const [alignment, setAlignment] = useState('left');
	const [numPrp, setNumPrp] = useState(5);
	//const [pricePerPrp, setPricePerPrp] = useState((29 / 5).toFixed(2));
	const [ttlPrice, setTtlPrice] = useState(29);
	const [maxPrp,setMaxPrp] = useState(5)

	const backGround = (x) => {
		return alignment === x ? { background: '#5EC198' } : { background: 'white' };
	};
	const txtclr = (x) => {
		return alignment === x ? { color: 'white' } : { color: 'gray' };
	};

	const calc = (x, value, LeftRight,mxPrp) => {
		if (LeftRight === 'left') {
		//	setPricePerPrp((x / value).toFixed(2));
			setTtlPrice(x);
		} else {
		//	setPricePerPrp(((x / value) * (1 - parseFloat(AnnualDiscount) / 100)).toFixed(2));
			setTtlPrice((x * (1 - parseFloat(AnnualDiscount) / 100)).toFixed(2));
		}
		setMaxPrp(mxPrp)
	};

	function handleChange(e, value, LeftRight) {
		let tmp = LeftRight === undefined ? alignment : LeftRight;
		setNumPrp(value);

		if (value === 1) {
			calc(9, value, tmp, 1);
		} else if (value >= 2 && value <= 5) {
			calc(29, value, tmp,5);
		} else if (value >= 6 && value <= 10) {
			calc(49, value, tmp,10);
		} else if (value >= 11 && value <= 15) {
			calc(69, value, tmp,15);
		} else if (value >= 16 && value <= 20) {
			calc(89, value, tmp,20);
		} else if (value >= 21 && value <= 35) {
			calc(149, value, tmp,35);
		} else if (value >= 36 && value <= 50) {
			calc(179, value, tmp,50);
		}
	}

	const handleAlignment = (event, newAlignment) => {
		if (newAlignment === null) return;

		setAlignment(newAlignment);
		handleChange(null, numPrp, newAlignment);
	};

	const bnfts = [
		{ txt: 'Set your own active channels.' },
		{ txt: 'Super easy setup.' },
		{ txt: '24/7 support.' },
		{ txt: 'Charts & Reports.' },
		{ txt: 'Integration with channels.' },
		{ txt: 'Unlimited users/owners.' },
		{ txt: 'Single & multi calendars.' },
		
	];

	const usg = [
		{ txt: '30 Days Free Trial.' },
		{ txt: 'No booking fees.' },
		{ txt: 'No credit card required.' },
	];
	
	return (
		<div>
			<MMenu />
			<div className={classes.root}>
				<Container maxWidth="lg">
					<div
						className={classes.containerBlueUpperText}
						style={{ textAlign: 'center', fontWeight: 400, color: '#ffffff' }}
					>
						<p>Simple, clear pricing for all.</p>
						<p style={{ fontSize: '30px' }}>
							For more than 50 rentals, contact us to get a better deal.
						</p>
					</div>
				</Container>
			</div>

			<Container maxWidth="lg">
				<Grid
					container
					direction="row"
					justifyContent="space-around"
					alignItems="center"
					style={{ paddingTop: '30px' }}
				>
					<Grid item>
						<div className={classes.txt} style={{textAlign:'center'}}>Select your plan:</div>
						<ToggleButtonGroup
							value={alignment}
							exclusive
							onChange={handleAlignment}
							style={{ paddingTop: '10px', height: '50px' }}
						>
							<ToggleButton
								value="left"
								className={[classes.tglBTN2, classes.leftBTN]}
								style={backGround('left')}
							>
								<div style={txtclr('left')}>Billed Monthly</div>
							</ToggleButton>

							<ToggleButton
								value="right"
								className={[classes.tglBTN2, classes.rightBTN]}
								style={backGround('right')}
							>
								<div
									style={txtclr('right')}
								>{`Billed Yearly (-${AnnualDiscount}) `}</div>
							</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
				</Grid>
			</Container>

			<div className={classes.divGray} style={{ marginTop: '30px' }}>
				<Container maxWidth="lg" style={{ padding: '40px 0' }}>
					<Card>
						<CardContent>
							<div
								className={classes.fnt}
								style={{ fontSize: '30px', textAlign: 'center' }}
							>
								How many properties do you plan to manage?
							</div>
							{/*<div
								className={classes.fnt}
								style={{
									fontSize: '45px',
									textAlign: 'center',
									paddingTop: '10px',
								}}
							>
								{`$${pricePerPrp}  `}
								<span
									className={classes.fnt}
									style={{ fontSize: '15px', textAlign: 'center' }}
								>
									Per property, per month
								</span>
							</div> */}
							<Container maxWidth="sm" style={{paddingTop: '5px'}}>
								<Grid container >
									<Grid item xs={12} md={6}>
										<div
											className={classes.fnt}
											style={{
												fontSize: '35px',
												textAlign: 'center',
												paddingTop: '10px',
											}}
										>
										{`$${ttlPrice}`}
										</div>
										<p className={classes.fnt} style={{
												fontSize: '15px',
												textAlign: 'center',
												paddingTop: '5px',
											}}>{alignment==='left' ? 'With monthly payments': 'With yearly payments'}
										</p>
									</Grid>
									<Grid item xs={12} md={6}>
										<div
											className={classes.fnt}
											style={{
												fontSize: '35px',
												textAlign: 'center',
												paddingTop: '10px',
											}}
										>
										{maxPrp}
										</div>
										<p className={classes.fnt} style={{
												fontSize: '15px',
												textAlign: 'center',
												paddingTop: '5px',
											}}>Max properties</p>
									</Grid>
								</Grid>
							</Container>
							<Grid
								container
								style={{ display: 'inline-flex', paddingTop: '35px' }}
								justifyContent="center"
							>
								<Grid item xs={12} md={3}>
									<div
										className={classes.fnt}
										style={{
											fontSize: '25px',
											textAlign: 'right',
											paddingRight: '15px',
										}}
									>
										Managed Properties:
									</div>
								</Grid>
								<Grid item xs={12} md={7}>
									<Slider
										defaultValue={5}
										onChange={handleChange}
										step={1}
										marks={marks}
										valueLabelDisplay="on"
										style={{ padding: '20px 0' }}
										min={1}
										max={50}
									/>
								</Grid>
							</Grid>
							<Container maxWidth="md">
								<Grid
									container
									style={{ paddingTop: '35px' }}
									justifyContent="center"
								>
								<Grid item xs={12} md={6}>
									{bnfts.map((x, i) => {
										return (
											<div style={{paddingTop: '2em', display: 'inline-flex', width: '100%'}} key={i}>
												<div style={{ paddingRight: '10px' }}>
													<img src={CheckedIcon} alt="123" width="20px" />
												</div>
												<div>
													<span className={classes.srvicesTxt}>
														{x.txt}
													</span>
												</div>
											</div>
										);
									})}
								</Grid>
								<Grid item xs={12} md={6}>
									<p className={classes.srvicesTxt} style={{paddingTop: '1.6rem', lineHeight: '25px'}}>
										Schedule a call with our experts to get a free consultation regarding GuesTodo usage and setup.
									</p>
										{usg.map((x, i) => {
										return (
											<div style={{paddingBottom: '2em', display: 'inline-flex', width: '100%'}} key={i}>
												<div style={{ paddingRight: '10px' }}>
													<img src={CheckedIcon} alt="123" width="20px" />
												</div>
												<div>
													<span className={classes.srvicesTxt}>
														{x.txt}
													</span>
												</div>
											</div>
										);
									})}
										<Link to="/freedemo" className={classes.lnk}>
												<Button label="Request a Demo"  className={classes.btn1} />

										</Link>
									
									
								</Grid>
							</Grid>
							</Container>
							
						</CardContent>
					</Card>
				</Container>
			</div>
			 <Footer />
		</div>
	);
};

export default Pricing;

/*<Grid item>
						<div className={classes.txt}>Select your currency:</div>
						<FormControl variant="outlined" className={classes.select} style={{ paddingTop: '10px' }}>
							<Select
								value={age}
								onChange={handleChange}
								className={classes.select1}
							>
								{currencies.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
								
							</Select>
						</FormControl>
					</Grid> 
*/
/*
const currencies = [
		{value: '$',label: 'US Dollar - $'},
		{value: '€',label: 'Euro  -  €'},
		{value: '£',label: 'British Pound Sterling - £'},
		{value: 'J¥Y',label: 'Japanese Yen - ¥'},
		{value: '₩',label: 'South Korean Won - ₩'},
		{value: '₹',label: 'Indian Rupee - ₹'},
		{value: '₪',label: 'Israeli New Sheqel - ₪'},
		{value: '₱',label: 'Philippine Peso - ₱'},
		{value: '฿',label: 'Thai Baht - ฿'},
		{value: '₡',label: 'Costa Rican Colón - ₡'},
		{value: '₫',label: 'Vietnamese Dong - ₫'},
  ];
  */

/*

<Grid item>
						<div className={classes.txt}>How many rentals you plan to manage?</div>
						<div
							//	onChange={handleAlignment}
							style={{ paddingTop: '10px' }}
						>
							<ToggleButton
								value="left"
								className={[classes.tglBTN1, classes.leftBTN].join(' ')}
								onChange={() => setNumPrp(numPrp - 1)}
							>
								<div style={{ color: 'white', fontSize: '40px' }}>-</div>
							</ToggleButton>
							<input
								type="text"
								value={numPrp}
								onChange={(e) => setNumPrp(e.target.value)}
								className={classes.inptNumber}
							/>
							<ToggleButton
								value="right"
								className={[classes.tglBTN1, classes.rightBTN].join(' ')}
								onChange={() => setNumPrp(numPrp + 1)}
							>
								<div style={{ color: 'white', fontSize: '30px' }}>+</div>
							</ToggleButton>
						</div>
					</Grid>
					
					*/