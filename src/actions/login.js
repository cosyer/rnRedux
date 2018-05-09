import { LOGIN_CODE_SEND_CHANGE, LOGIN_PARAMS_CHANGE} from '../constants/actionsTypes';
import Request from '../utils/request'
import Config from '../utils/config'
import Mock from 'mockjs'

// Login
const loginCodeSendChange = (obj) => ({ type: LOGIN_CODE_SEND_CHANGE, payload: obj });
const loginParamsChange = (obj) => ({ type: LOGIN_PARAMS_CHANGE, payload: obj });

// list获取列表
// function refresh() {
//     return dispatch => {
//         dispatch(listFetchStart())
//         return Request.get(Config.api.base + config.api.creations, {}, (data) => {
//             console.log(Mock.mock(data))
//             dispatch(listFetchSuccess(data && Mock.mock(data)));
//         })
//     }
// }

export default{
    loginCodeSendChange,
    loginParamsChange
}