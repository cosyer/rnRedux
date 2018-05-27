import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Picker from "../component/form/picker";
import Icon from "react-native-vector-icons/Ionicons";
import Icons from "react-native-vector-icons/FontAwesome";
import Button from "../component/button";
import Button1 from "../component/button/rn-button";
import Button2 from "../component/button/rn-button2";
import CModal from "../component/custom-modal";
import Toast from "../component/toast";
import { showHUDMessage } from "../component/hud-tips";
import DialogLoading from "../component/dialog-loading";
import Input from "../component/form/input";
import InputArea from "../component/form/input-area";
import Region from "../component/form/region";
import DatePicker from "../component/form/date-picker";
import MySwitch from "../component/form/switch";

const width = Dimensions.get("window").width;

export default class Rice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      dialogVisible: false,
      name: "",
      sex: "",
      inputAreaText: "",
      switchData: [{ value: 1, text: "关" }, { value: 2, text: "开" }]
    };
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerTitle: "组件页",
      headerRight: <View />
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this.setState({ modalVisible: true })}
          >
            Modal按钮
          </Button>
          <CModal
            modalVisible={this.state.modalVisible}
            title="公告"
            content="我是一个confirm框"
            onLeftPress={() => this.setState({ modalVisible: false })}
            onRightPress={() => this.setState({ modalVisible: false })}
          />
          <Button1
            containerStyle={styles.btn}
            disabledContainerStyle={{ backgroundColor: "grey" }}
            style={{ fontSize: 14, color: "green" }}
            onPress={() =>
              // Toast.show("before my body dry", {
              //     duration: Toast.durations.SHORT,
              //     position: Toast.positions.CENTER,
              //     shadow: true,
              //     animation: true,
              //     hideOnPress: true,
              //     delay: 0,
              // })
              showHUDMessage("before my body dry", 1500)
            }
          >
            Tips按钮
          </Button1>
          <Button2
            style={styles.btn}
            textStyle={{ fontSize: 14 }}
            onPress={() => {
              this.setState({ dialogVisible: true });
              setTimeout(() => this.setState({ dialogVisible: false }), 3000);
            }}
          >
            Hello! dialogLoading
          </Button2>
          <DialogLoading visible={this.state.dialogVisible} title="加载中..." />
          <Input
            labelText="姓名"
            placeholder="请输入姓名"
            maxLength={10}
            property="name"
            required={true}
            valueStyle={styles.valueLabelStyle}
            style={styles.inputStyle}
            value={this.state.name}
            onChange={val => {
              this.setState({ name: val });
            }}
          />
          <Picker
            labelText="性别"
            dataSource={["男", "女"]}
            property="sex"
            placeholder="请选择性别"
            valueStyle={styles.valueStyle}
            style={[styles.inputStyle]}
            value={"男"}
            editable={true}
            pickerTitle="请选择性别"
          />
          <DatePicker
            labelStyle={{
              textAlign: "right",
              fontSize: 16
            }}
            key="activityStartTimeEdit"
            underlineColorAndroid="transparent"
            placeholder={"请选择开始时间"}
            value={""}
            timeMode={"date"}
            valueStyle={styles.valueStyle}
            labelText="开始时间"
            startTime={"1940-01-01"}
            lastTime={"2099-12-31"}
            period={60}
            returnValueFormat="YYYY-MM-DD"
            onSelect={date => console.log(data)}
            editable={true}
          />
          <Region
            labelText="地址"
            property="addresss"
            showArea={true} //不显示区域
            valueStyle={styles.valueStyle}
            style={styles.inputStyle}
            value={[]}
            placeholder="请选择"
            onChange={item => {
              let address = item[0] + " " + item[1] + " " + item[2];
              this.setState({
                address: address
              });
            }}
          />
          <InputArea
            style={{ marginTop: 10, backgroundColor: "#fff" }}
            valueStyle={{ height: 80 }}
            property="inputAreaText"
            placeholder="请简短描述"
            value={this.state.inputAreaText}
            editable={true}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f5"
  },
  btn: {
    marginTop: 10,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "transparent",
    borderColor: "#EE735C",
    borderWidth: 1,
    borderRadius: 4
  },
  countBtnText: {
    color: "#5aa9fa",
    textAlign: "center",
    fontSize: 14
  },
  inputStyle: {
    backgroundColor: "#fff",
    height: 60,
    width: width,
    borderBottomColor: "#eee",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  valueLabelStyle: {
    fontSize: 16,
    color: "#666",
    height: 40,
    width: 180
  },
  valueStyle: {
    fontSize: 16,
    color: "#666"
  }
});
