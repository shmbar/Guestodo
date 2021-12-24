import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

const EditItem=(props)=>{
	const [value,setValue] = useState(props.item);
	
	return(
		<form
				style={{width:'100%'}}
				onSubmit={e => {
					e.preventDefault();
					props.editItem(props.id, value);
					setValue('');
					props.setIsediting(!props.isediting);
				}}>
			<TextField
					margin='normal'
					value={value}
					onChange={(e) => setValue(e.target.value)}
					fullWidth
					autoFocus
				/>
		</form>
		);
};

export default EditItem;