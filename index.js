import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/useAuthContext';
import ScrollTop from './components/Subcomponents/ScrollTop.js';

ReactDOM.render(
		<BrowserRouter>
			<AuthProvider>
				<ScrollTop />
				<App />
			</AuthProvider>
		</BrowserRouter>,
	document.getElementById('root')
);