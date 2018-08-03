/*
 * @Author: chenyu 
 * @Date: 2018-06-40 14:42:37 
 * @Last Modified by: chenyu
 * @Last Modified time: 2018-08-03 10:31:16
 */

import React, { Component } from "react";

import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  Dimensions
} from "react-native";

import Swiper from "react-native-swiper";
import Tips from "../../utils/tips";
import Icon from "react-native-vector-icons/Ionicons";

const isAndroid = Platform.OS === "android";
const width = Dimensions.get("window").width;

/**
 * 语音输入
 */
export default class SpeechInput extends Component {
  static defaultProps = {
    onSend: () => {},
    onTouch: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      text: "", // 输入内容
      swiperState: false, // 控制swiper展示
      recordOn: false, // 录音按钮状态
      audioOn: false, // 录音状态
      firstPageList: [],
      secondPageList: [],
      keyboardHeight: 0,
      speechInputShow: 0 //外部控制收起动作
    };
  }

  componentWillMount() {
    // 判断展示的图标
    let firstPageList = [];
    let secondPageList = [];
    if (this.props.type === "all") {
      firstPageList = [
        {
          icon: "ios-play",
          text: "面试阿姨"
        },
        {
          icon: "ios-power",
          text: "确定阿姨"
        },
        {
          icon: "ios-pizza",
          text: "收客户钱"
        },
        {
          icon: "ios-paw",
          text: "收阿姨钱"
        },
        {
          icon: "ios-pause",
          text: "签订合同"
        },
        {
          icon: "ios-people",
          text: "给客户钱"
        },
        {
          icon: "ios-planet",
          text: "更换阿姨"
        },
        {
          icon: "ios-rainy",
          text: "处理投诉"
        }
      ];
      secondPageList = [
        {
          icon: "ios-redo",
          text: "完成线索"
        },
        {
          icon: "ios-recording",
          text: "线索失效"
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        }
      ];
    } else if (this.props.type === "complete") {
      firstPageList = [
        {
          icon: "0xe74e",
          text: "收客户钱"
        },
        {
          icon: "0xe748",
          text: "收阿姨钱"
        },
        {
          icon: "0xe74a",
          text: "给客户钱"
        },
        {
          icon: "0xe751",
          text: "处理投诉"
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        },
        {
          icon: "",
          text: ""
        }
      ];
    }
    this.setState({ firstPageList, secondPageList });

    /*if (!isAndroid) {
			this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
			this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
		}*/
  }

  componentWillUnmount() {
    if (this.subscription && this.subscription.remove) {
      this.subscription.remove();
    }
    if (this.keyboardDidShowListener && this.keyboardDidShowListener.remove) {
      this.keyboardDidShowListener.remove();
    }
    if (this.keyboardDidHideListener && this.keyboardDidHideListener.remove) {
      this.keyboardDidHideListener.remove();
    }
  }

  _keyboardDidShow(e) {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  }

  _keyboardDidHide(e) {
    this.setState({
      keyboardHeight: 0
    });
  }

  _onFocus = () => {
    //this.setState({ swiperState: false, recordOn: false });
  };

  _onBlur = () => {
    this.setState({ swiperState: false, recordOn: false });
  };

  _showRecord = () => {
    let that = this;
    Keyboard.dismiss();
    setTimeout(() => {
      that.setState({
        recordOn: true
      });
    }, 150);
  };

  _onAdd = () => {
    let that = this;
    Keyboard.dismiss();
    setTimeout(() => {
      that.setState({ swiperState: true, recordOn: false });
    }, 150);
  };

  _onPressIn = () => {
    let _this = this;
    this.setState({ audioOn: true });
  };

  _onPressOut = () => {
    this.setState({ audioOn: false });
  };

  _onSend = () => {
    if (this.state.text) {
      this.props.onSend && this.props.onSend(this.state.text);
    } else {
      Tips.showTips("请输入内容");
    }
  };

  _onTouch = text => {
    this.props.onTouch && this.props.onTouch(text);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      text: nextProps.text || ""
    });

    if (
      (this.state.swiperState || this.state.recordOn) &&
      this.state.speechInputShow != nextProps.speechInputShow
    ) {
      this.setState({
        swiperState: false,
        recordOn: false,
        speechInputShow: nextProps.speechInputShow
      });
    }
  }

  render() {
    let audioOn = this.state.audioOn;

    return (
      <View
        style={{
          zIndex: 9,
          position: "absolute",
          bottom: this.state.keyboardHeight
        }}
      >
        <View style={styles.speechRow}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this._showRecord}
            style={{ marginLeft: 9, marginRight: 9 }}
          >
            <Icon name={"ios-microphone"} size={25} style={{ color: "#666" }} />
          </TouchableOpacity>
          <View style={styles.communicationInput}>
            <TextInput
              maxLength={140}
              value={this.state.text}
              caretHidden={this.state.caretHidden}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              placeholder="添加沟通记录"
              placeholderTextColor="#999999"
              underlineColorAndroid="transparent"
              keyboardType={"default"}
              style={styles.textInput}
              onSubmitEditing={() => this._onSend()}
              onChangeText={text => {
                this.setState({ text });
              }}
            />
          </View>
          {this.state.text.length === 0 ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={this._onAdd}
              style={{ marginLeft: 9, marginRight: 9 }}
            >
              <Icon
                name={"ios-add-circle-outline"}
                size={25}
                style={{ color: "#666" }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.row1Button}
              onPress={this._onSend}
            >
              <Text
                style={{
                  fontFamily: "PingFangSC-Regular",
                  color: "#fff",
                  fontSize: 14
                }}
              >
                发送
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.swiperState &&
        !this.state.recordOn &&
        this.props.type === "all" ? (
          <Swiper
            height={208}
            loop={false}
            key={2}
            dotColor="#ccc"
            activeDotColor="#999"
            paginationStyle={{
              bottom: 5
            }}
          >
            <View
              style={{
                backgroundColor: "#F6F6F6",
                width: width,
                height: 208,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {this.state.firstPageList.map((item, index) => {
                return (
                  <View key={"firstPageList_" + index}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this._onTouch(item.text)}
                      style={[
                        styles.iconitem,
                        {
                          backgroundColor: item.icon ? "#fff" : "#f6f6f6",
                          borderColor: item.icon ? "#dcdcdc" : "#f6f6f6"
                        }
                      ]}
                    >
                      <Icon
                        name={item.icon}
                        size={40}
                        style={{ color: "#7E8184" }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.itemText}>{item.text}</Text>
                  </View>
                );
              })}
            </View>
            {this.state.secondPageList.length > 0 ? (
              <View
                style={{
                  backgroundColor: "#F6F6F6",
                  width: width,
                  height: 208,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                {this.state.secondPageList.map((item, index) => {
                  return (
                    <View key={"secondPageList_" + index}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this._onTouch(item.text)}
                        style={[
                          styles.iconitem,
                          {
                            backgroundColor: item.icon ? "#fff" : "#f6f6f6",
                            borderColor: item.icon ? "#dcdcdc" : "#f6f6f6"
                          }
                        ]}
                      >
                        <Icon
                          name={item.icon}
                          size={40}
                          style={{ color: "#7E8184" }}
                        />
                      </TouchableOpacity>
                      <Text style={styles.itemText}>{item.text}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </Swiper>
        ) : null}
        {this.state.swiperState &&
        !this.state.recordOn &&
        this.props.type === "complete" ? (
          <Swiper
            height={208}
            loop={false}
            key={2}
            dotColor="#ccc"
            activeDotColor="#999"
          >
            <View
              style={{
                backgroundColor: "#F6F6F6",
                width: width,
                height: 208,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {this.state.firstPageList.map((item, index) => {
                return (
                  <View key={"firstPageList_" + index}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this._onTouch(item.text)}
                      style={[
                        styles.iconitem,
                        {
                          backgroundColor: item.icon ? "#fff" : "#f6f6f6",
                          borderColor: item.icon ? "#dcdcdc" : "#f6f6f6"
                        }
                      ]}
                    >
                      <Icon
                        name={item.icon}
                        size={40}
                        style={{ color: "#7E8184" }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.itemText}>{item.text}</Text>
                  </View>
                );
              })}
            </View>
          </Swiper>
        ) : null}
        {this.state.recordOn ? (
          <View style={styles.recordContainer}>
            <View
              style={[styles.iconRecordContainer, { backgroundColor: "#fff" }]}
            >
              {!audioOn ? (
                <Image
                  source={{
                    uri:
                      "https://bm-oss.oss-cn-hangzhou.aliyuncs.com/arena/arenaprod/audio.png"
                  }}
                  style={{ width: 78, height: 40 }}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      "https://bm-oss.oss-cn-hangzhou.aliyuncs.com/arena/arenaprod/audio.gif"
                  }}
                  style={{ width: 80, height: 60 }}
                />
              )}
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.pressButton}
              onPressIn={this._onPressIn}
              onPressOut={this._onPressOut}
            >
              <Text style={styles.pressText}>按住 说话</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  speechRow: {
    height: 45,
    width: width,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-start",
    backgroundColor: "#F6F6F6",
    alignItems: "center"
  },
  iconRecordContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center"
  },
  row1Button: {
    width: 67,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 9,
    marginRight: 9,
    borderColor: "#ccc",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#5aa9fa"
  },
  communicationInput: {
    flex: 1,
    height: 32,
    paddingLeft: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderRadius: 5
  },
  textInput: {
    height: 32,
    textAlign: "left",
    textAlignVertical: "center",
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 14,
    color: "#999"
  },
  recordContainer: {
    backgroundColor: "#f3f4f5",
    width: width,
    height: 208,
    justifyContent: "center",
    alignItems: "center"
  },
  iconitem: {
    width: 55,
    height: 55,
    borderRadius: 15,
    marginLeft: (width - 220) / 10,
    marginRight: (width - 220) / 10,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcdcdc"
  },
  itemText: {
    marginLeft: (width - 220) / 10 + 5,
    fontSize: 11,
    color: "#666"
  },
  pressButton: {
    marginTop: 22,
    width: 175,
    height: 40,
    backgroundColor: "#5aa9fa",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  pressText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
  }
});
