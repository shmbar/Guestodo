import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import {VtContext} from '../../../../../contexts/useVtContext';
import RowOut from '../../../../Subcomponents/PaperRowOutput';
import Divider from '@material-ui/core/Divider';
import {Num2} from '../../../../../functions/functions.js';
import {SettingsContext} from '../../../../../contexts/useSettingsContext';


const showTR = (x) => x.indexOf("_") === -1 ? x : x.substring(0, x.indexOf("_"));

const DataSummary = () =>{

	const {value} = useContext(VtContext);
	const {settings} = useContext(SettingsContext);
	const cur =settings.CompDtls.currency


	return (
			<Grid container spacing={3}>
				<Grid item sm={12} >
					<RowOut name='Transaction'	value={showTR(value.Transaction)} 
							pad='19'  />
				</Grid>
				<Grid item sm={12} style={{width:'100%'}}>
					<RowOut name={value.VatPayRtrn<0? 'Vat to be returned': 'Vat to be paid'}
							value={value.VatPayRtrn!=='' ? `${cur} ${Num2(Math.abs(value.VatPayRtrn))}`: ''} 
							st={true}/>
				</Grid>
				<Grid item xs={12}> 
					<Divider />
					<RowOut name='Total Payment'
						value={(value.TtlPmnt!=='' && value.TtlPmnt!==0)?`${cur} ${Num2(value.TtlPmnt)}`:''}
							pad='20' />
				</Grid>
				<Grid item xs={12}>
					<RowOut name='Balance Due'
							value={(value.BlncVat!=='' && value.VatPayRtrn!=='')?`${cur} ${Num2(value.BlncVat)}`:''} 
							pad='0' />
				</Grid>
				<Grid item xs={12}>
					<RowOut name='Payment Status'
							//value={value.PmntStts!==null ?value.PmntStts : `0 $`} 
							value={value.TtlPmnt>0 ?value.PmntStts : ''} 
							pad='0' />
				</Grid>
			</Grid>
    );
    };

export default DataSummary;


/*

	
					
					
					
					
					
*/
