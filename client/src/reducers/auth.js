import {
	REGISTER_SUCCESS,
	REGISTER_FAIL
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
		case REGISTER_SUCCESS:
			localStorage.setItem('token', payload.token); //fetching/get back token above in initialState and put token in localStorage. payload is an object
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			}
			
		case REGISTER_FAIL:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false
			}

		default:
			return state;
	}
}


