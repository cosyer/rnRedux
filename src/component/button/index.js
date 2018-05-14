/*
 * @Author: chenyu 
 * @Date: 2018-05-14 22:00:03 
 * @Last Modified by:   chenyu 
 * @Last Modified time: 2018-05-14 22:00:03 
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

        // umEventId 用于友盟统计,如果为空则认为不需要友盟统计
        eventId: null,
        // umEventData 用于友盟统计 ， 可以为空
        eventData: null,
    };

    render() {
        return (
            <TouchableOpacity
                activeOpacity={this.props.activeOpacity}
                onPress={this._onPress}
                style={[styles.container, this.props.style]}>
                {this.loadContent()}
            </TouchableOpacity>
        );
    };

    // 点击事件
    _onPress = () => {
        this.props.onPress();
        // 如果有eventId 表示需要友盟统计，此时应当调用友盟api
        if (this.props.eventId && NativeModules.Umeng) {
            NativeModules.Umeng.onEventWithMap(this.props.eventId, this.props.eventData);
        };
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