/**
 * 横向栏式布局
 *
 * Created by apple on 2017/1/9.
 */
import React, { Component } from "react";

import { View, StyleSheet, TouchableOpacity } from "react-native";

export default class RowLayout extends Component {
  render() {
    if (this.props.onPress == undefined) {
      return (
        <View style={[this.props.style, styles.container]}>
          {this.props.children}
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={[this.props.style, styles.container]}
          onPress={this.props.onPress}
        >
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  }
});
