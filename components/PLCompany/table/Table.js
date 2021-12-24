import React, {useState, useContext, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import Header from '../../Subcomponents/tablecomponents/Header';
import {SelectContext} from '../../../contexts/useSelectContext';
import useWindowSize from '../../../hooks/useWindowSize';
import {SettingsContext} from '../../../contexts/useSettingsContext'; 
import {showDataTable} from '../../../functions/setTableDt.js';

const tableCols = [
	{field: 'ExpInc', header: 'Revenue / Expense type', showcol: true, s:['xs','sm','md','lg', 'xl']},
	{field: 'VendChnnl', header: 'Source', showcol: true, s:['xs','sm','md','lg', 'xl']},
	{field: 'AccDate', header: 'Accounting Date ', showcol: true, s:['xs','sm','md','lg', 'xl']},
	{field: 'Transaction', header: 'Transaction', showcol: true, s:['md','lg', 'xl']},
	{field: 'Income', header: 'Revenue', showcol: true, s:['xs','sm','md','lg', 'xl']},
	{field: 'Expense', header: 'Expense', showcol: true, s:['xs','sm','md','lg', 'xl']},
];

const Table =(props) =>{
	
	const scrSize = useWindowSize();

	const [screenSize, setScreenSize] = useState();
	const {settings} = useContext(SettingsContext);
	const [cols, setCols] = useState(tableCols);
	const [globalFilter,setGlobalFilter] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const [showFilter, setShowFilter] = useState(false);
	const [dt, setDt] = useState('');
	const {/*valuePL, */setValuePL,setPlData, /*setPanelDatePicker*/
		  setFilteredData} = useContext(SelectContext);
	
	useEffect(()=>{
	
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
	
	},[scrSize, screenSize, cols])
	
	const onSearchChange = (event) => { 
        dt.filter(null, '', 'equals');

        setGlobalFilter(event.target.value);
        setSearchValue(event.target.value);
    }; //search
	
	 const resetFilter = async() =>{
        setGlobalFilter(null);
        setSearchValue('');
        setShowFilter(false);

	//	 setPanelDatePicker('');
		 setPlData({data:[],inc:'',exp:''});
		 setValuePL({From:null, To:null});
		 
		for (var key in cols) {
			dt.filter('', cols[key].field, 'equals');
		}
    };
	
	 const handleToggleCols= value => {
        let newArr = [...cols];
        let newObj = {...value, 'showcol': !value.showcol};
        newArr[newArr.map(i => i.field).indexOf(value.field)] = newObj;
        setCols(newArr);
    };

	const setCubes = (dta)=>{
		if(dta!=null){
			let inc=0; let exp=0;
			for (let i = 0; i < dta.length; i++) {
    			inc += +dta[i].Income;
				exp += +dta[i].Expense;
  		}
		
		setFilteredData({inc:inc, exp: exp})
		}
		
	}
	
	const showShortTR=(rowData, column) => {
		return (rowData.Transaction).indexOf("_") === -1 ? rowData.Transaction : rowData.Transaction.substring(0, rowData.Transaction.indexOf("_"))
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
			 tableData={setSHortTr(props.currentData)}
			 dates={true}
			 showOwners={false}
			 showSearch={false}
		 /> ;  
	
	const dataTable=(rowData, column)=>{
			return showDataTable(rowData, column, scrSize, settings);
	}

	let dynamicColumns = cols.filter(x=> props.showCols ==='Expense' ? x.field!=='Income' : 
									 props.showCols ==='Income' ? x.field!=='Expense' : {} )
									.filter(col => col.showcol === true).map((col,i) => {
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
		<Grid container >		
			<DataTable  value={props.currentData /*valuePL.From!=null ? plData.data: []*/}
						ref={(el) => setDt(el)}
				 		globalFilter={globalFilter}
						header={header}
						className="p-datatable-responsive-demo"
						paginator={true}
						rows={10} rowsPerPageOptions={[5,10,20]}
						paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
						currentPageReportTemplate={scrSize!=='xs' ? "Showing {first} to {last} of {totalRecords}" : ''}
						onValueChange={filteredData => setCubes(filteredData)}
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
