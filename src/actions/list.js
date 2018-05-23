import {
    INCREASE, DECREASE, RESET, LIST_FETCH_START, LIST_FETCH_SUCCESS,
    LIST_FETCH_FAILURE, LIST_STATE_CHANGE, LIST_FACTOR_CHANGE, LIST_USER_FACTOR_CHANGE
} from '../constants/actionsTypes';
import {
    AsyncStorage
} from 'react-native';
import Toast from '../component/toast'
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

const listFactorChange = (obj) => ({ type: LIST_FACTOR_CHANGE, payload: obj });

const listUserFactorChange = (obj) => ({ type: LIST_USER_FACTOR_CHANGE, payload: obj });

// list获取列表 为什么要尾调 函数嵌套 俄罗斯套娃
function refresh(payload) {
    return dispatch => {
        dispatch(listFetchStart())
        return Request.get(Config.api.base + Config.api.creations, payload, (data) => {
            console.log(Mock.mock(data))
            dispatch(listFetchSuccess(data.length > 0 ? Mock.mock(data) : { data: [], total: 0 }));
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

// 保存用户
function saveUser(user) {
    return dispatch => {
        Request.post(Config.api.base + Config.api.update, user, (data) => {
            AsyncStorage.setItem('user', JSON.stringify(user))
            dispatch(listFactorChange({ name: 'modalVisible', value: false }))
            Toast.show("保存成功", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        })
    }
}

// 获取七牛Token
function getQiniuToken(payload) {
    return dispatch => {
        return Request.post(Config.api.base + Config.api.signature, payload, (data) => {
            console.log(data)
            if (data && data.success) {
                var token = data.data.token
                var key = data.data.key
                var body = new FormData()

                body.append('token', token)
                body.append('key', key)
                body.append('file', {
                    type: 'image/jpeg',
                    uri: payload.uri,
                    name: key
                })
                _upload(body, payload.user, dispatch)
            }
        })
    }
}

// 获取七牛Token base64
function getQiniuTokenBase64(payload) {
    return dispatch => {
        return Request.post(Config.api.base + Config.api.signature, payload, (data) => {
            console.log(data)
            if (data && data.success) {
                var token = data.data.token
                var pic = payload.data;
                // var url = "http://up.qiniu.com/putb64/-1"
                var url = "https://upload.qiniup.com/putb64/" + payload.fileSize; //非华东空间需要根据注意事项 1 修改上传域名
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.status == 200) {
                        var response
                        try {
                            response = JSON.parse(xhr.response)
                        } catch (e) {
                            console.log(e)
                            console.log("parse fails")
                        }
                        if (response && response.key) {
                            // 来自七牛
                            payload.user.avatar = response.key
                            // 上传到自己的服务器
                            asyncUser(payload.user)
                            dispatch(listFactorChange({ name: 'user', value: payload.user }));
                        }
                    }
                }
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/octet-stream");
                xhr.setRequestHeader("Authorization", "UpToken " + token);
                xhr.send(pic);
            }
        })
    }
}

// 上传图片到七牛
function _upload(body, user, dispatch) {
    var that = this
    var xhr = new XMLHttpRequest()
    var url = Config.qiniu.upload

    xhr.open('POST', url)
    xhr.onreadystatechange = (e) => {
        // 请求失败
        if (xhr.readyState !== 4) {
            return
        }
        if (xhr.status == 200) {
            console.log(xhr)
            var response
            try {
                console.log(xhr.response)
                response = JSON.parse(xhr.response)
            } catch (e) {
                console.log(e)
                console.log("parse fails")
            }
            if (response && response.key) {
                // 来自七牛
                user.avatar = response.key
                // 上传到自己的服务器
                asyncUser(user)
                dispatch(listFactorChange({ name: 'user', value: user }));
            }
        }

        // 进度条
        // if (xhr.upload) {
        //     xhr.upload.onprogress = (event) => {
        //         if (event.lengthComputable) {
        //             var percent = Number((event.loaded / event.total).toFixed(2))
        //             console.log(percent)
        //             that.setState({
        //                 avatarProgress: percent
        //             })
        //         }
        //     }
        // }
        else {
            console.log("失败")
        }
    }
    xhr.send(body)
}

// 更新用户数据
function asyncUser(user) {
    if (user && user.accessToken) {
        Request.post(Config.api.base + Config.api.update, user, (data) => {
            AsyncStorage.setItem('user', JSON.stringify(user))
        })
    }
}

export default {
    increase,
    decrease,
    reset,
    refresh,
    saveUser,
    getQiniuToken,
    getQiniuTokenBase64,
    listStateChange,
    listFactorChange,
    listUserFactorChange
}

// 组装的话需要default