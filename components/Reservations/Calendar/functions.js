import React  from 'react'; 
import './styles.css';
import {idToItem} from '../../../functions/functions.js';
import {PmntClrStatus1} from '../../../functions/setTableDt.js';

export const getCellWidth = (container,date) =>  {
	return container.current.clientWidth / new Date(date.year, date.month + 1, 0).getDate() /*+ (tfValue.substring(0, 1) - 3)*/
}

////////////////////////////////////////////////////////////////////////

export const getNights=(end,start)=>{
		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

export const getSlotWidth = (slot, cellWidth) => {
  return cellWidth * getNights(slot.ChckOut, slot.ChckIn) - 5;
};

export const getSlotWidthR = (slot, date, cellWidth) => {
  return cellWidth * getNights(new Date(date.year, date.month + 1, 0), slot.ChckIn) - 5;
};

export const getSlotWidthL = (slot, date, cellWidth) => {
  return cellWidth * getNights(slot.ChckOut, new Date(date.year, date.month, 1)) + cellWidth*0.44;
};

const findImg=(txt,y, chnnlslogo)=>{
		return	chnnlslogo.filter(x=> x.brnd===txt)[0]!==undefined ?
                chnnlslogo.filter(x=> x.brnd===txt)[0][y] :  chnnlslogo[chnnlslogo.length-1][y]
} 
 
///////////////////////////////////////////////////////////////////////////////////////////

const eventColor=(slot)=>{
	return slot.pStatus==='Confirmed' ? '#dce4ea': 'yellow';
}
export const inCalendar = (settings, slot, chnnlslogo, index) => {
	
	
  return(	<div key={index} className='inTable' style={{width: getSlotWidth(slot, 60), borderLeftColor: PmntClrStatus1(slot.PmntStts), cursor: 'cell',
				 backgroundColor: eventColor(slot) }} > 
	  			<div className='event'>
					<img src={	findImg( idToItem(settings.channels, slot.RsrvChn, 'RsrvChn'),'img', chnnlslogo)} alt={slot.RsrvChn}
						width={findImg(idToItem(settings.channels, slot.RsrvChn, 'RsrvChn'),'width', chnnlslogo)}  />
					{getSlotWidth(slot, 60)-45 > 50 &&	<span style={{width:getSlotWidth(slot, 60)-45}}>{slot.GstName}</span> }
				</div>
			</div>)
};

export const endCalendarNotLastDay = (settings, slot, chnnlslogo, index, date) => {

return	 	<div  key={index} className='inTable'  style={{ width: getSlotWidthR(slot, date, 60), borderLeftColor: PmntClrStatus1(slot.PmntStts), cursor: 'cell',
														  backgroundColor: eventColor(slot)}}>
				<div className='event'>
						<img src={	findImg( idToItem(settings.channels, slot.RsrvChn, 'RsrvChn'),'img', chnnlslogo)} alt={slot.RsrvChn}
							width={findImg(idToItem(settings.channels, slot.RsrvChn, 'RsrvChn'),'width', chnnlslogo)}  />
						{getSlotWidthR(slot,date, 60)-45 > 50 &&	<span style={{maxWidth:getSlotWidth(slot, 60)-45}}>{slot.GstName}</span> }
				</div>
				<span className='styleEnd' style={{zIndex:'-1'}}>
				</span>
			</div>
};

export const endCalendarLastDay = (settings, slot, chnnlslogo, index, date) => {

return	 	<div key={index} className='lastDaySlot' style={{width: getSlotWidthR(slot, date, 60), cursor: 'cell', backgroundColor: eventColor(slot)  }}>
				<div style={{backgroundColor:  PmntClrStatus1(slot.PmntStts)}}>
				</div>
			</div>
};

export const startCalendarNotEndFirstDay = (settings, slot, chnnlslogo, index, date) => {
 return <div  key={index} className='styleStart' style={{width: getSlotWidthL(slot, date, 60), cursor: 'cell', backgroundColor: eventColor(slot)  }}>
			<div className='eventStart'>
					<img src={	findImg( idToItem(settings.channels, slot.RsrvChn, 'RsrvChn'),'img', chnnlslogo)} alt={slot.RsrvChn}
						width={findImg(idToItem(settings.channels, slot.RsrvChn, 'RsrvChn'),'width', chnnlslogo)}  />
					{getSlotWidthL(slot, date, 60)-45 > 50 &&	<span style={{maxWidth:getSlotWidth(slot, 60)-45}}>{slot.GstName}</span> }
			</div>  
		</div> 
};

export const startCalendarEndFirstDay = (slot, index, date) => {
	return <div  key={index} className='styleEndFirstDay' style={{width: getSlotWidthL(slot, date, 60), cursor: 'cell'  }}>
				<div className='eventStart'></div>
       		</div>
};


export const handleMouseDown = (cellX, cellY, setMouseDown, setSlctdCell,  schdl, resources, tableObj) => { 
	
	if(tableObj[resources[cellY].id][schdl[cellX]]!==null && tableObj[resources[cellY].id][schdl[cellX]]!=='e')return;
	
	setMouseDown(true);
	setSlctdCell({ xFrst: cellX, xScnd: cellX, y: cellY });
    };



 export const selectCells = (colIndx, mouseDown, setSlctdCell, slctdCell) => {
	 
	if(mouseDown)setSlctdCell({ ...slctdCell, 'xScnd': colIndx });  
	
};

export const handleMouseUp = (mouseDown,setMouseDown, setOpenAddRsrv, setSnackbar,slctdCell, schdl, tableObj,resources ) => {
	
	let cancel=false;
        if (mouseDown) {
            setMouseDown(false);
				if(slctdCell.xFrst===slctdCell.xScnd){
					setSnackbar({open: true, msg: 'The selection shall include at least one night', variant: 'warning'});
					return;
				}
			
			
				let strt;
				let end; 

				if(slctdCell.xFrst <= slctdCell.xScnd){
					strt	=schdl[slctdCell.xFrst]
					end		=schdl[slctdCell.xScnd]
				}else{
					strt	=schdl[slctdCell.xScnd]
					end		=schdl[slctdCell.xFrst]
				}
				
		
				for(let i=strt; i<=end; i++ ){
					
					if( (tableObj[resources[slctdCell.y].id][i]==='t' || tableObj[resources[slctdCell.y].id][i]==='c') ||
						(tableObj[resources[slctdCell.y].id][i]==='s' && tableObj[resources[slctdCell.y].id][i+1]==='e' && (i+1)<=end) 
					  )	{
							cancel=true;
							setSnackbar( {open:true, msg: 'This apartment is already reserved for the selected dates', variant: 'warning'});
							return;
						}
				}
				
			  	!cancel && setOpenAddRsrv(true);
					
        }
    }; 

const style1 = {
   	border: '2px solid #193e6d',
	padding: '20px 0px',
	background: '#45afed',
};

const style2 = {
   	border: '2px solid #7f0000',
	padding: '20px 0px',
	background: '#ffb2b2',
};
	
export const cellsFuncSelect = (ind, i, slctdCell, schdl, resources, tableObj) => { 
		   if( (tableObj[resources[i].id][schdl[ind]]==='t' || tableObj[resources[i].id][schdl[ind]]==='c') &&
			  						i === slctdCell.y && ((ind >= slctdCell.xFrst && ind <= slctdCell.xScnd) || (ind >= slctdCell.xScnd && ind <= slctdCell.xFrst) ) ){
			   return style2;
		   }else if( (tableObj[resources[i].id][schdl[ind]]===null || tableObj[resources[i].id][schdl[ind]]==='s' || tableObj[resources[i].id][schdl[ind]]==='e') &&
									i === slctdCell.y && ((ind >= slctdCell.xFrst && ind <= slctdCell.xScnd) || (ind >= slctdCell.xScnd && ind <= slctdCell.xFrst) ) ){
			   return style1;
		   }
 };

export const getDatesBetweenDates = (startDate, endDate) => {
		  let dates = []
		  //to avoid modifying the original date
		  let theDate = new Date(startDate)
		  while (theDate <=  new Date(endDate)) {
			dates = [...dates, new Date(theDate)]
			theDate.setDate(theDate.getDate() + 1)
		  }
		  return dates
	}