import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Platform,
    ToastAndroid,
} from 'react-native';
import { connect } from 'react-redux'
import CountDown from '../component/count-down'
import Toast from '../component/toast'
import Loading from '../component/dialog-loading'
import CModal from '../component/custom-modal'
import Button from '../component/button'
import Action from '../actions'
const width = Dimensions.get("window").width
const isAndroid = Platform.OS === 'android'

// let obj={a:1,b:2}
// const {a}=obj

const { loginCodeSendChange, loginParamsChange, sendVerifyCode, startLogin } = Action
@connect(state => ({
    login: state.login
}))
export default class Login extends Component {
    static navigationOptions = {
        headerTitle: '快速登录'
    };

    // 发送验证码 多个dispatch多次渲染
    _sendCode = () => {
        this.props.dispatch(sendVerifyCode())
    }

    // 倒计时结束
    _countingDone = () => {
        this.props.dispatch(loginCodeSendChange())
    }

    // 数据参数改变
    _changeParams = (name, value) => {
        this.props.dispatch(loginParamsChange({ name, value }))
    }

    // 登录
    _onLogin = () => {
        // ToastAndroid.showWithGravity(
        //     'This is a toast with top gravity',
        //     ToastAndroid.SHORT,
        //     ToastAndroid.CENTER,
        // )
        if (!this.props.login.phone) {
            Toast.show('请输入手机号', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            return
        }
        if (!this.props.login.verifyCode) {
            Toast.show('请输入验证码', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            return
        }
        if (!this.isPhone(this.props.login.phone)) {
            Toast.show('请输入正确的手机号', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
            return
        }
        this.props.dispatch(startLogin())
    }

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
        console.log(this.props)
        return (
            <View style={{ backgroundColor: '#f9f9f9', flex: 1, padding: 10 }}>
                <TextInput
                    // ref="textInput"
                    ref={(component) => this.c = component}
                    placeholder="输入手机号"
                    underlineColorAndroid="transparent" // 去除android底边框
                    multiline={true} // android垂直居中
                    // textAlignVertical='top' // android垂直居顶
                    maxLength={11}
                    autoCapitalize={'none'} // 自动转换为大写
                    autoCorrect={false} // 自动纠正
                    keyboardType={"numeric"}
                    // secureTextEntry={true} // 密码输入
                    clearButtonMode={"while-editing"} // ios 清除按钮
                    style={styles.inputField}
                    onChangeText={(text) => {
                        this._changeParams("phone", text)
                    }} />
                <View style={styles.verifyCodeBox}>
                    <TextInput
                        placeholder="输入验证码"
                        underlineColorAndroid="transparent"
                        keyboardType={"default"}
                        style={styles.verifyCodeInput}
                        onChangeText={(text) => {
                            this._changeParams("verifyCode", text)
                        }}
                    />
                    {
                        this.props.login.codeSend ?
                            <CountDown
                                text='重新发送'
                                style={styles.countBtn}
                                time={60}
                                afterEnd={this._countingDone}
                            /> :
                            <Button style={styles.countBtn} title="发送验证码" onPress={this._sendCode} />
                    }

                </View>
                <Button
                    title="登录"
                    style={styles.btn}
                    onPress={this._onLogin}
                />
                {/*  <Toast
                visible={this.props.login.codeSend}
                position={50}
                shadow={false}
                animation={false}
                hideOnPress={true}
            >This is a message</Toast>  */}
                <Loading visible={this.props.login.loading} />
                <CModal modalVisible={false} title="确定" onRightPress={() => this.props.dispatch(loginParamsChange({ name: "modalVisible", value: false }))} />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    inputField: {
        height: 40,
        padding: 0, // android底边框
        paddingLeft: 10,
        color: '#666',
        fontSize: 16,
        borderRadius: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#CCC'
    },
    verifyCodeInput: {
        width: width - 120,
        height: 40,
        padding: 0, // android底边框
        paddingLeft: 10,
        color: '#666',
        fontSize: 16,
        borderRadius: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#CCC'
    },
    verifyCodeBox: {
        marginTop: 10,
        marginBottom: 10,
        height: 40,
        width: width - 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countBtn: {
        width: 110,
        height: 40,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#ee735c',
        color: '#fff',
        borderColor: '#ee735c',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
        borderRadius: 2
    },
    btn: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: '#EE735C',
        borderWidth: 1,
        borderRadius: 4,
        color: '#ee735c'
    }
})


