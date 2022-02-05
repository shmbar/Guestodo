import React, { useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useWindowSize from '../../../../../hooks/useWindowSize';
import { Paper, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SettingsContext } from '../../../../../contexts/useSettingsContext';
import {RcContext} from '../../../../../contexts/useRcContext';
import { convId2Item, readDataSlots, getNewTR, checkAvailableSlot } from '../../../../../functions/functions.js';
import EditIcon from '@material-ui/icons/Edit';
import { v4 as uuidv4 } from 'uuid';
import {showDataTable} from '../../../../../functions/setTableDt.js';

const dateFormat = require('dateformat');

const tableCols = [
	{ field: 'TokeetApt', header: 'Tokeet Apt', showcol: true },
	{ field: 'ChckIn', header: 'Check In', showcol: true },
	{field: 'RsrvChn', header: 'Channel', showcol: true},	
	{ field: 'PrpName', header: 'Property', showcol: true },
	{ field: 'AptName', header: 'Apartment', showcol: true },
	{ field: 'pStatus', header: 'Status', showcol: true },
	{ field: 'el', header: '', el: 'el', showcol: true },
	/*   {field: 'LstSave', header: 'Last Created ', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'pStatus', header: 'Status ', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'GstName', header: 'Guest', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'Transaction', header: 'Transaction', showcol: true, s:['md','lg', 'xl']},
			{field: 'ChckIn', header: 'Check In', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'ChckOut', header: 'Check Out', showcol: true, s:['lg', 'xl']},
			{field: 'NigthsNum', header: 'Nights', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'PrpName', header: 'Property', showcol: true,initial: 4},
			{field: 'AptName', header: 'Apartment', showcol: true, s:['xs','sm','md','lg', 'xl']},
			{field: 'RsrvChn', header: 'Channel', showcol: true, s:['xs','sm','md','lg', 'xl']},	
			{field: 'TtlPmnt', header: 'Total Payment', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'BlncRsrv', header: 'Balance Due', showcol: true, s:['lg', 'xl']},	
			{field: 'PmntStts', header: 'Payment Status', showcol: true, s:['md','lg', 'xl']},	
			{field: 'NetAmnt', header: 'Base Amount', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'Fees', header: 'Fees', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'TtlRsrvWthtoutVat', header: 'Reservation Amount Before VAT', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'Taxes', header: 'Taxes', showcol: false, s:['xs','sm','md','lg', 'xl']},
			{field: 'VAT', header: 'VAT', showcol: false, s:['xs','sm','md','lg', 'xl']},	
			{field: 'RsrvAmnt', header: 'Reservation Amount', showcol: true, s:['md','lg', 'xl']},	
			{field: 'el' , header: '', el: 'el', showcol: true, s:['xs','sm','md','lg', 'xl']} 
			*/
];

const TktReservationsTable = (props) => {
	const scrSize = useWindowSize();
	const { settings } = useContext(SettingsContext);
	const {selectValue, setSlotsTable, setRcTable, setIsSlotAvailable} = useContext(RcContext);
	const useStyles = makeStyles((theme) => ({
		root: {
			padding: scrSize === 'xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
			display: 'grid',
			maxWidth: 900,
			background: 'aliceblue'
		},
	}));

	const SetYel = (rowData, column) => {
		return <span style={{ backgroundColor: 'yellow' }}>{rowData[column.field]}</span>;
	};

	const selectValueOrder = async (rowData) => {

		const indx = props.gstdAptsArr.findIndex(x=>x.tokeet.tokeetID===rowData.tokeet.tokeetID);
		let val = props.gstdAptsArr[indx];

		selectValue(val);
		
		let tmpRC = await  getNewTR(props.uidCollection, 'lastTR', 'lastTR', 'RC');
		val =({...val, 'Transaction' : 'RC'.concat(tmpRC).concat('_' + uuidv4())});
		
		let availORnotavail = await checkAvailableSlot(props.uidCollection, val.AptName,
							val.Transaction, val.ChckIn, val.ChckOut);
		setIsSlotAvailable(!availORnotavail);
		
		
		let slotsData = await readDataSlots(props.uidCollection,'slots',
			dateFormat(val.ChckIn, 'yyyy'),	null, val.AptName);
		
		setSlotsTable(slotsData.dates);
		setRcTable(slotsData.rc);  
	};

	const actionTemplate = (rowData, column) => {
	
		return ( 
			!props.tokeetIdList.includes(rowData.tokeet.tokeetID) ? 
				<Tooltip title='Edit before importing'>
					<IconButton aria-label="Edit" onClick={() => selectValueOrder(rowData)}>
						<EditIcon />
					</IconButton>
				</Tooltip>
			:
				<span>Exist</span>
			
		);
	};
	
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}
	
	const classes = useStyles();
	let dynamicColumns = tableCols.map((col, i) => {
		return (
			<Column
				key={col.field}
				field={col.field}
				header={col.header}
				body={col.field === 'pStatus' ? SetYel :
						col.field === 'el' ? actionTemplate :
						col.field === 'RsrvChn' ? dataTable :
						''}
				headerStyle={{ overflow: 'visible', textAlign: 'center', background: 'aliceblue' }}
				style={{ textAlign: 'center', background: 'aliceblue' }}
				//	filter={col.field!=='el'? showFilter:false}
			/>
		);
	});


	return (
		<Paper className={classes.root}>
			<h4 className="ttlClr">Tokeet reservations</h4>
			<div className="datatable-responsive-demo">
				<DataTable
					value={convId2Item(props.gstdAptsArr.map(x=> ({...x, TokeetApt:
						x.tokeet.TokeetApt})), ['AptName', 'PrpName', 'RsrvChn'], settings)}
					className="p-datatable-responsive-demo"
					rowHover 
					//	header={header}
					paginator={true}
				
					rows={10}
					 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					rowsPerPageOptions={[10,25,50]}
					currentPageReportTemplate={
						scrSize !== 'xs' ? 'Showing {first} to {last} of {totalRecords}' : ''
					}
				>
					{dynamicColumns}
				</DataTable>
			</div>
		</Paper>
	);
};

export default TktReservationsTable;