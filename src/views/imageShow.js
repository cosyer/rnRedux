import React, { Component } from "react";
import {
  NativeModules,
  BackHandler,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";
import Tips from "../utils/tips";
import Request from "../utils/request";

const width = Dimensions.get("window").width;

export default class DayPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeArray: [], //栏目标签数组
      dataSource: {}, //栏目对应的海报  {"节日":[],"劳动":[]}
      contentLayout: {}, //内容视图的布局大小
      showModal: false, //是否显示蒙层,
      isCreatePhoto: false, //是否生成海报
      selectPhoto: {}, //选中的图片对象
      user: {}, //用户个人信息
      refreshing: false //刷新标识符
    };

    this.isComplete = false; //加载完成标识符
    this.pageNum = 0; //当前页码
    this.pageSize = 10; //一页请求条数
    this.paddingHorizontal = 10; //整个内容视图距离两边的间距
    this.photoHorizontal = 11; //图片与图片之间的间距
    this.photoWidth =
      (width - this.paddingHorizontal * 2 - this.photoHorizontal * 2) / 3.0; //每个图片的宽度
    this.photoHeight = this.photoWidth * 1.78; //每个图片的高度

    this._renderContentView = this._renderContentView.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderModalView = this._renderModalView.bind(this);
    this._savePicture = this._savePicture.bind(this);
    this._share = this._share.bind(this);
    this._queryUserInfo = this._queryUserInfo.bind(this);
    this._queryDailyChartList = this._queryDailyChartList.bind(this);
    this._loadPage = this._loadPage.bind(this);
    this._emptyComponent = this._emptyComponent.bind(this);
    this._queryDailyChartLabList = this._queryDailyChartLabList.bind(this);

    /*
    * android 的物理返回键 ，当蒙层显示时，需要先把蒙层隐藏
    * */
    if (Platform.OS == "android") {
      BackHandler.addEventListener("hardwareBackPress", () => {
        if (this.state.showModal) {
          this.setState({
            showModal: false
          });

          return true;
        }
        return false;
      });
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerTitle: "图片展示",
      headerRight: <View />
    };
  };

  componentDidMount() {
    // this._queryUserInfo();
    this._queryDailyChartLabList();
  }

  render() {
    return (
      <View
        style={styles.container}
        onLayout={event => {
          this.setState({ contentLayout: event.nativeEvent.layout });
        }}
      >
        <ScrollableTabView
          initialPage={0}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{
                backgroundColor: "white",
                borderBottomColor: "#eeeeee",
                borderBottomWidth: StyleSheet.hairlineWidth
              }}
              tabStyle={{ height: 45 }}
              activeTextColor="#5AA9FA"
              inactiveTextColor="#666666"
              textStyle={{ fontSize: 14 }}
              underlineStyle={{ height: 2, backgroundColor: "#5AA9FA" }}
            />
          )}
        >
          {/**绘制内容视图*/}
          {this._renderContentView()}
        </ScrollableTabView>

        {/**绘制蒙层*/}
        {this._renderModalView()}
      </View>
    );
  }

  /**
   * 绘制内容视图
   * @return {Array}
   * @private
   */
  _renderContentView() {
    let that = this;
    let views = that.state.typeArray.map(function(value, index) {
      return (
        <FlatList
          key={index}
          tabLabel={value}
          style={{ paddingTop: 6 }}
          numColumns={3}
          horizontal={false}
          data={that.state.dataSource[value]}
          columnWrapperStyle={{
            paddingHorizontal: that.paddingHorizontal,
            paddingVertical: 6
          }}
          renderItem={that._renderItem}
          onRefresh={() => {
            // that._queryDailyChartList(0, value);
          }}
          refreshing={that.state.refreshing}
          ListEmptyComponent={that._emptyComponent}
          onEndReachedThreshold={0.15}
          onEndReached={() => {
            that._loadPage(value);
          }}
          keyExtractor={(item, index) => index}
          keyboardDismissMode="on-drag"
        />
      );
    });

    return views;
  }

  /**
   * 空白页
   */
  _emptyComponent() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{
            marginTop: width * 0.536,
            width: 100,
            height: 80
          }}
          source={{
            uri:
              "https://bm-oss.oss-cn-hangzhou.aliyuncs.com/arena/arenaimg/prod/frame/flatlist/nocontent.png"
          }}
        />
        <Text style={{ fontSize: 14, color: "#999999", marginTop: 15 }}>
          暂无内容
        </Text>
      </View>
    );
  }

  /**
   * 绘制蒙层
   * @return {*}
   * @private
   */
  _renderModalView() {
    let modelContentHeight = this.state.contentLayout.height - 37.5 - 30;
    let modelImageHeight = modelContentHeight - 40 - 15;
    let modelContentWith = modelImageHeight * 0.562;
    let closeRight =
      (this.state.contentLayout.width - modelContentWith) / 2.0 - 20 - 12.5;
    if (closeRight < 0) {
      closeRight = 0;
    }

    if (this.state.showModal) {
      return (
        <View
          style={[
            styles.modalView,
            {
              width: this.state.contentLayout.width,
              height: this.state.contentLayout.height
            }
          ]}
        >
          <View
            style={[
              styles.modalContentView,
              { height: modelContentHeight, width: modelContentWith }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ showModal: false });
              }}
            >
              <ImageBackground
                source={{ uri: this.state.selectPhoto.picUrl }}
                style={{
                  justifyContent: "flex-end",
                  width: modelContentWith,
                  height: modelImageHeight
                }}
                resizeMode="contain"
              >
                {this.state.isCreatePhoto ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      paddingHorizontal: 6,
                      paddingVertical: 6
                    }}
                  >
                    <Image
                      source={{ uri: `${this.state.user.photo}@667h_375w_0e` }}
                      style={{ width: 37, height: 37, borderRadius: 18.5 }}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        marginHorizontal: 9
                      }}
                    >
                      <Text
                        style={{ color: "white", fontSize: 11 }}
                        numberOfLines={2}
                      >{`${this.state.user.name} ${this.state.user
                        .companyName || ""}`}</Text>
                      <Text
                        style={{ color: "white", fontSize: 10 }}
                        numberOfLines={1}
                      >{`${this.state.user.phone || ""}`}</Text>
                    </View>

                    <Image
                      source={{ uri: this.state.user.qrCode }}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>
                ) : null}
              </ImageBackground>
            </TouchableOpacity>
            {this.state.isCreatePhoto ? (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={this._savePicture}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    height: 40,
                    marginTop: 15,
                    borderRadius: 2,
                    marginRight: 16
                  }}
                >
                  <Text style={{ color: "#FFA61A", fontSize: 16 }}>
                    保存到手机
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this._share}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFA61A",
                    height: 40,
                    marginTop: 15,
                    borderRadius: 2
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>分享</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isCreatePhoto: true });
                }}
                style={[styles.createBtn, { width: modelContentWith }]}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  加上我的名片，生成我的海报
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Icon name="ios-play" size={48} />
        </View>
      );
    } else {
      return null;
    }
  }

  /**
   * 绘制每一个Item
   * @param data
   * @return {XML}
   * @private
   */
  _renderItem(data) {
    let item = data.item;
    let index = data.index;
    let marginHorizontal = index % 3 == 0 ? 0 : this.photoHorizontal;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ showModal: true, selectPhoto: item });
        }}
      >
        <Image
          source={{ uri: `${item.picUrl}` }}
          style={{
            height: this.photoHeight,
            width: this.photoWidth,
            marginLeft: marginHorizontal
          }}
          resizeMode="contain"
        />
        <Text style={styles.contentText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  /**
   * 查询用户个人信息
   * @private
   */
  _queryUserInfo() {
    let that = this;
    // 有空把request再封一层api,就可以用async/await
    Request.post(
      "https://gatewaytest.bm001.com/fw/user/queryInfoCount",
      {},
      res => {
        let finalUser = res.data;
        //如果没有二维码，再调用一次二维码生成的接口
        if (!finalUser.qrCode || finalUser.qrCode == "") {
          Request.post(
            "https://gatewaytest.bm001.com/fw/toQrCode",
            {},
            result => {
              finalUser.qrCode = result.data.qrCodeUrl;
              that.setState({
                user: finalUser
              });
            }
          );
        } else {
          that.setState({
            user: finalUser
          });
        }
      }
    );
  }

  _queryDailyChartLabList() {
    let that = this;
    Request.post(
      "https://gatewaytest.bm001.com/fw/dailychart/labList",
      {},
      res => {
        if (res.data) {
          // 处理datasource
          let dataSource = {
            科技: [
              {
                picUrl: "https://static.mydearest.cn/img/avatar.jpg"
              },
              {
                picUrl: "https://static.mydearest.cn/img/avatar.jpg"
              },
              {
                picUrl: "https://static.mydearest.cn/img/avatar.jpg"
              }
            ]
          };
          that.setState({
            // typeArray: res.data.dataList
            typeArray: ["科技", "教育", "节日", "文化"],
            dataSource
          });
          // res.data.dataList.map(function(value) {
          //   that._queryDailyChartList(0, value);
          // });
        }
      }
    );
  }

  /**
   * 查询每日一图列表
   * @param pageNum 页码
   * @param lab 栏目
   * @private
   */
  _queryDailyChartList(pageNum, lab) {
    let that = this;
    that.setState({
      refreshing: true
    });

    let params = {
      pageSize: this.pageSize,
      lab: lab
    };
    if (pageNum > 0) {
      params.pageNum = this.pageNum;
    } else {
      params.pageNum = 0;
    }

    Request.post(
      "https://gateway.bm001.com/fw/dailychart/list",
      params,
      res => {
        let dataList = res.data.dataList;
        if (
          (dataList.length > 0 && dataList.length < this.pageSize) ||
          dataList.length === 0
        ) {
          that.isComplete = true;
        }

        let fianlDataSource = that.state.dataSource;
        let finalDataList = that.state.dataSource[lab];
        finalDataList =
          that.isComplete === false && params.pageNum > 0
            ? finalDataList.concat(dataList)
            : dataList;
        fianlDataSource[lab] = finalDataList;
        that.setState({
          dataSource: fianlDataSource,
          refreshing: false
        });
      }
    );
  }

  /**
   * 上拉加载数据
   * @param lab 栏目
   * @private
   */
  _loadPage(lab) {
    if (this.isComplete === true) {
      return;
    }

    this.pageNum = this.pageNum + 1;
    // this._queryDailyChartList(this.pageNum, lab);
  }

  /**
   * 保存到手机
   * @private
   */
  _savePicture() {
    let that = this;

    Tips.showLoading("海报生成中");
    NativeModules.extra.posterWatermark(
      {
        url: that.state.selectPhoto.picUrl
      },
      (error, datas) => {
        Tips.hideLoading();

        if (datas) {
          Tips.showTips("保存成功");
        } else {
          Tips.showTips("保存失败");
        }
      }
    );
  }

  /**
   * 分享
   * @private
   */
  _share() {
    let that = this;

    Tips.showLoading("海报生成中");
    NativeModules.extra.posterWatermark(
      {
        url: that.state.selectPhoto.picUrl,
        saveToAlbum: false
      },
      (error, datas) => {
        Tips.hideLoading();

        if (datas) {
          NativeModules.extra.shareImage(
            {
              filePath: datas.filePath
            },
            (error, events) => {
              if (error) {
                Tips.showTips("分享失败");
              }
            }
          );
        } else {
          Tips.showTips("分享失败");
        }
      }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f5"
  },

  contentText: {
    color: "#333333",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7.5
  },

  modalView: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0
  },
  modalContentView: {
    flexDirection: "column",
    alignItems: "center"
  },
  createBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFA61A",
    borderRadius: 2,
    marginTop: 15,
    height: 40
  }
});
