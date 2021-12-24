import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import './headercss.css';

const ColFilter =({cols,handleToggleCols }) =>{
   
    const [anchorEl, setAnchorEl] = useState(null);
     
    const handleClick = event => {   setAnchorEl( event.currentTarget );    };
    //Open Menu
    const handleClose = () => { setAnchorEl(null);  };
	
    let filtRows = cols.filter(k=> !k.el).map(value => (
                <ListItem
                    key={value.field}
                    role={undefined} dense button onClick={() => handleToggleCols(value)} 
                    className="noPaddinTopBot">
				   	<Checkbox  checked={value.showcol}   tabIndex={-1}  /*disableRipple*/ /> 
					<ListItemText 
                            primary={value.header}
                            style={{textAlign: 'left'}}
                            className='txtFont noPaddRightLEft' 
					/>
                	</ListItem> 
    ));
    
    return(
        <div>
			<Menu  anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} className='colsFiltermenuTop'
								 PaperProps={{
						  			style: {
											maxHeight: 500,
											width: '30ch',
										  },
									}}
			>
                <h6 className='menuColFilterTitle txtFont'><span>Show Columns</span></h6>
             		 {filtRows}
            </Menu>
            <Tooltip title="Show Columns" leaveTouchDelay={0}>
                <IconButton  aria-owns={anchorEl ? 'Columns-menu' : undefined} aria-haspopup="true"  onClick={handleClick} style={{outline:'none'}} >
                    <SvgIcon className='iconHover'>
                        <path d="M16,5V18H21V5M4,18H9V5H4M10,18H15V5H10V18Z" />
                    </SvgIcon>
                </IconButton>
            </Tooltip>
			 
        </div>
       );
   };
    
export default ColFilter;    
