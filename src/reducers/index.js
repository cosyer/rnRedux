import { combineReducers } from 'redux';
import counter from "./count"
import nav from "./nav"
import list from "./list"

export default combineReducers({
    counter,
    nav,
    list
});