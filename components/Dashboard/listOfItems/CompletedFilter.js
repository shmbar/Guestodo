import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
//import './headercss.css';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import 'primeflex/primeflex.css';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

const CompletedFilter = (props) => {
  
    const [anchorEl, setAnchorEl] = useState(null);
     
    const handleClick = event => {   setAnchorEl( event.currentTarget );    };
    //Open Menu
    const handleClose = () => { setAnchorEl(null);  };    
	
	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	   
        return(
            <div >
		  		<Menu  id="Columns-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} className='colsFiltermenuTop'>
					<ListItem role={undefined} dense button onClick={props.runFltr} className="noPaddinTopBot" style={{paddingLeft: '7px'}}>
						<GreenCheckbox	checked={props.completedOnly}	onChange={props.handleChangeActive}	  />
						<ListItemText primary='Completed tasks' style={{textAlign: 'left'}}  className='txtFont noPaddRightLEft' />
                    </ListItem> 
				</Menu>
                <Tooltip title="Filter tasks" leaveTouchDelay={0}>
                    <IconButton  aria-owns={anchorEl ? 'Columns-menu' : undefined} aria-haspopup="true"  onClick={handleClick} style={{outline:'none'}} >
                       <MoreVertIcon />
                    </IconButton>
                </Tooltip>
            </div>
           );
   };
    
export default CompletedFilter;

