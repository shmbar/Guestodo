import React from 'react';
import {DataTable} from 'primereact/datatable';
import { makeStyles } from '@material-ui/core/styles';
import {
	InputLabel,//Checkbox,
	MenuItem,
	FormControl,
	Select,
	Paper ,Container,
} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';

const useStyles = makeStyles((theme) => ({
	formControl: {
		width: 250,
	},
	apt: {
		marginLeft: '10px',
		fontFamily: '"Poppins", Sans-serif',
		fontSize: '17px',
	},
	prp: {
		fontSize: '15px',
		fontStyle: 'italic',
		fontFamily: '"Poppins", Sans-serif',
		pointerEvents: 'none',
	},
	fnt: {
		fontFamily: '"Poppins", Sans-serif',
		padding: '10px'
	},
}));



const ConnectAptsTable = (props) => {
	const classes = useStyles();

	const SetYel=(rowData, column)=>{
		return(
		/*	<Checkbox
					edge="start"
					checked={rowData.checked}
					onChange={() => props.handleChangeChecked(rowData)}
					disableRipple
			/> */
			<Checkbox onChange={() => props.handleChangeChecked(rowData)} checked={rowData.checked}
				disabled={rowData.GstdApt===''}></Checkbox>
		)	
	}
	
	const setAptsDrill=(rowData, column)=>{
		return(
			<FormControl className={classes.formControl}>
					<InputLabel htmlFor="grouped-select" 
						style={{fontFamily: '"Poppins", Sans-serif',}}>
						Apartment
					</InputLabel>
					<Select
						id="grouped-select"
						value={rowData.GstdApt}
						onChange={(e) => props.handleChange(e, rowData)}
					>
						{props.arrApts.map((y, k) => {
							return (
								<MenuItem	key={k}	className={	y.val === 'apt' ? classes.apt :
										classes.prp} value={y.name}
								>
									{y.name}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
		)	
}

	
	const footer = 	<div>
					  <Button size="small" variant="contained" color="primary" onClick={()=>props.moveToStep3(3)}
						  disabled={props.assignApts.filter(x=> x.checked).length===0}>
						Move to Step 3
					  </Button>
		  			<Button size="small" variant="contained" color="secondary" onClick={()=>props.clr()}
						style={{marginLeft: '10px'}}>Clear List</Button>
					</div>

	
	return (
		<Container maxWidth="md" style={{margin: 0 }}>
		<Paper className={classes.root}  >
			<div className="datatable-responsive-demo">
				<DataTable
					value={props.assignApts}
					className="p-datatable-responsive-demo"
					footer={footer}
					paginator
					 rows={20} rowsPerPageOptions={[10,20,50]}
					  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
					//paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink 
				//			   PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
					
				//	 paginatorTemplate="">
				>
					 <Column field="el" header="" body={SetYel} style={{width: '5em', textAlign: 'center', background: '#f8f9fa'}}
						/>
					 <Column field="TokeetApt" header='Tokeet Apartments' style={{ background: '#f8f9fa'}}/>
					 <Column field="GstdApt" header='GuesTodo Apartments' body={setAptsDrill}  style={{background: '#f8f9fa'}}/>
				</DataTable>
			</div>
		</Paper>
		</Container>
		
		
		
     
			
      
      
	);
};

export default ConnectAptsTable;
