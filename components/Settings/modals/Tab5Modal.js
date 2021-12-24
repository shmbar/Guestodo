import React, { useContext } from 'react';
import { Button, Dialog, IconButton, Typography } from '@material-ui/core';
import Tab5Details from './Tab5Details';
import firebase from 'firebase/app';
import { withStyles } from '@material-ui/core/styles';
import { SettingsContext } from '../../../contexts/useSettingsContext';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@material-ui/icons/Close';
import { AuthContext } from '../../../contexts/useAuthContext';

const dateFormat = require('dateformat');

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

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
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

const Tab5Modal = (props) => {
    const {
        settings,
        selectValueSettings,
        displayDialogSettings,
        setDisplayDialogSettings,
        valueSettings,
        setRedValid,
        setLoading, roles
    } = useContext(SettingsContext);
    const { uidCollection } = useContext(AuthContext);
	
	
    const closeDialog = () => {
        setRedValid(false);
        setDisplayDialogSettings(false);
    };

    const handleChange = (e) => {
        if (e.target.name === 'OwnerName') {
            selectValueSettings({
                ...valueSettings,
                [e.target.name]: e.target.value,
                username: e.target.value,
            });
        } else if (e.target.name === 'role') {
            selectValueSettings({ ...valueSettings,
                role: e.target.value,
                username: valueSettings.uid != null ? valueSettings.username : '',
                password: valueSettings.uid != null && valueSettings.passYN ? valueSettings.password : '',
                OwnerName: '',
                email: valueSettings.uid != null ? valueSettings.email : '',
                admin: false,
                write: false,
            });
        } else {
            selectValueSettings({ ...valueSettings, [e.target.name]: e.target.value });
        }
    };

    const handleChangeTrueFalse = (name) => (e) => {
        name === 'admin'
            ? selectValueSettings({
                  ...valueSettings,
                  [name]: e.target.checked,
                  write: e.target.checked,
              })
            : selectValueSettings({ ...valueSettings, [name]: e.target.checked });
    };

    // /**********************************/
    const handleSave = async (e) => {
        setLoading(true);
        let isUpdate = valueSettings.uid != null; //not new
        // let exstIntheList=false;

        //validationn
        let fields = ['role', 'email'];
        let tmpTF = true;
        for (let i = 0; i < fields.length; i++) {
            if (valueSettings[fields[i]] === '' || valueSettings[fields[i]] === null) {
                tmpTF = false;
                break;
            }
        }

        if (valueSettings.role === 'Property Owner' && valueSettings.OwnerName === '') {
            tmpTF = false;
        }

        if (valueSettings.role !== 'Property Owner' && valueSettings.username === '') {
            tmpTF = false;
        }
		
		if (valueSettings.passYN  && valueSettings.password === '') {
            tmpTF = false;
        }
		

        if (!tmpTF) {
            setRedValid(true);
            props.setSnackbar({ open: true,   msg: 'Please fill out the required fields', variant: 'warning'  });
            setLoading(false);
            return;
        }

		if(!isUpdate && !valueSettings.passYN){
			setRedValid(true);
            props.setSnackbar({ open: true,   msg: 'Password must be valid', variant: 'warning'  });
            setLoading(false);
            return;
		}
	
        if (valueSettings.passYN && !/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(valueSettings.password)) {
            props.setSnackbar({ open: true, msg: 'Password must be at least 8 characters including at least one digit and one upper case letter',  variant: 'warning' });
            setLoading(false);
            return;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valueSettings.email)) {
            props.setSnackbar({ open: true, msg: 'Invalid email address', variant: 'warning' });
            setLoading(false);
            return;
        }
		
		if (valueSettings.passYN===true && valueSettings.password!==valueSettings.password1) {
            props.setSnackbar({ open: true, msg: 'Passwords are not the same', variant: 'warning' });
            setLoading(false);
            return;
        }
		
        //if email already exists on the firebase server
 
		const emailExistInTheList = props.data.map( (x) => x.email.toLowerCase() ).includes( valueSettings.email.toLowerCase()) //check if email in is table
		if(isUpdate && emailExistInTheList){}else{
			 let emailCheck = firebase.functions().httpsCallable('isEmailExist');
					emailCheck(valueSettings.email).then(async (result) => {

					if (result.data) {
						props.setSnackbar({  open: true,  msg: 'Email address already exists, try another one',  variant: 'error' });  
						return;
					}
				});	
		}
			
	
	
		/////////////////////////
		 const tmpStirng = 'http://a.a.a/';
		 const tmpCreator = valueSettings.creator ? 'y': 'n';
		 const tmpRole = Object.keys(roles).find(key => roles[key] ===  valueSettings.role);
		 const tmpAdmin = valueSettings.admin ? 'y':'n';
		 const tmpWrite = valueSettings.write ? 'y':'n';
		 const name = valueSettings.role=== 'Property Owner' ? valueSettings.OwnerName:
									valueSettings.username;
		 const srvrRow = {...valueSettings, 'displayName': name,
						'photoURL': tmpStirng.concat(tmpCreator).concat(tmpRole).concat(tmpAdmin).concat(tmpWrite).concat('--').concat('_').concat(uidCollection) }
		 delete srvrRow.OwnerName;
		 delete srvrRow.username;
		 delete srvrRow.login;
		 delete srvrRow.start;
		 delete srvrRow.write;
		 delete srvrRow.admin;
		 delete srvrRow.role;
		 delete srvrRow.passYN;
		 if(valueSettings.password===''){
			 delete srvrRow.password;
			 delete srvrRow.password1;
		 }
		
	
	 	if(isUpdate){ //update, id is in the list 
			let updateUser = firebase.functions().httpsCallable('updateUser');
				updateUser(srvrRow).then(result=> {
				props.setSnackbar( {open:true, msg: 'User has been updated!', variant: 'success'});
				setDisplayDialogSettings(false);
				const newArr = props.data.map(x=>
						x.uid!==valueSettings.uid? x: {...valueSettings, 'displayName': name})
			 	props.setData(newArr);
				setLoading(false);
			});
		 }else{ //new, not in the list
			 const uid = valueSettings.role=== 'Property Owner' ?
			   settings.owners.filter(x=>x.item ===valueSettings.OwnerName)[0]['id']: uuidv4(); 
			const tmp = {...srvrRow, 'uid':uid }
		
			
		 	let addUser = firebase.functions().httpsCallable('addUser');
			 
			addUser(tmp).then(result=> {
				if(result.data){
					props.setSnackbar( {open:true, msg: 'Email address already exists, try another one!', variant: 'error'});
					setLoading(false);
				}else{
		
					props.setSnackbar( {open:true, msg: 'New user has been added!', variant: 'success'});
					setDisplayDialogSettings(false);
					const tableRow = {...valueSettings, 'displayName': name, 'uid':uid,
						'start': dateFormat(new Date(),'dd-mmm-yyyy')}
					const newArr = [...props.data, tableRow];
					props.setData(newArr);
				}
				setLoading(false);
			}); 

			 
	};	
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
            <Dialog aria-labelledby="customized-dialog-title" open={displayDialogSettings} maxWidth='sm' fullWidth={true}>
                <DialogTitle onClose={closeDialog}>User Details</DialogTitle>
                <DialogContent dividers>
                    <Tab5Details
                        handleChange={handleChange}
                        //runFromOrders={props.runFromOrders}
                        handleChangeTrueFalse={handleChangeTrueFalse}
                        selectValueSettings={selectValueSettings}
						roles={Object.values(roles)}
                    />
                </DialogContent>
                <DialogActions>{footer}</DialogActions>
            </Dialog>
        </div>
    );
};

export default Tab5Modal;

/*
                
				
				
				
               */