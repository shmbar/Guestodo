import React, {useContext} from 'react';
import {List, ListSubheader, Checkbox, FormControlLabel} from '@material-ui/core';
import Item from './Item';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {SettingsContext} from '../../../../contexts/useSettingsContext';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const NameList =(props)=>{
	const {pmntsLogo} = useContext(SettingsContext);
	const defaultPicImg = pmntsLogo[pmntsLogo.length-1];

	const GreenCheckbox = withStyles({
		  root: {
			'&$checked': {
			  color: green[600],
			},
		  },
		  checked: {},
	})(props => <Checkbox color="default" {...props} />);
	
 	if(props.list!=null)
	return(
		<Paper>
			<List
				 component="nav"
				  aria-labelledby="nested-list-subheader"
				  subheader={
					<ListSubheader component="div" id="nested-list-subheader" style={{lineHeight: '30px'}}>
					 <FormControlLabel style={{padding:'5px', marginBottom: '0px'}}
						control={
							  <GreenCheckbox
								checked={props.activeOnly}
								onChange={props.handleChangeActive}
							  />
							}
						label="Active only"
			  		/>
					</ListSubheader>
				  }
				>
				{props.list.map((itm, i) => (
					<React.Fragment key={itm.id }>
						<Item   item={itm}
							img={props.typelist==='pmnts' && 
								(pmntsLogo.filter(x=> x.txt===itm.item)[0]!==undefined ?
							   	pmntsLogo.filter(x=> x.txt===itm.item)[0] : defaultPicImg) }
								removeItem={props.removeItem}
								editItem={props.editItem}
								typelist={props.typelist}
							/>
					{i < props.list.length-1 && <Divider />}
					</React.Fragment>	
				))}
			</List>	
		</Paper>
	);
	return null;
};

export default NameList;
