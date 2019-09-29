import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';

//import axios from 'axios';

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const { name, email, password, password2 } = formData;
	//This make state available to us without having to call setState(). Update it by calling setFormData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }) //Allows us to use onChange for all fields, previoulsly name: e.target.value
	//If we wanted to change the value at email, would default to whatever was passed to name

	const onSubmit = async e => {
		e.preventDefault();
		if(password !== password2) {
			console.log('Passwords do not match')
		} else {
			//Code below would allow us to save to the DB from the component, used as a test before adding redux
			/*const newUser = {
				name,
				email,
				password
			}
			try {
				//Since we're sending data, want to create a config object as a header obj
				const config = {
					headers: {
						'Content-Type': 'Application/json'
					}
				}
				const body = JSON.stringify(newUser);

				const res = await axios.post('/api/users', body, config);
				console.log(res.data)
			} catch(err) {
				console.error(err.response.data);
			}*/
			console.log('SUCCESS!')
		}
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group" >
          <input 
						type="text" 
						placeholder="Name" 
						name="name" 
						value={name}
						onChange={e => onChange(e)}
						required />
        </div>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
						value={password2}
						onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
		</Fragment>
	)
}

export default Register
