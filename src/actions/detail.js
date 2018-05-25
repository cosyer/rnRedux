import { DETAIL_PARAMS_CHANGE } from '../constants/actionsTypes';
import { AsyncStorage } from 'react-native'
import Toast from '../component/toast'
import Request from '../utils/request'
import Config from '../utils/config'
import Mock from 'mockjs'

const detailParamsChange = (obj) => ({ type: DETAIL_PARAMS_CHANGE, payload: obj });

// 查询详情 
function queryDetail(phone) {
    return dispatch => {
        // dispatch(loginCodeSendChange())
        return Request.post(Config.api.base + Config.api.signup, { phoneNumber: phone }, (data) => {
            console.log(Mock.mock(data))
        })
    }
}

export default {
    detailParamsChange,
    queryDetail
}