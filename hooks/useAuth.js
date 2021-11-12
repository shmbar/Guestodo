import  {useState, useEffect} from "react";
import firebase from 'firebase/app';
import 'firebase/auth';

const useAuth = () =>{
	const [stateAuth, setStateAuth] = useState(() => { const user = firebase.auth().currentUser;
				  return { initializing: !user, user} })
 
	
	const onChange= user=> {
    	setStateAuth({ initializing: false, user})
 	 }
	
  useEffect(() => {
	  
   const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, []);

  return stateAuth;
}

export default useAuth;
