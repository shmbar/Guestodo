import React, {useState, useContext} from 'react';

import {IconButton, Tooltip} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import pencil from '../../logos/Pencil.png';
import AptIcon from '@material-ui/icons/DeviceHub';

import {AuthContext} from '../../contexts/useAuthContext';


export const EditDel = (props) => {

	const [s, setS] = useState(null);	
	const {write} = useContext(AuthContext);	
	const {selectValueOrder, rowData, column, delRow, dis, selectPropertyData, properties, dsbl} = props;
	//dis - disable id row is deleted
	//dsbl - disable delete channels and payment methods
	
        let moshe = 	<div style={{display: 'inline-flex'}}  onMouseLeave={(s) =>setS(null)}>
							{properties && <Tooltip title="Apartments" aria-label='Edit'>
								<span>
									<IconButton aria-label='Edit' onClick={() => selectPropertyData(rowData)}
										disabled={dis}>
										<AptIcon />
									</IconButton>
								</span>	
							</Tooltip> }
							<Tooltip title="Edit" aria-label='Edit'>
								<span>
									<IconButton aria-label='Edit' onClick={() => selectValueOrder(rowData)} disabled={dis}>
										<EditIcon disabled={true}  />
									</IconButton>
								</span>
							</Tooltip> 
							<Tooltip title="Delete" aria-label='Delete'>
								<span>	
									<IconButton aria-label='Delete' onClick={()=> delRow(rowData)}	  disabled={!write || rowData.NetAmnt==='' || dis || dsbl}>
										<DeleteIcon  />
									</IconButton>
								</span>
							</Tooltip>	 
						</div>;
		
		let shauli = 	<div style={{display: 'inline-flex'}} onMouseEnter={(s) =>setS(column.rowIndex)} >
								<Tooltip title="Edit" aria-label='Edit'>
									<IconButton aria-label='Edit' onClick={() => selectValueOrder(rowData)}  >
										<img src={pencil} alt='Edit' width='24' />
									</IconButton>
								</Tooltip>
					</div>;
		
		
		
		return (s!==column.rowIndex) ?  shauli : moshe ;
    }

export default EditDel;