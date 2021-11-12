import React, {useContext, useState, useRef} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {ClickAwayListener, Grow, Paper, Popper, MenuItem, 
		MenuList, Button} from '@material-ui/core';
import {SettingsContext} from '../../contexts/useSettingsContext'; 

import {SelectContext} from '../../contexts/useSelectContext';
import {itemToId, idToItem } from '../../functions/functions.js';
import useWindowSize from '../../hooks/useWindowSize';



export default function OwnerSelect() {
  	const [open, setOpen] = useState(false);
	const {ownerList, settings} = useContext(SettingsContext);
	const anchorRef = useRef(null);
	const {valueOwner, handleChange} = useContext(SelectContext);
	const scrSize = useWindowSize();	
	
	const handleMenuItemClick = (event, index) => {
		handleChange(	itemToId(settings.owners,ownerList[index]))
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
            color="inherit"
            size="large"
            aria-owns={open ? 'menu-list-grow' : undefined}
			ref={anchorRef}
            onClick={handleToggle}
          >  {	valueOwner==null ? (scrSize==='xs' ? 'Owner':'Choose owner') : idToItem(settings.owners,valueOwner, 'item')}
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
				  	{ownerList.map((option, index) => (
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
