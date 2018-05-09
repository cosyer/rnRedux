import React, { Component } from 'react';
import {
    Button,
    View
} from 'react-native';

export default class CountDown extends Component {
    // getInitialState() {
    //     return {
    //         iTime: this.props.time
    //     }
    // }
    state = {
        iTime: this.props.time
    }

    componentDidMount() {
        var that = this
        timer = setInterval(function () {
            if (that.state.iTime > 1) {
                var tmp = that.state.iTime;
                that.setState({
                    iTime: --tmp
                })

            } else {
                clearInterval(timer);
                that.props.afterEnd();
            }
        }, 1000)
    }

    // 组件注销前
    componentWillUnmount() {
        clearInterval(timer)
    }

    render() {
        return (
            <Button style={this.props.style} title={this.props.text + '(' + this.state.iTime + ')'} onPress={() => { }} />
        )
    }
}

