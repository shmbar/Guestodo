import React, {useState, useContext, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {AuthContext} from '../../contexts/useAuthContext'; 
import {getSubsciptionData} from '../../functions/functions';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

const noteAbove45 = <>Your GuesTodo free trial has ended. Upgrading to a paid plan allows you to
						continue working with GuesTodo's features, integrations, calendar and many 
						more.<br></br>
						Please follow the <b>Subscription</b> button for payment.<br></br>
						You will still be able to use GuesTodo app in read mode only.</>


const noteAbove3045 = <>Your free demo period has ended. To ensure that your services are not interrupted, please set your billing account with a 							valid payment information by following <b>Subscription</b> button below. <br></br>
							If you have already updated your payment information, please disregard this message.</>
const noteAbove2030 = <>Your free demo period is about to end. To ensure that your services are not interrupted, please set your billing account with a 							valid payment information by following <b>Subscription</b> button below. <br></br>
							If you have already updated your payment information, please disregard this message.</>

export default function AlertDialogSlide(props) {
	
	const [open, setOpen] = useState(false);
	const [note,setNote] = useState(null)
	const {uidCollection, user, setWrite}  = useContext(AuthContext);
	
	const handleClose = () => {
		setOpen(false);
	};
	
	const handleClose1 = () => {
		setOpen(false);
		props.setPage('Subscription');
	};
	

	useEffect(()=>{
		
		const checkPayment = async () => {
		
			let doc = await getSubsciptionData(uidCollection);


			/*	const lastPaid = new Date(doc.lastPaid.seconds*1000)
			const nowTime = Date.now();

			const daysFromLastPayment = Math.round((nowTime - lastPaid)/(1000*60*60*24)).toFixed(2)

			console.log(daysFromLastPayment*1) */

			if (doc) {
				//check if the is pament
				console.log('here');
				//check that the last payment was ok
				//check about monthy/early payment
			} else {
				const createdDay = new Date(user.user.metadata.creationTime);

				if (createdDay) {
					const nowDate = Date.now();

					let diff = Math.round((nowDate -createdDay)/(1000*60*60*24))
					
					if (diff >= 20 && diff < 31) {
						setNote(noteAbove2030)
						setOpen(true)
					} else if (diff >= 31 && diff <= 45) {
						setNote(noteAbove3045)
						setOpen(true)
					} else if (diff > 45 ) {
						setNote(noteAbove45)
						setOpen(true)
					//	setWrite(false)
					}
				}
			}
	};
		
		checkPayment()
		
	},[uidCollection, user.user.metadata.creationTime, setWrite])
	

	return (
		<div>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">
					{"Subscription Notification "}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{note}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose1} color="primary">
						Subscription 
					</Button>
					<Button onClick={handleClose} color="primary">
						Exit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
