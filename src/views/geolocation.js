import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";

var Geolocation = require("Geolocation");

//监听定位的id
var watchID = null;

//默认应用的容器组件
export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      headerTitle: "获取定位",
      headerRight: <View />
    };
  };

  //渲染
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.item} onPress={this.getCurrentPosition.bind(this)}>
          获取定位
        </Text>
        <Text style={styles.item} onPress={this.beginWatch.bind(this)}>
          开始监听
        </Text>
        <Text style={styles.item} onPress={this.stopWatch.bind(this)}>
          停止监听
        </Text>
      </View>
    );
  }

  // 获取位置
  getCurrentPosition() {
    Geolocation.getCurrentPosition(
      location => {
        var result =
          "速度：" +
          location.coords.speed +
          "\n经度：" +
          location.coords.longitude +
          "\n纬度：" +
          location.coords.latitude +
          "\n准确度：" +
          location.coords.accuracy +
          "\n行进方向：" +
          location.coords.heading +
          "\n海拔：" +
          location.coords.altitude +
          "\n海拔准确度：" +
          location.coords.altitudeAccuracy +
          "\n时间戳：" +
          location.timestamp;
        alert(result);
      },
      error => {
        alert("获取位置失败：" + error);
      }
    );
  }

  //开始监听位置变化
  beginWatch() {
    watchID = Geolocation.watchPosition(
      location => {
        var result =
          "速度：" +
          location.coords.speed +
          "\n经度：" +
          location.coords.longitude +
          "\n纬度：" +
          location.coords.latitude +
          "\n准确度：" +
          location.coords.accuracy +
          "\n行进方向：" +
          location.coords.heading +
          "\n海拔：" +
          location.coords.altitude +
          "\n海拔准确度：" +
          location.coords.altitudeAccuracy +
          "\n时间戳：" +
          location.timestamp;
        alert(result);
      },
      error => {
        alert("获取位置失败：" + error);
      }
    );
  }

  //停止监听位置变化
  stopWatch() {
    Geolocation.clearWatch(watchID);
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25
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
