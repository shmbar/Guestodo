import React, { useState, useEffect } from 'react';
import { Button, Grid, IconButton,
		DialogActions, Typography, DialogTitle, DialogContent,Dialog } from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import EventIcon from '@material-ui/icons/Event';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';



const dateFormat = require('dateformat');

export default function DatesRangePicker(props) {
    const [open, setOpen] = useState(false);
    const [dates, setDates] = useState({ start: '', end: ''});
    const [arrdays, setArrdays] = useState([]);
    const [pDate, setPDate] = useState({month: new Date().getMonth(), year: new Date().getFullYear()}); //panel date
    const weekDays = ['SU', 'MO', 'TU', 'WE', ' TH', 'FR', 'SA'];


	
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
		
        setArrdays(arr);
		
    }, [pDate]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const useStyles = makeStyles((theme) => ({
      
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
		props.setDates({'start': new Date(dates.start), 'end': new Date(dates.end) })
		setOpen(false);
	}
	
	
    const slctRange = (val) => {
	
		if(dates.start > new Date(pDate.year, pDate.month, val))return;
		
        if (dates.start === '' && dates.end === '') {
			
           		setDates({ ...dates, start: new Date(pDate.year, pDate.month, val)});
        }else if (dates.start !== '' && dates.end === '') {			
				if(dateFormat(dates.start)===dateFormat(new Date(pDate.year, pDate.month, val)))return;

            	setDates({ ...dates, 'end': new Date(pDate.year, pDate.month, val) });
				
        }
    };

	
    const handleClickMnth = (val) => {
        if (val === 'prev' && pDate.month === 0) {
            setPDate({ ...pDate, month: 11, year: +pDate.year - 1 });
        } else if (val === 'next' && pDate.month === 11) {
            setPDate({ ...pDate, month: 0, year: +pDate.year + 1 });
        } else if (val === 'prev' && pDate.month !== 0) {
            setPDate({ ...pDate, month: +pDate.month - 1 });
        } else if (val === 'next' && pDate.month !== 11) {
            setPDate({ ...pDate, month: +pDate.month + 1 });
        }
    };

    return (
        <div>
			 <Button style={{textTransform: 'none', fontSize: '16px',  color: 'rgba(0, 0, 0, 0.54)', float: 'right'}} onClick={handleClickOpen} size="large" 
            endIcon={<EventIcon style={{marginLeft: '12px', marginBottom: '3px', fontSize: '24px', color: 'rgba(0, 0, 0, 0.54)'}}/>}>
       { props.dates.start !== props.dates.end ? dateFormat(props.dates.start, 'mmm-dd-yyyy').toString().concat(' - ').concat(dateFormat(props.dates.end,
																						'mmm-dd-yyyy')): 'Select Dates'}
      </Button>
	
          
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
														className={		 x==="" ? clsx(classes.cell, classes.disableClick) :								
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

