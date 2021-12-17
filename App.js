import React from 'react';
import Main from './components/Main';
import UploadData from './components/UploadData/Upload';
import RCProvider from './contexts/useRcContext';
import EXProvider from './contexts/useExContext';
import SettingsProvider from './contexts/useSettingsContext';
import CfProvider from './contexts/useCfContext';
import VtProvider from './contexts/useVtContext';
import OIProvider from './contexts/useOiContext';
import PrivateRoute  from './components/Subcomponents/PrivateRoute ';
import SelectProvider from './contexts/useSelectContext';
import Login from './components/Auth/login';
import SignUp from './components/Auth/signup';
import Home from './components/LandingPage/home';
import Contact from './components/LandingPage/contact';
import Terms from './components/LandingPage/termsofuse';
import Privacy from './components/LandingPage/privacy';
import Pmnt from './components/LandingPage/Pmnt';
import Features from './components/LandingPage/features';
import ResetPaswword from './components/Auth/passwordReset';
import {Switch, Route} from 'react-router-dom';
//import {AuthContext} from './contexts/useAuthContext';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Redirect } from "react-router-dom";
import './App.css';
import CD from './components/Subcomponents/cookiesDrawer';

//firebase hosting:channel:deploy new-awesome-feature --expires 7d
//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
///fsdfdsf
const App = (props) => {
	
  return (
	<div>
		<CD />
  		<SelectProvider>
			<OIProvider>
				<RCProvider>
					<EXProvider>
						<CfProvider>
							<VtProvider>
								<SettingsProvider>
									
								<Switch>
									<Route exact path='/' render={()=> <Redirect to='/home' />} />
									<Route path='/login' component={Login} />
									<Route path='/signup' component={SignUp} />
									<Route path='/home' component={Home} />
									<Route path="/contact"  component={Contact} />
									<Route path="/features"  component={Features} />
									<Route path="/userdef"  component={ResetPaswword} />
									<Route path="/terms"  component={Terms} />
									<Route path="/privacy"  component={Privacy} />
									<Route path="/pmnt"  component={Pmnt} />
									<PrivateRoute path="/owners"  component={Main} />
									<PrivateRoute path="/dataupload"  component={UploadData} />
								</Switch>
								</SettingsProvider>
							</VtProvider>
						</CfProvider>
					</EXProvider>
				</RCProvider>
			</OIProvider>	
	  	</SelectProvider>	
			    
	  	</div>
 		
  );
}

export default App;

/*

	
								<Route path='/owners' component={Main} />		
										<Main />
										*/
