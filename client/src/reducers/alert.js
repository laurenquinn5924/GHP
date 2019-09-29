//Reducer is a function that takes in a piece of state and an action
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
	switch(action.type) {
		case SET_ALERT:
			return [...state, action.payload];
		case REMOVE_ALERT:
			return state.filter(alert => alert.id != payload);
		default: 
			return state;
	}
}