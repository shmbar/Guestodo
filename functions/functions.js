import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/analytics'
import { v4 as uuidv4 } from 'uuid';

import config from '../firebase.js';

firebase.initializeApp(config[0]);

// Retrieve the database.
let db = firebase.firestore();
const dateFormat = require('dateformat');

/////////////////////////////////////////////////////

export const readDatSettings = async (uidCollection, collection)=>{
   const snapshot = await db.collection(uidCollection).doc('data').collection(collection).get()
    return snapshot.docs.map(doc => doc.data());
}

//////////////////////////////////////

export const addDataSettings = (uidCollection, collection, doc, data)=>{
	
	return db.collection(uidCollection).doc('data').collection(collection).doc(doc).set(data)
		.then(()=> {
		return true;
		})
		.catch(error=> {
			console.error("Error writing document: ", error);
		});
	
};


export const addRecurringExpense = (obj)=>{
	
	return db.collection('RecurringCosts').doc(obj.recTransaction).set(obj)
		.then(()=> {
		return true;
		})
		.catch(error=> {
			console.error("Error writing document: ", error);
		});
	
};
/////////////////////////////////////////////////
export const getRecurringExpense = (obj)=>{
	
	return db.collection('RecurringCosts').doc(obj.recTransaction).get()
		.then((doc) => {
   			return doc.data();
	})
   .catch((error) => {
    console.log("Error getting document:", error);
	});
};

////////////////////////////////////////////////

export const readRecurringExpense = async (uidCollection)=>{
   const snapshot = await db.collection('RecurringCosts').get()
    return snapshot.docs.map(doc => doc.data()).filter(x=> x.uidCollection===uidCollection);
}

//////////////////////////////////////////////////

export const delRecurringExpense = (obj)=>{
	
	return db.collection('RecurringCosts').doc(obj.recTransaction).delete()
	.then(()=> {
    return true;
	}).catch(error=> {
    console.error("Error removing document: ", error);
});
	
};



///
export const getNewTR = async(uidCollection, collection, document, id)=>{
	
	const increment = firebase.firestore.FieldValue.increment(1);
	const storyRef = await db.collection(uidCollection).doc('data').collection(collection).doc(document)

	await storyRef.update({ [id]: increment });

	const doc = await storyRef.get();
	  return  doc.data()[id];

	/* const tmpTR = await db.collection(uidCollection).doc('data').collection(collection).doc(document).get()
	.then(async(doc) => {

		let nextVAL = doc.exists && Object.keys(doc.data()).includes(id) ? doc.data()[id] + 1 : 1;
		doc.exists ? await updateField(uidCollection, collection, document, id, nextVAL ) : await addDataSettings(uidCollection, collection, document, {[id] : nextVAL})	
   		return nextVAL;
	})
	
	return tmpTR; */
	
};


////////////////////////////////////////////////// for settings
export const updateField = (uidCollection, collection, doc, id, val)=>{
	db.collection(uidCollection).doc('data').collection(collection).doc(doc).update({ [id]:val }); //set numbers of shows settings
};

////////////////////////////////////////// for settings
export const delField = async (uidCollection, collection, doc, id)=>{
	 await db.collection(uidCollection).doc('data').collection(collection).doc(doc).update({ [id]: firebase.firestore.FieldValue.delete() });
};

///////////////////////////////////////////////

export const readDataPerPropertyDates = (uidCollection, collection, property, year, month)=>{   //read reservations and expenses
	
	const allY = month!==null && month!==12 ? false : true;

	return 	db.collection(uidCollection).doc('alldata').collection(collection + '_' + year).where('PrpName', "==", property)
			.where(allY ? 'PrpName' : 'm', '==', allY ? property : dateFormat(new Date(year, month, 1), "mm")).get()
			.then(snapshot => {
					snapshot.empty && console.log('No matching documents');
					return !snapshot.empty ? snapshot.docs.map(doc=>doc.data()) : [];
			})
			  .catch(err => {
				console.log('Error getting documents', err);
			  })
	};

/////////////////////////////////////////////////////////

export const readDataMultiPropertyDates = async(uidCollection, collection, properties, year, month)=>{   //read reservations and expenses
	
	return 	await db.collection(uidCollection).doc('alldata').collection(collection + '_' + year).where('PrpName', 'in', properties)
			.where('m', '==', dateFormat(new Date(year, month, 1), "mm")).get()
			.then(snapshot => {
					snapshot.empty && console.log('No matching documents');
					return !snapshot.empty ? snapshot.docs.map(doc=>doc.data()) : [];
			})
			  .catch(err => {
				console.log('Error getting documents', err);
			  })
	};
