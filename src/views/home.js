import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { increase, decrease, reset ,refresh} from '../actions/actions';

const width=Dimensions.get("window").width
@connect(state => ({
  list: state.list
}))
export default class Home extends Component {
  constructor(props){
    super(props)
    this.state={
      up:false
    }
  }

  componentDidMount(){
    this.props.dispatch(refresh());
  }

  _renderItem=({item,index})=>{
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          <Image
            source={{uri:item.thumb}}
            style={styles.thumb}/>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name={this.state.up ? "ios-heart" : "ios-heart-outline"}
                size={28}
                style={[styles.up,this.state.up ? null : styles.down]}
                onPress={this._up}
              />
              <Text style={styles.handleText} onPress={this._up}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon}
              />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>)
  }
  
  render() {
    console.log("111111111",this.props.list)

    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.list.dataList}
          extraData={this.props.list}
          keyExtractor={(item, index) => item._id}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#F5FCFF"
  },
  row:{
    width:width,
    marginBottom:10,
    backgroundColor:"#FFF"
  },
  thumb : {
    width: width,
    height: width * 0.5,
    resizeMode:'cover'
  },
  title : {
    padding:10,
    fontSize:18,
    color:'#333'
  },
  itemFooter : {
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#eee'
  },
  handleBox : {
    padding:10,
    flexDirection:'row',
    width:width / 2 - 0.5,
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  play : {
    position:'absolute',
    bottom:14,
    right:14,
    width:46,
    height:46,
    paddingTop:9,
    paddingLeft:18,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderWidth:1,
    borderRadius:23,
    color:'#ed7b66'
  },
  handleText : {
    paddingLeft:12,
    fontSize:18,
    color:'#333'
  },
  up:{
    fontSize:22,
    color:'#ed7b66'
  },
  dowm:{
    fontSize:22,
    color:'#333'
  },
  commentIcon:{
    fontSize:22,
    color:'#333'
  }
})

// const mapStateToProps = state => ({
//   list: state.list
// })

// export default connect(mapStateToProps)(Home);