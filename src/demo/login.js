import React from "react";
import { Button, Image, View, Text } from "react-native";

export default class Login extends React.Component {
  static navigationOptions = {
    headerTitle: "登录"
  };

  render() {
    const { params } = this.props.navigation.state;
    console.log(params);
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Text
          style={{ padding: 20 }}
          onPress={() => this.props.navigation.goBack()}
        >
          返回
        </Text>
      </View>
    );
  }
}
