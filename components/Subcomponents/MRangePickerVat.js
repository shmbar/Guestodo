import React, {useState, useEffect}from 'react';
import {Button,Grid, Menu, MenuItem    } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import EventIcon from '@material-ui/icons/Event';

const dateFormat = require('dateformat');	

export default function MonthsPicker(props) {
  	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [yr, setYr] = useState(props.date.year)
	const [yrRange, setYrRange] = useState([])
	const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const [dates, setDates] = useState({start:'', end: ''});
	const [hvr,setHvr] = useState(null)
	const [slctFirst, setSlctFirst] = useState(false)
	
	useEffect(()=>{
		let yearsArr = [];
		for(let i=0; i<= 6; i++)yearsArr.push(props.date.year- 3 + i)
		setYrRange(yearsArr)
	},[props.date.year])
	

  	const theme = useTheme();
  	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const useStyles = makeStyles(theme => ({
		root: {
		//  padding: scrSize==='xs' ? theme.spacing(1, 1, 5, 1) : theme.spacing(1, 4, 5, 4),
		},
	  	cell:{
			height: 50,
			display: 'flex',
    		justifyContent: 'center',
    		alignItems: 'center',
			padding: 2,
			cursor: 'pointer',
			"&:hover": {
			  background: !slctFirst && '#A5B5DF',
			  color: !slctFirst && 'white',
			}
		 },
		btn:{
			minWidth:'unset',
			fontSize: '1rem',
			 fontWeight: 600,
			 color:'#909090',
			"&:hover": {
					color: '#181818',
					background: 'none',
				//	-webkit-transition: color .3s;
				  transition: 'color .3s'
			}
		},
		div:{
			height: 28,
			width: '100%',
			textAlign: 'center',
			alignItems: 'center',
			justifyContent: 'center',
			color: 'white',
			display: 'flex',
            background:'#3f51b5',
            userSelect: 'none'
		},
		firstSelected:{
			borderBottomLeftRadius: 15,
			borderTopLeftRadius: 15,
		},
		lastHover:{
			borderBottomRightRadius: 15,
			borderTopRightRadius: 15,
        },
        
	  }));
	
	
   	const classes = useStyles();
	
  	const handleClickYear = (event) => {
   	 	setAnchorEl(event.currentTarget);
  	};
	
	const handleCloseYear = (e,i) => {
    	setAnchorEl(null);
		i!=='backdropClick' && 	setYr(	yrRange.filter(x=> x===yrRange[i])[0]	)
  	};
	
	const handleClickYr = (val) =>{
		let newdTmp = val==='prev' ? +yr - 1 : +yr + 1;
		
		let yearsArr = [];
		for(let i=0; i<= 6; i++)yearsArr.push(newdTmp- 3 + i)
		setYrRange(yearsArr)
		setYr( newdTmp)
	}
	
	
  	const handleClickOpen = () => {
		setOpen(true);
  	};

	
  	const handleClose = () => {
		
		setDates({...dates,'start':'', 'end': ''})
		setSlctFirst(false)
		setHvr(null)
		setOpen(false);
  	};
	
	const setHovers=(val)=>{
		if(dates.start!==''){
			setHvr(val)
		}
	}
	
	const slctMonths=(val)=>{
	
 		if(dates.start==='' && dates.end===''){
 			setDates({...dates, 'start':val})
			setSlctFirst(true)
		
		}else if(dates.start!=='' && dates.end===''){
		 	setDates({...dates, 'end': val})
			let n1 = new Date(yr, dates.start);
			let n2 = new Date(yr, val);
			props.setValue({...props.value, 'From': dateFormat(n1,'mmm-yyyy'), 'To': dateFormat(n2,'mmm-yyyy')});
		 	handleClose();
		} 
	}
	
	
  return (
    <div>
      <Button color="primary" style={{textTransform: 'none', fontSize: '16px'}} onClick={handleClickOpen} size="large"
            endIcon={<EventIcon style={{marginLeft: '12px', marginBottom: '3px', fontSize: '24px'}}/>}>
       { props.value.From==='' ? '' : dateFormat(props.value.From, 'mmm-yyyy').toString().concat(' - ').concat(dateFormat(props.value.To, 'mmm-yyyy'))}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
       	<DialogTitle style={{padding: '8px 24px'}}>
		  <Grid  container >
					<Grid item xs={1}>
						<Button onClick={()=>handleClickYr('prev')} className={classes.btn} disableRipple style={{paddingLeft: '20px'}} >{'<<'}</Button>  
					</Grid>
					<Grid item xs={10} style={{textAlign: 'center'}}>
						<Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickYear} style={{fontSize: '18px'}}>
							  {yr}
							</Button>
							<Menu
							  anchorEl={anchorEl}
							  keepMounted
							  open={Boolean(anchorEl)}
							  onClose={handleCloseYear}
							>
							{
								yrRange.map((x,i)=>{
									return   <MenuItem key={i}  onClick={(e)=>handleCloseYear(e,i)}>{x}</MenuItem>
								})
							}
								
							</Menu>
					</Grid>
					<Grid item xs={1}  >
						<Button onClick={()=>handleClickYr('next')} className={classes.btn} disableRipple style={{right: '20px'}} >{'>>'}</Button>
					</Grid>
			</Grid>	
		</DialogTitle>
		<Divider />
        <DialogContent style={{padding: '6px 10px'}}>
        	
			<Grid  container >
				{
					months.map((x,i)=>{
						return <Grid key={i} item xs={4} className={classes.cell} onClick={(e)=>slctMonths(i)} 
								   	style={i < dates.start ? {pointerEvents: 'none', color: 'gainsboro'} : { userSelect: 'none'}}
								   	onMouseEnter={(e) => setHovers(i)}
        						
								   >
									<div className={(i===dates.start && dates.start!=='' && dates.end!=='' && i===dates.end) ?  clsx(classes.firstSelected, classes.lastHover, classes.div):
									(i===dates.start ) ? clsx(classes.firstSelected, classes.div):   
								 	(i>dates.start && dates.start!=='' && i === hvr ) ?   clsx(classes.lastHover, classes.div):
									(i>dates.start && dates.start!=='' && i < hvr) ?  classes.div:
									(i===dates.start && dates.start!=='' && dates.end!=='' && i===dates.end) ?  clsx(classes.firstSelected, classes.lastHover) : null } 
									> 
									{x}
									</div>
							</Grid>
							
					})
				}
				
			</Grid>	

        </DialogContent>
       
      </Dialog>
    </div>
  );
}
