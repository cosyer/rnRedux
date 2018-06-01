import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

export default class Webview extends Component {

    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        return {
            title: 'webview'
        };
    };

    //渲染
    render() {
        return (
            <WebView
                ref={'webview'}
                style={{ flex: 1, backgroundColor: '#fff' }}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                source={{ uri: 'http://mydearest.cn/responsive/' }}
            />
        );
    }
}

