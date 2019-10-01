import {
	GET_PROFILE,
	PROFILE_ERROR
} from '../actions/types';

const initialState = {
	profile: null,
	profiles: [], //Initialized as empty array, profiles of developers ==> change to patients
	repos: [],
	loading: true,
	error: {}
};

export default function(state = initialState, action) {
	const {type, payload} = action;

	switch(type) {
		case GET_PROFILE:
			return {
				...state,
				profile: payload,
				lading:false
			}
		
		case PROFILE_ERROR :
			return {
				...state,
				error: payload,
				loading: false
			};
			default:
				return state;
	}
}