////////////////////////////////////////////////////////////////////////

export const readDataPropsDatesRange= (uidCollection, collection,properties, From, To)=>{  ////PL and Cash Flow Table

	return properties.length ? db.collection(uidCollection).doc('alldata').collection(collection + "_" + From.slice(0,4)).where('PrpName', 'in', properties).get()
	  .then(snapshot => {
		return snapshot.docs.map(doc=> 
		 (dateFormat(doc.data()['m'], "mm")>=From.substr(From.length - 2) && dateFormat(doc.data()['m'], "mm")<=To.substr(From.length - 2)) ? doc.data(): null )
		.filter(q=> q!==null)
	  })
	  .catch(err => {
		console.log('Error getting documents', err);
	  }): [];
	
};

///////////////////////////////////////////////

export const readDataPerFundVAT = (uidCollection, collection, fund, year) =>{ //Vat
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).where("Fund", "==", fund).get()
	  .then(snapshot => {
		return snapshot.docs.map(doc=>  doc.data())
		})
	  .catch(err => {
		console.log('Error getting documents', err);
	  });
};
///////////////////////////////////////////////

export const readDataPerFundCashFlow = (uidCollection, collection, fund, year, month) =>{ //Money transfer
	const allY = month!==null && month!==12 ? false : true;
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).where("Fund", "==", fund)
		.where(allY ? 'Fund' : 'm', '==', allY ? fund : dateFormat(new Date(year, month, 1), "mm")).get()
	  .then(snapshot => {
		return snapshot.docs.map(doc=>  doc.data())
		})
	  .catch(err => {
		console.log('Error getting documents', err);
	  });
};

///////////////////////////////////////////////

export const readDataPerOwner = (uidCollection, collection, owner, year, month) =>{ //Other income owner
	const allY = month!==null && month!==12 ? false : true;
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).where("owner", "==", owner)
		.where(allY ? 'owner' : 'm', '==', allY ? owner : dateFormat(new Date(year, month, 1), "mm")).get()
	  .then(snapshot => {
		return snapshot.docs.map(doc=>  doc.data())
		})
	  .catch(err => {
		console.log('Error getting documents', err);
	  });
};

///////////////////////////////////////////////

export const readDataDates = (uidCollection, collection, year, month) =>{

	const allY = month!==null && month!==12 ? false : true;
	
	if(!allY){
		return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year)
			.where('m', '==', dateFormat(new Date(year, month, 1), "mm")).get()
		  .then(snapshot => {
			return snapshot.docs.map(doc=>  doc.data())
			})
		  .catch(err => {
			console.log('Error getting documents', err);
		  });
	}else{
		return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).get()
		  .then(snapshot => {
			return snapshot.docs.map(doc=>  doc.data())
			})
		  .catch(err => {
			console.log('Error getting documents', err);
		  });
		
	}
};
///////////////////////////////////////////////
export const addData = (uidCollection, collection, year, data)=>{
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).doc(data.Transaction).set(data)
		.then(()=> {
		return true;
		})
		.catch(error=> {
			console.error("Error writing document: ", error);
		});

	}

///////////////////////////////////////////////
export const addMsg = (doc, data)=>{
	
	return db.collection('messages').doc(doc).set(data)
		.then(()=> {
		return true;
		})
		.catch(error=> {
			console.error("Error writing document: ", error);
		});

	}

///////////////////////////////////////////////////
export const readData = (uidCollection, collection, year, Transaction)=>{
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).doc(Transaction).get()
		.then(doc => {
		return doc.data();
  		})
		.catch(error=> {
			console.error("Error writing document: ", error);
		});

	}
	
///////////////////////////////////////////////////
export const delData = (uidCollection, collection, year, transaction)=>{
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).doc(transaction).delete()
	.then(()=> {
    return true;
	}).catch(error=> {
    console.error("Error removing document: ", error);
});
	
};

/////////////////////////////////////////////////////////
	
export const Login =async(email, password)=>{
	return await firebase.auth().signInWithEmailAndPassword(email, password);
}

export const LogoutFromSystem =async(email, password)=>{
	await firebase.auth().signOut();
}

////////////////////////////////////////////////////////
  
