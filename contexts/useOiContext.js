import React, {createContext} from 'react';
import useOiState from '../hooks/useOtherIncomeState';


export const OiContext = createContext();

const OIProvider=(props)=>{
		const oiStuff = useOiState();
		
		return (
			<OiContext.Provider value={oiStuff} >
				{props.children}
			</OiContext.Provider>
		);
	};

export default OIProvider;