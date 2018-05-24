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
    // Modal,
    Dimensions,
    AsyncStorage,
    Platform,
    TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import Actions from '../actions';
import ImagePickerManager from 'react-native-image-picker' // 需要rnpm link
import * as Progress from 'react-native-progress'; // 需要手动添加libraries
import Button from '../component/button'
import Modal from 'react-native-root-modal'

const width = Dimensions.get("window").width
const { getQiniuToken, listFactorChange, listUserFactorChange, getQiniuTokenBase64, saveUser } = Actions

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
    nav: state.nav,
    list: state.list
}))
export default class Mine extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onEdit: () => this._onEdit()
        });
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        const headRightView = (
            <TouchableOpacity activeOpacity={1} style={{ marginRight: 16 }} onPress={() => navigation.state.params.onEdit()}>
                <Icons
                    name='edit'
                    style={{
                        color: '#fff',
                        fontSize: 20,
                    }}
                />
            </TouchableOpacity>)
        return {
            // 这里面的属性和App.js的navigationOptions是一样的。
            headerTitle: "我的设置",
            headerRight: headRightView
        }
    }

    _onEdit = () => {
        this.props.dispatch(listFactorChange({ name: 'modalVisible', value: true }))
    }

    _closeModal = () => {
        this.props.dispatch(listFactorChange({ name: 'modalVisible', value: false }))
    }

    _changeUserState = (name, value) => {
        this.props.dispatch(listUserFactorChange({ name: name, value: value }))
    }

    //  保存用户资料
    _submit = () => {
        this.props.dispatch(saveUser(this.props.list.user))
    }

    _getQiniuToken = (uri) => {
        let payload = {}
        payload.accessToken = this.props.list.user.accessToken
        payload.uri = uri
        payload.type = 'avatar'
        payload.cloud = 'qiniu'
        payload.user = this.props.list.user
        this.props.dispatch(getQiniuToken(payload))
    }

    _getQiniuTokenBase64 = (data, fileSize) => {
        let payload = {}
        payload.accessToken = this.props.list.user.accessToken
        payload.data = data
        payload.fileSize = fileSize
        payload.type = 'avatar'
        payload.cloud = 'qiniu'
        payload.user = this.props.list.user
        this.props.dispatch(getQiniuTokenBase64(payload))
    }

    // 选取图片
    _pickPhoto = () => {
        var that = this
        // ios10 需要在info.plist中增加NSPhotoLibraryUsageDescription和NSCameraUsageDescription
        ImagePickerManager.showImagePicker(photoOptions, (res) => {
            if (res.didCancel) {
                return
            }
            console.log(res)
            let avatarData = 'data:image/jpeg;base64,' + res.data
            if (Platform.OS == 'android') {
                that._getQiniuTokenBase64(res.data, res.fileSize)
            } else {
                //  生成七牛签名并上传图片
                that._getQiniuToken(res.uri)
            }
        })
    }

    // 退出登录
    _logout = () => {
        AsyncStorage.removeItem("user")
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
        let list = this.props.list
        const { user, avatarProgress, avatarUploadState } = list
        return (
            <View style={styles.container}>
                {
                    user.avatar
                        ?
                        <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer} >
                            <Image source={{ uri: user.avatar ? 'http://p33v4b0bc.bkt.clouddn.com/' + user.avatar : 'https://mydearest.cn/static/img/avatar.jpg' }} style={styles.avatarContainer} />
                            <View style={styles.avatarBox}>
                                {
                                    avatarUploadState ?
                                        <Progress.Circle
                                            showsText={true}
                                            color={'#ee735c'}
                                            size={75}
                                            progress={avatarProgress} />
                                        :
                                        <Image
                                            source={{ uri: user.avatar ? 'http://p33v4b0bc.bkt.clouddn.com/' + user.avatar : 'https://mydearest.cn/static/img/avatar.jpg' }}
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
                                    avatarUploadState ?
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
                    visible={list.modalVisible}
                    style={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        position: 'absolute'
                    }}
                >
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
                                defaultValue={user.nickname}
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
                                defaultValue={user.breed}
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
                                defaultValue={user.age}
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
                                style={[styles.gender, user.gender == 'male' ?
                                    styles.genderChecked : {}]}
                                name='ios-paw-outline'>男</Icon.Button>
                            <Icon.Button
                                onPress={() => {
                                    this._changeUserState('gender', 'female')
                                }}
                                style={[styles.gender, user.gender == 'female' ?
                                    styles.genderChecked : {}]}
                                name='ios-paw'>女</Icon.Button>
                        </View>
                        <Button style={styles.btn} textStyle={styles.countBtnText}
                            onPress={this._submit}>保存</Button>
                    </View>
                </Modal>
                <Button style={styles.btn} textStyle={styles.countBtnText}
                    onPress={this._go2Component}>封装的组件</Button>
                <Button style={styles.btn} textStyle={styles.countBtnText}
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
    },
    countBtnText: {
        color: '#5aa9fa',
        textAlign: 'center',
        fontSize: 14,
    }
});