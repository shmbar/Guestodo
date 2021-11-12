import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel} from '@material-ui/core';

import {Obj} from './jsfile';
import {ObjPmnts} from './Payments'
import {ObjGstDetails} from './GstDtls'
import {ObjChannelCommission} from './ChannelCmsn'
import {ObjMngCommission} from './MngCmsn'
import {dataPtrn} from './dataPtrn'


//import {addDataBatch} from '../../functions/functions.js';


//http://beautifytools.com/excel-to-json-converter.php
// convert excell sheets to json. It can be excell consisted of many sheets to json.
// sheet name is a name of collection


//////////////////////////////////////////////
const setPayments=(objTR)=>{
	let pmntsArr=[];
	for(var property in ObjPmnts){ //loop through collections
		pmntsArr = ObjPmnts[property].filter(x=> x.Transaction===objTR)
			.map(y=> ({'P': y.P==='' ? '' : +y.P, 'Date': y.Date==null? null : y.Date, 'PM': y.PM==null ? '' : y.PM})	)
	}
	return pmntsArr;
}

//////////////////////////////////////////////

const setGstDtls=(objTR)=>{
	let dtls={};
	for(var property in ObjGstDetails){ //loop through collections
		dtls = ObjGstDetails[property].filter(x=> x.Transaction===objTR)[0]
	}
	let newDtls = {'Passport' : dtls.Passport,'addrss': dtls.addrss ,'adlts': dtls.adlts, 'chldrn':dtls.chldrn, 'cntry':dtls.cntry,
				   	'email':dtls.email, 'mobile':dtls.mobile, 'phone':dtls.phone }
	return newDtls;
}

//////////////////////////////////////////////

const setObj=(O)=>{
	let D=[];
	for(let p in O){ //loop through collections/sheet names in Excel
		let colData = O[p]
				
			colData.forEach((doc,i) => { //loop through documents in collection
				
				 let newObject={}
				 for(var prprty in doc){	//loop through properties in object
				 		let objKey = prprty;
				 		let objValue = doc[prprty]
			
						newObject[objKey] =	objValue==='' ? ''	:
											!isNaN(Number(objValue)) ? 	Number(objValue):
											objValue==='TRUE' ? true:
											objValue==='FALSE' ?false:  objValue
					
				 }
				 colData[i]=newObject
				 //D=[...D, newObject]
					D.push(newObject)
				
			});

  		return D;
		
	}
}

const setObjVat = (O) => {
	let D=[];
	
	for(let p in O){ //loop through collections/sheet names in Excel
		let obj = O[p];
		let valueInc = {'Vat': obj['valueInc-Vat'], 'withVat': obj['valueInc-withVat'], 'withoutVat': obj['valueInc-withoutVat']};
		let valuex = {'Vat': obj['valuex-Vat'], 'withVat': obj['valuex-withVat'], 'withoutVat': obj['valuex-withoutVat']}
		
		obj={...obj, 'valueInc': valueInc , 'valuex': valuex}
		
		delete obj['valueInc-Vat']
		delete obj['valueInc-withVat']
		delete obj['valueInc-withoutVat']
		delete obj['valuex-Vat']
		delete obj['valuex-withVat']
		delete obj['valuex-withoutVat']

		D=[...D, obj]
	}	
	return D;
}

const UploadData = () => {

const [def, setDef] = useState({'Pmnts': false, GstDtls:false, ChnlCmsn: false, MngCmsn: false, Vat: false})	
	
const handleChange = name => event => {
    setDef({ ...def, [name]: event.target.checked });
  };
	
const runUplad=()=>{
	let newDataObject={}
	
	for(let property in Obj){ //loop through collections/sheet names in Excel
		let collectionName = property;
		let collectionData = Obj[property]
				
			collectionData.forEach((doc,i) => { //loop through documents in collection
				
				let newObject={}
				for(var prprty in doc){	//loop through properties in object
						let objKey = prprty;
						let objValue = doc[prprty]
			
						newObject[objKey] =	objValue==='' ? ''	:
											!isNaN(Number(objValue)) ? 	Number(objValue):
											objValue==='TRUE' ? true:
											objValue==='FALSE' ?false:  objValue
					
				}
				if(def.Pmnts){
					newObject['Payments'] = setPayments(newObject.Transaction);
				}
				if(def.GstDtls){
					newObject['dtls'] = setGstDtls(newObject.Transaction);
				}
				
				collectionData[i]=newObject
				
				
			});
		
		collectionData = def.ChnlCmsn ? [...collectionData, ...setObj(ObjChannelCommission)] : collectionData;
		collectionData = def.MngCmsn ? [...collectionData, ...setObj(ObjMngCommission)] : collectionData;
		collectionData = def.Vat ? setObjVat(collectionData) : collectionData;
		
  		newDataObject[collectionName] = collectionData;

		
	}

	console.log(newDataObject)
//	addDataBatch(newDataObject)
}	

const createNewData=()=>{
	console.log(dataPtrn)
	//addDataBatch(newDataObject)
}

return(
	<>
	<div>
		<h4>Click only one time (if needed more, than refresh this page)</h4>
		<h5>Show console.log to verify before upload</h5>
		<Button variant="contained" color="primary" style={{margin:'30px'}} onClick={runUplad}>
  				CLick to Upload
		</Button>
		<FormControlLabel
          control={
			<Checkbox
				checked={def.Pmnts}
				onChange={handleChange('Pmnts')}
				value="Pmnts"
				inputProps={{
				  'aria-label': 'primary checkbox',
				}}
      	/>
			}
          label="Payments"
          labelPlacement="end"
        />
		<FormControlLabel
          control={
			<Checkbox
				checked={def.GstDtls}
				onChange={handleChange('GstDtls')}
				value="GstDtls"
				inputProps={{
				  'aria-label': 'primary checkbox',
				}}
      	/>
			}
          label="Guest Details"
          labelPlacement="end"
        />
		<FormControlLabel
          control={
			<Checkbox
				checked={def.ChnlCmsn}
				onChange={handleChange('ChnlCmsn')}
				value="ChnlCmsn"
				inputProps={{
				  'aria-label': 'primary checkbox',
				}}
      	/>
			}
          label="Channel Commission"
          labelPlacement="end"
        />
		<FormControlLabel
          control={
			<Checkbox
				checked={def.MngCmsn}
				onChange={handleChange('MngCmsn')}
				value="MngCmsn"
				inputProps={{
				  'aria-label': 'primary checkbox',
				}}
      	/>
			}
          label="Management Commission"
          labelPlacement="end"
        />
		<FormControlLabel
          control={
			<Checkbox
				checked={def.Vat}
				onChange={handleChange('Vat')}
				value="Vat"
				inputProps={{
				  'aria-label': 'primary checkbox',
				}}
      	/>
			}
          label="Vat"
          labelPlacement="end"
        />
		</div>
	<div>
		<Button variant="contained" color="primary" style={{margin:'30px'}} onClick={createNewData}>
  				CLick to Create new Data
		</Button>
	</div>
	</>
	
)
};

export default UploadData;