import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Lists from './modals/listOfItems/Lists';
import {SettingsContext} from '../../contexts/useSettingsContext';

const PmntsMethods =() =>{

		const { settings} = useContext(SettingsContext);
	
	return(
	<div>
       <Grid container >
			<Grid item xs={12} md={6}  lg={4}> 
					<Lists list={settings.pmntMethods || [] }
						typelist='pmnts'
						snkbar='payment method'
						lbl='Add new payment method' name='pmntMethods' 
						ttl='Payment Methods'/>
			</Grid>
     	</Grid>
 	</div>
	)
};

export default PmntsMethods;

