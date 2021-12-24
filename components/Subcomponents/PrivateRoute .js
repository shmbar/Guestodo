import React, {useContext} from "react";
import { Route, Redirect } from "react-router-dom";
import {AuthContext} from '../../contexts/useAuthContext';


const  PrivateRoute = ({component: Component,auth, ...rest}) =>{  
	
	const {user} = useContext(AuthContext);	
	
	let islogged = sessionStorage.getItem('isLogged');

	return (
	<div>
    	
	{!user.initializing && <Route {...rest} render={props => (user.user && islogged) ? (<Component {...props} {...rest} />) 
		  	:
		  (<Redirect to="/login" />) }  />}
        
	
		  </div>
		  );
};

export default PrivateRoute;