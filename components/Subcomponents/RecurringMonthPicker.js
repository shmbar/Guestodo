import React, {useState, useEffect}from 'react';
import {Button,Grid, Menu, MenuItem, TextField, InputAdornment, IconButton   } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import EventIcon from '@material-ui/icons/Event';


const dateFormat = require('dateformat');	

export default function MonthsPicker(props) {
  	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [yr, setYr] = useState(props.date.year)
	const [yrRange, setYrRange] = useState([])
	const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const [mnth, setMnth] = useState('');
	
	
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
			  background: '#A5B5DF',
			  color: 'white',
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
		}
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
		setMnth('')
		setOpen(false);
  	};
	

	
	const slctMonths=(val)=>{
		
 		if(mnth===''){
 			setMnth(val)
			handleClose();
			props.setDate(new Date(yr, val,1))
		}	
	
	}
	
  return (
    <div style={{width: '185px'}}>
      <TextField
		  value={props.recDate===null ? '' : dateFormat(props.recDate,'mmmm yyyy')}
		  InputProps={{
				readOnly: true,
			  	endAdornment: (
					<InputAdornment position="end">
						  <IconButton onClick={handleClickOpen}  disabled={props.dis} >
								 <EventIcon />
						  </IconButton>

					</InputAdornment>
		  		),
			}}
		 disabled={props.dis} 
		 error={props.recDate===null && props.redValid ? true: false}
        />
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
						return <Grid key={i} item xs={4} className={classes.cell}
								   style={(props.recDate!==null &&  dateFormat(props.recDate ,'m')*1===i+1 &&  dateFormat(props.recDate ,'yyyy')*1===yr) ?
										{background: 'grey', color:'white'}: {}}  onClick={(e)=>slctMonths(i)} >
									{x}
								</Grid>
					})
				}
				
			</Grid>	

        </DialogContent>
       
      </Dialog>
    </div>
  );
}
