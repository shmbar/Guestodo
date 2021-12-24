import React, {createContext} from 'react';
import useSelectState from '../hooks/useSelectState';


export const SelectContext = createContext();

const SelectProvider=(props)=>{
	
		const OptsSelectStuff = useSelectState();
		
		return (
			<SelectContext.Provider value={OptsSelectStuff} >
				{props.children}
			</SelectContext.Provider>
		);
	};

export default SelectProvider;
