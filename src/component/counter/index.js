import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default class Counter extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    leftName: "",
    value: 1,
    onBack: () => {}
  };

  // +
  increment = () => {
    let result =
      Number(this.props.value) + 1 >= 100 ? 100 : Number(this.props.value) + 1;
    this.props.onBack(result);
  };

  // -
  decrement = () => {
    let result =
      Number(this.props.value) - 1 <= 0 ? 1 : Number(this.props.value) - 1;
    this.props.onBack(result);
  };

  render() {
    return (
      <View style={[styles.input, this.props.style]}>
        <Text style={styles.inputLeft}>{this.props.leftName}</Text>
        <View style={styles.rightContain}>
          <View style={styles.rightView}>
            <TouchableOpacity
              style={styles.btnTouch}
              activeOpacity={1}
              onPress={() => this.decrement()}
            >
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <View
              style={{
                borderStyle: "solid",
                borderLeftColor: "#cccccc",
                borderLeftWidth: 1,
                borderRightColor: "#cccccc",
                borderRightWidth: 1,
                height: "100%",
                width: 46,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.centerText}>{this.props.value}</Text>
            </View>
            <TouchableOpacity
              style={styles.btnTouch}
              activeOpacity={1}
              onPress={() => this.increment()}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  inputLeft: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333"
  },

  rightContain: {
    width: 100,
    height: 25,
    marginRight: 16
  },
  rightView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc"
  },

  btnTouch: {
    // height: 27,
    width: 25,
    // backgroundColor:"red",
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center"
  },
  centerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666"
  }
});
