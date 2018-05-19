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
            console.log(Mock.mock(data))
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
                _upload(body)
            }
        })
    }
}

// 上传图片到七牛
function _upload(body) {
    console.log(body)
    var that = this
    var xhr = new XMLHttpRequest()
    var url = Config.qiniu.upload

    xhr.open('POST', url)
    xhr.onload = () => {
        // 请求失败
        if (xhr.status !== 200) {
            // AlertIOS.alert('上传失败，请重试')
            console.log(xhr.responseText)
            return
        }

        if (!xhr.responseText) {
            // AlertIOS.alert('上传失败，请重试')
            return
        }

        var response
        try {
            console.log(xhr.response)
            response = JSON.parse(xhr.response)
        } catch (e) {
            console.log(e)
            console.log("parse fails")
        }
        console.log(9999, response)
        if (response) {
            // 来自七牛
            if (response.key) {
                console.log('77777', response)
                // var user = this.state.user
                // user.avatar = response.key
                // that.setState({
                //     user: user, // 这个貌似可以去掉
                //     avatarProgress: 0,
                //     avatarUploading: false
                // })
                // // 上传到自己的服务器
                // that._asyncUser(true)
            }

            // 来自cloudinary
            // if (response.public_id) {
            //   var user = this.state.user
            //   user.avatar = response.public_id
            //   that.setState({
            //     user: user, // 这个貌似可以去掉
            //     avatarProgress: 0,
            //     avatarUploading: false
            //   })
            //   // 上传到服务器
            //   that._asyncUser(true)
            // }
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
    xhr.send(body)
}

export default {
    increase,
    decrease,
    reset,
    refresh,
    getQiniuToken,
    listStateChange,
    listFactorChange
}

// 组装的话需要default