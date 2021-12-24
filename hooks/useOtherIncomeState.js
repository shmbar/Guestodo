import {useState} from 'react';
import {paymentStatus} from '../functions/functions.js';

	const dateFormat = require('dateformat');	

const useOIState = () =>{
	const [otherInc, setOtherInc] = useState([]);
	const [otherIncC, setOtherIncC] = useState([]);
	const [value, setValue] = useState({From:null, To: null});
	const [displayDialog,setDisplayDialog]=useState(false);
	const [snackbar, setSnackbar] = useState(false);
	const [redValid, setRedValid] = useState(false);

return {

	otherInc,setOtherInc,
	otherIncC, setOtherIncC,
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
	handleChange: (e, val) => {
		
		if (e.target.name==='Amnt') {	
		 		 setValue({...value, [e.target.name]: e.target.value,
					 'Blnc': +(e.target.value - +value.TtlPmnt),
					 'PmntStts': paymentStatus(value.TtlPmnt, +e.target.value),
					'IncAmntWthtoutVat': 
						value.Vat===false ?  +e.target.value:
						+e.target.value/(1+parseFloat(val)/100)	}); 
		}else if (e.target.name==='PrpName'){	
			setValue({...value, [e.target.name]: val.filter(x=> x.PrpName===e.target.value)[0]['id'] });
		}else if (e.target.name==='incType'){	
			setValue({...value, [e.target.name]: val.filter(x=> x.item===e.target.value)[0]['id'] });	
		} else {
			setValue({...value, [e.target.name]:e.target.value });
		} 
	},
	handleChangePmnts: (e, id, settings) => {
			let rowNum=id;
			let newVal=[...value.Payments];
			newVal[rowNum]={...newVal[rowNum],[e.target.name]:
							e.target.name!=='PM' ? e.target.value :	settings.pmntMethods.filter(x=> x.item===e.target.value)[0]['id'] };
			
			let TotalPmnt = newVal.map(x=> +x.P).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);

			setValue({...value,'Payments':newVal, 'TtlPmnt':TotalPmnt,
					  'Blnc': +value.Amnt - +TotalPmnt, 'PmntStts': paymentStatus(TotalPmnt, value.Amnt) });
	},
	handleChangeD: (name,val) =>{
		if(val===null){
		 	setValue({...value, [name]:null });
		}else{						
			setValue({...value, [name]: name==='AccDate' ? dateFormat(val,'01-mmm-yyyy'): dateFormat(val,'dd-mmm-yyyy')});
		}
	},	
	handleChangeTrueFalse: (name,vat) => e => {
   	 	setValue({ ...value, [name]: e.target.checked,
			 		'IncAmntWthtoutVat':  
			 		e.target.checked===false ?  value.Amnt :
			 		value.Amnt/(1+parseFloat(vat)/100) 
			 	 });
		
  	},
	handleChangeDPmnts: (name,val, id) =>{
		let rowNum=id;
		let newVal=[...value.Payments];
		
		if(val===null){
		   	newVal[rowNum]={...newVal[rowNum],[name]:null};
		}else{
			newVal[rowNum]={...newVal[rowNum],[name]:dateFormat(val,'dd-mmm-yyyy')};
		}
		
		setValue({...value,'Payments':newVal});
	}
};
};

export default useOIState;