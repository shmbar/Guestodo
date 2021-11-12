import React, {Component} from 'react'

import Scheduler, {SchedulerData, ViewTypes, DemoData} from 'react-big-scheduler'
import {SettingsContext} from '../../../contexts/useSettingsContext';
import Grid from '@material-ui/core/Grid';
import {brandTemplate1, PmntClrStatus1} from '../../../functions/setTableDt.js';
import {idToItem, addComma, getNewTR, checkAvailableSlot, deleteSlots, delData} from '../../../functions/functions.js';
import OrdersModal from '../table/Modals/OrdersModal';
import SnackBar from '../../Subcomponents/SnackBar';
import AddRsrvDialog from './AddRsrvDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import {Tooltip, IconButton} from '@material-ui/core/';
import { v4 as uuidv4 } from 'uuid';
import DelDialog from './DeleteDialog';

import withDragDropContext from './withDnDContext'
import './style.css';

const dateFormat = require('dateformat');

let newConfig={
		nonWorkingTimeBodyBgColor : "#fffff",
   		nonWorkingTimeHeadBgColor : '#fffff',
		tableHeaderHeight : 80,
		resourceName : 'Apartments',
	//customCellWidth: 30,
	//	eventItemHeight : 50,
		monthResourceTableWidth : 140,
		eventItemLineHeight : 40,
		monthCellWidth : 60,
	//	besidesWidth: window.innerWidth >= 960 ? 410: 70;
		besidesWidth:350,
		headerEnabled:false,
		schedulerMaxHeight: 900
	//	schedulerWidth : '75%'
	}

class Basic extends Component{

    static contextType = SettingsContext
    
	

