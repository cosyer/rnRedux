import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Icons from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Action from "../actions";
const { increase, decrease, reset } = Action;

class Count extends Component {
  _onPressReset() {
    //this.props.dispatch(reset()); // this.props.dispatch({type:"reset"});
    this.props.reset();
  }

  _onPressInc() {
    this.props.dispatch(increase());
  }

  _onPressDec() {
    this.props.dispatch(decrease());
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon name="ios-home" size={30} color="red" />
        <Icons name="rocket" size={30} color="#900" />
        <Text style={styles.counter}>{this.props.counter.count}</Text>
        <TouchableOpacity
          style={styles.reset}
          onPress={() => this._onPressReset()}
        >
          <Text>归零</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.start}
          onPress={() => this._onPressInc()}
        >
          <Text>加1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stop}
          onPress={() => this._onPressDec()}
        >
          <Text>减1</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  counter: {
    fontSize: 50,
    marginBottom: 70
  },
  reset: {
    margin: 10,
    backgroundColor: "yellow"
  },
  start: {
    margin: 10,
    backgroundColor: "yellow"
  },
  stop: {
    margin: 10,
    backgroundColor: "yellow"
  }
});

const mapStateToProps = state => ({
  counter: state.counter
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    reset: bindActionCreators(reset, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Count);
