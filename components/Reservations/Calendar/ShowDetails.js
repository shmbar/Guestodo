import React, {useContext, useState} from 'react';
import {Popover, Grid, Tooltip, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import {PmntClrStatus1, brandTemplate1} from '../../../functions/setTableDt.js';
import { SettingsContext } from '../../../contexts/useSettingsContext';
import { RcContext } from '../../../contexts/useRcContext';
import {idToItem, addComma, deleteSlots, delData, delDPaymentsBatch} from '../../../functions/functions.js';
import DelDialog from './DeleteDialog';
import {AuthContext} from '../../../contexts/useAuthContext';
import { SelectContext } from '../../../contexts/useSelectContext';



import './styles.css';

const dateFormat = require('dateformat');

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
	popoverContent: {
    	pointerEvents: 'auto',
		padding: theme.spacing(1),
		marginTop: theme.spacing(2),
		position:'absollute'
  	}
}));

export default function MouseOverPopover(props) {
	const { settings } = useContext(SettingsContext);
	const { rcDataPrp, setRcDataPrp, setSnackbar} = useContext(RcContext);
    const classes = useStyles();
	const [openDelete , setOpenDelete] = useState(false);
	const {uidCollection, write} = useContext(AuthContext);
	const { date } = useContext(SelectContext);
	
	
   const handleDelete= async(slot)=>{
		setOpenDelete(false);
		
				
			let ExIDCommissionCnhl = slot.ChnlTRex;
			let ExIDCommissionMng = slot.MngTRexCmsn;
		
		 	let newArr = rcDataPrp.filter(q=>q.Transaction!==slot.Transaction);
			setRcDataPrp(newArr);
		

			async function Snack(uidCollection, dy) {
				deleteSlots(uidCollection, slot.AptName, slot.Transaction, slot.ChckIn, slot.ChckOut)
				setSnackbar({open: ( await delData(uidCollection,'reservations', dy, slot.Transaction)),
							 msg: 'Reservation has been deleted!', variant: 'success'}) ; 
				
				await delDPaymentsBatch(uidCollection,'payments',rcDataPrp.filter(q=>q.Transaction===slot.Transaction)[0].Payments)
				
		}
		
			Snack(uidCollection, date.year);
	
		if(ExIDCommissionCnhl!==undefined) {await delData(uidCollection, 'expenses', date.year, ExIDCommissionCnhl)};
		await delData(uidCollection,'expenses', date.year, ExIDCommissionMng); 
	} 

    const open = Boolean(props.anchorEl);

    return (
        <div className="dtl">
			
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{ paper: classes.popoverContent }}
                open={open}
				 elevation={2}
                anchorEl={props.anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
               
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableRestoreFocus
            >
            
                    <div style={{ width: '300px'}} >
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                            <Grid item xs={1}>
                                <div className="status-dot" style={{ backgroundColor: PmntClrStatus1(props.slot.PmntStts)}} />
                            </Grid>
                            <Grid item xs={7} className="overflow-text">
                                <span className="header2-text" title={props.slot.GstName}>
                                    {props.slot.GstName}
                                </span>
                            </Grid>
                            <Grid item xs={4}  className="overflow-text"  style={{ textAlign: 'right' }}>
                                	{brandTemplate1(idToItem(settings.channels,  props.slot.RsrvChn, 'RsrvChn' ))}
                            </Grid>
                        </Grid>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item xs={12} style={{ padding: '10px' }}>
                                <span className="header2-text">
                                    {dateFormat(props.slot.ChckIn, 'dd-mmm-yyyy')} -{' '}
                                    {dateFormat(props.slot.ChckOut, 'dd-mmm-yyyy')}
									
                                </span>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                            <Grid item  xs={12} style={{ paddingLeft: '11px' }} >
                                <span className="header2-text" >
                                { `Reservation Amount: ${settings.CompDtls.currency} ${addComma(props.slot.RsrvAmnt)}`} 
								 </span>
                            </Grid>
							 <Grid item  xs={12} style={{ paddingLeft: '11px', paddingTop: '7px' }} >
                                <span className="header2-text" >
                                { `Balance Due: ${settings.CompDtls.currency} ${addComma(props.slot.BlncRsrv)}`} 
								 </span>
                            </Grid>
							 <Grid item  xs={12} style={{ paddingLeft: '11px', paddingTop: '7px' }} >
                                <span className="header2-text" >
                                { `Reservation is`} {props.slot.Confirmed==null? 'Confirmed':  props.slot.Confirmed? 'Confirmed': 'Tentative'}
								 </span>
                            </Grid>
                            <Grid item xs={12} style={{ paddingBottom: '0px', textAlign: 'end' }} onClick={(e) => e.stopPropagation()}>
								<Tooltip title="Edit reservation" aria-label="Delete">
                                    <IconButton aria-label="Edit"
                                        onClick={() =>   props.selectValueOrder(props.slot) } 
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete reservation" aria-label="Delete">
									<span>
                                    <IconButton aria-label="Delete" onClick={()=>setOpenDelete(true)} disabled={!write}>
                                        <DeleteIcon />
                                    </IconButton> </span>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </div>
               
            </Popover>
			
			<DelDialog openDelete={openDelete} setOpenDelete={setOpenDelete}  handleDelete={() => handleDelete(props.slot)}
					title='This reservation will be deleted!' 
					content='Please Confirm'/> 
			
        </div>
    );
}