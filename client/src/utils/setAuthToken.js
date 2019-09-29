//Function that takes in a token. If the token is there will add to headers otherwise will delete headers
import axios from 'axios'; //Not making a http request, but adding a global header

const setAuthToken = token => {
	if(token) {
		axios.defaults.headers.common['x-auth-token'] = token;
	}
	else {
		delete axios.defaults.headers.common['x-auth-token'];
	}
}

export default setAuthToken