export const readDataIncomeCompany = (uidCollection, collection, From, To)=>{  //for Vat calculation in company
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + From.slice(0,4)).where('ExpType', "==", 'Management commission').get()
	  .then(snapshot => {
		return snapshot.docs.map(doc=> 
		  (dateFormat(doc.data()['m'], "mm")>=From.substr(From.length - 2) && dateFormat(doc.data()['m'], "mm")<=To.substr(From.length - 2)) ? doc.data(): null )
		.filter(q=> q!==null)
	  })
	  .catch(err => {
		console.log('Error getting documents', err);
	  });
	
};

////////////////////////////////////////////////////////

export const readDataIncExpCompany = (uidCollection, collection, From, To)=>{  //for Vat calculation in company  - expense company and other income company
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + From.slice(0,4)).get()
	  .then(snapshot => {
		return snapshot.docs.map(doc=> 
		  (dateFormat(doc.data()['m'], "mm")>=From.substr(From.length - 2) && dateFormat(doc.data()['m'], "mm")<=To.substr(From.length - 2)) ? doc.data(): null )
		.filter(q=> q!==null)
	  })
	  .catch(err => {
		console.log('Error getting documents', err);
	  });
	
};
///////////////////////////////////////////////////////////////
export const readDataDashbordCompany = (uidCollection, collection, year, month) =>{

	const allY = month!==null && month!==12 ? false : true;
	
	if(!allY){
		return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).where('ExpType', "==", 'Management commission')
			.where('m', '==', dateFormat(new Date(year, month, 1), "mm")).get()
		  .then(snapshot => {
			return snapshot.docs.map(doc=>  doc.data())
			})
		  .catch(err => {
			console.log('Error getting documents', err);
		  });
	}else{
		return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).where('ExpType', "==", 'Management commission').get()
		  .then(snapshot => {
			return snapshot.docs.map(doc=>  doc.data())
			})
		  .catch(err => {
			console.log('Error getting documents', err);
		  });
		
	}
};


export const idToItem=(arr, id , item)=>{

	let tmp = arr!=null ? arr.filter(x=> x.id===id)[0]: null;
	tmp = tmp==null ? '' : tmp[item]
	return tmp
}

export const itemToId=(arr, val )=>{
	let tmp = arr.filter(x=> x.item===val)[0];
	tmp = tmp==null ? '' : tmp['id']
	return tmp
}


