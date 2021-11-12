import {useState, useEffect} from 'react';

const UseSessionStorageState = (key,initialValue) =>{
 	// State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [state, setState] = useState(() => {
    
  	try {
      // Get from local storage by key
      	return  JSON.parse(window.sessionStorage.getItem(key) || String(initialValue)) ;
	} catch (e) {
		return initialValue;
		}
	});
	
	useEffect(()=>{
		window.sessionStorage.setItem(key, JSON.stringify(state) );
	}, [state, key]);
	
	return [state, setState];
 };

export default UseSessionStorageState;

