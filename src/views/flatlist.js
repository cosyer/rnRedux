import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AuntCell from "../component/cell/aunt-cell";

export default class TestFlatList extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      headerTitle: "FlatList手势侧滑",
      headerRight: <View />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      auntList: [
        {
          auntId: 1,
          name: "张阿姨",
          phone: 18883269663,
          auntHeadPhoto: "https://static.mydearest.cn/img/avatar.jpg",
          addressInfo: {
            address: "软件谷人才公寓B2栋701"
          }
        },
        {
          auntId: 2,
          name: "李阿姨",
          phone: 18883269663,
          auntHeadPhoto: "https://static.mydearest.cn/img/avatar.jpg",
          addressInfo: {
            address: "软件谷人才公寓B2栋701"
          }
        },
        {
          auntId: 3,
          name: "陈阿姨",
          phone: 18883269663,
          auntHeadPhoto: "https://static.mydearest.cn/img/avatar.jpg",
          addressInfo: {
            address: "软件谷人才公寓B2栋701"
          }
        }
      ]
    };
    this.reflist = [];
    this.optId = -1;
  }

  // 阻止下拉
  _stopDropdown = value => {
    this.setState({
      isScrollEnabled: value
    });
  };

  /*隐藏前一个的id显示*/
  pre_id = inputId => {
    this.optId = inputId;
  };

  /*根据id 隐藏前一个 显示*/
  pre_hide = () => {
    let optId = this.optId;
    let len = this.reflist.length;

    for (let i = 0; i < len; i++) {
      if (this.reflist[i] && this.reflist[i].props) {
        let id = this.reflist[i].props.id;
        if (optId == id) {
          this.reflist[i].hide();
        }
      }
    }
    this.optId = -1;
  };

  _renderItem = (item, index) => {
    return (
      <AuntCell
        item={item}
        key={index}
        id={item.auntId}
        ref={component => {
          this.reflist.push(component);
        }}
        pre_hide={this.pre_hide}
        pre_id={this.pre_id}
        stopDropdown={this._stopDropdown}
        getDetail={() => console.log(11111)}
        deleteItem={() => console.log(22222)}
      />
    );
  };

  // 上拉刷新
  _onEndReached = () => {};

  //渲染
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.auntList}
          extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          onRefresh={this._refresh}
          refreshing={false}
          onEndReached={() => this._onEndReached()}
          onEndReachedThreshold={0.15}
          keyboardDismissMode="on-drag"
          keyExtractor={item => item.auntId}
          scrollEnabled={true}
        />
      </View>
    );
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    margin: 15,
    height: 30,
    borderWidth: 1,
    padding: 6,
    borderColor: "#ddd",
    textAlign: "center"
  }
});
