import React, { useContext, useState, useEffect, useRef } from 'react';

import { SelectContext } from '../../../contexts/useSelectContext';
import { SettingsContext } from '../../../contexts/useSettingsContext';
import { RcContext } from '../../../contexts/useRcContext';
import { inCalendar, endCalendarNotLastDay,endCalendarLastDay, startCalendarNotEndFirstDay, startCalendarEndFirstDay,
				handleMouseDown, selectCells, handleMouseUp, cellsFuncSelect, getNights, getDatesBetweenDates } from './functions.js';
import {getNewTR, readDataSlots} from '../../../functions/functions.js';
import {} from '../../../functions/setTableDt.js';
import ShowDetails from './ShowDetails';
import SnackBar from '../../Subcomponents/SnackBar';
import AddRsrvDialog from './AddRsrvDialog.js';
import OrdersModal from '../table/Modals/OrdersModal';
import {AuthContext} from '../../../contexts/useAuthContext';
import { v4 as uuidv4 } from 'uuid';

import './styles.css';

const Calendar = () => {
    const { date/*, setDate*/, multiPropertySlct } = useContext(SelectContext);
    const { rcDataPrp, selectValue, displayDialog, setDisplayDialog,
        snackbar, setSnackbar, setSlotsTable, setRcTable } = useContext(RcContext);
    const [schdl, setSchdl] = useState([]);
    const [resources, setResources] = useState([]);
    const { settings, chnnlslogo, loading } = useContext(SettingsContext);
    let container = useRef(null);
    const dateFormat = require('dateformat');
	const [anchorEl, setAnchorEl] = useState(null);
	const [openDtl, setOpnDtl] = useState(null);
	const [openAddRsrv, setOpenAddRsrv] = useState(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [slctdCell, setSlctdCell] = useState({ xFrst: 0, xScnd: 0, y: 0 });
	const {uidCollection, write} = useContext(AuthContext);	
	const [tableObj, setTableObj] = useState([]);
	
     useEffect(() => {
		 
				let rsrcs = settings.apartments != null ? settings.apartments
						.filter((x) => multiPropertySlct.includes(x.PrpName))
						.map((y) => ({ name: y.AptName, id: y.id })) : [];
		 
				setResources(rsrcs);

				let arrTmp = [];
				for (let i = 1; i <= new Date(date.year, date.month + 1, 0).getDate(); i++) arrTmp.push(i);
				setSchdl(arrTmp);

				 let tableDT={};
				 
				 for(let i=0; i<=rsrcs.length; i++){ //Create an empty table of all dates
					if(rsrcs[i]!=null){
						let scheduleApt =  arrTmp.reduce((o, key) => ({ ...o, [key]: null}), {});
							rcDataPrp.filter(q=> !q.RsrvCncl).filter(x=> x.AptName===rsrcs[i].id).map((y,i)=>{
							return	getDatesBetweenDates(y.ChckIn,y.ChckOut).filter(q=> dateFormat(q,'mm') * 1===(date.month+1)).map(z=> 
																				 
									scheduleApt[z.getDate()]= 	dateFormat(z,'dd-mmm-yyyy')=== y.ChckIn && scheduleApt[z.getDate()]!=='e'? 's' :
																dateFormat(z,'dd-mmm-yyyy')=== y.ChckIn && scheduleApt[z.getDate()]==='e'? 'c':
																dateFormat(z,'dd-mmm-yyyy')=== y.ChckOut && scheduleApt[z.getDate()]!=='s' ? 'e': 
																dateFormat(z,'dd-mmm-yyyy')=== y.ChckOut && scheduleApt[z.getDate()]==='s' ? 'c':'t'
															
									)
							})
					 	tableDT={...tableDT,...{[rsrcs[i].id] : scheduleApt}}
					} 
				 }
		 
				 setTableObj(tableDT)
		
    }, [date, rcDataPrp, settings, dateFormat, multiPropertySlct]);


    const getDate = (x) => {
        return new Date(x)
    }


 const handlePopoverOpen = (event, id) => {
	 	event.stopPropagation();
        setAnchorEl(event.currentTarget);
	 	setOpnDtl(id)
    };
	

    const renderTableData = () => {
        return resources.map((rs, i) => (
            <tr key={i}>
                {schdl.map((scd, ind) => (
                    <td key={ind}  style={mouseDown ? {border: '1px solid #F0F0F0'}:{border: '1px solid #ddd'}} 
						onMouseDown={(e) =>write && handleMouseDown(ind, i, setMouseDown, setSlctdCell,  schdl, resources, tableObj)} 
						onMouseOver={(e) =>write && selectCells(ind, mouseDown, setSlctdCell, slctdCell )} 
						onMouseUp={(e) =>write && handleMouseUp(mouseDown,setMouseDown, setOpenAddRsrv, setSnackbar, slctdCell, schdl, tableObj,resources)}
						>							
						
						<div style={mouseDown ? cellsFuncSelect(ind, i, slctdCell, schdl, resources, tableObj) : null} >
                        {!loading && rcDataPrp.filter(q=> !q.RsrvCncl).filter(z => z.AptName === rs.id).map((slot, index) => {
							
                            return (
                                    scd === dateFormat(slot.ChckIn, 'dd') * 1 &&
                                    getDate(slot.ChckIn) >= new Date(date.year, date.month, 1) &&
                                    getDate(slot.ChckOut) <= new Date(date.year, date.month + 1, 0) ?
										<div key={index} onMouseEnter={(event)=> handlePopoverOpen(event, slot.Transaction)} onMouseLeave={(event)=> setAnchorEl(null)} >
											<div>
												{inCalendar( settings, slot, chnnlslogo, index)}
											</div>
									 		{openDtl===slot.Transaction && <ShowDetails anchorEl={anchorEl} slot={slot} selectValueOrder={selectValueOrder}/> }
										</div>
                                    :
                                    scd === dateFormat(slot.ChckIn, 'dd') * 1 &&
                                    getDate(slot.ChckIn) >= new Date(date.year, date.month, 1) &&
                                    getDate(slot.ChckOut) > new Date(date.year, date.month + 1, 0) && 
                                    getDate(slot.ChckIn).getDate() !== new Date(date.year, date.month + 1, 0).getDate() ?
										<div key={index} onMouseEnter={(event)=> handlePopoverOpen(event, slot.Transaction)} onMouseLeave={(event)=> setAnchorEl(null)}>
											<div>
												{endCalendarNotLastDay(settings, slot, chnnlslogo, index, date)}
											</div>
											{openDtl===slot.Transaction && <ShowDetails anchorEl={anchorEl} slot={slot} selectValueOrder={selectValueOrder}/> }
										</div>
                                    :
                                    scd === dateFormat(slot.ChckIn, 'dd') * 1 &&
                                    getDate(slot.ChckIn) >= new Date(date.year, date.month, 1) &&
                                    getDate(slot.ChckIn).getDate() === new Date(date.year, date.month + 1, 0).getDate() ?
										<div key={index} onMouseEnter={(event)=> handlePopoverOpen(event, slot.Transaction)} onMouseLeave={(event)=> setAnchorEl(null)}>
											<div>
												{endCalendarLastDay(settings, slot, chnnlslogo, index, date)}
											</div>
											{openDtl===slot.Transaction && <ShowDetails anchorEl={anchorEl} slot={slot} selectValueOrder={selectValueOrder}/> }
										</div>
                                    :
									scd === 1 &&
                                    getDate(slot.ChckIn) < new Date(date.year, date.month, 1) &&
                                    getDate(slot.ChckOut) > new Date(date.year, date.month, 1)  ?
										<div key={index} onMouseEnter={(event)=> handlePopoverOpen(event, slot.Transaction)} onMouseLeave={(event)=> setAnchorEl(null)}>
											<div>
												{startCalendarNotEndFirstDay(settings, slot, chnnlslogo, index, date)}
											</div>
											{openDtl===slot.Transaction && <ShowDetails anchorEl={anchorEl} slot={slot} selectValueOrder={selectValueOrder}/> }
										</div>
									:
									scd === 1 &&
                                    getDate(slot.ChckIn) < new Date(date.year, date.month, 1) &&
                                    getDate(slot.ChckOut).getDate() === new Date(date.year, date.month, 1).getDate()  ?
										<div key={index} onMouseEnter={(event)=> handlePopoverOpen(event, slot.Transaction)} onMouseLeave={(event)=>setAnchorEl(null)} 
																onMouseDown={e=>e.stopPropagation()}>
											<div>
												{startCalendarEndFirstDay(slot, index, date)}	
											</div>
											{openDtl===slot.Transaction && <ShowDetails anchorEl={anchorEl} slot={slot} selectValueOrder={selectValueOrder} /> }
										</div>  
									:
									
									''

                            );
                        })}
						</div>
                    </td>
                ))}
            </tr>
        ));
    };
	
	const selectValueOrder= async(slot)=>{
		
		let slotsData = await readDataSlots(uidCollection, 'slots', dateFormat(slot.ChckIn, 'yyyy'), null, slot.AptName)
		setSlotsTable(slotsData.dates);
		
		setRcTable(slotsData.rc);
	
		selectValue(slot);
		setDisplayDialog(true);
	}
	
	
	const openModalRsrv= async()=>{
		
		setOpenAddRsrv(false);
	
		let AptNAme = resources[slctdCell.y].id
		let tmpRC = await getNewTR(uidCollection, 'lastTR', 'lastTR', 'RC');
		
		let strt;
		let end;
		if(new Date(date.year, date.month, schdl[slctdCell.xFrst]) < new Date(date.year, date.month, schdl[slctdCell.xScnd])){
			strt = new Date(date.year, date.month, schdl[slctdCell.xFrst]);
			end = new Date(date.year, date.month, schdl[slctdCell.xScnd]);
		}else{
			end = new Date(date.year, date.month, schdl[slctdCell.xFrst]);
			strt = new Date(date.year, date.month, schdl[slctdCell.xScnd]);
		}
	
		
		let tmpObj = {ChckIn : dateFormat(strt, 'dd-mmm-yyyy'),  ChckOut: dateFormat(end,'dd-mmm-yyyy'),
					  'Transaction':  'RC'.concat(tmpRC).concat('_' + uuidv4()), Payments:[{P:'', Date:null, PM:'', 'id' : uuidv4()}], Vat:true,
					 				  	PrpName: settings.apartments.filter(x=> x.id===AptNAme)[0]['PrpName'],	RsrvCncl:false, RsrvChn:'', NetAmnt:'', CnclFee:'', 
					  					NigthsNum: getNights(dateFormat(end,'dd-mmm-yyyy'), dateFormat(strt, 'dd-mmm-yyyy')), 
						  				RsrvAmnt:'', TtlPmnt:'', BlncRsrv:'', GstName:'', AptName:	AptNAme, Confirmed:true,
					 				  	dtls : {adlts: '', chldrn:'', Passport:'', email:'', mobile: '', phone: '', addrss:'', cntry:''} }
		
		selectValueOrder(tmpObj);
		setSlctdCell({ xFrst: 0, xScnd: 0, y: 0 });
	}
	
    const RenderResources = () => {
        return resources.map((rs, i) => {
            return (
                <tr key={i}>
                    <td /* style={{ height: celltHeight }} */>{rs.name}</td>
                </tr>
            );
        });
    };

    return (
        <div style={{position: 'relative'}}>
			<SnackBar msg={snackbar.msg} snackbar={snackbar.open} setSnackbar={setSnackbar}
				variant={snackbar.variant}/>
            <table className="resources">
                <thead>
                    <tr>
                        <th>Apartments</th>
                    </tr>
                </thead>
                <tbody>{RenderResources()}</tbody>
            </table>

            <div className="mainDiv" ref={container}>
                <table className="schedule">
                    <thead>
                        <tr>
                            {schdl.map((x, i) => (
                                <th
                                    key={i}
                                /*   style={{
                                    //    fontSize: timeFrameOptions.indexOf(tfValue) >= 2 ? '12px' : '14px',
                                    minWidth: getCellWidth(container, date),
                                }} */
                                >
                                    <div style={{ opacity: 0.6 }}>
                                        {dateFormat(new Date(date.year, date.month, x), 'ddd')}
                                    </div>
                                    <div>
                                        {dateFormat(new Date(date.year, date.month, x), 'dd')}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
					 <tbody>{renderTableData()}</tbody>
                </table>
            </div>
			
			
			{openAddRsrv && <AddRsrvDialog setOpenAddRsrv={setOpenAddRsrv} openModalRsrv={openModalRsrv} title='Place new reservation' /> }
			{displayDialog ?  <OrdersModal  />: null}
			
        </div> 
    );
};

export default Calendar;
