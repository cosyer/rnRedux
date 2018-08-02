import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  PanResponder,
  Linking,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const width = Dimensions.get("window").width;

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

// 图片后缀
const picSuffix = "?x-oss-process=image/resize,m_lfit,h_236,w_248/quality,q_20";
export default class AuntCell extends Component {
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true); //启用android Layout动画
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        // 关闭其他 I am the only one
        this.props.pre_hide();
        this.setState({ isDelete: false });
      },
      onPanResponderMove: (evt, gestureState) => {
        //用于控制父组件FlatList Scroll的滚动
        if (!this.state.openState && gestureState.dx < -10) {
          this.props.stopDropdown(false);
        } else {
          this.props.stopDropdown(true);
        }
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // 左滑
        if (!this.state.openState && gestureState.dx < -10) {
          this.setState({ moveWidth: -gestureState.dx });
        }
        // 右滑
        if (this.state.openState && gestureState.dx > 0) {
          this.setState({ moveWidth: 65 - gestureState.dx });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.props.stopDropdown(true);
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        // 左滑
        if (!this.state.openState && gestureState.dx < -33) {
          LayoutAnimation.configureNext(customAnimated.customLinear);
          this.pre_id(this.props.id);
          this.setState({ openState: true, moveWidth: 65 });
        }
        if (
          !this.state.openState &&
          gestureState.dx < 0 &&
          gestureState.dx > -33
        ) {
          LayoutAnimation.configureNext(customAnimated.customLinear);
          this.setState({ openState: false, moveWidth: 0 });
        }
        // 右滑
        if (
          this.state.openState &&
          gestureState.dx > 0 &&
          gestureState.dx < 33
        ) {
          LayoutAnimation.configureNext(customAnimated.customLinear);
          this.setState({ openState: true, moveWidth: 65 });
        }
        if (this.state.openState && gestureState.dx > 33) {
          LayoutAnimation.configureNext(customAnimated.customLinear);
          this.setState({ openState: false, moveWidth: 0 });
        }
        // 点击
        if (gestureState.dx === 0 && gestureState.dy === 0) {
          if (!this.state.openState) {
            this.props.getDetail();
          } else {
            this.setState({ openState: false });
          }
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        if (
          !this.state.openState &&
          (Math.abs(gestureState.dx) >= 33 || Math.abs(gestureState.vx) >= 1)
        ) {
          this.pre_id(this.props.id);
        }
        LayoutAnimation.configureNext(customAnimated.customLinear);
        let openState = this.state.openState;
        let moveWith = this.state.moveWidth;
        if (moveWith < 33) {
          moveWith = 0;
          openState = false;
        } else {
          moveWith = 65;
          openState = true;
        }
        this.setState({ moveWidth: moveWith, openState: openState });
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return false;
      }
    });
    this.pre_hide = this.props.pre_hide;
    this.pre_id = this.props.pre_id;
    this.state = {
      openState: this.props.openState || false, // 开启侧滑
      moveWidth: 0,
      isDelete: false
    };
  }

  hide = () => {
    LayoutAnimation.configureNext(customAnimated.customLinear);
    this.setState({
      openState: false,
      moveWidth: 0,
      isDelete: false
    });
  };

  _onCall = value => {
    return Linking.openURL(`tel:${value}`);
  };

  render() {
    let item = this.props.item;

    let openState = this.state.openState;
    let moveWidth = this.state.moveWidth;
    // 由openState控制
    if (openState && moveWidth == 0) {
      moveWidth = 65;
    }
    if (!openState && moveWidth == 65) {
      moveWidth = 0;
    }
    let viewRightStyle = { width: 65, zIndex: -1 };
    let touchStyle = moveWidth
      ? { right: moveWidth > 65 ? 65 : moveWidth }
      : {};
    return (
      <View>
        <View
          style={[
            styles.container,
            touchStyle,
            this.state.isDelete && { right: 130 }
          ]}
          {...this._panResponder.panHandlers}
        >
          <Image
            source={{
              uri: item.auntHeadPhoto
                ? item.auntHeadPhoto
                : "https://bm-oss.oss-cn-hangzhou.aliyuncs.com/arena/arenaprod/system/aytx@2x.png"
            }}
            style={{ width: 54, height: 54, borderRadius: 27 }}
          />
          <View style={styles.content}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.title}>{item.name || "--"}</Text>
              <TouchableOpacity
                style={styles.iconContainer}
                activeOpacity={0.5}
                onPress={() => this._onCall(item.phone)}
              >
                <Icon name="ios-call" size={16} style={{ color: "#5aa9fa" }} />
              </TouchableOpacity>
            </View>
            <Text style={styles.subTitle}>
              {item.addressInfo ? item.addressInfo.address : ""}
            </Text>
          </View>
          <Icon name="ios-arrow-forward" size={16} style={{ color: "#666" }} />
        </View>
        {this.state.isDelete ? (
          <View
            style={[
              { width: 130, zIndex: -1 },
              {
                position: "absolute",
                right: 0,
                justifyContent: "flex-end",
                flexDirection: "row"
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => this.props.deleteItem()}
              style={[styles.sureDelete, { backgroundColor: "#FE3B31" }]}
            >
              <Text style={{ fontSize: 16, color: "#FFFFFF" }}>确认删除</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              viewRightStyle,
              {
                position: "absolute",
                right: 0,
                justifyContent: "flex-end",
                flexDirection: "row"
              }
            ]}
          >
            <TouchableOpacity
              style={[styles.sidesLipFont, { backgroundColor: "#FE3B31" }]}
              onPress={() => this.setState({ isDelete: true })}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff"
                }}
              >
                删除
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: 88,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff"
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 14,
    backgroundColor: "#fff"
  },
  title: {
    color: "#333",
    fontSize: 16
  },
  subTitle: {
    color: "#999",
    fontSize: 14
  },
  right: {
    position: "absolute",
    right: 16,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  price: {
    color: "#FE3B31",
    fontSize: 20
  },
  orignPrice: {
    color: "#999",
    fontSize: 16,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontFamily: "PingFangSC-Medium"
  },
  sidesLipFont: {
    width: 65,
    height: 88,
    justifyContent: "center",
    alignItems: "center"
  },
  sureDelete: {
    width: 130,
    height: 88,
    justifyContent: "center",
    alignItems: "center"
  },
  iconContainer: {
    width: 22,
    height: 22,
    marginLeft: 5,
    marginTop: -3,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90,169,250,.1)"
  }
});
