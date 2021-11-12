import React, {createContext} from 'react';
import useRcState from '../hooks/useRcState';


export const RcContext = createContext();

const RCProvider=(props)=>{
		const rcStuff = useRcState();
		
		return (
			<RcContext.Provider value={rcStuff}>
				{props.children}
			</RcContext.Provider>
		);
	};

export default RCProvider;
