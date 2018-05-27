import {
  LOGIN_CODE_SEND_CHANGE,
  LOGIN_PARAMS_CHANGE
} from "../constants/actionsTypes";
import { AsyncStorage } from "react-native";
import Toast from "../component/toast";
import Request from "../utils/request";
import Config from "../utils/config";
import Mock from "mockjs";

// Login
const loginCodeSendChange = () => ({ type: LOGIN_CODE_SEND_CHANGE });
const loginParamsChange = obj => ({ type: LOGIN_PARAMS_CHANGE, payload: obj });

// Login 发送验证码
function sendVerifyCode(phone) {
  return dispatch => {
    dispatch(loginCodeSendChange());
    return Request.post(
      Config.api.base + Config.api.signup,
      { phoneNumber: phone },
      data => {
        console.log(Mock.mock(data));
      }
    );
  };
}

// 登录
function startLogin(payload, that) {
  return dispatch => {
    dispatch(loginParamsChange({ name: "loading", value: true }));
    return Request.post(Config.api.base + Config.api.verify, payload, data => {
      console.log(Mock.mock(data));
      if (!data.success) {
        dispatch(loginParamsChange({ name: "loading", value: false }));
        Toast.show(data.err, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0
        });
      } else {
        // 存储用户信息
        console.log(111111, data);
        AsyncStorage.setItem("user", JSON.stringify(data.data)).then(() => {
          dispatch(loginParamsChange({ name: "loading", value: false }));
          that.props.navigation.navigate("Home");
        });
      }
    });
  };
}

export default {
  loginCodeSendChange,
  loginParamsChange,
  sendVerifyCode,
  startLogin
};
