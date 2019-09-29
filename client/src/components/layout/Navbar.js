//racf will create functional component, will take name of component from file name
import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className="navbar bg-dark">
      <h1>
				<Link to='/'>
					<i className="fas fa-code"></i> Green Healing Project
				</Link>
        
      </h1>
      <ul>
        <li>
					<a href="profiles.html">Developers</a>
				</li>
        <li>
					<Link to='/register'>Register</Link>
				</li>
        <li>
					<Link to='/login'>Login</Link>
				</li>
      </ul>
    </nav>
	)
}

export default Navbar
 