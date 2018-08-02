import React, { Component } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { addNavigationHelpers, NavigationActions } from "react-navigation";
import SplashScreen from "react-native-splash-screen";
import { Provider, connect } from "react-redux";

import configureStore from "./store";
import Router from "./route";

const store = configureStore();

// 整合redux和navigation
@connect(state => ({
  nav: state.nav
}))
class AppWithNavigationState extends Component {
  // 处理安卓返回键 回到栈顶退出
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    this.lastBackPressed = null;
  }

  onBackPress = () => {
    const { dispatch, nav, navigation } = this.props;
    if (nav.index === 0 || nav.index === 1) {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
    }
    if (nav.index !== 1) {
      dispatch(NavigationActions.back({ key: nav.routes[nav.index].key }));
    }
    // navigation.goBack() 登录页使用会有问题

    return true;
  };

  render() {
    return (
      <Router
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    // 不提示 warning
    console.disableYellowBox = true;
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    // const { navigate } = this.props.navigation;
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
