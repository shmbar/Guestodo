import { v4 as uuidv4 } from 'uuid';

const dateFormat = require('dateformat');	

export const formValidation = (value, arrFields) =>{

	let fields=arrFields;
	let tmpTF=true;
	
	for(let i=0; i<fields.length; i++){
		if( value[fields[i]]==='' || value[fields[i]]===null){
			 tmpTF=false; break;
		 }
	}
	
 
	   for(let i=0; i<value.Payments.length; i++){
		if( ( value.Payments[i]['P']===''  && value.Payments[i]['Date']!==null) || 
		  (value.Payments[i]['P']!=='' && value.Payments[i]['Date']===null)){
				 tmpTF=false; break;
			}
		}
  
	
	return tmpTF;
}

export const checkDates = (settings, value) =>{
	
	let moshe = settings.apartments.filter(x => {
			return (x.PrpName=== value.PrpName && x.id===value.AptName) && x;
		})[0].StartDate
	
	return (dateFormat(moshe,'yyyy-mm-dd')<=dateFormat(value.ChckIn,'yyyy-mm-dd')) ? true: false;
}

export const delEmptyPaymentS = (pmts) => {
	let tmpPmnts = pmts.filter(x=> (x.P!=='' && x.Date!==null) && x );
	tmpPmnts = tmpPmnts.length===0 ? [{P:'', Date:null, PM:'', id : uuidv4() }]	: tmpPmnts;
	return tmpPmnts;
}
