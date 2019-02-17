import React from "react";
import Picker from "react-native-picker";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

export default class CustomPicker extends React.Component {
  static propTypes = {
    onPickerConfirm: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.isShow = false;
    this.state = {
      showMask: false
    };
  }

  render() {
    if (!this.state.showMask) return null;
    return (
      <TouchableOpacity
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "#00000080"
        }}
        activeOpacity={1}
        onPress={this.hidePicker}
      />
    );
  }

  initPicker = (pickerData, selectedValue, wheelFlex) => {
    Picker.init({
      pickerToolBarBg: [255, 255, 255, 1],
      pickerToolBarFontSize: 18,
      pickerTitleText: "",
      pickerConfirmBtnText: "确定",
      pickerConfirmBtnColor: [89, 144, 247, 1],
      pickerCancelBtnText: "取消",
      pickerCancelBtnColor: [153, 153, 153, 1],
      pickerBg: [255, 255, 255, 1],
      pickerFontSize: 15,
      pickerFontColor: [51, 51, 51, 1],
      pickerTextEllipsisLen: 30,
      wheelFlex: wheelFlex,
      pickerData,
      selectedValue,
      onPickerConfirm: pickedValue => {
        this.hidePicker();
        let { onPickerConfirm } = this.props;
        onPickerConfirm && onPickerConfirm(pickedValue, this.name);
      },
      onPickerCancel: () => {
        this.hidePicker();
      }
    });
  };

  showPicker = (pickerData, selectedValue, wheelFlex, name) => {
    if (this.name !== name) {
      this.name = name;
    }
    this.initPicker(pickerData, selectedValue, wheelFlex);
    this.setState({ showMask: true });
    Picker.show();
    this.isShow = true;
  };

  hidePicker = () => {
    this.setState({ showMask: false });
    Picker.hide();
    this.isShow = false;
  };

  isPickerShow() {
    return this.isShow;
  }
}
