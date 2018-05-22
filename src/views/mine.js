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
import Actions from '../actions';
import ImagePickerManager from 'react-native-image-picker' // 需要rnpm link
import * as Progress from 'react-native-progress'; // 需要手动添加libraries
import Button from '../component/button'

const width = Dimensions.get("window").width
const { getQiniuToken, listFactorChange } = Actions

const images = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAHgAeADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5qooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAbS9BSZ9KfFG8r7IkZ2boFBJP4CkEU5Oy3GD60Vqf8ACP6sFJOnz4/3f/r1nzQyW8hjlRkYdVYcii6NqmGrUVepBpeaa/Mj7GjjFA5zmrWlWM2o3sdrbD53PU9AO5PsKDGMXN8sVdvRFUDJ4BJPAArUTQdVkQMlhMVPQhetdqI9J8I2alwZrxxx0Lv9PQf55rEn8d3rOfs9rbonYPlj+YIqT25ZfhMGrY2o+ey0ja6v3b026afNanOXemXl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"
const headRightView = (
    <TouchableOpacity activeOpacity={1} style={{ marginRight: 16 }} onPress={() => console.log(this)}>
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
    nav: state.nav,
    list: state.list
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

    _onEdit = () => {
        this.props.dispatch(listFactorChange({ name: 'modalVisible', value: true }))
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
            //  生成七牛签名并上传图片
            that._getQiniuToken(avatarData)
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
        let user = this.props.list.user
        return (
            <View style={styles.container}>
                {
                    true
                        ?
                        <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer} >
                            <Image source={{ uri: user.avatar ? 'http://p33v4b0bc.bkt.clouddn.com/' + user.avatar : 'https://mydearest.cn/static/img/avatar.jpg' }} style={styles.avatarContainer} />
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
                    visible={list.modalVisible}>
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