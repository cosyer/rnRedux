import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen'
import { Provider } from 'react-redux';
import Home from './home';
import store from './store';

export default class App extends Component {
    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return (
            <Provider store={store}>
                <Home />
            </Provider>
        );
    }
}