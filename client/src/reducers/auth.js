import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT
} from '../actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: null, //starts as null, when user is authenticated will be set to true
	loading: true,
	user: null 
}

export default function(state = initialState, action) {
	const { type, payload } = action;

	switch(type) {
		case USER_LOADED:
			return{
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload //name, email, avatar all conatined in the payload. Does not contain password b/c backend route removes password
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem('token', payload.token); //fetching/get back token above in initialState and put token in localStorage. payload is an object
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			};
			
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false
			};

		default:
			return state;
	}
}


