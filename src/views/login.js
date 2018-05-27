import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  ToastAndroid,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import CountDown from "../component/count-down";
import Toast from "../component/toast";
import Loading from "../component/dialog-loading";
import CModal from "../component/custom-modal";
import Button from "../component/button";
import Action from "../actions";
const width = Dimensions.get("window").width;
const isAndroid = Platform.OS === "android";

// let obj={a:1,b:2}
// const {a}=obj

const {
  loginCodeSendChange,
  loginParamsChange,
  sendVerifyCode,
  startLogin
} = Action;
@connect(state => ({
  login: state.login
}))
export default class Login extends Component {
  static navigationOptions = {
    headerTitle: "快速登录"
  };

  componentDidMount() {
    // 判断用户是否登陆过
    let that = this;
    AsyncStorage.getItem("user").then(data => {
      console.log(data);
      if (data) {
        that.props.navigation.navigate("Home");
      }
    });
  }

  // 发送验证码 多个dispatch多次渲染
  _sendCode = () => {
    this.props.dispatch(sendVerifyCode(this.props.login.phone));
  };

  // 倒计时结束
  _countingDone = () => {
    this.props.dispatch(loginCodeSendChange());
  };

  // 数据参数改变
  _changeParams = (name, value) => {
    this.props.dispatch(loginParamsChange({ name, value }));
  };

  // 登录
  _onLogin = () => {
    // ToastAndroid.showWithGravity(
    //     'This is a toast with top gravity',
    //     ToastAndroid.SHORT,
    //     ToastAndroid.CENTER,
    // )
    if (!this.props.login.phone) {
      Toast.show("请输入手机号", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
      return;
    }
    if (!this.props.login.verifyCode) {
      Toast.show("请输入验证码", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
      return;
    }
    if (!this.isPhone(this.props.login.phone)) {
      Toast.show("请输入正确的手机号", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
      return;
    }
    let payload = {};
    let login = this.props.login;
    payload.phoneNumber = login.phone;
    payload.verifyCode = login.verifyCode;
    this.props.dispatch(startLogin(payload, this));
  };

  /**
   * 检验是否手机号
   * @param phone
   * @returns {boolean}
   */
  isPhone(phone) {
    let pass = true;
    let length = phone.length;
    let reg = /^((1)+\d{10})$/;
    // let reg = /^1[34578]\d{9}$/;
    pass = length == 11 && reg.test(phone);
    return pass;
  }

  render() {
    return (
      <View style={{ backgroundColor: "#f9f9f9", flex: 1, padding: 10 }}>
        <TextInput
          // ref="textInput"
          ref={component => (this.c = component)}
          placeholder="输入手机号"
          underlineColorAndroid="transparent" // 去除android底边框
          multiline={true} // android垂直居中
          // textAlignVertical='top' // android垂直居顶
          maxLength={11}
          autoCapitalize={"none"} // 自动转换为大写
          autoCorrect={false} // 自动纠正
          keyboardType={"numeric"}
          // secureTextEntry={true} // 密码输入
          clearButtonMode={"while-editing"} // ios 清除按钮
          style={styles.inputField}
          onChangeText={text => {
            this._changeParams("phone", text);
          }}
        />
        <View style={styles.verifyCodeBox}>
          <TextInput
            placeholder="输入验证码"
            underlineColorAndroid="transparent"
            keyboardType={"default"}
            style={styles.verifyCodeInput}
            onChangeText={text => {
              this._changeParams("verifyCode", text);
            }}
          />
          {this.props.login.codeSend ? (
            <CountDown
              text="重新发送"
              style={styles.countBtn}
              time={60}
              afterEnd={this._countingDone}
            />
          ) : (
            <Button
              style={styles.countBtn}
              textStyle={styles.countBtnText}
              onPress={this._sendCode}
            >
              发送验证码
            </Button>
          )}
        </View>
        <Button style={styles.btn} onPress={this._onLogin}>
          登录
        </Button>
        {/*  <Toast
                visible={this.props.login.codeSend}
                position={50}
                shadow={false}
                animation={false}
                hideOnPress={true}
            >This is a message</Toast>  */}
        <Loading visible={this.props.login.loading} title="登录中..." />
        <CModal
          modalVisible={this.props.login.modalVisible}
          title="确定"
          content="131231231231"
          onRightPress={() =>
            this.props.dispatch(
              loginParamsChange({ name: "modalVisible", value: false })
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputField: {
    height: 40,
    paddingTop: 10, // android底边框
    paddingLeft: 10,
    color: "#666",
    lineHeight: 16,
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CCC"
  },
  verifyCodeInput: {
    width: 200,
    height: 40,
    padding: 0, // android底边框
    paddingLeft: 10,
    marginRight: 10,
    color: "#666",
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CCC"
  },
  verifyCodeBox: {
    marginTop: 10,
    marginBottom: 10,
    height: 40,
    width: width - 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  countBtn: {
    flex: 1,
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#5aa9fa",
    borderRadius: 2
  },
  countBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14
  },
  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#5aa9fa",
    borderRadius: 2
  }
});
