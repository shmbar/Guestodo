import React, {createContext} from 'react';
import useCfState from '../hooks/useCashFlowState';


export const CfContext = createContext();

const CFProvider=(props)=>{
		const cfStuff = useCfState();
		
		return (
			<CfContext.Provider value={cfStuff} >
				{props.children}
			</CfContext.Provider>
		);
	};

export default CFProvider;