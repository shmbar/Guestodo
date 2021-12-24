import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Lists from './modals/listOfItems/Lists';
import {SettingsContext} from '../../contexts/useSettingsContext';
import Typography from '@material-ui/core/Typography';
import {SelectContext} from '../../contexts/useSelectContext';

const Tab1 =() =>{

		const { settings} = useContext(SettingsContext);
		const {setPage} = useContext(SelectContext);
	
	return(
	<div>
       <Grid container direction='column'>
			<Grid item xs={12} md={6}  lg={4}> 
					<Lists list={settings.owners || []} 
						snkbar='owner'
						lbl='Add new owner' name='owners' 
						ttl='Owners'
						typelist='owners'/>
			</Grid>
		    <Typography variant="h6" style={{fontFamily: '"Varela Round", sans-serif', fontSize: '1rem', paddingTop: '15px'}}>
       			To proceed setting funds click <span style={{color: 'blue', cursor: 'pointer'}} onClick={()=>setPage('Funds')}>here </span> 
      		</Typography>
     	</Grid>
 	</div>
	)
};

export default Tab1;

					  
