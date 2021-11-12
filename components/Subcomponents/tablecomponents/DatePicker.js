import React, {useContext} from 'react';
import DateRange from '@material-ui/icons/DateRange';
import {InputAdornment, Input} from '@material-ui/core';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {OwnerSelectContext} from '../../../contexts/useOwnerSelectContext';

//import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const dateFormat = require('dateformat');	

const DatePicker = (props) =>{
	
	const {valuePL, setValuePL, panelDatePicker, setPanelDatePicker} = useContext(OwnerSelectContext);
	
	
   	const handleChange = (event, picker) => {
		let tmp ={...valuePL, 'start': dateFormat(picker.startDate._d,'yyyy-mm-dd'),
				   		'end': dateFormat(picker.endDate._d,'yyyy-mm-dd')};
		setValuePL(tmp);

	 	setPanelDatePicker(dateFormat(picker.startDate._d,'dd-mmm-yyyy').concat(' - ').concat(
		  		dateFormat(picker.endDate._d,'dd-mmm-yyyy')));

	}
	
	return(
				<DateRangePicker /*startDate="7/1/2019" endDate="8/31/2019"*/ onApply={handleChange}
				locale={{format:'MMM DD, YYYY'}} style={{display: 'block'}}
					showDropdowns={true}
				>
				 <Input
					value={panelDatePicker}
					className='searchInput'
					placeholder='Dates'
					readOnly= {true}
					fullWidth
				//	style={{width:'200'}}
					endAdornment={<InputAdornment position="end">
					<DateRange style={{color: '#ccc'}} />
						</InputAdornment>}
					/>
				</DateRangePicker>
        );
};

export default  DatePicker;