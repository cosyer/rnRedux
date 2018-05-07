import { combineReducers } from 'redux';
import counter from "./count"
import nav from "./nav"

export default combineReducers({
    counter,
    nav
});