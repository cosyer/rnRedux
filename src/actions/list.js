import {
    INCREASE, DECREASE, RESET, LIST_FETCH_START, LIST_FETCH_SUCCESS,
    LIST_FETCH_FAILURE, LIST_STATE_CHANGE
} from '../constants/actionsTypes';
import Request from '../utils/request'
import Config from '../utils/config'
import Mock from 'mockjs'

// 计数器
const increase = () => ({ type: INCREASE });
const decrease = () => ({ type: DECREASE });
const reset = () => ({ type: RESET });

// List接口状态
const listFetchStart = () => ({ type: LIST_FETCH_START });
const listFetchSuccess = (data) => ({ type: LIST_FETCH_SUCCESS, payload: data });
const listFetchFailure = () => ({ type: LIST_FETCH_FAILURE });

const listStateChange = (index) => ({ type: LIST_STATE_CHANGE, payload: index });

const listFactorChange = (obj) => ({ type: LIST_STATE_CHANGE, payload: obj });

// list获取列表 为什么要尾调 函数嵌套 俄罗斯套娃
function refresh(payload) {
    return dispatch => {
        dispatch(listFetchStart())
        return Request.get(Config.api.base + Config.api.creations, payload, (data) => {
            console.log("list000", Mock.mock(data))
            dispatch(listFetchSuccess(data && Mock.mock(data)));
        })
    }
}

// 点赞
function onLiked(index) {
    return dispatch => {
        return Request.get(Config.api.base + Config.api.up, {}, (data) => {
            console.log(Mock.mock(data))
            dispatch(listStateChange(index))
        })
    }
}

export default {
    increase,
    decrease,
    reset,
    refresh,
    listStateChange,
    listFactorChange
}

// 组装的话需要default