import React, {createContext} from 'react';
import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

const AuthProvider=(props)=>{
		const user = useAuth();
	
		let index_ = user.user!==null ? user.user.photoURL.indexOf("_"): null;
		const uidCollection = user.user!==null ? user.user.photoURL.slice(index_ + 1, user.user.photoURL.length): null;
	
		const admn =user.user!==null ? user.user.photoURL.slice(index_ - 4, index_ - 3)==='y' ? true : false : null;
		const uid = user.user!==null ? user.user.uid : null;
		const write = user.user!==null ? user.user.photoURL.slice(index_ - 3, index_ - 2)==='y' ? true : false : null;	
		const creator = user.user!==null ? user.user.photoURL.slice(index_ - 6, index_ - 5)==='y' ? true : false : null;
		const stuff = user.user!==null ? user.user.photoURL.slice(index_ - 5, index_ - 4)==='c' ? false : true : null; //c===propperty owner
		const PropMangr = user.user!==null ? user.user.photoURL.slice(index_ - 5, index_ - 4)==='a' ? true : false : null; //a===propperty manager
		const acnt =  user.user!==null ? user.user.photoURL.slice(index_ - 5, index_ - 4)==='d' ? true : false : null; //c===propperty owner
	
		return (
		<AuthContext.Provider value={{user, admn, uid, write, uidCollection, creator, stuff, PropMangr,acnt}} >
				{props.children}
			</AuthContext.Provider>
		);
	};

export default AuthProvider;
