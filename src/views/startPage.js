import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AsyncStorage
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

class StartPageScreen extends React.Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      imgUrl: ""
    };
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerStyle: {
        height: 0,
        elevation: 0, // android导航底部阴影
        shadowOpacity: 0 // ios导航底部阴影
      }
    };
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      {
        this.jumpNextPage();
      }
    }, 2000);
  }

  render() {
    return <View>{this.renderImg()}</View>;
  }

  renderImg = () => {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/image/start_bg.png")}
          style={styles.img_bg}
        />
        <Image
          source={require("../assets/image/start_homeasy.png")}
          style={styles.imgTopStyle}
        />
        <Image
          source={require("../assets/image/start_center.png")}
          style={styles.imgCenterStyle}
        />

        <View style={styles.txtViewStyle}>
          <Text style={styles.txtStyle}>由cosyer支持</Text>
          <Text style={styles.txtStyle}>stay foolish stay hungry</Text>
        </View>
      </View>
    );
  };

  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
  }

  jumpNextPage = () => {
    // 判断用户是否登陆过
    let that = this;
    AsyncStorage.getItem("user").then(data => {
      console.log(data);
      if (data) {
        that.props.navigation.navigate("Home");
      } else {
        that.props.navigation.navigate("Login");
      }
    });
    // if (this.state.isLogin) {
    //   //跳转页面：Reset - 用一个新的状态替换当前状态
    //   this.props.navigation.dispatch(
    //     StackActions.reset({
    //       index: 0,
    //       actions: [NavigationActions.navigate({ routeName: "Main" })]
    //     })
    //   );
    // } else {
    //   //跳转页面：Reset - 用一个新的状态替换当前状态
    //   this.props.navigation.dispatch(
    //     StackActions.reset({
    //       index: 0,
    //       actions: [NavigationActions.navigate({ routeName: "Login" })]
    //     })
    //   );
    // }
  };
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    alignItems: "center"
  },
  img_bg: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch"
  },
  imgTopStyle: {
    position: "absolute",
    top: height * 0.1
  },
  imgCenterStyle: {
    position: "absolute",
    top: height * 0.28
  },
  txtViewStyle: {
    position: "absolute",
    bottom: 20,
    alignItems: "center"
  },
  txtStyle: {
    fontSize: 13,
    color: "#3d6fc7"
  }
});

module.exports = StartPageScreen;
