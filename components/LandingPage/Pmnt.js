import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


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
		border: 'none',
		outline: 'none',
		color: '#fff',
		fontSize: '30px',
		lineHeight: '1',
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

	let checkoutUrl =
		'https://store.payproglobal.com/checkout?products[1][id]=69304&page-template=22222&currency=USD&exfo=742';

	return (
		<div className={classes.divMain}>
			<div style={{ position: 'absolute', width: 'calc(100% - 20px)' }}>
				<button className={classes.exitButton}>Exit</button>
			</div>
			<iframe
				frameBorder={0}
				allowtransparency={true}
				title="iframe"
				src={checkoutUrl}
				loading="lazy"
				className={classes.styleIframe}
			></iframe>
		</div>
	);
}
