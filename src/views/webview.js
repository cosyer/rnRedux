import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, WebView } from "react-native";

export default class Webview extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      headerTitle: "webview",
      headerRight: <View />
    };
  };

  //渲染 uri
  render() {
    let videohtml =
      "<!DOCTYPE html width='100%' height='100%'>" +
      "<head><meta name='viewport' content='width=device-width, initial-scale=1'></head>" +
      "<body style='margin: 0 auto;display: flex;align-items: center; justify-content: center;' width='100%' height: '100%'>" +
      "<video id='video' preload='preload' style='object-fit: inherit;' width='100%' controls>" +
      "<source src='" +
      this.props.navigation.state.params.url +
      "'>" +
      "</video>" +
      "</body>";
    return (
      <WebView
        ref={"webview"}
        style={{ flex: 1, backgroundColor: "#fff" }}
        javaScriptEnabled={true}
        scalesPageToFit={true}
        source={{ html: videohtml }}
      />
    );
  }
}