export const convId2Item = (arr,list, settings)=>{//(rcData.prp, 'PrpName', 'AptName','RsrvChn', 'PM')
	
	let newArr = arr.map(x=>	{

		let tmpObj={};
		for(let z of list){
			if(z==='PrpName'){
				tmpObj={...tmpObj, 'PrpName' : settings.properties.filter(y=> y.id===x.PrpName)[0]['PrpName']}
			}else if(z==='AptName'){
				tmpObj={...tmpObj, 'AptName' : x.AptName!=='All'? settings.apartments.filter(y=> y.id===x.AptName)[0]['AptName'] : x.AptName};
		 	}else if(z==='RsrvChn'){
				tmpObj={...tmpObj, 'RsrvChn' : settings.channels.filter(y=> y.id===x.RsrvChn)[0]['RsrvChn']}; 
			}else if(z==='ExpType'){
				tmpObj={...tmpObj, 'ExpType' : (x.ExpType==='Channel advance commission' || x.ExpType==='Management commission') ?
							x.ExpType: (idToItem(settings.exType, x.ExpType,'item') || idToItem(settings.exTypeCompany, x.ExpType,'item'))}; 
			}else if(z==='vendor'){
				tmpObj={...tmpObj, 'vendor' : (x.ExpType!=='Channel advance commission') ? x.vendor : idToItem(settings.channels, x.vendor, 'RsrvChn')}; 
			}else if(z==='VendChnnl'){
				let tmp	=	x.ExpInc==='Extra Revenue' ? (idToItem(settings.incType, x.VendChnnl, 'item') || idToItem(settings.incTypeCompany, x.VendChnnl, 'item')): 
											(x.ExpInc==='Channel advance commission' || x.ExpInc==='Guest Payment') ?
											idToItem(settings.channels, x.VendChnnl, 'RsrvChn' ) :  (x.ExpInc==='Withdrawal' || x.ExpInc==='Deposit') ?
											(idToItem(settings.owners, x.VendChnnl, 'item' ) || x.VendChnnl ): x.ExpInc==='Management commission' ? 
											(idToItem(settings.properties, x.VendChnnl, 'PrpName' )  || x.VendChnnl) : x.VendChnnl;
				
				tmpObj={...tmpObj, 'VendChnnl' : tmp}
			}else if(z==='ExpInc'){
		//		console.log(x)
				tmpObj={...tmpObj, 'ExpInc' : (x.Transaction.substring(0,2)==='EX' && x.ExpInc!=='Management commission' && x.ExpInc!=='Channel advance commission' && x.ExpInc!=='Channel Commission') ?
											(idToItem(settings.exType, x.ExpInc, 'item' ) || idToItem(settings.exTypeCompany, x.ExpInc, 'item' )) :	x.ExpInc}
			}else if(z==='incType'){
				tmpObj={...tmpObj, 'incType' : (idToItem(settings.incType, x.incType,'item') || idToItem(settings.incTypeCompany, x.incType,'item'))}; 
			}else if(z==='PM'){
				tmpObj={...tmpObj, 'PM' : idToItem(settings.pmntMethods, x.PM,'item')};
			}else if(z==='TtlRsrvWthtoutVat'){
			tmpObj={...tmpObj, 'TtlRsrvWthtoutVat' : +(+x.TtlRsrvWthtoutVat).toFixed(2)};
			}else if(z==='RsrvAmnt'){
			tmpObj={...tmpObj, 'RsrvAmnt' : +(+x.RsrvAmnt).toFixed(2)};
			}else if(z==='TtlPmnt'){
			tmpObj={...tmpObj, 'TtlPmnt' : +(+x.TtlPmnt).toFixed(2)};
			}else if(z==='IncAmntWthtoutVat'){
			tmpObj={...tmpObj, 'IncAmntWthtoutVat' : +(+x.IncAmntWthtoutVat).toFixed(2)};
			}else if(z==='ExpAmntWthtoutVat'){
			tmpObj={...tmpObj, 'ExpAmntWthtoutVat' : +(+x.ExpAmntWthtoutVat).toFixed(2)};
			}else if(z==='TtlPmnt'){
			tmpObj={...tmpObj, 'TtlPmnt' : +(+x.TtlPmnt).toFixed(2)};
			}	
			
		}
		
	return 	{...x,...tmpObj}

	})
	
	return newArr;
}

export const addComma = (nStr) => {
		 nStr += '';
		 var x = nStr.split('.');
		 var x1 = x[0];
		 var x2 = x.length > 1 ? '.' + x[1] : '';
		 var rgx = /(\d+)(\d{3})/;
		 while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1,$2'); 
		 }
		 return (x1 + x2);
}

export const Num2=(x)=>{
	return x!=='' ? x===0 ? x :addComma(x.toFixed(2)) : ''
}

