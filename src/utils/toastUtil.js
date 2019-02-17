import React, { Component } from "react";
import { ToastAndroid, Platform, Alert } from "react-native";

export default class ToastUtil extends Component {
  static show(message) {
    if (Platform.OS === "ios") {
      Alert.alert("提示", message);
    } else if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  }
}
