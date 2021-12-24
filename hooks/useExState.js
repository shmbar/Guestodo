import {useState} from 'react';
import {paymentStatus} from '../functions/functions.js';


	const dateFormat = require('dateformat');	

const useExState = () =>{
	
	const [exDataPrp, setExDataPrp] = useState({'exData': [], 'pmnts':[]});
	const [exDataC, setExDataC] = useState([]);
	const [value, setValue] = useState({From:null, To: null});
	const [displayDialog,setDisplayDialog]=useState(false);
	const [snackbar, setSnackbar] = useState(false);
	const [redValid, setRedValid] = useState(false);
//	const [valueRec, setValueRec] = useState({startDate: null});
	const [recStart, setRecStart] = useState(null)
	const [recEnd, setRecEnd] = useState(null)
	
return {
	exDataPrp, setExDataPrp,
	exDataC, 	setExDataC,
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
	//valueRec, setValueRec,
	recStart, setRecStart,
	recEnd, setRecEnd,
	handleChange: (e, val) => {
		if (e.target.name==='Amnt') {	
		 		 setValue({...value, [e.target.name]: e.target.value,
					 'BlncExp': +(e.target.value-value.TtlPmnt),
					 'PmntStts': paymentStatus(value.TtlPmnt, +e.target.value),
					'ExpAmntWthtoutVat': value.Vat===false ?  +e.target.value:
						+e.target.value/(1+parseFloat(val)/100) }); 
		
		} else if(e.target.name==='ExpType'){
			setValue({...value, [e.target.name]: val.filter(x=> x.item===e.target.value)[0]['id'], 'vendor': '' });
		}else if (e.target.name==='AptName'){	
			setValue({...value, [e.target.name]:e.target.value!=='All' ? val.filter(x=> x.AptName===e.target.value)[0]['id'] : 'All' });
		}else {
			setValue({...value, [e.target.name]:e.target.value });
		}
	},
	handleChangePmnts: (e, id, settings) => {
			let rowNum=id;
			let newVal=[...value.Payments];
			newVal[rowNum]={...newVal[rowNum],[e.target.name]:
							e.target.name!=='PM' ? e.target.value :settings.pmntMethods.filter(x=> x.item===e.target.value)[0]['id'] };
			let TotalPmnt = newVal.map(x=> +x.P).filter(x=> x>0)
			.reduce((a, b) => a + b, 0);

			setValue({...value,'Payments':newVal, 'TtlPmnt':TotalPmnt,
					  'BlncExp': +value.Amnt - +TotalPmnt, 'PmntStts': paymentStatus(TotalPmnt, value.Amnt) });
	},
	handleChangeD: (name,val) =>{
		if(val===null){
		 	setValue({...value, [name]:null });
		}else{						
			setValue({...value, [name]: name==='AccDate' ? dateFormat(val,'01-mmm-yyyy'): dateFormat(val,'dd-mmm-yyyy')});
		}
	},	
	handleChangeTrueFalse: (name,vat) => e => {
		if(name==='Vat'){
			setValue({ ...value, [name]: e.target.checked,
			 		'ExpAmntWthtoutVat':  
			 		e.target.checked===false ?  +value.Amnt :
			 		+value.Amnt/(1+parseFloat(vat)/100)
			 	 });
		} else if(name==='recCost'){
   	 		setValue({ ...value, [name]: e.target.checked })
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

export default useExState;