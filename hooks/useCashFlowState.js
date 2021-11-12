import {useState} from 'react';


	const dateFormat = require('dateformat');	

const useCfState = () =>{
	
	const [cfData, setCfData] = useState([]);
	const [cfDataC, setCfDataC] = useState([]);	
	const [value, setValue] = useState(null);
	const [displayDialog,setDisplayDialog]=useState(false);
	const [snackbar, setSnackbar] = useState(false);
	const [redValid, setRedValid] = useState(false);

	
return {
	cfData,
	setCfData,
	cfDataC,
	setCfDataC,
	selectValue: rowData => { 
		setValue(rowData);
	 	setDisplayDialog(true);
	 },
 	displayDialog,
	setDisplayDialog,
	value,
	setValue,
	snackbar,
	setSnackbar,
	redValid,
	setRedValid,
	//tr,
	handleChange: (e, settings) => {

		if (e.target.name==='Amnt') {	
		 		 setValue({...value, [e.target.name]: e.target.value}); 
		}else if(e.target.name==='PM'){
				setValue({...value, [e.target.name]: settings.pmntMethods.filter(x=> x.item===e.target.value)[0]['id']	}); 
		} else {
				setValue({...value, [e.target.name]:e.target.value });
		} 
	},
	handleChangeD: (name,val) =>{
		
		if(val===null){
		 	setValue({...value, [name]:null });
		}else{						
			setValue({...value, [name]: dateFormat(val,'dd-mmm-yyyy')});
		}
	}
	};
};

export default useCfState;