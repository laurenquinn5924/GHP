const jwt = require('jsonwebtoken');
const config = require('config');

//Middleware function takes in req, res, and next. Once the request has been sent and received a response, next allows it to go on to the next piece of middleware
module.exports = function(req, res, next) {
	//Get token from header, sending variable from a protected route needs to be sent in the header.
	const token = req.header('x-auth-token');

	//Check if no token
	if(!token) {
		return res.status(401).json({ msg: 'No token, authorization denied.' });
	}
	//If there is a token, Verify token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret')); //Verify takes in two parameters: token, sent in header, and the secret, get from config.get
		req.user = decoded.user;
		next();

	} catch(err) { //Will run if token is not valid
		res.status(401).json({ msg: 'Token is not valid, auth.js' })
	}
}