import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, InputAdornment, Input, FormControl, InputLabel, Tooltip } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import EventIcon from '@material-ui/icons/Event';
import { SelectContext } from '../../../../../contexts/useSelectContext';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import {RcContext} from '../../../../../contexts/useRcContext';
import {readDataSlots} from '../../../../../functions/functions.js';
import {AuthContext} from '../../../../../contexts/useAuthContext';
import './papersStyle.css';


const dateFormat = require('dateformat');



export default function DatesRangePicker(props) {
    const [open, setOpen] = useState(false);
    const [dates, setDates] = useState({ start: '', end: ''});
    const { date } = useContext(SelectContext);
    const [arrdays, setArrdays] = useState([]);
    const [pDate, setPDate] = useState(date);
    const weekDays = ['SU', 'MO', 'TU', 'WE', ' TH', 'FR', 'SA'];
	const {slotsTable, rcTable, value,handleChangeDNew, setSlotsTable, setRcTable, setIsSlotAvailable} = useContext(RcContext);
	const [disSchedule, setDisSchedule] = useState([]);
	const [slotsChange, setSlotsChange] = useState([]);
	const {uidCollection} = useContext(AuthContext);
	
    useEffect(() => {
        let firstDay = new Date(pDate.year, pDate.month, 1).getDay();
        let lastDay = 32 - new Date(pDate.year, pDate.month, 32).getDate();

        let arr = [];

        for (let i = 0; i < 42; i++) {
            if (i < firstDay || i > lastDay + firstDay - 1) {
                arr.push('');
            } else {
                arr.push(i - firstDay + 1);
            }
        }
		
		if(arr[35]==='')arr.splice(arr.length - 7)
			
		
		let scheduleAptTmp =  	arr.filter(a=> a!=='').reduce((o, key) => ({ ...o, [key]: null}), {});
		let slotsRcTmp =  	arr.filter(a=> a!=='').reduce((o, key) => ({ ...o, [key]: null}), {}); //availability to update slots

			Object.keys(scheduleAptTmp).forEach(key=>{
					let prevDay = dateFormat(new Date(pDate.year, pDate.month, key-1), 'ddmmyyyy')
					
					if(slotsTable.includes(dateFormat(new Date(pDate.year, pDate.month, key), 'ddmmyyyy')) && !slotsTable.includes(prevDay)){
						scheduleAptTmp[key]='s'
						slotsRcTmp[key] = rcTable[slotsTable.indexOf(dateFormat(new Date(pDate.year, pDate.month, key), 'ddmmyyyy'))] ===value.Transaction
					}else if(!slotsTable.includes(dateFormat(new Date(pDate.year, pDate.month, key), 'ddmmyyyy')) && slotsTable.includes(prevDay)){
						scheduleAptTmp[key]='e'
					}else if(slotsTable.includes(dateFormat(new Date(pDate.year, pDate.month, key), 'ddmmyyyy'))){
						scheduleAptTmp[key]='t'
						slotsRcTmp[key] = rcTable[slotsTable.indexOf(prevDay)] ===value.Transaction || 
							rcTable[slotsTable.indexOf(dateFormat(new Date(pDate.year, pDate.month, key), 'ddmmyyyy'))] ===value.Transaction
					}
			});
		
		setDisSchedule(scheduleAptTmp);
		setSlotsChange(slotsRcTmp)
        setArrdays(arr);
		
    }, [pDate , slotsTable, rcTable, value.Transaction]);


    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const useStyles = makeStyles((theme) => ({
        root: {
            //  padding: scrSize==='xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
        },
        cell: {
            color: 'rgba(0, 0, 0, 0.87)',
            width: 36,
            height: 44,
            fontSize: '0.75rem',
            letterSpacing: '0.03333em',
            flexBasis: '14.28571%',
            textAlign: 'center',
			display: 'grid',
			margin: '1px 0'
		},			
		hover: {
			 '&:hover': {
					background: '#eee',
					borderRadius: '50%',
					border: '1px solid #193e6d',
				 	cursor: 'pointer'
		}},
		disabledStart: {
				//background: 'linear-gradient(to right, #fff 50%, #ccc 50%)',
			//	borderRadius: '50%',
		//		fontWeight: 700,
				pointerEvents: 'none',
		//		transform: 'rotate( 40deg )'
		},
		disabled:{
		//		background: '#ccc',
		//		borderRadius: '50%',
		//		color:'red',
				fontWeight: 700,
				pointerEvents: 'none'
		},
		disableClick:{
			pointerEvents: 'none'
		},
		selectedRange:{
			background: '#4791db99',
			color: 'white'
		},
		selectedRangeFirst:{
			background: '#4791db99',
			color: 'white',
			borderBottomLeftRadius: '50%',
			borderTopLeftRadius: '50%',
		},
		selectedRangeScnd:{
			background: '#4791db99',
			color: 'white',
			borderBottomRightRadius: '50%',
			borderTopRightRadius: '50%',
		},

        firstSelected: {
            background:  '#193e6d',
			borderRadius: '50%',
			color: 'white',
		//	height: '100%',
			display: 'grid'
        },
    }));

    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
	
	const Submit=()=>{
		
		if(dates.start ==='' || dates.end ==='')return;
			
		handleChangeDNew(dates.start, dates.end)
		setOpen(false);
	}
	
	
    const slctRange = (val) => {
		let datesTmp = [];
	
		if(dates.start > new Date(pDate.year, pDate.month, val))return;
		
        if (dates.start === '' && dates.end === '') {
			
           		setDates({ ...dates, start: new Date(pDate.year, pDate.month, val)});
        }else if (dates.start !== '' && dates.end === '') {			
				if(dateFormat(dates.start)===dateFormat(new Date(pDate.year, pDate.month, val)))return;

				//to avoid modifying the original date
				let theDate = new Date(dates.start)
				while (theDate < new Date(pDate.year, pDate.month, val)) {
					datesTmp = [...datesTmp, dateFormat(theDate, 'ddmmyyyy')]
					theDate.setDate(theDate.getDate() + 1)
				}
			
		
				//intersection
			let tmp=true;
			
			for(let i in datesTmp){	
				if( slotsTable.includes(datesTmp[i]) && rcTable[slotsTable.indexOf(datesTmp[i])]!==value.Transaction)tmp=false;
			}
			
				if(!tmp)return;
			//	datesTmp.filter((n)=> { return slotsTable.indexOf(n) !== -1}).length
            	setDates({ ...dates, 'end': new Date(pDate.year, pDate.month, val) });
				setIsSlotAvailable(true);
        }
		
    };

	
	const laotData=async(yr)=>{
		let slotsData = await readDataSlots(uidCollection, 'slots',yr, null, value.AptName)
	

		setSlotsTable([...slotsTable, ...slotsData.dates]);
		let rcData=[...rcTable, ...slotsData.rc]

		setRcTable(rcData);
	}
	
    const handleClickMnth = (val) => {
        if (val === 'prev' && pDate.month === 0) {
            setPDate({ ...pDate, month: 11, year: +pDate.year - 1 });
			laotData(+pDate.year - 1)
        } else if (val === 'next' && pDate.month === 11) {
            setPDate({ ...pDate, month: 0, year: +pDate.year + 1 });
			laotData(+pDate.year + 1)
        } else if (val === 'prev' && pDate.month !== 0) {
            setPDate({ ...pDate, month: +pDate.month - 1 });
        } else if (val === 'next' && pDate.month !== 11) {
            setPDate({ ...pDate, month: +pDate.month + 1 });
        }
    };

    return (
        <div>
			<FormControl style={{width: '100%'}}>
          	<InputLabel htmlFor="StartEnd">Dates Range</InputLabel>
			  	<Input
					id="StartEnd"
					fullWidth
			        value={value.ChckIn===null ? '' : `${value.ChckIn}   -   ${value.ChckOut}` } 
					endAdornment={
					  <InputAdornment position="end">
						<Tooltip title={value.AptName==='' ? 'Choose apartment first' : ''}  arrow>
							<IconButton
								aria-label="toggle password visibility"
								onClick={value.AptName==='' ? null :handleClickOpen}
							>
								<EventIcon />
							</IconButton>
						</Tooltip>
					  </InputAdornment>
					}
			  	/>
			</FormControl>
          
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
				className='customWidth'
            >
                <DialogTitle style={{ padding: '12px 24px' }}>
                    <Typography gutterBottom style={{ fontSize: '0.9rem',  padding: '8px 0', color: 'rgba(0, 0, 0, 0.6)' }}>
                        Select Date Range
                    </Typography>
                    <Grid container>
                        <Grid item xs={8} style={{ textAlign: 'left', padding: '6px 0', fontSize: '18px' }}>
                            {dateFormat(new Date(pDate.year, pDate.month, 1), 'mmmm yyyy')}
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton aria-label="delete" className={classes.margin} onClick={() => handleClickMnth('prev')}>
                                <ArrowBackIosIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton aria-label="delete" className={classes.margin} onClick={() => handleClickMnth('next')}>
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Grid container style={{ padding: '2px 10px' }}>
                    {weekDays.map((x, i) => {
                        return (
                            <Grid key={i} item className={classes.cell}>
                                {x}
                            </Grid>
                        );
                    })}
                </Grid>
                <DialogContent style={{ padding: '0px 10px' }}>
                    <Grid container>
                        {
                            arrdays.map((x, i) => {
                                return (
									
                                    <Grid key={i} item 
														className={x==="" ? clsx(classes.cell, classes.disableClick) :  // reserved slots
														disSchedule[x]==='t' && slotsChange[x]!==true  ? clsx(classes.cell, classes.disabled) :  // reserved slots
														(disSchedule[x]==='s' && slotsChange[x]!==true && dates.start==='') ? clsx(classes.cell, classes.disabledStart) :  // reserved slots
										
														//selected range
														new Date(pDate.year, pDate.month, x) > dates.start &&   
														new Date(pDate.year, pDate.month, x) < dates.end ? clsx(classes.cell,classes.selectedRange) :
														dateFormat(new Date(pDate.year, pDate.month, x), 'ddmmyyyy')  === dateFormat(dates.start, 'ddmmyyyy')  &&
														dates.end!=='' ? clsx(classes.cell,classes.selectedRangeFirst) :
														dateFormat(new Date(pDate.year, pDate.month, x), 'ddmmyyyy')  === dateFormat(dates.end, 'ddmmyyyy')  && dates.end!=='' &&
														dates.start!=='' ? clsx(classes.cell,classes.selectedRangeScnd) :
														clsx(classes.cell, classes.hover)} onClick={(e)=>slctRange(x)}>
                                        <div style={{display: 'grid'}} className={(dateFormat(new Date(pDate.year, pDate.month, x), 'ddmmyyyy') === dateFormat(dates.start, 'ddmmyyyy') && 
													   dates.start!=='' && x!=="") ||  (dateFormat(new Date(pDate.year, pDate.month, x), 'ddmmyyyy')=== dateFormat(dates.end, 'ddmmyyyy') 
															&& dates.end!=='' && x!=="") 
														 ? clsx(classes.firstSelected) :
														null}
													
											
										><span style={{alignSelf: 'center'}}>{x}</span>
										
										{x!=="" &&
											<div style={{display: 'inline-flex', justifyContent: 'space-evenly'}}>
												<div style={{alignSelf: 'flex-start', width:7, height:7, background: disSchedule[x]==='t'? 'red': disSchedule[x]==='e' ? 'red': 'blue', 
												borderRadius: '50%'}}></div>
												<div style={{alignSelf: 'flex-start', width:7, height:7, background: disSchedule[x]==='t'? 'red': disSchedule[x]==='s'? 'red' :'blue',
												borderRadius: '50%'}}></div>
											</div> 
										}
										</div>
                                    </Grid> 
								);
                            })

                        }
                    </Grid>

                    <DialogActions>
                        <Button onClick={() => setDates({ start: '', end: '' })} color="primary">Clear</Button>
                        <Button style={{marginLeft: '20px'}} onClick={handleClose} color="primary" >Cancel</Button>
                        <div style={{width: '100%',textAlign: 'right'}}>
							<Button onClick={Submit} color="primary">OK	</Button>
						</div>
						
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}

