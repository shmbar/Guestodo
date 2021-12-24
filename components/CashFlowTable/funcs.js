const dateFormat = require('dateformat');

const pmMthd=(pmnt, pmntsSets)=>{
	return pmnt.PM!=='' ? pmntsSets.filter(x=> pmnt.PM===x.id)[0]['item'] : '-'
}



export const RC = (obj, pmntsSets)=>{

    let newObj={ExpInc:'Guest Payment', VendChnnl: obj.RsrvChn, OpDate: dateFormat(obj.Date.seconds*1000, 'dd-mmm-yyyy'), pmnt: pmMthd(obj, pmntsSets),
               Transaction: obj.Transaction, receiving: +obj.P, cost:'', balance:''}    
    return newObj;
}
 
export const EX = (obj, pmntsSets)=>{
   
    let newObj={ExpInc:obj.ExpInc, VendChnnl: obj.VendChnnl, OpDate: dateFormat(obj.Date.seconds*1000, 'dd-mmm-yyyy'), pmnt: pmMthd(obj, pmntsSets),
               Transaction: obj.Transaction, receiving:'', cost:+obj.P, balance:''}    
    return newObj;
}

export const CF = (obj, pmntsSets, name)=>{

    let newObj={ExpInc: obj.WithdrDepst, VendChnnl: obj.owner || name, OpDate: obj.TransactionDate, pmnt: obj.PM!=='' ? pmntsSets.filter(x=> obj.PM===x.id)[0]['item'] : '-',
               Transaction: obj.Transaction, receiving: obj.WithdrDepst!=='Withdrawal'? obj.Amnt:'',
                cost: obj.WithdrDepst==='Withdrawal'? obj.Amnt:'', balance:''}
    return newObj;
}


export const VT = (obj, pmntsSets)=>{
    let newObj={ExpInc: obj.ExpInc, VendChnnl: obj.VendChnnl, OpDate: dateFormat(obj.Date.seconds*1000, 'dd-mmm-yyyy'), pmnt: pmMthd(obj, pmntsSets),
               Transaction: obj.Transaction,receiving: +obj.VatPayRtrn<0? obj.P:'',
                cost: +obj.VatPayRtrn>=0? +obj.P:'', balance:''}
    return newObj;
}


export const OI = (obj, pmntsSets)=>{
    let newObj={ExpInc: obj.ExpInc, VendChnnl: obj.VendChnnl, OpDate: dateFormat(obj.Date.seconds*1000, 'dd-mmm-yyyy'), pmnt: pmMthd(obj, pmntsSets),
               Transaction: obj.Transaction, receiving: +obj.P, cost:'', balance:''}    
    return newObj;
}


export const MngPmnt=(obj, x, pmntsSets)=>{
	
    let newObj={ExpInc: obj.ExpType, VendChnnl: obj.VendChnnl, OpDate: dateFormat(obj.Date.seconds*1000, 'dd-mmm-yyyy'),  pmnt: pmMthd(obj, pmntsSets),
               Transaction: '', receiving: x==='company' ? +obj.P: '' , cost: x==='owner' ? +obj.P : '', balance:''}    

    return newObj;
}

export const setBalance=(arr, initCash)=>{
   // const num = 0//(+initCash === 0) ? '0': +initCash
    let tmp = arr;
  //  let init = {ExpInc: `Initial Cash Flow Balance`,  Transaction: '', /* ToFrom: '', OpDate: '',   Transaction: '',*/receiving:'', cost: '', balance: num}
  //  tmp.push(init)
     
    for(let i=(tmp.length-1); i>=0; i--){
        
            if(i===tmp.length-1){
                tmp[i].balance= (+tmp[i].receiving) - (+tmp[i].cost) //num
            }else{
                tmp[i].balance= (+tmp[i+1].balance) + (+tmp[i].receiving) - (+tmp[i].cost)
            }
     }
    return tmp;
    
}

export const ChnnlPmnt = (pmnt, channelCommision, vat, pmntsSets)=>{

            let cst = pmnt.Vat ? +(+pmnt.P/(1+parseFloat(vat)/100)*channelCommision).toFixed(2) : +(+pmnt.P*channelCommision).toFixed(2)

               let newObj={ExpInc:'Channel advance commission', VendChnnl: pmnt.RsrvChn, OpDate: dateFormat(pmnt.Date.seconds*1000, 'dd-mmm-yyyy'),
						   pmnt: pmMthd(pmnt, pmntsSets),
               Transaction: pmnt.ChnlTRex, receiving: '', cost: cst, balance:''}  
               return newObj;
}