    constructor(props){
        super(props);
        const {date} = this.props.SelectContext;
     	
        let schedulerData = new SchedulerData(dateFormat(new Date(date.year,date.month,30),'yyyy-mm-dd'), ViewTypes.Month, false, false, newConfig );
		
        this.state = {
            viewModel: schedulerData,
			openAddRsrv: false,
			openDelete: false,
			row: null,
            newRsrvData:{'start': null, 'end': null, 'apt' : null},
			scrSize: this.props.SettingsContext.openMenu,
			scrData: this.props.scrData
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        const {propertySlct, date} = this.props.SelectContext;
        const {settings, openMenu} = this.props.SettingsContext;
        const {rcDataPrp} = this.props.RcContext;
		
		let bsd=null;
		if(this.state.scrData!=='xs' && this.state.scrData!=='sm'){
			if(openMenu){
				bsd=350;
			}else{
				bsd=185;
			}
		}else{
			if(this.state.scrData==='sm'){
				bsd=80;
			}else{
				bsd=40;
			}
		}
		
		let newConf = {...newConfig, 'besidesWidth': bsd}

        let schedulerData = new SchedulerData(dateFormat(new Date(date.year,date.month,15	),'yyyy-mm-dd'), ViewTypes.Month, false, false, newConf);
		let resources= settings.apartments!=null ? settings.apartments.filter(x=> x.PrpName===propertySlct).map(y=> ({'name': y.AptName, 'id': y.id}) ) : [];
        let events = rcDataPrp.filter(q=> !q.RsrvCncl).map(x=> ({id: x.Transaction,
            start: dateFormat(x.ChckIn,'yyyy-mm-dd'),
            end: dateFormat(x.ChckOut ,'yyyy-mm-dd'),
            resourceId: x.AptName,
            title: x.GstName,
            movable: false,
            resizable: false,
            bgColor: PmntClrStatus1(x.PmntStts),
            chnl: x.RsrvChn,
			RsrvAmnt: x.RsrvAmnt
        }));
  
		events = events.map(x=>{
			if((dateFormat(x.start,'mm')!==dateFormat(x.end,'mm')) &&  dateFormat(x.end,'dd')==='01'){
				let tmppDate = new Date(x.end);
				let nxtDay = tmppDate.setDate(tmppDate.getDate() + 1);
				return {...x, 'sp': true, 'end':  dateFormat(nxtDay,'yyyy-mm-dd')}
			}else{
				return x;
			}
		})
		
        schedulerData.setResources(resources);
        schedulerData.setEvents(events);
      
        if((prevProps.RcContext.rcDataPrp!==rcDataPrp)){
		
			this.setState({ viewModel: schedulerData  })
        }
  
		if(openMenu!==this.state.scrSize){
			this.setState({'viewModel': schedulerData, 'scrSize' : openMenu})
		}
	
		window.dispatchEvent(new Event('resize')); 
      }


    render(){
        const {viewModel} = this.state;

        return (
            <div>
              	<SnackBar msg={this.props.RcContext.snackbar.msg} snackbar={this.props.RcContext.snackbar.open} setSnackbar={this.props.RcContext.setSnackbar}
				variant={this.props.RcContext.snackbar.variant}/>
				<AddRsrvDialog open={this.state.openAddRsrv} setOpen={this.setOpenAddRsrvState.bind(this)} handleAdd={this.openModalRsrv}
					title='Place new reservation' 
						/>
				<DelDialog opendel={this.state.openDelete} setOpendel={this.setOpenDeleteState.bind(this)} handleDelete={this.handleDelete}
					title='This reservation will be deleted!' 
					content='Please Confirm'/>
                <div>
                    <Scheduler schedulerData={viewModel} 
                               prevClick={this.prevClick}
                               nextClick={this.nextClick}
                               onSelectDate={this.onSelectDate}
                               onViewChange={this.onViewChange}
                               eventItemTemplateResolver={this.eventItemTemplateResolver}
							   eventItemPopoverTemplateResolver={this.eventItemPopoverTemplateResolver}
                               eventItemClick={this.eventClicked}
							   newEvent={this.newEvent}
						 	   nonAgendaCellHeaderTemplateResolver = {this.nonAgendaCellHeaderTemplateResolver}
						
						   onScrollLeft={this.onScrollLeft}
                               onScrollRight={this.onScrollRight}
                               onScrollTop={this.onScrollTop}
                               onScrollBottom={this.onScrollBottom}
                               toggleExpandFunc={this.toggleExpandFunc}
                    />
					{ this.props.RcContext.displayDialog ?  <OrdersModal  />: null}
                </div>
            </div>
        )
    }

    prevClick = (schedulerData)=> {
        schedulerData.prev();
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData)=> {
        schedulerData.next();
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData
        })
    }

    eventClicked = (schedulerData, event) => {
		let row = this.props.RcContext.rcDataPrp.filter(x=> x.Transaction===event.id)[0];
		this.props.RcContext.selectValue(row)
		
		
    };

    findImg(txt,y){
		return	this.props.SettingsContext.chnnlslogo.filter(x=> x.brnd===txt)[0]!==undefined ?
                this.props.SettingsContext.chnnlslogo.filter(x=> x.brnd===txt)[0][y] :
                     this.props.SettingsContext.chnnlslogo[this.props.SettingsContext.chnnlslogo.length-1][y]
    } 
    
    eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {

        let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);

        let divStyle =   isStart && (!isEnd || (event.end > schedulerData.endDate))?
						 { backgroundColor: bgColor, height: '30px', marginLeft: '30px', borderBottomLeftRadius: '14px', borderTopLeftRadius: '14px'} :
                        !isStart && isEnd ?  { backgroundColor: bgColor, height: '30px',borderBottomRightRadius: '14px', borderTopRightRadius: '14px'} :
                         { backgroundColor: bgColor, height: '30px', borderRadius: '14px'}
        
    
        let mrgnLft =   (isStart && isEnd && !(event.end > schedulerData.endDate)) ? {width: '100%', marginLeft: '30px'} :
						 (!isStart && isEnd && event.sp!==true) ? {width: ((dateFormat(event.end, 'dd') - 1)*schedulerData.config.monthCellWidth + 25) + 'px'} :
							(event.sp===true && !isStart) ? {width: '60%'}:{};
	
		return <div style={mrgnLft}><div key={event.id} style={divStyle} /* className="round-all" */   >
				<div style={{padding: '2px 0 3px 10px'}} className="event-item">
                    <img src={	this.findImg( idToItem(this.props.SettingsContext.settings.channels, event.chnl, 'RsrvChn'),'img')} alt={event.chnl}
                         width={this.findImg(idToItem(this.props.SettingsContext.settings.channels, event.chnl, 'RsrvChn'),'width')}  style={{background: 'white', borderRadius: '14px'}}/>
					<span style={{paddingLeft :'10px'}}>{titleText}</span>
				</div>
        </div></div>;
		 
    }
	
	 eventItemPopoverTemplateResolver = (schedulerData, eventItem, title, start, end, statusColor) => {
		let chkOut = this.props.RcContext.rcDataPrp.filter(x=> x.Transaction===eventItem.id)[0]['ChckOut'];
        return (
            <div style={{width: '300px'}}>
            	<Grid   container   direction="row"   justifyContent="flex-start"   alignItems="center" >
				 	<Grid item xs={1}>
						  <div className="status-dot" style={{backgroundColor: statusColor}} />
					</Grid>
					<Grid item xs={7} className="overflow-text">
						  <span className="header2-text" title={title}>{title}</span>
					</Grid>
					<Grid item xs={4} className="overflow-text" style={{textAlign: 'right'}}>
						  {brandTemplate1(idToItem(this.props.SettingsContext.settings.channels, eventItem.chnl, 'RsrvChn'))}
					</Grid>
				</Grid>
				<Grid   container   direction="row"   justifyContent="flex-start"   alignItems="center"  >
				 	<Grid item xs={12} style={{padding : '10px'}}>
						   <span className="header3-text">{dateFormat(eventItem.start,'dd-mmm-yyyy')}  -  {dateFormat(chkOut,'dd-mmm-yyyy')}</span>
					</Grid>
				</Grid>
				<Grid   container   direction="row"   justifyContent="flex-start"   alignItems="center"  >
				 	<Grid item xs={10} style={{paddingBottom : '5px', paddingLeft : '11px'}}>
						   <span className="header2-text" style={{color: '#40a9ff'}}>Reservation Amount: {' '}
							   {`${this.props.SettingsContext.settings.CompDtls.currency} ${addComma(eventItem.RsrvAmnt)}`}</span>
					</Grid>
					<Grid item xs={2} style={{paddingBottom : '5px'}}>
						<Tooltip title="Delete reservation" aria-label='Delete'>
							<IconButton aria-label='Delete' onClick={()=> this.setState({openDelete: true, row: eventItem })}  >
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</Grid>
					
				</Grid>
            </div>
        );
    }
	
	getNight=(end,start)=>{
		const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; 
	}; 
	 
	setOpenAddRsrvState(){
		this.setState({ openAddRsrv: false});
	}
	

	openModalRsrv= async()=>{
	
		this.setState({ openAddRsrv: false});
	
		let AptNAme = this.props.SettingsContext.settings.apartments.filter(x=> x.AptName===this.state.newRsrvData.apt)[0]
		AptNAme = AptNAme==null ? '' : AptNAme['id']
	
		let tmpRC = await getNewTR(this.props.AuthContext.uidCollection, 'lastTR', 'lastTR', 'RC');
		let tmpObj = {ChckIn : dateFormat(this.state.newRsrvData.start, 'dd-mmm-yyyy'),  ChckOut: dateFormat(this.state.newRsrvData.end,'dd-mmm-yyyy'),
					  'Transaction':  'RC'.concat(tmpRC).concat('_' + uuidv4()), Payments:[{P:'', Date:null, PM:''}], Vat:true,
					 				  PrpName:this.props.SelectContext.propertySlct,	RsrvCncl:false, RsrvChn:'', NetAmnt:'', CnclFee:'', 
					  				NigthsNum: this.getNight(this.state.newRsrvData.end, this.state.newRsrvData.start), 
						  				RsrvAmnt:'', TtlPmnt:'', BlncRsrv:'', GstName:'', AptName:	AptNAme,
					 				  dtls : {adlts: '', chldrn:'', Passport:'', email:'', mobile: '', phone: '', addrss:'', cntry:''} }
		
		this.props.RcContext.selectValue(tmpObj);
		}
		 
	 
    newEvent = async(schedulerData, slotId, slotName, start, end, type, item) => {

		if(dateFormat(start,'dd-mmm-yyyy') === dateFormat(end,'dd-mmm-yyyy')){
			this.props.RcContext.setSnackbar({open: true, msg: 'The range shall include at least two days', variant: 'warning'});
			return;
		}
        
        
        let availORnotavail =   await checkAvailableSlot(this.props.AuthContext.uidCollection, this.props.SettingsContext.settings.apartments.filter(x=> x.AptName===slotName)[0]['id'],
                        '12345678', start, end);
    
        if(availORnotavail){
            this.props.RcContext.setSnackbar( {open:true, msg: 'This apartment is already reserved for the selected dates', variant: 'warning'});
            return;
        }

		 this.setState({
            openAddRsrv: true,
			newRsrvData: {'start':  start, 'end': end, 'apt': slotName} 
        })	
     
    }
	
	nonAgendaCellHeaderTemplateResolver = (schedulerData, item, formattedDateItems, style) => {
		  let datetime = schedulerData.localeMoment(item.time);
		  let isCurrentDate = false;

		  if (schedulerData.viewType === ViewTypes.Day) {
			  isCurrentDate = datetime.isSame(new Date(), 'hour');
		  }
		  else {
			  isCurrentDate = datetime.isSame(new Date(), 'day');
		  }

		  if (isCurrentDate) {
			  style.color = 'red';
		  }else{
			   style.color = 'black';
			}
		
		 style.backgroundColor = '#E8E8E8';
		 style.whiteSpace= 'pre-line';
	//	 style.width = '60px';
	
		var dayName = new Date(dateFormat(item.time, 'yyyy-mm-dd')).toString().split(' ')[0];
		
		  return (
			  <th key={item.time} className={`header3-text`} style={style}>
				  <div>
				  	{dayName}
				  </div>
				  <div style={{fontWeight: '600', fontSize: '14px'}}>
				  	{dateFormat(item.time,'dd')}
				  </div>
				  
			  </th>
		  );
  	}
	
	setOpenDeleteState(){
		this.setState({ openDelete: false});
	}

	handleDelete= async()=>{
		this.setState({ openDelete: false});
		
		let delRow = this.props.RcContext.rcDataPrp.filter(x=> x.Transaction===this.state.row.id)[0];
		
			let ExIDCommissionCnhl = delRow.ChnlTRex;
			let ExIDCommissionMng = delRow.MngTRexCmsn;
		
		 	let newArr = this.props.RcContext.rcDataPrp.filter(q=>q.Transaction!==delRow.Transaction);
			this.props.RcContext.setRcDataPrp(newArr);
		

			async function Snack(id, dy, rc) {
				deleteSlots(id, delRow.AptName, delRow.Transaction, delRow.ChckIn, delRow.ChckOut)
				rc.setSnackbar({open: ( await delData(id,'reservations', dy, delRow.Transaction)),
							 msg: 'Reservation has been deleted!', variant: 'success'}) ; 
			}
		
		Snack(this.props.AuthContext.uidCollection, this.props.SelectContext.date.year, this.props.RcContext);
	
		if(ExIDCommissionCnhl!==undefined) {await delData(this.props.AuthContext.uidCollection, 'expenses', this.props.SelectContext.date.year, ExIDCommissionCnhl)};
		await delData(this.props.AuthContext.uidCollection,'expenses', this.props.SelectContext.date.year, ExIDCommissionMng);
	}
	
	onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
        if(schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.next();
            schedulerData.setEvents(DemoData.events);
            this.setState({
                viewModel: schedulerData
            });
    
            schedulerContent.scrollLeft = maxScrollLeft - 10;
        }
    }

    onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
        if(schedulerData.ViewTypes === ViewTypes.Day) {
            schedulerData.prev();
            schedulerData.setEvents(DemoData.events);
            this.setState({
                viewModel: schedulerData
            });

            schedulerContent.scrollLeft = 10;
        }
    }

    onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
        console.log('onScrollTop');
    }

    onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
        console.log('onScrollBottom');
    }

    toggleExpandFunc = (schedulerData, slotId) => {
        schedulerData.toggleExpandStatus(slotId);
        this.setState({
            viewModel: schedulerData
        });
    }
	
	
	
	
}

export default withAuthContext(withSettingsContext(withSelectContext(withRcContext(withDragDropContext(Basic)))));