/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Modal,
    Dimensions,
    AsyncStorage,
    Platform,
    TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import ImagePickerManager from 'react-native-image-picker' // 需要rnpm link
import * as Progress from 'react-native-progress'; // 需要手动添加libraries
import Button from '../component/button'

const width = Dimensions.get("window").width

const headRightView = (
    <TouchableOpacity activeOpacity={1} style={{ marginRight: 16 }}>
        <Icons
            name='edit'
            style={{
                color: '#fff',
                fontSize: 20,
            }}
        />
    </TouchableOpacity>)

// 选取图片的参数
const photoOptions = {
    title: '选择头像',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.8,
    allowsEditing: true,
    noData: false, // 设置成false，图片转成base
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

@connect(state => ({
    nav: state.nav
}))
export default class Mine extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerTitle: "我的账户",
        headerRight: headRightView,
        headerStyle: {
            backgroundColor: '#5AA9FA',
            height: Platform.OS === 'ios' ? 44 : 44,
            elevation: 0,
            shadowOpacity: 0,
        },
        headerTitleStyle: {
            fontSize: 18,
            color: 'white',
            alignSelf: 'center'
            // flex: 1,
            // textAlign: 'center',
        }
    });

    componentDidMount() {
        this.props.navigation.setParams({
            headerTitle: '我的账户',
        });
    }

    navigatePress = () => {
        alert('点击headerRight');
    }

    _getQiniuToken() {
        var accessToken = this.state.user.accessToken
        var signatureURL = config.api.base + config.api.signature
        return request.post(signatureURL, {
            accessToken: accessToken,
            type: 'avatar',
            cloud: 'qiniu'
        })
            .catch(e => {
                console.log(e)
            })
    }

    // 选取图片
    _pickPhoto() {
        var that = this
        // ios10 需要在info.plist中增加NSPhotoLibraryUsageDescription和NSCameraUsageDescription
        ImagePickerManager.showImagePicker(photoOptions, (res) => {
            if (res.didCancel) {
                return
            }
            console.log(res.data)
            let avatarData = 'data:image/jpeg;base64,' + res.data
            //  生成七牛签名并上传图片
            var uri = res.uri
            that._getQiniuToken()
                .then(data => {
                    console.log(data)
                    if (data && data.success) {
                        var token = data.data.token
                        var key = data.data.key
                        var body = new FormData()

                        body.append('token', token)
                        body.append('key', key)
                        body.append('file', {
                            type: 'image/jpeg',
                            uri: uri,
                            name: key
                        })
                        that._upload(body)
                    }
                })
        })
    }

    // 上传图片到七牛
    _upload(body) {
        console.log(body)
        var that = this
        var xhr = new XMLHttpRequest()
        var url = config.qiniu.upload

        that.setState({
            avatarUploading: true,
            avatarProgress: 0
        })

        xhr.open('POST', url)
        xhr.onload = () => {
            // 请求失败
            if (xhr.status !== 200) {
                AlertIOS.alert('上传失败，请重试')
                console.log(xhr.responseText)
                return
            }

            if (!xhr.responseText) {
                AlertIOS.alert('上传失败，请重试')
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

            if (response) {
                // 来自七牛
                if (response.key) {
                    var user = this.state.user
                    user.avatar = response.key
                    that.setState({
                        user: user, // 这个貌似可以去掉
                        avatarProgress: 0,
                        avatarUploading: false
                    })
                    // 上传到自己的服务器
                    that._asyncUser(true)
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
        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    var percent = Number((event.loaded / event.total).toFixed(2))
                    console.log(percent)
                    that.setState({
                        avatarProgress: percent
                    })
                }
            }
        }

        xhr.send(body)
    }

    // 退出登录
    _logout = () => {
        console.log(this.props)
        this.props.navigation.goBack(this.props.nav.routes[1].key) // is goback from not gobackto
        // const resetAction = NavigationActions.reset({
        //     index: 1,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'Home' }),
        //     ]
        // })
        // that.props.navigation.dispatch(resetAction)
        // that.props.navigation.dispatch(NavigationActions.back({
        //     key: this.props.nav.routes[1].key
        // }));
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    true
                        ?
                        <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer} >
                            <Image source={{ uri: 'https://mydearest.cn/static/img/avatar.jpg' }} style={styles.avatarContainer} />
                            <View style={styles.avatarBox}>
                                {
                                    false ?
                                        <Progress.Circle
                                            showsText={true}
                                            color={'#ee735c'}
                                            size={75}
                                            progress={10} />
                                        :
                                        <Image
                                            source={{ uri: 'https://mydearest.cn/static/img/avatar.jpg' }}
                                            style={styles.avatar} />
                                }
                            </View>
                            <Text style={styles.avatarTip}>戳这里换头像</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
                            <Text style={styles.avatarTip}>添加头像</Text>
                            <View style={styles.avatarBox}>
                                {
                                    false ?
                                        <Progress.Circle
                                            showsText={true}
                                            color={'#ee735c'}
                                            size={75}
                                            progress={10} />
                                        :
                                        <Icon
                                            name='ios-cloud-upload-outline'
                                            style={styles.plusIcon} />
                                }
                            </View>
                        </TouchableOpacity>
                }
                <Modal
                    visible={false}>
                    <View style={styles.modalContainer}>
                        <Icon
                            onPress={this._closeModal}
                            name='ios-close-outline'
                            style={styles.closeIcon} />
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>昵称</Text>
                            <TextInput
                                placeholder={'狗狗的昵称'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={""}
                                onChangeText={(text) => {
                                    this._changeUserState('nickname', text)
                                }} />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>品种</Text>
                            <TextInput
                                placeholder={'狗狗的品种'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={""}
                                onChangeText={(text) => {
                                    this._changeUserState('breed', text)
                                }} />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>年龄</Text>
                            <TextInput
                                placeholder={'狗狗的年龄'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={""}
                                onChangeText={(text) => {
                                    this._changeUserState('age', text)
                                }} />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>性别</Text>
                            <Icon.Button
                                onPress={() => {
                                    this._changeUserState('gender', 'male')
                                }}
                                style={[styles.gender,
                                styles.genderChecked]}
                                name='ios-paw-outline'>男</Icon.Button>
                            <Icon.Button
                                onPress={() => {
                                    this._changeUserState('gender', 'female')
                                }}
                                style={[styles.gender,
                                styles.genderChecked]}
                                name='ios-paw'>女</Icon.Button>
                        </View>
                        <Button style={styles.btn}
                            onPress={this._submit}>保存</Button>
                    </View>
                </Modal>
                <Button style={styles.btn}
                    onPress={this._logout}>退出登录</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbar: {
        flexDirection: 'row',
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    toolbarTitle: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    toolbarEdit: {
        position: 'absolute',
        right: 10,
        top: 26,
        color: '#fff',
        textAlign: 'right',
        fontWeight: '600',
        fontSize: 14
    },
    avatarContainer: {
        width: width,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666'
    },
    avatarBox: {
        marginTop: -(70 + 0.1 * width),
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusIcon: {
        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        color: '#999',
        fontSize: 20,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    avatarTip: {
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 14
    },
    avatar: {
        marginBottom: 15,
        width: width * 0.2,
        height: width * 0.2,
        resizeMode: 'cover',
        borderRadius: width * 0.1,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff'
    },
    fieldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#eee',
        borderBottomWidth: 1,
    },
    label: {
        color: '#ccc',
        marginRight: 10,
    },
    inputField: {
        height: 50,
        flex: 1,
        color: '#666',
        fontSize: 14
    },
    closeIcon: {
        position: 'absolute',
        width: 40,
        height: 40,
        fontSize: 32,
        right: 10,
        top: 30,
        color: '#ee735c'
    },
    gender: {
        backgroundColor: '#ccc'
    },
    genderChecked: {
        backgroundColor: '#ee735c'
    },
    btn: {
        marginTop: 25,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
        borderColor: '#EE735C',
        borderWidth: 1,
        borderRadius: 4,
    }
});