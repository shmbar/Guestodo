import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { RcContext } from '../../../../../contexts/useRcContext';
import SnackBar from '../../../../Subcomponents/SnackBar';
import { AuthContext } from '../../../../../contexts/useAuthContext';
import useWindowSize from '../../../../../hooks/useWindowSize';
import RetreiveDetails from './RetreiveDetails';
import '../modals.css';


const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'sticky',
	},
}));


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

const OrdersModalRetrieveData = (props) => {
	const classes = useStyles();
	const scr = useWindowSize();
	let scrSize = scr === 'xs' || scr === 'sm';

	const {	snackbar,setSnackbar,displayRetrieveDialog,
		setDisplayRetrieveDialog} = useContext(RcContext);

	const { write } = useContext(AuthContext);

	const closeDialog = () => {
		//	setRedValid(false);
		setDisplayRetrieveDialog(false);
	};

	const DialogHeader = (
		<AppBar className={classes.appBar}>
			<Toolbar>
				<IconButton edge="start" color="inherit" onClick={closeDialog} 
					aria-label="Close">
					<CloseIcon />
				</IconButton>


				{write && (
					<Button color="inherit" onClick={/*handleSave*/ null}>
						Save
					</Button>
				)}
			</Toolbar>
		</AppBar>
	);

	return (
		<>
			<SnackBar
				msg={snackbar.msg}
				snackbar={snackbar.open}
				setSnackbar={setSnackbar}
				variant={snackbar.variant}
			/>
			<Dialog
				fullScreen
				style={!scrSize ? { left: '15em' } : { left: '0' }}
				open={displayRetrieveDialog}
				onClose={closeDialog}
				TransitionComponent={Transition}
			>
				{DialogHeader}
				<RetreiveDetails />
			</Dialog>
		</>
	);
};

export default OrdersModalRetrieveData;