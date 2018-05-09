/*
 * @Author: chenyu 
 * @Date: 2018-04-18 17:19:31 
 * @Last Modified by: chenyu
 * @Last Modified time: 2018-04-19 19:07:32
 */
import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    Easing
} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

import RootSiblings from 'react-native-root-siblings'; // 版本1.3.0

let loadingView = null;
let timer = null;
let rotationAnim = new Animated.Value(0);

let _initializeRotationAnimation = () => {
    rotationAnim.setValue(0);

    Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
    }).start(() => {
        if (loadingView) {
            _initializeRotationAnimation();
        }
    });
};

/**
 * 弹出HUDLoading 挡住下面的控件交互
 */
exports.showHUDLoading = (text, style) => {
    const hud = (
        <View style={styles.maskView}>
            <View style={[styles.iconContainer, styles.shadowStyle]}>
                <Animated.Image
                    style={styles.iconStyle}
                    source={require('./loading.png')} />
                <Text style={[{ color: '#fff', fontSize: 12 }, style]} allowFontScaling={false}>{text}</Text>
            </View>
        </View>
    );

    if (loadingView) {
        loadingView.update(hud);
    }
    else {
        loadingView = new RootSiblings(hud);
    }
    _initializeRotationAnimation();
};

/**
 * 隐藏HUD
 */
exports.hidenHUDLoading = () => {
    if (loadingView) {
        loadingView.destroy();
        loadingView = null;
    }
};

/**
 * 弹出提示message
 */
exports.showHUDMessage = (message, timeout) => {
    if (typeof message !== 'string') {
        return;
    }

    const hud = (
        <View style={styles.maskView}>
            <View style={[styles.textContainer, styles.shadowStyle]}>
                <Text style={styles.textStyle} allowFontScaling={false}>{message}</Text>
            </View>
        </View>
    );

    setTimeout(() => {
        if (loadingView) {
            loadingView.update(hud);
        }
        else {
            loadingView = new RootSiblings(hud);
        }
    }, 500);


    let t = 2500;
    if (timeout) {
        t = timeout;
    }

    timer = setTimeout(() => {
        if (loadingView) {
            loadingView.destroy();
            loadingView = null;
        }
    }, t);
};


const styles = StyleSheet.create({
    maskView: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 0.1 * WINDOW_WIDTH,
        backgroundColor: 'rgba(20,20,20,0.9)',
        borderRadius: 6
    },
    shadowStyle: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.7,
        shadowRadius: 0
    },
    textStyle: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.5,
        lineHeight: 18
    },
    iconContainer: {
        padding: 15,
        backgroundColor: 'rgba(20,20,20,0.9)',
        borderRadius: 6
    },
    iconStyle: {
        width: 48,
        height: 48,
        marginLeft: 6,
        tintColor: '#fcfcfc',
        transform: [{
            rotate: rotationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            })
        }]
    }
});