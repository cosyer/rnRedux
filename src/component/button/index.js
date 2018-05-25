/*
 * @Author: chenyu 
 * @Date: 2018-05-14 22:00:03 
 * @Last Modified by: chenyu
 * @Last Modified time: 2018-05-25 21:46:25
 */

import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Image,
    NativeModules
} from 'react-native';

/**
 * Usage：
 *
 * <Button style={{}} textStyle={{}}>
 *  登录
 * </Button>
 */
export default class Button extends Component {

    static defaultProps = {
        type: 'text',// 模式    text 文字按钮  image 图片按钮  imageText 图文混合按钮
        imageSource: null, // 图片资源  一般是  require('#/image...')
        style: {},// 按钮样式，有默认值，可不传。
        textStyle: {}, // 按钮文字样式，有默认值，可不传。
        /*按钮press的回调*/
        onPress: () => {
        },
        // 默认透明度
        activeOpacity: 0.5,

        // 不可用
        disabled: false
    };

    render() {
        console.log(this.props.style.backgroundColor)
        return (
            <TouchableOpacity
                activeOpacity={this.props.activeOpacity}
                onPress={this._onPress}
                style={this.props.disabled ? [styles.container, this.props.style, { backgroundColor: '#eee' }] : [styles.container, this.props.style]}>
                {this.loadContent()}
            </TouchableOpacity>
        );
    };

    // 点击事件
    _onPress = () => {
        if (!this.props.disabled) {
            this.props.onPress();
        }
    };

    loadContent() {
        if (this.props.type == 'text') {
            return (
                <Text style={[styles.btn, this.props.textStyle]} allowFontScaling={false}>
                    {this.props.children}
                </Text>
            )
        } else if (this.props.type == 'image' && this.props.imageSource) {
            return (
                <Image source={this.props.imageSource} />
            )
        } else if (this.props.type == 'imageText') {
            return (
                <View style={[styles.contentViewStyle, this.props.contentViewStyleNew]}>
                    <Image source={this.props.imageSource} />
                    <Text style={[styles.btn, this.props.textStyle]} allowFontScaling={false}>
                        {this.props.children}
                    </Text>
                </View>
            )
        } else if (this.props.type == 'textImage') {
            return (
                <View style={[styles.contentViewStyle, this.props.contentViewStyleNew]}>
                    <Text style={[styles.btn, this.props.textStyle]} allowFontScaling={false}>
                        {this.props.children}
                    </Text>
                    <Image source={this.props.imageSource} />
                </View>
            )
        }
    }
}

//style
let styles = StyleSheet.create({
    container: {
        backgroundColor: '#1EB4E5',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
        paddingBottom: 8
    },
    btn: {
        fontSize: 16,
        color: '#FFF'
    },
    contentViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',

    }
});