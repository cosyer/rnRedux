import { createStackNavigator } from "react-navigation";
import CardStackStyleInterpolator from "react-navigation/src/views/StackView/StackViewStyleInterpolator";
import React, { Component } from "react";
import MainScreenNavigator from "./tabNav";
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

const MyStackNav = createStackNavigator(
  {
    Home: {
      screen: MainScreenNavigator
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
    Test: { screen: Test }
  },
  {
    initialRouteName: "StartPage",
    mode: "screen",
    headerMode: "none",
    cardStyle: {},
    navigationOptions: {
      gesturesEnabled: true
    },
    transitionConfig: () => ({
      screenInterpolator: CardStackStyleInterpolator.forHorizontal
    })
  }
);

module.exports = MyStackNav;
