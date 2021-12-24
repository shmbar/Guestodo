import React, {useState} from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createTheme   } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const dateFormat = require('dateformat');	


const MRangePicker = (props) =>{
	
	const [firstSlct, setFirstSlct] = useState(0)
	const [dates, setDates] = useState({start:'', end: ''});
	const [vals, setVals] = useState([1,2,3,4,5,6,7,8,9,10,11,12].map(o => ({ 'id': o, 'value': false})	));
	
	
	
	const materialTheme = createTheme({
  overrides: { 
    MuiPickersToolbar: {
      toolbar: {
		  height: '65px'
      },
    },
	MuiPickersToolbarText: {
		toolbarTxt:{
			fontSize: '22px'
		},  
	},
	MuiPickersMonthSelection:{
		container:{
			width: '310px',
			'& :nth-child(n):hover': { 
				color: '#3f51b5',
    			fontSize: '1.5rem'
				
			},
			'& :nth-child(1)': {
  				color: vals.filter(x=> x.id===1)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===1)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	1 < firstSlct && dates.end==='' ? 'none' : null,
		
			},
			'& :nth-child(2)': {
  				color: vals.filter(x=> x.id===2)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===2)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	2 < firstSlct && dates.end==='' ? 'none' : null,
			
			},
			'& :nth-child(3)': {
  				color: vals.filter(x=> x.id===3)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===3)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	3 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(4)': {
  				color: vals.filter(x=> x.id===4)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===4)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	4 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(5)': {
				color: vals.filter(x=> x.id===5)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===5)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	5 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(6)': {
  				color: vals.filter(x=> x.id===6)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===6)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	6 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(7)': {
				color: vals.filter(x=> x.id===7)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===7)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	7 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(8)': {
				color: vals.filter(x=> x.id===8)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===8)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	8 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(9)': {
  				color: vals.filter(x=> x.id===9)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===9)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	9 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(10)': {
  				color: vals.filter(x=> x.id===10)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===10)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	10 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(11)': {
  				color: vals.filter(x=> x.id===11)[0]['value'] ? 'green' : null,
				fontSize: vals.filter(x=> x.id===11)[0]['value'] ? '1.5rem': null,
				pointerEvents: 	11 < firstSlct && dates.end==='' ? 'none' : null,
			},
			'& :nth-child(12)': {
  				color: vals.filter(x=> x.id===12)[0]['value'] ? 'green' : null,
			},  
		},	
	},
	MuiTypography:{
		h4:{
			display: 'none!important'
		},	
	},
  },
});
	
	
	const handleChange = (val) => {
	//	setValuePL({...valuePL, 'start': val})
	}
		
	const aaa=(val)=>{
		
		if(dates.start===''){
			setDates({...dates, 'start':val, 'end': ''})
			let tmp = [...vals]

			tmp = tmp.map(x=> x.id.toString() === (val.getMonth() + 1).toString() ? {...x, 'value': true} : x)
			setVals(tmp);
			setFirstSlct(val.getMonth() + 1)
			
		}else if(dates.end===''){
			setDates({...dates, 'end': val})
			let first = dates.start.getMonth()+1;
			let second = val.getMonth() + 1
				
			setVals(	vals.map(x=> (x.id >=first && x.id <=second) ? {...x, 'value': true} : x )	);
		}else if(dates.start!=='' && dates.end!==''){
			setDates({...dates, 'start':val, 'end': ''})
			let tmp = [...vals]

			tmp = tmp.map(x=> x.id.toString() === (val.getMonth() + 1).toString() ? {...x, 'value': true} : {...x, 'value': false})
			setVals(tmp);
			setFirstSlct(val.getMonth() + 1)
		}
	} 	 	
	
	const handleClear=() => {
		setFirstSlct(0);
		setVals(vals.map(x => x.value ? {...x, 'value': false} : x) );
		setDates({...dates, 'start':'', 'end': ''})
	}
	
	const handleClose=()=>{
		if(dates.start!=='' && dates.end!==''){
			props.setValuePL({...props.valuePL, 'From': dateFormat(dates.start,'mmm-yyyy'), 'To': dateFormat(dates.end,'mmm-yyyy')});
		}else if(dates.start!=='' && dates.end===''){
			props.setValuePL({...props.valuePL, 'From': dateFormat(dates.start,'mmm-yyyy'), 'To': dateFormat(dates.start,'mmm-yyyy')});	 
		}
	}
	
	
	let n = new Date();
	
	const formatWeekSelectLabel = (date, invalidLabel) => {
    return props.valuePL.From==='' ? '' : dateFormat(props.valuePL.From, 'mmm-yyyy').toString().concat(' - ').concat(dateFormat(props.valuePL.To, 'mmm-yyyy'));
  };
	
	return (
				<ThemeProvider theme={materialTheme}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker 
								autoOk={false}
        						views={["year", "month"]}
								variant="dialog"
								cancelLabel={false}
								clearable
								label="From - To"
								value={props.valuePL.From}
								onChange={date=>handleChange(date)}
								onOpen={handleClear}
								onMonthChange={date => aaa(date)}
								onClose={handleClose}
								//initialFocusedDate={new Date(dateFormat(value.From, "yyyy-mm"))}
								minDate={new Date(	(n.getFullYear()-3).toString().concat("-").concat('01').concat("-").concat('01')	)}
								maxDate={new Date(	(n.getFullYear()+3).toString().concat("-").concat('12').concat("-").concat('15')	)}
								fullWidth
								onYearChange={date => setVals(	vals.map(x=> ({...x, 'value': false}))	)}
								labelFunc={date=>formatWeekSelectLabel(date)}
							
							/>
					</MuiPickersUtilsProvider>
				</ThemeProvider>	
			
    );
    };

export default MRangePicker;


