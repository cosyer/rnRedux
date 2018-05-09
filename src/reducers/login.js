import { LOGIN_CODE_SEND_CHANGE, LOGIN_PARAMS_CHANGE } from '../constants/actionsTypes';
// 原始默认state
const defaultState = {
    codeSend: false, // 验证码发送状态
    phone: "",// 手机号
    verifyCode: "",// 验证码
}

function login(state = defaultState, action) {
    switch (action.type) {
        case LOGIN_CODE_SEND_CHANGE:
            state.codeSend = !state.codeSend
            return Object.assign({}, state);
        case LOGIN_PARAMS_CHANGE:
            state[action.payload.name] = action.payload.value
            return Object.assign({}, state);
        default:
            return state;
    }
}

export default login