import React, {useContext, useState, useRef} from 'react';
import {Grid, ButtonGroup, Button, Popper, Grow, Paper, ClickAwayListener, Menu,
		MenuItem, MenuList, Tooltip } from '@material-ui/core';
import {SelectContext} from '../../contexts/useSelectContext';
import Divider from '@material-ui/core/Divider';
import useWindowSize from '../../hooks/useWindowSize';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
 	button: {
		color: '#193e6d'
  }
}));

const MonthSelect = (props) => {
	const [openMonth, setOpenMonth] = useState(false);
	const anchorRef = useRef(null);
	const {date, setDate} = useContext(SelectContext);
	const classes = useStyles();
	const months =  ['Jan', 'Feb', 'Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const scrSize = useWindowSize();							
	

	
	const handleMonthItemClick = (event, index) => {
		setDate({...date, 'month': index})
  	};	
	
	const handleClickMnth = (val) =>{
		
			if(val==='prev' && date.month===0){
				setDate({...date, 'month': 11, 'year': +date.year - 1})
			}else if(val==='next' && (date.month===11 || date.month===12)){
				setDate({...date, 'month': 0, 'year': +date.year + 1})
			}else if(val==='prev' && date.month!==0){
				setDate({...date, 'month': +date.month - 1})
			}else if(val==='next' && date.month!==11 && date.month!==12){
				setDate({...date, 'month': +date.month + 1})
			}
	}
	
	const handleClickYr = (val) =>{
		let newdTmp = val==='prev' ? +date.year - 1 : +date.year + 1;
		setDate({...date, 'year': newdTmp})
	}
	
	
	const handleMontClick = (event, index) => {
		handleMonthItemClick(event,index)
		setOpenMonth(false);
  	};	
	
	 const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
		  return;
		}
	setOpenMonth(false);
	 };
	
	const handleToggleMonth = () => {
    	setOpenMonth(prevOpen => !prevOpen);
  	};
	//` ${option} - ${date.year} `
	
const showDate=(x)=>{return x + '-' + date.year;}

  return (
	  <div>
		<Grid item>
			<ButtonGroup color="primary" aria-label="outlined primary button group" size="small" >
				<Tooltip title="Prev Year" placement="bottom">
		   			<Button onClick={()=>handleClickYr('prev')} className={classes.button}>{'<<'}</Button>
				</Tooltip> 
			 	<Tooltip title="Prev Month" placement="bottom">
					<Button onClick={()=>handleClickMnth('prev')} className={classes.button}>{'<'}</Button>
				</Tooltip> 
			  	<Button 
					aria-owns={openMonth ? 'menu-list-grow' : undefined} 
					ref={anchorRef}
					onClick={handleToggleMonth} className={classes.button}
			  	>  
					{ date.month===12 ? date.year : showDate(months[date.month])	}
			  	</Button>
				<Tooltip title="Next Month" placement="bottom">
			  		<Button onClick={()=>handleClickMnth('next')} className={classes.button}>{'>'}</Button>
				</Tooltip>
				<Tooltip title="Next Year" placement="bottom">
				<Button onClick={()=>handleClickYr('next')} className={classes.button} >{'>>'}</Button>
				</Tooltip>
			</ButtonGroup>
		</Grid>
		  
		{scrSize!=='xs' ?
				  <Popper open={openMonth} anchorEl={anchorRef.current} transition disablePortal style={{zIndex: 10}}>
				  {({ TransitionProps, placement }) => (
					<Grow
					  {...TransitionProps}
					  style={{
						transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
					  }}
					>
					  <Paper id="menu-list-grow">
						<ClickAwayListener onClickAway={handleClose}>
					  <MenuList >
							{months.map((option, index) => (
								<MenuItem
									key={index}
									onClick={event => handleMontClick(event, index)}
									selected={index === date.month} 
								>
									  {showDate(option)}
								</MenuItem>

							))}

							{props.allMonths  &&	<Divider variant="middle" /> }
							{props.allMonths  &&
								<MenuItem	key={months.length}	onClick={event => handleMontClick(event, months.length)}	>
									  {date.year}
								</MenuItem> }
						  </MenuList >
						</ClickAwayListener>
					  </Paper>
					</Grow>
				  )}
				</Popper>
			  	:  
			  	<Menu id="long-menu"	anchorEl={anchorRef.current} keepMounted	open={openMonth} onClose={handleClose} style={{top: 110}}
						PaperProps={{ style: { maxHeight: 80 * 4.5,	width: '14ch'}}}
			  	>
			  	{months.map((option, index) => (
					<MenuItem key={index}	onClick={event => handleMontClick(event, index)}
								selected={index === date.month} 
					>
						{showDate(option)}
					</MenuItem>

			  	))}
					  
					{props.allMonths  &&	<Divider variant="middle" /> }
					{props.allMonths  &&
			  		<MenuItem	key={months.length}	onClick={event => handleMontClick(event, months.length)}	>
			  			{date.year}
			  		</MenuItem> }
			  	</Menu>
			}
	  
	</div>	
  );
}

export default MonthSelect;


/*

   <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 50 * 4.5,
            width: '20ch',
          },
        }}
      >
      	{months.map((option, index) => (
				 		<MenuItem
							key={index}
							onClick={event => handleMontClick(event, index)}
							selected={index === date.month} 
                      	>
							  {showDate(option)}
						</MenuItem>
						
					))}
					  
					{props.allMonths  &&	<Divider variant="middle" /> }
				  	{props.allMonths  &&
					  	<MenuItem	key={months.length}	onClick={event => handleMontClick(event, months.length)}	>
							  {date.year}
						</MenuItem> }
      </Menu>
*/