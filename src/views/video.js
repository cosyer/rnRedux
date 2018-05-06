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
    View
} from 'react-native';

export default class Video extends Component {


    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerTitle: "我的账户",
        gestureResponseDistance: { horizontal: 300 },

    });

    componentDidMount() {
        this.props.navigation.setParams({
            headerTitle: '我的账户',
        });
    }

    navigatePress = () => {
        alert('点击headerRight');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to Detail1!
              </Text>
                <Text style={styles.instructions} onPress={() => {
                    const { navigate } = this.props.navigation;
                }}>
                    跳转到Detail2
              </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,

    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
        fontSize: 18
    },
});