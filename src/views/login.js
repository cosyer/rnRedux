import React from 'react';
import {
    Button,
    Image,
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions
} from 'react-native';

const width = Dimensions.get("window").width
export default class Login extends React.Component {
    static navigationOptions = {
        headerTitle: '快速登录',
    };

    render() {
        console.log(this.props)
        return (
            <View style={{ backgroundColor: '#f9f9f9', flex: 1 }}>
                <TextInput
                    placeholder="输入手机号"
                    underlineColorAndroid="transparent"
                    maxLength={11}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={"number-pad"}
                    style={styles.inputField}
                    onChangeText={(text) => {
                        this.setState({
                            phoneNumber: text
                        })
                    }} />
                <View style={styles.verifyCodeBox}>
                    <TextInput
                        placeholder="输入验证码"
                        underlineColorAndroid="transparent"
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={"number-pad"}
                        style={styles.inputField}
                    />
                </View>
                <Button
                    title="登录"
                    style={styles.btn}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputField: {
        // marginTop:5,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#CCC'
    },
    verifyCodeBox: {
        marginTop: 10,
        height: 40,
        padding: 5,
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    countBtn: {
        width: 110,
        height: 40,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 8,
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
