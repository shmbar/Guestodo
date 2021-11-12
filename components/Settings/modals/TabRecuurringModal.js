import React, { useContext} from 'react';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TabRecuurringDetails from './TabRecuurringDetails';
import IconButton from '@material-ui/core/IconButton';
import { SettingsContext } from '../../../contexts/useSettingsContext';
import { formValidation } from '../../../functions/formValidation';
import {addRecurringExpense} from '../../../functions/functions.js';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';


const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const dateFormat = require('dateformat');


const DialogTitle = withStyles(styles)((props) => {
		const { children, classes, onClose } = props;
		return (
			<MuiDialogTitle disableTypography className={classes.root}>
				<Typography variant="h6">{children}</Typography>
				{onClose ? (
					<IconButton
						aria-label="Close"
						className={classes.closeButton}
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
				) : null}
			</MuiDialogTitle>
		);
	});

	const DialogContent = withStyles((theme) => ({
		root: {
			padding: theme.spacing(2),
		},
	}))(MuiDialogContent);

	const DialogActions = withStyles((theme) => ({
		root: {
			margin: 0,
			padding: theme.spacing(1),
		},
	}))(MuiDialogActions);






const TabRecuurringModal = (props) => {
	
	const {displayDialogSettings,setDisplayDialogSettings,
		valueSettings, recStart, recEnd, setRedValid} = useContext(SettingsContext);

	
	const closeDialog = () => {
		setRedValid(false);
		setDisplayDialogSettings(false);
	};


	const handleSave = async () => {
		///validation
	
		let validation = formValidation(valueSettings, ['ExpType','vendor','PrpName','AptName', 'Amnt']);

		if (!validation) {
			setRedValid(true);
			props.setSnackbar({	open: true,	msg: 'Please fill out the required fields',	variant: 'warning'	});
			return;
		}
		
		if (recStart===null) {
			setRedValid(true);
			props.setSnackbar({	open: true,	msg: 'Please fill out the required fields',	variant: 'warning'	});
			return;
		}
		

		if (valueSettings.recTransaction != null && new Date(recStart) >= new Date(recEnd) && recEnd!==null) {
			//recc
			props.setSnackbar({ open: true, msg: 'Recurring date is wrong!', variant: 'warning' });
			return;
		}

		///////////////////
		
		let indx = props.recData.findIndex((x) => x.recTransaction === valueSettings.recTransaction);
		let newObj = {...valueSettings, 'startDate': dateFormat(recStart, '01-mmm-yyyy') , 'recEnd':dateFormat(recEnd===null? '12-12-2099' : recEnd, '01-mmm-yyyy'),
					  'VatAmnt': +(+valueSettings.Amnt - +valueSettings.ExpAmntWthtoutVat).toFixed(2)};
		if (indx !== -1) {
			
			//Update the table
			const tmpArr = props.recData.map((k) =>	k.recTransaction === valueSettings.recTransaction ? newObj : k	);

			props.setSnackbar({	open: await addRecurringExpense(newObj),msg: 'Recurring Expense has been updated!',variant: 'success'});
			props.setRecData(tmpArr);
		} else {
			//add new data
					
				const tmpArr = [...props.recData, newObj];
				props.setRecData(tmpArr);
			
				props.setSnackbar({open: await addRecurringExpense(newObj),	msg: 'New Recurring Expense has been added!',
				variant: 'success',	});
				
			
			}

		setDisplayDialogSettings(false);
		
	};

	const footer = (
		<div>
			<Button
				className="myFont"
				variant="contained"
				type="submit"
				onClick={handleSave}
				color="primary"
			>
				Save
			</Button>
		</div>
	);

	

	return (
		<div>
			
			<Dialog aria-labelledby="customized-dialog-title" open={displayDialogSettings} maxWidth="md">
				<DialogTitle onClose={closeDialog}>
					<span style={{ color: '#193e6d' }}>Recurring Expenses</span>
				</DialogTitle>
				<DialogContent dividers>
					<TabRecuurringDetails />  
				</DialogContent>
				<DialogActions>{footer}</DialogActions>
			</Dialog>
		</div>
	);
};



export default TabRecuurringModal;