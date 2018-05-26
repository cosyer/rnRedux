/**
 * 纵向栏式布局
 *
 * Created by apple on 2017/1/9.
 */

import React, {
    Component
} from 'react';

import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';

export default class ColumnLayout extends Component {

    render() {

        if (this.props.onPress == undefined) {
            return (
                <View style={[this.props.style, styles.container]}>
                    {this.renderComponent()}
                </View>
            );
        } else {
            return (
                <TouchableOpacity style={[this.props.style, styles.container]} onPress={this.props.onPress}>
                    {this.renderComponent()}
                </TouchableOpacity>
            );
        }


    }

    renderComponent() {
        let children = React.Children.map(this.props.children, (child,index) => {
            return React.cloneElement(child)
        });

        if (!this.props.separator) {
            return children;
        }

        let size = children.length * 2 - 1;
        let array = [];

        for (let i=0; i<size; i++) {
            if (i % 2 == 0) {
                array.push(children[i / 2]);
            } else {
                array.push(this.props.separator());
            }
        }
        return array;
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    }
});

