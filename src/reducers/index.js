import { combineReducers } from 'redux';
import counter from "./count"
import nav from "./nav"
import list from "./list"
import login from "./login"

export default combineReducers({
    counter,
    nav,
    list,
    login
});