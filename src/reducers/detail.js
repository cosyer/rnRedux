import { DETAIL_PARAMS_CHANGE } from "../constants/actionsTypes";
import { Dimensions } from "react-native";
// 原始默认state
const defaultState = {
  videoOptions: {
    source: "http://dir.mydearest.cn/responsive/video/small.mp4", //视频地址
    rate: 1.0, // 控制暂停/播放，0 代表暂停paused, 1代表播放normal
    volume: 1.0, // 声音的放声音的放大倍数大倍数，0 为静音，1 为正常音量 ，更大的数字表示放大的倍数
    muted: false, // true代表静音，默认为false
    pause: true, // 暂停
    resizeMode: "cover", // 视频的自适应伸缩铺放行为，contain、stretch、cover
    repeat: false, // 是否重复播放
    playInBackground: false, //app切换后台时，是否播放
    playWhenInactive: false, // ios

    isFullScreen: false, // 是否全屏
    videoCover:
      "http://124.129.157.208:8889/data/uploads/kecheng/2018/01/18/5a600b2c99836.png@0o_0l_220w.png", // 封面
    showVideoCover: true, // 是否显示封面
    videoLoaded: true, // video是否加载
    currentTime: 0, // 当前的播放时间
    duration: 0, // 总时长
    videoProgress: 0, // 播放进度
    videoOk: true, // video是否能正常播放
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width * 9 / 16
  },
  pageNum: 0
};

function detail(state = defaultState, action) {
  switch (action.type) {
    case DETAIL_PARAMS_CHANGE:
      state[action.payload.name] = action.payload.value;
      return Object.assign({}, state);
    default:
      return state;
  }
}

export default detail;
