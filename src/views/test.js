import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
var Geolocation = require("Geolocation");

//监听定位的id
var watchID = null;

//默认应用的容器组件
export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      headerTitle: "测试",
      headerRight: <View />
    };
  };

  //渲染
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: width,
            height: 100,
            backgroundColor: "red"
          }}
        />
        <ScrollView>
          <View
            style={{
              width: width,
              marginTop: -50,
              height: 300,
              backgroundColor: "green"
            }}
          />
          <View
            style={{
              width: width,
              marginTop: 50,
              height: 300,
              backgroundColor: "green"
            }}
          />
          <View
            style={{
              width: width,
              marginTop: 50,
              height: 300,
              backgroundColor: "green"
            }}
          />
          <View
            style={{
              width: width,
              marginTop: 50,
              height: 300,
              backgroundColor: "green"
            }}
          />
          <View
            style={{
              width: width,
              marginTop: 50,
              height: 300,
              backgroundColor: "green"
            }}
          />
          <View
            style={{
              width: width,
              marginTop: 50,
              height: 300,
              backgroundColor: "green"
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  item: {
    margin: 15,
    height: 30,
    borderWidth: 1,
    padding: 6,
    borderColor: "#ddd",
    textAlign: "center"
  }
});
