import {useState} from 'react';
import {paymentStatus} from '../functions/functions.js';


	const dateFormat = require('dateformat');	
	
const useVtState = () =>{
	
	const [vtData, setVtData] = useState([]);
	const [vtDataC, setVtDataC] = useState([]);
	
	const [value, setValue] = useState();
	const [displayDialog,setDisplayDialog]=useState(false);
	const [snackbar, setSnackbar] = useState(false);
	const [redValid, setRedValid] = useState(false);
	
return {
	vtData,	setVtData,
	vtDataC, setVtDataC,
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
	setValueIncEx: (valueVatTmp, valExInput)=>{
		let newVal=[...value.Payments];
		let TotalPmnt = newVal.map(x=>+x.P).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);
	
		setValue({...value, 'valueInc': valueVatTmp, /*'valuex': valueVatTmpEx,*/ 'VatPayRtrn':
				  +valueVatTmp.Vat - +valExInput /*+valueVatTmpEx.Vat*/,
				  'BlncVat': +(+valueVatTmp.Vat - +valExInput /*+valueVatTmpEx.Vat*/
							   -TotalPmnt).toFixed(2)});
		
	},
	handleChange: (e)=>{
		let newVal=[...value.Payments];
		let TotalPmnt = newVal.map(x=>+x.P).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);
										
		setValue({...value, inputVat: e.target.value, 'VatPayRtrn':
				  +(+value.valueInc.Vat - +e.target.value).toFixed(2) ,
				  'BlncVat': +(+value.valueInc.Vat - +e.target.value - TotalPmnt).toFixed(2)});
	},
	handleChangePmnts: (e, id, settings) => {
			let rowNum=id;
			let newVal=[...value.Payments];
			newVal[rowNum]={...newVal[rowNum],[e.target.name]:
							e.target.name!=='PM' ? e.target.value :settings.pmntMethods.filter(x=> x.item===e.target.value)[0]['id'] };

			let TotalPmnt = newVal.map(x=> parseFloat(x.P)).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);

			setValue({...value,'Payments':newVal, 'TtlPmnt':TotalPmnt,
					  'BlncVat': Math.abs(value.VatPayRtrn)-TotalPmnt, 'PmntStts': paymentStatus(TotalPmnt,
					  Math.abs(value.VatPayRtrn)) });
	},
	handleChangeD: (name,val) =>{
		if(val===null){
		 	setValue({...value, [name]:null });
		}else{						
			setValue({...value, [name]: dateFormat(val,'mmmm-yyyy')});
		}
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

export default useVtState;