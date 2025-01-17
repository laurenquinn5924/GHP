import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
//import axios from 'axios';

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const { email, password } = formData;
	//This make state available to us without having to call setState(). Update it by calling setFormData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }) //Allows us to use onChange for all fields, previoulsly name: e.target.value
	//If we wanted to change the value at email, would default to whatever was passed to name

	const onSubmit = async e => {
		e.preventDefault();
		login(email, password);
	}

	//Redirect if logged in

	if(isAuthenticated) {
		return <Redirect to="/dashboard" />
	}
	
	return (
		<Fragment>
			<h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign IntoYour Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input 
						type="email" 
						placeholder="Email Address" 
						name="email"
						value={email}
						onChange={e => onChange(e)} 
						required
						/>
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div> 
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
						value={password}
						onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
		</Fragment>
	)
}

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login)
