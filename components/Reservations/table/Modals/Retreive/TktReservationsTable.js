import React, { useContext, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import useWindowSize from '../../../../../hooks/useWindowSize';
import { Paper, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SettingsContext } from '../../../../../contexts/useSettingsContext';
import {RcContext} from '../../../../../contexts/useRcContext';
import { convId2Item, readDataSlots, checkAvailableSlot } from '../../../../../functions/functions.js';
import EditIcon from '@material-ui/icons/Edit';
import {showDataTable} from '../../../../../functions/setTableDt.js';
import { InputText } from 'primereact/inputtext';

const dateFormat = require('dateformat');

const tableCols = [
	{ field: 'TokeetApt', header: 'Tokeet Apt', showcol: true },
	{ field: 'GstName', header: 'Guest', showcol: true },
	{ field: 'ChckIn', header: 'Check In', showcol: true },
	{field: 'RsrvChn', header: 'Channel', showcol: true},	
	{ field: 'PrpName', header: 'Property', showcol: true },
	{ field: 'AptName', header: 'Apartment', showcol: true },
	{ field: 'el', header: '', el: 'el', showcol: true },
];

const TktReservationsTable = (props) => {
	const scrSize = useWindowSize();
	const { settings } = useContext(SettingsContext);
	const {selectValue, setSlotsTable, setRcTable, setIsSlotAvailable} = useContext(RcContext);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	
	const useStyles = makeStyles((theme) => ({
		root: {
			padding: scrSize === 'xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
			display: 'grid',
			maxWidth: 1400,
			background: '#f8f9fa'
		},
	}));

	const SetYel = (rowData, column) => {
		return <span style={{ backgroundColor: 'yellow' }}>{rowData[column.field]}</span>;
	};

	const selectValueOrder = async (rowData) => {

		const indx = props.gstdAptsArr.findIndex(x=>x.tokeet.tokeetID===rowData.tokeet.tokeetID);
	
		let val = props.gstdAptsArr[indx];

		selectValue(val);
		
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
				headerStyle={{ overflow: 'visible', textAlign: 'center', background: '#f8f9fa' }}
				style={{ textAlign: 'center', background: '#f8f9fa' }}
				sortable
				//	filter={col.field!=='el'? showFilter:false}
			/>
		);
	});
	
	const onSearchChange = (event) => { 
        setGlobalFilter(event.target.value);
        setSearchValue(event.target.value);
    }; 
	

	const searchBox =   <div className="flex justify-content-between">
                				<span className="p-input-icon-left">
                   				<i className="pi pi-search" />
                    			<InputText value={searchValue} onChange={onSearchChange} placeholder="Keyword Search" />
                				</span>
            			</div>
	
	return (
		<Paper className={classes.root}>
			<div style={{display:'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
				<h4 className="ttlClr">Tokeet reservations</h4>
				{searchBox}
			</div>
			
			<div className="datatable-responsive-demo">
				<DataTable
					value={convId2Item(props.gstdAptsArr.map(x=> ({...x, TokeetApt:
						x.tokeet.TokeetApt})), ['AptName', 'PrpName', 'RsrvChn'], settings)}
					
					className="p-datatable-responsive-demo"
					paginator
					globalFilter={globalFilter}
					rows={10}
					rowsPerPageOptions={[5,10,20]} 
					
					
					paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink 
							   PageLinks NextPageLink LastPageLink"
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