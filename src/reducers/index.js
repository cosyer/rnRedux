import { combineReducers } from 'redux';
import counter from "./count"
import nav from "./nav"
import list from "./list"
import login from "./login"
import detail from "./detail"

export default combineReducers({
    counter,
    nav,
    list,
    login,
    detail
});