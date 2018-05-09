import { INCREASE, DECREASE, RESET, LIST_FETCH_START, LIST_FETCH_SUCCESS, LIST_FETCH_FAILURE, LIST_STATE_CHANGE } from '../constants/actionsTypes';
import Request from '../utils/request'
import Mock from 'mockjs'

// 计数器
const increase = () => ({ type: INCREASE });
const decrease = () => ({ type: DECREASE });
const reset = () => ({ type: RESET });

// 接口状态
const fetchStart = () => ({ type: LIST_FETCH_START });
const fetchSuccess = (data) => ({ type: LIST_FETCH_SUCCESS, payload: data });
const fetchFailure = () => ({ type: LIST_FETCH_FAILURE });

const stateChange = (index) => ({ type: LIST_STATE_CHANGE, payload: index });

const factorChange = (obj) => ({ type: LIST_STATE_CHANGE, payload: obj });

// 列表
function refresh() {
    return dispatch => {
        dispatch(fetchStart())
        return Request.get("http://rap.taobao.org/mockjs/8417/api/creations", {}, (data) => {
            console.log(Mock.mock(data))
            dispatch(fetchSuccess(data && Mock.mock(data)));
        })
    }
}

// setTimeout(() => {
//     dispatch(refreshSuccess(json && json.data.list));
// }, 3000);

export {
    increase,
    decrease,
    reset,
    refresh,
    stateChange,
    factorChange
}