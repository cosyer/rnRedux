import React, { Component } from 'react';
import {
    StackNavigator,
    TabNavigator
} from 'react-navigation';
import { Platform, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './views/home';
import Mine from './views/mine';
import Login from './views/login'

let loginState = false
// 判断用户是否登陆过
AsyncStorage.getItem('user')
    .then((data) => {
        var user
        if (data) {
            loginState = true
        }
    })


// tab
const MainScreenNavigator = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({ navigation, screenProps }) => ({
            tabBarLabel: '首页', // 设置标签栏的title。推荐这个方式。
            tabBarIcon: (({ tintColor, focused }) => {
                return (
                    <Icon name="ios-home" size={30} color="#5AA9FA" />
                )
            }),
        })
    },
    Mine: {
        screen: Mine,
        navigationOptions: ({ navigation, screenProps }) => ({
            tabBarLabel: '我的', // 设置标签栏的title。推荐这个方式。
            tabBarIcon: (({ tintColor, focused }) => {
                return (
                    <Icon name="ios-person" size={30} color="#5AA9FA" />
                )
            })
        })
    },
}, {
        animationEnabled: false, // 切换页面时不显示动画
        tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
        swipeEnabled: false, // 禁止左右滑动
        backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
        tabBarOptions: {
            activeTintColor: '#008AC9', // 文字和图片选中颜色
            inactiveTintColor: '#999', // 文字和图片默认颜色
            showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
            indicatorStyle: { height: 0 }, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
            style: {
                backgroundColor: '#fff', // TabBar 背景色
            },
            labelStyle: {
                fontSize: 12, // 文字大小
            },
        }
    });

MainScreenNavigator.navigationOptions = ({ navigation }) => {
    let title;
    let focusedRouteName =
        navigation.state.routes[navigation.state.index].routeName;
    if (focusedRouteName === 'Home') {
        // of course in this case it's the same, but do whatever you want here
        title = '列表首页';
    } else if (focusedRouteName === 'Mine') {
        title = '我的设置';
    }
    return {
        title,
    };
}

// 路由
const SimpleApp = StackNavigator({
    Home: {
        screen: MainScreenNavigator,
        // 单独配置
        navigationOptions: {
            // headerTitle: '列表首页',  // 只会设置导航栏文字,
        }
    },
    Login: { screen: Login },
},
    // 通用配置
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#5AA9FA',
                height: Platform.OS === 'ios' ? 64 : 44,
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
        },
        initialRouteName: loginState ? "Home" : "Login"
    }
);

export default SimpleApp