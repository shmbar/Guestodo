import React, {useState, useContext,useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Header from '../../Subcomponents/tablecomponents/Header';
import {SettingsContext} from '../../../contexts/useSettingsContext';
import useWindowSize from '../../../hooks/useWindowSize';
import {showDataTable} from '../../../functions/setTableDt.js';
import {addCommas} from '../../../functions/functions.js';


const tableCols = [
		{field: 'ExpInc', header: 'Revenue / Expense Type', showcol: true, s:['xs','sm','md','lg', 'xl']},
		{field: 'VendChnnl', header: 'Source', showcol: true, s:['xs','sm','md','lg', 'xl']},
		{field: 'OpDate', header: 'Operation Date', showcol: true, s:['xs','sm','md','lg', 'xl']},
		{field: 'Transaction', header: 'Transaction', showcol: true, s:['md','lg', 'xl']},
		{field: 'pmnt', header: 'Payment Method', showcol: true, s:['xs','sm','md','lg', 'xl']},
		{field: 'receiving', header: 'Money Received', showcol: true, s:['xs','sm','md','lg', 'xl']},
		{field: 'cost', header: 'Payments', showcol: true, s:['xs','sm','md','lg', 'xl']},
		{field: 'balance', header: 'Balance', showcol: true, s:['xs','sm','md','lg', 'xl']},
];


const Table =(props) =>{

	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	
	const {settings} = useContext(SettingsContext);
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const dt = useRef(null);
	
	useEffect(() => {
	
				let newArr = [...cols];
		for(let col of cols){
			if(	(col.showcol && !(col.s).includes(scrSize)) || (!col.showcol &&  tableCols[cols.indexOf(col)].showcol  &&  (col.s).includes(scrSize)) ){
				let newObj = {...col, 'showcol': !col.showcol};
				newArr[newArr.map(i => i.field).indexOf(col.field)] = newObj;
			}
		};
		if(screenSize !== scrSize ){
			setCols(newArr);
			setScreenSize(scrSize);
		}


  	},[scrSize, screenSize, cols]);
		
	
	const onSearchChange = (event) => { 
        dt.current.filter(null, '', 'equals');
        setGlobalFilter(event.target.value);
        setSearchValue(event.target.value);
    }; //search
	
	
	const setCubes=(dt)=>{
		
			let rcv=0;	let pmnt=0;

			for(let i=0; i<dt.length;i++){
				rcv+= (+dt[i].receiving);
				pmnt+= (+dt[i].cost);
			}
			props.setPnldata({cost:addCommas(pmnt), receiving:addCommas(rcv)});
	}
		
	 const resetFilter = async() =>{
        setGlobalFilter(null);
        setSearchValue('');
        setShowFilter(false);
		setCubes(props.tableData)
		dt.current.reset();
        
	/*	for (var key in cols) {
			dt.filter('', cols[key].field, 'equals');
		} */
    };
	
	 const handleToggleCols= value => {
        let newArr = [...cols];
        let newObj = {...value, 'showcol': !value.showcol};
        newArr[newArr.map(i => i.field).indexOf(value.field)] = newObj;
        setCols(newArr);
    };
	
	const showShortTR=(rowData, column) => {
		return (rowData.Transaction==null || rowData.Transaction.indexOf("_") === -1) ? rowData.Transaction : rowData.Transaction.substring(0, rowData.Transaction.indexOf("_"))
	}
	
	const setSHortTr=(ddd) => { //for data export to excel
		return ddd.map(x=> ({...x, 'Transaction': showShortTR(x, null)}));
	}
		
	const header = <Header 
			 onChange={onSearchChange}
			 runFltr={()=> setShowFilter(!showFilter)}
			 n={showFilter}
			 searchValue={searchValue}
			 resetFltr={resetFilter}
			 handleToggleCols={handleToggleCols}
			 cols={cols}
			 tableData={setSHortTr(props.tableData)}
			showOwners={true}
			  showSearch={true}
			showFilter={showFilter}
		 /> ;  
	 
	const dataTable=(rowData, column)=>{
		return showDataTable(rowData, column, scrSize, settings);
	}

	let dynamicColumns = cols.filter(col => col.showcol === true).map((col,i) => {
            return <Column 	key={col.field}
					   		field={col.field}
					   		header={col.header}
					   		style={{textAlign:'center'}}
					  		body={dataTable}
					   		filter={showFilter} 
					   	
					   />;
        	});
	
	return(	
		<div className="datatable-responsive-demo">
		<Grid container  >
			<DataTable  value={props.tableData}
						ref={dt}
						globalFilter={globalFilter}
						className="p-datatable-responsive-demo"
						header={header}
						paginator={true}
						onValueChange={filteredData => setCubes(filteredData)}
						rows={10} rowsPerPageOptions={[5,10,20]}
						paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
						currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
				
				>
					{dynamicColumns}
			</DataTable>
		</Grid>
		</div>
	)
};

export default Table;

/*
	
*/
