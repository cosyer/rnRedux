/*
 * @Author: chenyu 
 * @Date: 2018-05-26 18:00:09 
 * @Last Modified by: chenyu
 * @Last Modified time: 2018-05-31 00:44:01
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

import RCTPicker from "../picker/rn-picker";
import Icon from "react-native-vector-icons/Ionicons";
import RowLayout from "../../layout/row";
import area from "./region.json";

export default class Region extends Component {
  static defaultProps = {
    showArea: true
  };

  static propTypes = {
    showArea: PropTypes.bool //是否显示区域
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedValue: this.props.value || []
    };

    this.showPicker = this.showPicker.bind(this);

    this.regions = this.createAreaData();

    this.selectedItems = [];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value != this.props.value) {
      this.selectedItems = nextProps.value;
      this.setState({
        selectedValue: nextProps.value
      });
    }
  }

  render() {
    let showText =
      this.state.selectedValue.length == 0
        ? this.props.placeholder
        : this.state.selectedValue.join(" ");
    return (
      <RowLayout
        onPress={this.showPicker}
        style={[styles.container, this.props.style]}
      >
        {/*左侧标题*/}
        <View>
          <Text
            style={[
              { color: "#333", fontSize: 16, fontFamily: "PingFangSC-Regular" },
              this.props.labelStyle
            ]}
            allowFontScaling={false}
          >
            {this.props.labelText || ""}
          </Text>
        </View>

        <RowLayout style={styles.right}>
          {/*选择的内容*/}
          <Text
            style={[
              styles.value,
              showText != this.props.placeholder
                ? this.props.valueStyle
                : styles.placeholderStyle
            ]}
            allowFontScaling={false}
          >
            {showText}
          </Text>
          {this.renderRight()}
        </RowLayout>
      </RowLayout>
    );
  }

  componentWillUnmount() {
    RCTPicker.hide();
  }

  showPicker() {
    let object = this.state.selectedValue;

    let selectedValues = [];

    if (
      !(object && typeof object === "object" && Array == object.constructor)
    ) {
      selectedValues = [object];
    } else {
      selectedValues = object;
    }
    RCTPicker.init({
      pickerTitleText: this.props.pickerTitle || "请选择",
      pickerCancelBtnText: "取消",
      pickerConfirmBtnText: "确认",
      pickerData: this.regions,
      selectedValue: selectedValues,
      onPickerConfirm: data => {
        if (this.props.onChange) {
          this.props.onChange(data);
        }
        this.selectedItems = data;
        this.setState({ selectedValue: data });
      },
      onPickerCancel: data => { },
      onPickerSelect: data => {
        if (this.props.onSelectChange) {
          this.props.onSelectChange(data);
        }
      }
    });
    RCTPicker.show();
  }

  createAreaData() {
    let data = [];
    let len = area.length;
    for (let i = 0; i < len; i++) {
      let city = [];
      for (let j = 0, cityLen = area[i]["city"].length; j < cityLen; j++) {
        if (this.props.showArea) {
          //如果显示区域，把区域添加到picker里
          let _city = {};
          _city[area[i]["city"][j]["name"]] = area[i]["city"][j]["area"];
          city.push(_city);
        } else {
          //否则只显示省+市
          city.push(area[i]["city"][j]["name"]);
        }
      }

      let _data = {};
      _data[area[i]["name"]] = city;
      data.push(_data);
    }

    return data;
  }

  getValue() {
    if (this.props.valueFunction) {
      return this.props.valueFunction(this.selectedItems);
    }
    return this.selectedItems;
  }

  setValue(v) {
    if (!v) {
      v = [];
    }

    let selectedValues = [];

    if (v.province) {
      selectedValues.push(v.province);
    }

    if (v.city) {
      selectedValues.push(v.city);
    }

    if (v.district) {
      selectedValues.push(v.district);
    }

    this.selectedItems = selectedValues;
    this.setState({ selectedValue: selectedValues });
  }

  renderRight() {
    var views = [];

    if (this.props.rightRender) {
      views.push(this.props.rightRender());
    }

    if (this.props.iconRender) {
      views.push(this.props.iconRender());
    } else {
      views.push(<Icon name={"ios-arrow-forward"} size={25} color="#999" key="region" />);
    }

    return <RowLayout>{views}</RowLayout>;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: 40,
    alignItems: "center",
    paddingHorizontal: 16
  },
  right: {
    alignItems: "center"
  },

  value: {
    marginRight: 6,
    fontSize: 16,
    fontFamily: "PingFangSC-Regular",
    color: "#666"
  },
  placeholderStyle: {
    marginRight: 6,
    fontSize: 16,
    fontFamily: "PingFangSC-Regular",
    color: "#999"
  }
});
