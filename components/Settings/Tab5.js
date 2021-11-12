import React, { useContext, useState, useEffect } from 'react';
import { Grid, Fab, Typography, Container } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SettingsContext } from '../../contexts/useSettingsContext';
import useWindowSize from '../../hooks/useWindowSize';
import firebase from 'firebase/app';
import Paper from '@material-ui/core/Paper';
import SnackBar from '../Subcomponents/SnackBar';
import DelDialog from '../Subcomponents/DeleteDialog';
import Tab5Modal from './modals/Tab5Modal';
import { AuthContext } from '../../contexts/useAuthContext';
import EditDel from '../Subcomponents/EditDel'
import { showDataTable } from '../../functions/setTableDt.js';
import TableTtl from '../Subcomponents/tableTitleAndExplain'


const dateFormat = require('dateformat');

const tableCols = [
	{ field: 'displayName', header: 'User Name', showcol: true },
	{ field: 'email', header: 'Email', showcol: true },
	{ field: 'start', header: 'Start Date', showcol: true },
	{ field: 'login', header: 'Last Log In', showcol: true },
	{ field: 'admin', header: 'Admin', showcol: true },
	{ field: 'write', header: 'Write', showcol: true },
	{ field: 'role', header: 'Role', showcol: true },
	{ field: 'el', header: '', el: 'el', showcol: true }
];


function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3, paddingBottom: 0 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};


const useStyles = makeStyles(theme => ({
	button: {
		margin: theme.spacing(1.5, 0, 0, 1),
	},
	paper: {
		padding: theme.spacing(1, 4, 3, 4),
	},
	titlelClr: {
		color:	'#193e6d',
		padding: '12px 12px 0px 12px',
		paddingBottom: 10
}}));

const Tab5 = () => {
	const scrSize = useWindowSize();
	const classes = useStyles();
	const [data, setData] = useState([]);
	const { selectValueSettings, displayDialogSettings, settings, setLoading, roles } = useContext(SettingsContext);
	const [snackbar, setSnackbar] = useState(false);
	const [open, setOpen] = useState(false);
	const [row, setRow] = useState('');
	const [runFirstTime, setRunFirstTime] = useState(false);
	const { uidCollection, creator, uid } = useContext(AuthContext);
	

	useEffect(() => {

		const ownersArr = settings.owners !== undefined ? settings.owners.map(z => z.item) : [];

		const loadUsers = () => {

			setRunFirstTime(true);
			let listAllUsers = firebase.functions().httpsCallable('listAllUsers');
			listAllUsers({ uidCollection: uidCollection }).then(result => {

				let tmp = result.data.tmp.map(x => {
					let index_ = x.photoURL.indexOf("_");
					let tmpAdmin = x.photoURL.slice(index_ - 4, index_ - 3) === 'y' ? true : false;
					let tmpWrite = x.photoURL.slice(index_ - 3, index_ - 2) === 'y' ? true : false;
					let tmpRole = roles[x.photoURL.slice(index_ - 5, index_ - 4)];
					let tmpCreator = x.photoURL.slice(index_ - 6, index_ - 5) === 'y' ? true : false;
					let lstlgnTemp = x.metadata.lastSignInTime === null ?
						'' : dateFormat(x.metadata.lastSignInTime, 'dd-mmm-yyyy');
					let tmpUser = ({
						...x, 'start': dateFormat(x.metadata.creationTime, 'dd-mmm-yyyy'),
						'login': lstlgnTemp, 'OwnerName': ownersArr.includes(x.displayName) ? x.displayName :
							'Company Name', 'write': tmpWrite, 'admin': tmpAdmin, 'role':tmpRole, 'creator': tmpCreator, 'password': '', 'password1': '',
						'username': x.displayName
					})
					delete tmpUser.metadata;
					delete tmpUser.photoURL;
					return tmpUser;
				} );
				
		
				setData(tmp);
				setLoading(false); 
			});
		}

		if (!runFirstTime) {  // לטפל בזה
			setLoading(true);
			loadUsers();
		}

	}, [runFirstTime, setLoading, settings.owners, uidCollection, roles])

	const addUser = () => {
		selectValueSettings(createEmptyObj());
	};

	const createEmptyObj = () => {
		let tmpObj = {};
		tableCols.map(k => k.field).map(q => {
			return tmpObj[q] = (q === 'start' || q === 'login') ? null : '';
		});
		delete tmpObj.el;
		tmpObj.password = '';
		tmpObj.password1 = '';
		tmpObj.OwnerName = '';
		tmpObj.write = false;
		tmpObj.email = '';
		tmpObj.admin = false;
		tmpObj.passYN = true;
		tmpObj.username = '';
		tmpObj.role = '';
		return tmpObj;
	};


	const actionTemplate = (rowData, column) => {
		return <EditDel selectValueOrder={selectValueSettings} rowData={rowData} column={column} delRow={delRow}  dis={creator ? false :
								uid===rowData.uid? true: rowData.creator} />; // 
	}

	const delRow = (rowData) => {
		setRow(rowData)
		setOpen(true)
	};

	const handleDelete = () => {
		setLoading(true);
		let newArr = data.filter(q => q.uid !== row.uid);

		let delUser = firebase.functions().httpsCallable('delUser');
		delUser(row.uid).then(result => {
			setSnackbar({ open: true, msg: 'User has been deleted!', variant: 'success' });
			setData(newArr);
			setLoading(false);
		});
		setOpen(false)
	};

	const dataTable = (rowData, column) => {
		return showDataTable(rowData, column, scrSize, settings);
	}

	let dynamicColumns = tableCols.filter(col => col.showcol === true).map((col, i) => {
		return <Column key={col.field}
			field={col.field}
			header={col.header}
			style={{ textAlign: 'center' }}
			body={col.field === 'el' ? actionTemplate : dataTable}
		/>;
	});


	return (
		<div className="datatable-responsive-demo">
			<Container maxWidth="lg" disableGutters  >
				<Paper className={classes.paper} >
					<TableTtl ttl='Permissions Settings' tltip='List of users who may login into the account.
											  Propoerty Owners can assign only to the properties they own and may obtain Read/Write permissions.
											  Company stuff can assign to all properties and may obtain Admin/Read/Write permissions. 
												Please select the  permissions  type for each user carefuly.'
					/>

					<Grid container spacing={3}  style={{paddingTop: '12px'}}>
						<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
							variant={snackbar.variant} />

						<DelDialog open={open} setOpen={setOpen} handleDelete={handleDelete}
							title='This user will be deleted!'
							content='Please Confirm' />

						<DataTable value={data}
							paginator={true}
							className="p-datatable-responsive-demo"
							paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
							currentPageReportTemplate={scrSize !== 'xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
							rows={10} rowsPerPageOptions={[5, 10, 20]}
						>
							{dynamicColumns}
						</DataTable>

						<Fab color="primary" aria-label="add" className={classes.button} onClick={addUser}>
							<AddIcon />
						</Fab>
					</Grid>
					{displayDialogSettings ? <Tab5Modal snackbar={snackbar} setSnackbar={setSnackbar}
					data={data} setData={setData} /> : null} 
				</Paper>
			</Container>
		</div>
	)
};

export default Tab5;

