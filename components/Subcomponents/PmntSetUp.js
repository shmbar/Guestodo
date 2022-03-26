import React, {useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../contexts/useAuthContext';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {SettingsContext} from '../../contexts/useSettingsContext'; 

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	divMain: {
		zIndex: 99999,
		//display: ' + initialCheckoutVisibility() +';
		backgroundColor: 'transparent',
		border: '0px none transparent',
		visibility: 'visible',
		margin: '0px',
		padding: '0px',
		//-webkit-tap-highlight-color: 'transparent',
		position: 'fixed',
		left: '0px',
		top: '0px',
		width: '100%',
		height: '100%',
	},
	exitButton: {
		position: 'absolute',
		top: '10px',
		right: '10px',
	//	border: 'none',
	//	outline: 'none',
	//	color: '#fff',
	//	fontSize: '30px',
	//	lineHeight: '1',
	//	background: 'none',
	//	color: 'blue'
	},
	styleIframe : {
		width: '100%',
		height: '100%',
		border: 0,
		overflowX: 'hidden',
		overflowY: 'auto',
	}
}));


export default function ContainedButtons() {
	const classes = useStyles();
	const { uidCollection } = useContext(AuthContext);
	const {subscriptionPlan} = useContext(SettingsContext);
	
	let checkoutUrl =
		`https://store.payproglobal.com/checkout?products[1][id]=${subscriptionPlan}&page-template=15402&currency=USD&exfo=742&x-UniqueID=${uidCollection}`;

	return (
		<div className={classes.divMain}>
			<div style={{ position: 'absolute', width: 'calc(100% - 20px)' }}>
				<Link to='/owners'>
					<Button variant="contained" color="primary" className={classes.exitButton}>Back</Button>
				</Link>
				
			</div>
			<iframe
				frameBorder={0}
				allowtransparency='true'
				title="iframe"
				src={checkoutUrl}
				loading="lazy"
				className={classes.styleIframe}
			></iframe>
		</div>
	);
}
