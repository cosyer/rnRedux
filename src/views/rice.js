import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Linking,
  Clipboard,
  ScrollView,
  Platform,
  Dimensions,
  Switch,
  LayoutAnimation,
  UIManager,
  TouchableOpacity
} from "react-native";
import Picker from "../component/form/picker";
import QRCode from "react-native-qrcode";
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
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import Counter from "../component/counter";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const isAndroid = Platform.OS === "android" ? true : false;
//动画方式
const customAnimated = {
  customLinear: {
    duration: 300,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut
    }
  }
};
// 使用LayoutAnimation.configureNext(customAnimated.customLinear);
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true); //启用android Layout动画

export default class Rice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      switchValue: true,
      modalVisible: false,
      dialogVisible: false,
      name: "",
      sex: "",
      address: "",
      inputAreaText: "",
      filterVisible: false,
      itemList: [
        { id: 1, name: "处女座" },
        { id: 2, name: "双子座" },
        { id: 3, name: "天马座" },
        { id: 4, name: "仙女座" },
        { id: 5, name: "水瓶座" },
        { id: 6, name: "双鱼座" },
        { id: 7, name: "天秤座" }
      ],
      rateList: [
        { value: 0, text: "专业技能", id: "professionalSkillsLevel" },
        { value: 0, text: "沟通能力", id: "communicationSkillsLevel" },
        { value: 0, text: "诚实守信", id: "honestyLevel" },
        { value: 0, text: "适应能力", id: "adaptLevel" },
        { value: 0, text: "踏实勤快", id: "diligentlevel" }
      ],
      choosenType: [1]
    };
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerTitle: "组件页",
      headerRight: <View />
    };
  };

  async _setClipboardContent() {
    Clipboard.setString("Hello World");
    try {
      var content = await Clipboard.getString();
      showHUDMessage("复制成功");
    } catch (e) {
      console.log(e);
    }
  }

  // 打电话
  _call = phone => {
    return Linking.openURL(`tel:${phone}`).catch(e => console.warn(e));
  };

  // 选择服务类型
  _changeType = type => {
    let choosenType = this.state.choosenType;
    if (choosenType.indexOf(type) > -1) {
      choosenType.splice(choosenType.indexOf(type), 1);
    } else {
      choosenType.push(type);
    }
    LayoutAnimation.configureNext(customAnimated.customLinear);
    this.setState({
      choosenType: type === -1 ? [] : choosenType
    });
  };

  // 重置
  _onReset = () => {
    this.setState({
      choosenType: []
    });
  };

  // 评分
  _changeRate = (index, value) => {
    let rateList = this.state.rateList;
    // 重复点击清0
    if (rateList[index].value === value) {
      rateList[index].value = 0;
    } else {
      rateList[index].value = value;
    }
    this.setState({
      rateList
    });
  };

  // 渲染星星
  _renderRate = (value, totalIndex) => {
    let checkedList = [];
    let leftList = [];
    for (let i = 0; i < value; i++) {
      checkedList.push({});
    }
    for (let i = 0; i < 5 - value; i++) {
      leftList.push({});
    }
    return (
      <View style={styles.rateIcon}>
        {checkedList.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this._changeRate(totalIndex, index + 1)}
            >
              <Icon name={"ios-star"} size={28} style={{ color: "orange" }} />
            </TouchableOpacity>
          );
        })}
        {leftList.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                this._changeRate(totalIndex, checkedList.length + index + 1)
              }
            >
              <Icon
                name={"ios-star-outline"}
                size={28}
                style={{ color: "orange" }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // 渲染模态框内容
  _renderModalContent = () => {
    return (
      <View style={styles.filterContainer}>
        <View style={{ backgroundColor: "#f3f4f5" }}>
          <Text
            style={{
              marginTop: 20,
              marginLeft: 16,
              fontSize: 14,
              color: "#666"
            }}
          >
            类型(多选)
          </Text>
          <ScrollView>
            <View style={styles.filterType}>
              {this.state.itemList.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionView,
                      this.state.choosenType.indexOf(item.id) > -1 &&
                        styles.choosenView
                    ]}
                    key={item.id}
                    onPress={() => this._changeType(item.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        this.state.choosenType.indexOf(item.id) > -1 &&
                          styles.choosenOption
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {
                // 奇数个填补空白
              }
              {this.state.itemList.length % 2 === 1 && (
                <TouchableOpacity
                  style={[styles.optionView, { backgroundColor: "#f3f4f5" }]}
                />
              )}
              <View style={styles.separatorStyle} />
            </View>
          </ScrollView>
        </View>
        <View style={[styles.buttonGroup, { bottom: 64 }]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.leftButton}
            onPress={this._onReset}
          >
            <Text style={{ fontSize: 18, color: "#333" }}>重置</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={styles.rightButton}>
            <Text style={{ fontSize: 18, color: "#fff" }}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.state.switchValue ? "#f3f4f5" : "grey" }
        ]}
      >
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
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this.props.navigation.navigate("TextFlatList")}
          >
            FlatList
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={this._setClipboardContent}
          >
            Copy
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this._call("18883269663")}
          >
            Call
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this.props.navigation.navigate("Geolocation")}
          >
            地理位置
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this.setState({ filterVisible: true })}
          >
            filter
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() =>
              this.props.navigation.navigate("WebView", {
                url:
                  "http://124.129.157.208:8810/SD/2017qingdao/xiaoxueEnglish/grade3/b/1.mp4"
              })
            }
          >
            WebView
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this.props.navigation.navigate("VideoView")}
          >
            视频播放
          </Button>
          <Button
            style={styles.btn}
            textStyle={styles.countBtnText}
            onPress={() => this.props.navigation.navigate("ImageShow")}
          >
            图片展示
          </Button>
          <DialogLoading visible={this.state.dialogVisible} title="加载中..." />
          <Counter
            leftName={"选择数量"}
            value={this.state.count}
            style={styles.wigetStyle}
            onBack={num => this.setState({ count: num })}
          />
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
            value={
              this.state.address
                ? [
                    this.state.address.split(" ")[0],
                    this.state.address.split(" ")[1],
                    this.state.address.split(" ")[2]
                  ]
                : []
            }
            placeholder="请选择地址"
            onChange={item => {
              let address = item[0] + " " + item[1] + " " + item[2];
              this.setState({
                address: address
              });
            }}
          />
          {this.state.rateList.map((item, index) => {
            return (
              <View style={styles.rateRow}>
                <Text style={styles.rateText}>{item.text}</Text>
                {this._renderRate(item.value, index)}
              </View>
            );
          })}

          <InputArea
            style={{ marginTop: 10, backgroundColor: "#fff" }}
            valueStyle={{ height: 80 }}
            property="inputAreaText"
            placeholder="请简短描述"
            value={this.state.inputAreaText}
            editable={true}
          />
          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            height={200}
            loop={true}
          >
            <View style={styles.slide1}>
              <Text style={styles.text}>Hello Swiper</Text>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>And simple</Text>
            </View>
          </Swiper>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 40
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {this.state.switchValue ? "开灯" : "关灯"}
            </Text>
            <Switch
              value={this.state.switchValue}
              onValueChange={switchValue => {
                this.setState({
                  switchValue: switchValue
                });
              }}
            />
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 80
            }}
          >
            <QRCode
              value={this.state.qrText}
              size={50}
              bgColor="purple"
              fgColor="white"
            />
          </View>
        </ScrollView>

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.filterVisible}
          onRequestClose={() => this.setState({ filterVisible: false })}
        >
          <TouchableOpacity
            style={{ flex: 1, marginTop: isAndroid ? 44 : 64 }}
            activeOpacity={1}
            onPress={() => this.setState({ filterVisible: false })}
          >
            <View style={styles.modalContainer}>
              {this._renderModalContent()}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 16
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  filterContainer: {
    width: width * 0.8,
    height: height,
    backgroundColor: "#efefef",
    position: "absolute",
    right: 0
  },
  filterType: {
    width: width * 0.8,
    minHeight: 126,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center"
  },
  buttonGroup: {
    width: width * 0.8,
    height: 50,
    position: "absolute",
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DCDCDC"
  },
  leftButton: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  rightButton: {
    flex: 1,
    backgroundColor: "#5AA9FA",
    justifyContent: "center",
    alignItems: "center"
  },
  optionView: {
    marginTop: 16,
    paddingLeft: 10,
    paddingRight: 10,
    minWidth: 100,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center"
  },
  optionText: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 14,
    color: "#999"
  },
  choosenOption: {
    color: "#fff"
  },
  choosenView: {
    backgroundColor: "#5AA9FA"
  },
  separatorStyle: {
    width: width,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee"
  },
  rateRow: {
    height: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    backgroundColor: "#fff"
  },
  rateText: {
    fontSize: 16,
    color: "#333"
  },
  rateIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  wigetStyle: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});
