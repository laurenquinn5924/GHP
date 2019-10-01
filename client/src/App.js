import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import About from './components/layout/About';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

//Redux
import { Provider } from 'react-redux'; 
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

//In actions/auth.js this auth only runs the first time a user is loaded, want it to run each time user is loaded so that's why it's in App.js
if(localStorage.token) {
		setAuthToken(localStorage.token); 
	}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	//Catch when using useEffect, unless it's passed a second parameter of [] will continuously run in a loop

return (
	<Provider store={store}>
		<Router>
			<Fragment>
				<Navbar />
				<Route exact path="/" component={ Landing } />
				<Route exact path="/about" component={ About } />
				<section className="container">
					<Alert />
					<Switch>
						<Route exact path="/login" component={ Login } />
						<Route exact path="/register" component={ Register } />
						<PrivateRoute exact path="/dashboard" component={Dashboard} />
					</Switch>
				</section>
			</Fragment>
		</Router>
	</Provider>
)}
export default App;
