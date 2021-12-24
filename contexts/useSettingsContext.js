import React, {createContext} from 'react';
import useSettingsState from '../hooks/useSettingsState';


export const SettingsContext = createContext();

const SettingsProvider=(props)=>{
		const rcStuff = useSettingsState();
		
		return (
			<SettingsContext.Provider value={rcStuff}>
				{props.children}
			</SettingsContext.Provider>
		);
	};

export default SettingsProvider;
