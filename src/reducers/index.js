import { combineReducers } from 'redux';
import counter from "./count"
import stack from "./stack"

export default combineReducers({
    counter,
    stack
});