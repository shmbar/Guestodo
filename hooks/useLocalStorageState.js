import {useState, useEffect} from 'react';

const UseLocalStorageState = (key,initialValue) =>{
 	// State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [state, setState] = useState(() => {
    
  	try {
      // Get from local storage by key
      	return  JSON.parse(window.localStorage.getItem(key) || String(initialValue)) ;
	} catch (e) {
		return initialValue;
		}
	});
	
	useEffect(()=>{
		window.localStorage.setItem(key, JSON.stringify(state) );
	}, [state, key]);
	
	return [state, setState];
 };

export default UseLocalStorageState;

