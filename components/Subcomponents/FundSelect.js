import React, {useContext, useState, useRef} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {ClickAwayListener, Grow, Paper, Popper, MenuItem, 
		MenuList, Button} from '@material-ui/core';
import {SettingsContext} from '../../contexts/useSettingsContext'; 
import useWindowSize from '../../hooks/useWindowSize';

import {SelectContext} from '../../contexts/useSelectContext';
import {itemToId, idToItem } from '../../functions/functions.js';


export default function FundSelect() {
  	const [open, setOpen] = useState(false);
	const {fundList, settings} = React.useContext(SettingsContext);
	const anchorRef = useRef(null);
	const {fundSlct, setFundSlct} = useContext(SelectContext);
	const scrSize = useWindowSize();
	
	const handleMenuItemClick = (event, index) => {
		setFundSlct(itemToId(settings.funds,fundList[index]))
		setOpen(false);
	
  	};	
	
	const handleToggle = () => {
    	setOpen(prevOpen => !prevOpen);
  	};

  	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
		  return;
		}
    	setOpen(false);
  	};
	
  return (
	  <>
          <Button
            style={{color: '#193E6D'}}
            size="large"
            aria-owns={open ? 'menu-list-grow' : undefined}
			ref={anchorRef}
            onClick={handleToggle}
          >  {	fundSlct==null ? (scrSize==='xs' ? 'Fund':'Choose fund') : idToItem(settings.funds ,fundSlct, 'item')}
            <ArrowDropDownIcon style={{marginLeft: '1rem'}}/>
          </Button>
       
        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
				  	{fundList.map((option, index) => (
				 		<MenuItem
							key={index}
							onClick={event => handleMenuItemClick(event, index)}
                      	>
                        	{option}
                      	</MenuItem>
					))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
	</>	  
  );
}
