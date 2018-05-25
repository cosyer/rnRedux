import { DETAIL_PARAMS_CHANGE } from '../constants/actionsTypes';

// 原始默认state
const defaultState = {
    videoOptions: {
        source: 'http://mydearest.cn/responsive/video/small.mp4', //视频地址
        rate: 1.0, // 控制暂停/播放，0 代表暂停paused, 1代表播放normal
        volume: 1.0, // 声音的放声音的放大倍数大倍数，0 为静音，1 为正常音量 ，更大的数字表示放大的倍数
        muted: false, // true代表静音，默认为false
        pause: true, // 暂停
        resizeMode: "cover", // 视频的自适应伸缩铺放行为，contain、stretch、cover
        repeat: false,  // 是否重复播放
        playInBackground: false, //app切换后台时，是否播放
        playWhenInactive: false, // ios

        videoLoaded: true, // video是否加载
        currentTime: 0, // 当前的播放时间
        videoProgress: 0, // 播放进度
        videoOk: true, // video是否能正常播放
    },


}

function detail(state = defaultState, action) {
    switch (action.type) {
        case DETAIL_PARAMS_CHANGE:
            state[action.payload.name] = action.payload.value
            return Object.assign({}, state);
        default:
            return state;
    }
}

export default detail