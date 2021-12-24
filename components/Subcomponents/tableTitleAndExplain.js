import React from 'react';
import { Tooltip} from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import { withStyles } from '@material-ui/core/styles';

const CustomToolTip = withStyles({
        tooltip: {
            fontSize: 13,
        },
})(Tooltip)

const TableTtl=(props)=>{
	
	return(
		<h5 className='ttlClr' >{props.ttl}
			 <CustomToolTip title={props.tltip}>
						<ContactSupportIcon style={{marginLeft: '20px'}}/>
			</CustomToolTip>
		</h5>
	)
	
}

export default TableTtl;