import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    Platform
} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import { Provider, connect } from 'react-redux';

import configureStore from './store';
import Router from './route';

const store = configureStore()

// 整合redux和navigation
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
