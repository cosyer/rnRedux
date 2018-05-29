import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icons from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import Actions from "../actions";
import Loading from "../component/default-loading";
import Login from "./login";

const width = Dimensions.get("window").width;
const {
  increase,
  decrease,
  reset,
  refresh,
  listStateChange,
  listFactorChange
} = Actions;

@connect(state => ({
  list: state.list
}))
export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    headerRight: <Text />,
    headerStyle: {
      backgroundColor: "#5AA9FA",
      height: Platform.OS === "ios" ? 44 : 44,
      elevation: 0,
      shadowOpacity: 0
    },
    headerTitleStyle: {
      fontSize: 18,
      color: "white",
      alignSelf: "center"
      // flex: 1,
      // textAlign: 'center',
    }
  };

  componentDidMount() {
    var that = this;
    AsyncStorage.getItem("user").then(data => {
      var user;
      if (data) {
        user = JSON.parse(data);
      }
      if (user && user.accessToken) {
        that.props.dispatch(listFactorChange({ name: "user", value: user }));
        let payload = {};
        payload.accessToken = user.accessToken;
        payload.page = that.props.list.page;
        // that.props.dispatch(refresh(payload));
      }
    });
  }

  _onSelect = item => {
    this.props.navigation.navigate("Detail", { data: item });
  };

  // 下拉
  _pullDownRefresh = () => {
    this.props.dispatch(refresh());
  };

  // 喜欢切换
  _up = index => {
    this.props.dispatch(onLiked(index));
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => this._onSelect(item)}>
          <Text style={styles.title}>{item.title}</Text>
          <Image
            source={{ uri: "https://mydearest.cn/static/img/avatar.jpg" }}
            style={styles.thumb}
          />
        </TouchableOpacity>
        <View style={styles.itemFooter}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this._up(index)}
            style={styles.handleBox}
          >
            <Icon
              name={item.up ? "ios-heart" : "ios-heart-outline"}
              size={28}
              style={[styles.up, item.up ? null : styles.down]}
              onPress={this._up}
            />
            <Text style={styles.handleText}>喜欢</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this._up(index)}
            style={styles.handleBox}
          >
            <Icon
              name="ios-chatboxes-outline"
              size={28}
              style={styles.commentIcon}
            />
            <Text style={styles.handleText}>评论</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    let list = this.props.list;
    return (
      <View style={styles.container}>
        {list.loading ? (
          <Loading />
        ) : (
            <FlatList
              data={list.dataList}
              extraData={list}
              onRefresh={this._pullDownRefresh}
              refreshing={list.refreshing}
              keyExtractor={(item, index) => item._id}
              renderItem={this._renderItem}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  row: {
    width: width,
    marginBottom: 10,
    backgroundColor: "#FFF"
  },
  thumb: {
    width: width,
    height: width * 0.5,
    resizeMode: "cover"
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: "#333"
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee"
  },
  handleBox: {
    padding: 10,
    flexDirection: "row",
    width: width / 2 - 0.5,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  play: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    color: "#ed7b66"
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: "#333"
  },
  up: {
    fontSize: 22,
    color: "#ed7b66"
  },
  dowm: {
    fontSize: 22,
    color: "#333"
  },
  commentIcon: {
    fontSize: 22,
    color: "#333"
  }
});

// const mapStateToProps = state => ({
//   list: state.list
// })

// export default connect(mapStateToProps)(Home);
