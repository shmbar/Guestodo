import React from 'react';
import {Grid} from '@material-ui/core';

import MonthSelect from '../../Subcomponents/MonthSelect';
//import PrpSelect from './PrpSelect';


const LoadData = (props) => {
 
  return (
	  <div>
	  	<Grid container justifyContent={props.flx}>
			<Grid item>
	  			<MonthSelect allMonths={true}/>
			</Grid>			
	  	</Grid>
	</div>	  
  );
}

export default LoadData;


/*

	<PrpSelect />
*/