/**
 * Created by Song on 2017/5/28
 * App入口
 */
import React, { Component } from "react";
import SplashScreen from "react-native-splash-screen";
import Router from "./Router";
import store from "./store";
import { addNavigationHelpers } from "react-navigation";
import { connect, Provider } from "react-redux";

@connect(state => ({
  nav: state.nav
}))
class AppWithNavigationState extends Component {
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
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
