import React, {createContext} from 'react';
import useVtState from '../hooks/useVatState';


export const VtContext = createContext();

const VTProvider=(props)=>{
		const vtStuff = useVtState();
		
		return (
			<VtContext.Provider value={vtStuff} >
				{props.children}
			</VtContext.Provider>
		);
	};

export default VTProvider;