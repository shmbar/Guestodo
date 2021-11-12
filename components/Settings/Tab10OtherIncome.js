import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Lists from './modals/listOfItems/Lists';
import {SettingsContext} from '../../contexts/useSettingsContext';


const Tab10 =() =>{

		const { settings} = useContext(SettingsContext);
	
	
	return(
	<div>
       <Grid container >
	   		<Grid item xs={12} md={6}  lg={4}>  
					<Lists list={settings.incType || []}
						typelist='nothing'
						snkbar='income type'
						 lbl='Add new income type' name='incType'
						ttl='Revenue Type'/>
			</Grid>
     	</Grid>
 	</div>
	)
};

export default Tab10;
