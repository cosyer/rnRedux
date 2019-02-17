import React, { Component } from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import { Platform, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import Home from "./views/home";
import Mine from "./views/mine";
import Login from "./views/login";
import Detail from "./views/detail";
import Rice from "./views/rice";
import Geolocation from "./views/geolocation";
import WebView from "./views/webview";
import VideoView from "./views/videoview";
import ImageShow from "./views/imageShow";
import TextFlatList from "./views/flatlist";
import TestAnimate from "./views/animate";
import Test from "./views/test";
import StartPage from "./views/startPage";
// tab
const MainScreenNavigator = TabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "首页", // 设置标签栏的title。推荐这个方式。screenProps用于设置通用的theme
        tabBarIcon: ({ tintColor, focused }) => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon
                name={focused ? "ios-home" : "ios-home-outline"}
                size={20}
                color={tintColor}
                style={{ width: 20, height: 20, fontSize: 20 }}
              />
            </View>
          );
        }
      })
    },
    Video: {
      screen: Home,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "视频", // 设置标签栏的title。推荐这个方式。
        tabBarIcon: ({ tintColor, focused }) => {
          return (
            <Icon
              name={focused ? "ios-videocam" : "ios-videocam-outline"}
              size={20}
              color={tintColor}
              style={{ width: 20, height: 20, fontSize: 20 }}
            />
          );
        }
      })
    },
    Mine: {
      screen: Mine,
      navigationOptions: ({ navigation, screenProps }) => ({
        tabBarLabel: "我的", // 设置标签栏的title。推荐这个方式。
        tabBarIcon: ({ tintColor, focused }) => {
          return (
            <Icon
              name={focused ? "ios-person" : "ios-person-outline"}
              size={20}
              color={tintColor}
              style={{ width: 20, height: 20, fontSize: 20 }}
            />
          );
        }
      })
    }
  },
  {
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: "bottom", // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: "none", // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarOptions: {
      activeTintColor: "#5AA9FA", // 文字和图片选中颜色
      inactiveTintColor: "#999", // 文字和图片默认颜色
      showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: { height: 0 }, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
      style: {
        backgroundColor: "#fff" // TabBar 背景色
        // height: 50
      },
      labelStyle: {
        margin: 0,
        padding: 0, // 处理间距
        fontSize: 12 // 文字大小
      }
    }
  }
);

MainScreenNavigator.navigationOptions = ({ navigation }) => {
  let title;
  let focusedRouteName =
    navigation.state.routes[navigation.state.index].routeName;
  if (focusedRouteName === "Home") {
    // of course in this case it's the same, but do whatever you want here
    title = "列表首页";
  } else if (focusedRouteName === "Mine") {
    title = "我的";
  }
  return {
    title
  };
};

// 路由 最后index.js需要的就是stacknavigator的配置
const SimpleApp = StackNavigator(
  {
    Home: {
      screen: MainScreenNavigator,
      // 单独配置
      navigationOptions: {
        // headerTitle: '列表首页',  // 只会设置导航栏文字,
      }
    },
    Login: { screen: Login },
    Detail: { screen: Detail },
    Rice: { screen: Rice },
    Geolocation: { screen: Geolocation },
    WebView: { screen: WebView },
    VideoView: { screen: VideoView },
    ImageShow: { screen: ImageShow },
    TextFlatList: { screen: TextFlatList },
    TestAnimate: { screen: TestAnimate },
    Test: { screen: Test },
    StartPage: { screen: StartPage }
  },
  // 通用配置
  {
    navigationOptions: ({ navigation, screenProps }) => ({
      headerStyle: {
        backgroundColor: "#5AA9FA",
        height: Platform.OS === "ios" ? 44 : 44,
        elevation: 0, // android导航底部阴影
        shadowOpacity: 0 // ios导航底部阴影
      },
      // headerLeft: null && (<TouchableOpacity style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
      //     <Icon name={'ios-arrow-back'} size={25} color="#fff" style={{ width: 25, height: 25, fontSize: 25 }}
      //         onPress={() => { console.log("navigation", navigation); navigation.goBack() }}
      //     />
      // </TouchableOpacity>),
      // headerRight: null && <View />,
      headerTitleStyle: {
        fontSize: 18,
        color: "white",
        alignSelf: "center"
        // 新版android居中处理
        // flex: 1,
        // textAlign: 'center',
      },
      headerBackTitle: null // 箭头后面文字
    }),
    initialRouteName: "StartPage",
    mode: "screen",
    // headerMode: "none", // 不启用头部，可以自己自定义
    cardStyle: {},
    navigationOptions: {
      gesturesEnabled: true
    }
  }
);

export default SimpleApp;