export const addCommas = (x) =>{
	var parts = Math.round(x).toString().split('.');
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getUnique = (arr, comp) => {
			  const unique = arr
				   .map(e => e[comp])
				 // store the keys of the unique objects
				.map((e, i, final) => final.indexOf(e) === i && i)
				// eliminate the dead keys & store unique objects
				.filter(e => arr[e]).map(e => arr[e]);
			   return unique;
}

export const addSettingsBatch = (uidCollection,obj, vat)=>{
	let batch = db.batch();
	for(let set in obj){ 
		let docRef = db.collection(uidCollection).doc('data').collection('settings').doc(set==='CompDtls' ?  'companyDetails' : set);
		batch.set(docRef, 	{[set] : set!=='vat' ? obj[set] :	vat==='' ? '0%' : vat.concat('%')});
	}
	
	batch.commit()
	
}


export const addDataBatch = (Obj /*, collection, data*/)=>{
	let batch = db.batch();

	for(var property in Obj){ //loop through collections/sheet names in Excel
		let collectionName = property;
		let collectionData = Obj[property]
	
			collectionData.forEach((doc) => { //loop through documents in collection
				let docRef = db.collection(collectionName).doc(doc.Transaction); //automatically generate unique id
				batch.set(docRef, doc);
			});
  		
	}
	batch.commit()
	console.log('Done Uploading')
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
export const checkAvailableSlot = async(uidCollection, apt, Transaction, startD, endD)=>{ //check aso when year changes
	
	let existedArray=[]
	let tmppDate = new Date(endD);
	let prevDay = tmppDate.setDate(tmppDate.getDate() - 1);
	
	for (let y = dateFormat(startD,"yyyy"); y <= dateFormat(prevDay,"yyyy"); y++) {
		const data = await db.collection(uidCollection).doc('slots').collection(y.toString()).doc(apt).get()
		existedArray = data.exists ? {...existedArray, ...data.data()} : existedArray;
	}

		let isSlotTaken;
		if (existedArray.length===0){ // document doesn't exist
			isSlotTaken=false; //slots is available
		}else{  //document exist
			const existedArrayDates=  Object.keys(existedArray);
			let newArr=[]; // array reservation dates
		
			for (let d = new Date(dateFormat(startD,"yyyy"), dateFormat(startD,"mm") - 1, dateFormat(startD,"dd")); d <= new Date(dateFormat(prevDay,"yyyy"), dateFormat(prevDay,"mm") -1,
						  dateFormat(prevDay,"dd")); d.setDate(d.getDate() + 1)) {
				newArr.push(dateFormat(new Date(d),"ddmmyyyy")	);
			}
			
			let tmpdata = existedArrayDates.filter(value => newArr.includes(value)); //get the array of the intersected dates
				
			if(	tmpdata.length > 0 && tmpdata.length!==1){ //there is an intersection of two dates arrays , check if first array includes transaction ID
				let tmp1=false;
				for (let i in tmpdata){
					if(	existedArray[tmpdata[i]]!==Transaction /*&& tmpdata[i]!== dateFormat(startD,"ddmmyyyy") && tmpdata[i]!== dateFormat(endD,"ddmmyyyy")*/){ //update of the reservation
							tmp1=true; //slot is taken
							break;
					}
						// The first day and the last day can be intersected as the check in is in the evening and checkout is in the morning
				}
				isSlotTaken = tmp1;
			}else if(tmpdata.length===1 && existedArray[tmpdata[0]]!==Transaction 	/*&& 
					 (tmpdata.includes( dateFormat(startD,"ddmmyyyy"))|| tmpdata.includes( dateFormat(prevDay,"ddmmyyyy"))) */	){ 
				isSlotTaken= true		//slots are taken
			}else{				
				isSlotTaken= false		//slots are available
			}
		}

   		return isSlotTaken;
};

export const isSlotAvailale = async(uidCollection, apt, startD)=>{ 
	
	let tmppDate = new Date(startD);
	let prevDay = tmppDate.setDate(tmppDate.getDate() - 1);
	

	let docTmp = await db.collection(uidCollection).doc('slots').collection(dateFormat(prevDay,"yyyy").toString()).doc(apt).get()
	
	.then(async(doc) => {
	
		let tmp =  doc.exists && Object.keys(doc.data()).includes(dateFormat(prevDay,"ddmmyyyy") )? true: false;
		return tmp===true ? doc.data()[dateFormat(prevDay,"ddmmyyyy")]: 'available'
	});
   		return docTmp;
};



export const addNewSlotDoc = async(uidCollection, apt, year, data)=>{

	return  await db.collection(uidCollection).doc('slots').collection(year).doc(apt).set(data)
				.then(()=> {
				return true;
				})
				.catch(error=> {
					console.error("Error writing document: ", error);
				});	
	
};


export const addSlots = async(uidCollection, apt,transaction, startD, endD)=>{ //check aso when year changes

	let tmppDate = new Date(endD);
	let prevDay = tmppDate.setDate(tmppDate.getDate() - 1);
	
	for (let y = dateFormat(startD,"yyyy"); y <= dateFormat(prevDay,"yyyy"); y++) {
		let tmp={};
		for (let d = new Date(dateFormat(startD,"yyyy"), dateFormat(startD,"mm") - 1, dateFormat(startD,"dd")); d <= new Date(dateFormat(prevDay,"yyyy"), dateFormat(prevDay,"mm") -1,
				  dateFormat(prevDay,"dd")); d.setDate(d.getDate() + 1)) {
			if(dateFormat(d,"yyyy")===y.toString()){
				tmp = {...tmp, [dateFormat(new Date(d),"ddmmyyyy")]: transaction }
			}
		}
			
				await db.collection(uidCollection).doc('slots').collection(y.toString()).doc(apt).get()
				.then(async(doc) => {
							let newDatesArr ={...doc.data(), ...tmp}
							await addNewSlotDoc(uidCollection, apt, y.toString(), newDatesArr)
					return ;
				})
	
	}
	
};


export const updateSlots = async(uidCollection, oldApt, apt,transaction, startD, endD, startDold , endDold)=>{ 

	await deleteSlots(uidCollection, oldApt, transaction, startDold, endDold)
	await setTimeout(()=>{  addSlots(uidCollection, apt,transaction, startD, endD) }, 1000);

};


export const deleteSlots = async(uidCollection, apt, transaction, startD, endD) => {

	let tmppDate = new Date(endD);
	let prevDay = tmppDate.setDate(tmppDate.getDate() - 1);
	

	for (let y = dateFormat(startD,"yyyy"); y <= dateFormat(prevDay,"yyyy"); y++) {

	await db.collection(uidCollection).doc('slots').collection(y.toString()).doc(apt).get()
		
	.then(async(doc) => {
	
				//Delete the slots. 
				let batch = db.batch();
				let path = db.collection(uidCollection).doc('slots').collection(y.toString()).doc(apt);
				
				for (let i in doc.data()){
					if(doc.data()[i]===transaction) batch.update( path, { [i] :  firebase.firestore.FieldValue.delete()} )	
				}
	
				batch.commit();
		
   		return;
	})
	}
};
/////////////////////////////////////////////////////////////////
export const readDataCashFlow = (uidCollection, collection, fund, year, start, end) =>{ //CashFlow Table
	
	return db.collection(uidCollection).doc('alldata').collection(collection + "_" + year)
		.where('Date' , '>=', start).where('Date' , '<=', end)
		.get().then(snapshot => {
		return fund!==null ? snapshot.docs.map(doc=>  doc.data()).filter(x=>x.Fund===fund) : 
					snapshot.docs.map(doc=>  doc.data());
		})
	  .catch(err => {
		console.log('Error getting documents', err);
	  });
	
};

//////////////////////////////////////////////////////////////////////////////////////
export const readDataMoneyTransferforCashFlow = (uidCollection, collection,fund, year, start, end) =>{
	return fund!==null ? db.collection(uidCollection).doc('alldata').collection(collection + "_" + year) //cashFlow
		.where('Fund' , '==' , fund).get().then(snapshot => {
		return snapshot.docs.map(doc=>  doc.data()).filter(x=> (new Date(x.TransactionDate)>=start && new Date(x.TransactionDate)<=end))
		}) :  //company cashFlow
		db.collection(uidCollection).doc('alldata').collection(collection + "_" + year).get().then(snapshot => {
		return snapshot.docs.map(doc=>  doc.data()).filter(x=> (new Date(x.TransactionDate)>=start && new Date(x.TransactionDate)<=end))
		}) 
	
};

/////////////////////////////////////////////////////////////////////////////////////


export const addDPaymentsBatch = (uidCollection,collection,pmnts )=>{
	let batch = db.batch();

	for (let i in pmnts){
		let year = dateFormat(pmnts[i].Date,'yyyy')
		let docRef = db.collection(uidCollection).doc('alldata').collection(collection + '_' + year).doc(pmnts[i].id);
		if(pmnts[i].P!=='')batch.set(docRef, pmnts[i]);
	}
	
	batch.commit()
	console.log('Done Uploading')
}

//////////////////////////////////////////////////////////////////////////////////////////////

export const delDPaymentsBatch = (uidCollection,collection,pmnts )=>{
	let batch = db.batch();

	for (let i in pmnts){
		let year = dateFormat(pmnts[i].Date,'yyyy')
		let docRef = db.collection(uidCollection).doc('alldata').collection(collection + '_' + year).doc(pmnts[i].id);
		batch.delete(docRef);
	}
	
	batch.commit().then(() => {
    	console.log('Done Deleting')
	});
	
}

///////////////////////////////////////////////////////////////////
export const readDataSlots = (uidCollection, collection, year, month, apt)=>{
	
	const allY = month!==null && month!==12 ? false : true;
	let dates=[];
	let rc=[];
	
	return db.collection(uidCollection).doc('slots').collection(year.toString()).doc(apt).get()
	.then(doc => {
		if(!allY){
			 if(doc.data()!=null){
				 dates=Object.keys(doc.data()).filter(x=> x.substring(2,4)*1 === month+1)
				 rc=Object.values(doc.data()).filter(x=> x.substring(2,4)*1 === month+1)//.map(x=> x.substring(0, x.indexOf("_")))
			 } 
		}else{
			 if(doc.data()!=null){
				 dates=Object.keys(doc.data())
				 rc=Object.values(doc.data())//.map(x=> x.substring(0, x.indexOf("_")))
			 }
		}
		
		return {dates,rc};
		
  		})
		.catch(error=> {
			console.error("Error writing document: ", error);
		});

	}
	
///////////////////////////////////////////////////
export const paymentStatus = (payments, amount ) =>{
	let result = +payments / +amount;   //payments

	switch(true) {
		case result===0:
			  return 'Unpaid';
			//break;
		case ( result >0 && result<=0.999):
			  return 'Partially paid';
			//break;
		case ( result>0.999):
			  return 'Fully paid';
			//break
		default:
		  return null;
		}
}


/*
export const setID=async(uidCollection, collection)=>{
	
	let batch = db.batch();
	let arr = [];
	
	var citiesRef = db.collection(uidCollection).doc('alldata').collection(collection);
		console.log('running Id')
	
	await  citiesRef.get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
			let Payments =  doc.data().Payments;
				if(Payments!==undefined){
					arr.push(doc.data())
				}
				
		});
    });
	
	console.log(arr.length)
	
	
	for(let i in arr){
	//for(let i=0; i<=450; i++ ){
	//for(let i=450; i<=arr.length-1; i++ ){
	//	for(let i=900; i<=arr.length-1; i++ ){
	//		for(let i=1350; i<=1800; i++ ){
	//			for(let i=1800; i<=2250; i++ ){
	//				for(let i=2250; i<=arr.length-1; i++ ){
	
	
		let Payments =  arr[i].Payments;
		
		if(Payments!==undefined){
					for (let k in Payments){

						if(Payments[k].id===undefined){
							let pmnt = {...Payments[k], 'id': uuidv4()}
							Payments[k] = pmnt
						}
					}

				 let docRef = await db.collection(uidCollection).doc('alldata').collection(collection).doc(arr[i].Transaction);
				 await batch.update(docRef, { 'Payments': Payments });
			
				}
	}
	
	
	// Commit the batch
	batch.commit().then(() => {
    console.log('Done')
});
	
}


export const setPmnt = async(uidCollection, collection, settings, pmntEnt)=>{
	
	let batch = db.batch();
	let arr = [];
	let arr1 = [];
	var citiesRef = db.collection(uidCollection).doc('alldata').collection(collection);
	
	await  citiesRef.get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
				arr.push(doc.data())
		});
	});		
			
			
		console.log(arr.length)
	
	
	for(let i in arr){	
	
		let Payments =  arr[i].Payments;
		
			if(Payments!==undefined){
					for (let k in Payments){

						if(Payments[k].P!==''){
							 //--------//Payments Owner
							//RC 
							let pmnt ={...Payments[k], 'RsrvChn': arr[i].RsrvChn, 'Date': new Date(Payments[k].Date), 'Transaction': arr[i].Transaction,
								'Fund': settings.properties.filter(x=>x.id===arr[i].PrpName)[0]['Fund'], ChnPrcnt: arr[i].ChnPrcnt || '0', Vat: arr[i].Vat,
									   ChnlTRex: arr[i].ChnlTRex!==undefined ? arr[i].ChnlTRex : ''}   	
						
							//EX
							
							
					//		let tmp1 = settings.properties.filter(x=>x.id===arr[i].PrpName).length===0 ? '':
						//	settings.properties.filter(x=>x.id===arr[i].PrpName)[0]['Fund']
							
					//		let pmnt = {...Payments[k], 'ExpInc': arr[i].ExpType,  'VendChnnl': arr[i].vendor, 'Date': new Date(Payments[k].Date), 
					//					'Transaction': arr[i].Transaction,	'Fund': tmp1}		
						
							//IO
							
						//	let pmnt = {...Payments[i], 'ExpInc': 'Extra Revenue',  VendChnnl: doc.data().incType, 'Date': new Date(Payments[i].Date),
						//				'Transaction': doc.data().Transaction,	'Fund': settings.properties.filter(x=>x.id===doc.data().PrpName)[0]['Fund']}
								
							//VaT
							
						//	let pmnt = {...Payments[k], ExpInc: 'VAT',  VendChnnl: 'VAT Payment' , Date: new Date(Payments[k].Date),
						//			'Transaction': arr[i].Transaction,	'Fund':arr[i].Fund, VatPayRtrn: arr[i].VatPayRtrn}
					
							
							// Company Income
						//	let pmnt = {...Payments[k], ExpType: 'Management commission',  'VendChnnl': settings.CompDtls.cpmName, 'Date': new Date(Payments[k].Date),
						//	'Transaction': arr[i].Transaction, 'Fund': settings.properties.filter(x=> x.id===arr[i].PrpName)[0]['Fund']}
					
							
							//------------//Company
							
							// Company Income
						//	let pmnt = {...Payments[i], ExpType: 'Management commission',  'VendChnnl':  doc.data().PrpName, 'Date': new Date(Payments[i].Date),
						//	'Transaction': doc.data().Transaction}
							
							//EX
							
						//	let pmnt = {...Payments[i], 'ExpInc': doc.data().ExpType,  'VendChnnl': doc.data().vendor, 'Date': new Date(Payments[i].Date), 
						//				'Transaction': doc.data().Transaction}	
						
							//IO
							
						//	let pmnt = {...Payments[i], 'ExpInc': 'Extra Revenue',  VendChnnl: doc.data().incType, 'Date': new Date(Payments[i].Date),
						//				'Transaction': doc.data().Transaction}
								
							//VaT
							
						//	let pmnt = {...Payments[i], ExpInc: 'VAT',  VendChnnl: 'VAT Payment' , Date: new Date(Payments[i].Date),
						//			'Transaction': doc.data().Transaction, VatPayRtrn: doc.data().VatPayRtrn}
					
							
							
							
							
							arr1.push(pmnt)
						}
					}
			};
		}
   
	console.log(arr1.length)
	
	
	for(let i in arr1){
	//		for(let i=0; i<=450; i++ ){
	//for(let i=450; i<=arr1.length-1; i++ ){
	//	for(let i=900; i<=arr1.length-1; i++ ){
	//		for(let i=1350; i<=arr1.length-1; i++ ){
	
		let year = dateFormat(arr1[i].Date, 'yyyy')
		let docRef = await db.collection(uidCollection).doc('alldata').collection(pmntEnt + '_' + year).doc(arr1[i].id);
		await batch.set(docRef, arr1[i]);
	}
	
  
	// Commit the batch
	 await batch.commit().then(() => {
    	console.log('Done')
	})    
}

//////////////////////////////////////////////////////

export const setNewRsrvCncl = async(uidCollection, collection )=>{
	
	let batch = db.batch();
	
	var citiesRef = db.collection(uidCollection).doc('alldata').collection(collection);
	let arr = [];

	await  citiesRef.get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
			arr.push(doc.data())
		});
    });
	
	console.log(arr.length)
	
	
	for(let i in arr){
	//for(let i=0; i<=450; i++ ){
	//for(let i=450; i<=arr.length-1; i++ ){
		let docRef = await db.collection(uidCollection).doc('alldata').collection(collection).doc(arr[i].Transaction);
		let newObj = {...arr[i], pStatus: !arr[i].RsrvCncl ? 'Confirmed': 'Cancelled'}
		delete newObj.RsrvCncl
		
		await batch.set(docRef, newObj);
	}
 	
	
	// Commit the batch
	 await batch.commit().then(() => {
    	console.log('Done')
	}) 
	
}
*/

export const setSets=async(uidCollection)=>{
	 const properties = await db.collection(uidCollection).doc('data').collection('settings').doc('properties').get()
   	 const vt = await db.collection(uidCollection).doc('data').collection('settings').doc('vat').get()
	let arr =[]
	let propsArr = properties.data().properties
	
	
	for(let i in propsArr){
		
		let fees = {FeeName:'', FeeType:'', FeeAmount: '', FeeModality: '', FeeDescription: '', 'id': uuidv4()}
		let taxes = {TaxName:'', TaxType:'', TaxAmount: '', TaxTypeDscrp: '', TaxModality: '', TaxDescription: '', 'id': uuidv4()};
		let Commissions={ManagCommission: propsArr[i].ManagCommission, addVat:propsArr[i].addVat==='Yes' ? true: false, inclVat:propsArr[i].inclVat==='Yes' 
						 ? true: false};
		let newObj = {...propsArr[i], 'Fees':[fees], 'Taxes': [taxes], 'Commissions': Commissions, 'VAT': vt.data().vat }
		delete newObj.ManagCommission
		delete newObj.addVat
		delete newObj.inclVat
		arr.push(newObj)
	}	
	
	
	console.log(arr)
	await db.collection(uidCollection).doc('data').collection('settings').doc('properties').set( {properties: arr})
	console.log('done')
}