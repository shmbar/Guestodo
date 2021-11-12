import React, {createContext} from 'react';
import useExState from '../hooks/useExState';


export const ExContext = createContext();

const EXProvider=(props)=>{
		const exStuff = useExState();
		
		return (
			<ExContext.Provider value={exStuff} >
				{props.children}
			</ExContext.Provider>
		);
	};

export default EXProvider;