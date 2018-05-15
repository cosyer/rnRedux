import { LOGIN_CODE_SEND_CHANGE, LOGIN_PARAMS_CHANGE, LOGIN_TO_HOME } from '../constants/actionsTypes';
import Request from '../utils/request'
import Config from '../utils/config'
import Mock from 'mockjs'

// Login
const loginCodeSendChange = () => ({ type: LOGIN_CODE_SEND_CHANGE });
const loginParamsChange = (obj) => ({ type: LOGIN_PARAMS_CHANGE, payload: obj });
const loginToHome = () => ({ type: LOGIN_TO_HOME });

// Login 发送验证码
function sendVerifyCode() {
    return dispatch => {
        dispatch(loginCodeSendChange())
        return Request.get(Config.api.base + Config.api.verify, {}, (data) => {
            console.log(Mock.mock(data))
            dispatch(loginParamsChange({ name: "verifyCode", value: 1234 }))
        })
    }
}

function startLogin(that) {
    return dispatch => {
        dispatch(loginParamsChange({ name: "loading", value: true }))
        return Request.get(Config.api.base + Config.api.verify, {}, (data) => {
            console.log(Mock.mock(data))
            dispatch(loginToHome())
            that.props.navigation.navigate("Home")
        })
    }
}

export default {
    loginCodeSendChange,
    loginParamsChange,
    sendVerifyCode,
    startLogin,
    loginToHome
}