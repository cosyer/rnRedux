/**
 * 文本域
 * <InputArea placeholder="请输入"  //提示词         可选
 *            value = {}           //值            可选 默认为''
 *            maxLength={140}      //输入最大长度    可选  默认140
 *            editable = {true}    //是否可以编辑    可选  默认可编辑
 *            keyboardType = 'default'  //键盘弹出类型   可选
 *            valueStyle = {}      //文本域的样式    可选
 *            onChange={function}  //文字变化回调
 *            />
 */

import React, { Component } from "react";

import { TextInput, View, Text, StyleSheet } from "react-native";

export default class InputArea extends Component {
  static defaultProps = {
    value: "",
    editable: true,
    maxLength: 140,
    valueStyle: {},
    placeholder: "",
    keyboardType: "default"
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      maxLength: this.props.maxLength,
      placeholder: this.props.placeholder,
      editable: this.props.editable,
      inputVal: this.props.value
    };

    this.value = this.props.value;

    this.onTextChange = this.onTextChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== undefined && nextProps.value != this.value) {
      this.value = nextProps.value;
      this.setState({
        inputVal: nextProps.value,
        count: nextProps.value.length
      });
    }
  }

  render() {
    let inputVal = this.state.inputVal;

    return (
      <View style={[styles.container, this.props.style]}>
        <TextInput
          underlineColorAndroid="transparent"
          placeholder={this.props.placeholder}
          multiline={true}
          onChangeText={this.onTextChange}
          placeholderTextColor={"#999"}
          value={inputVal}
          maxLength={this.state.maxLength}
          editable={this.state.editable}
          keyboardType={this.props.keyboardType}
          style={[styles.input, this.props.valueStyle]}
          allowFontScaling={false}
        />
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.tipTextStyle} allowFontScaling={false}>
            {this.state.count}/{this.state.maxLength}
          </Text>
        </View>
      </View>
    );
  }

  onTextChange(text) {
    this.value = text;

    this.setState({
      count: text.length,
      inputVal: text
    });

    if (this.props.onChange) {
      this.props.onChange(text);
    }
  }

  getValue() {
    return this.value;
  }

  setValue(v) {}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  input: {
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 16,
    color: "#666",
    fontFamily: "PingFangSC-Regular",
    height: 200,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top"
  },
  tipTextStyle: {
    marginRight: 10,
    marginBottom: 4,
    fontSize: 16,
    color: "#999"
  }
});
