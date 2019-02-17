import { createBottomTabNavigator } from "react-navigation";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React, { Component } from "react";

import Home from "../views/home";
import Mine from "../views/mine";

const MyTabNav = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "主页",
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon
                name={focused ? "ios-home" : "ios-home-outline"}
                size={20}
                color={tintColor}
                style={{ width: 20, height: 20, fontSize: 20 }}
              />
            </View>
          );
        }
      }
    },
    Video: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "视频",
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <Icon
              name={focused ? "ios-videocam" : "ios-videocam-outline"}
              size={20}
              color={tintColor}
              style={{ width: 20, height: 20, fontSize: 20 }}
            />
          );
        }
      }
    },
    Mine: {
      screen: Mine,
      navigationOptions: {
        tabBarLabel: "我的",
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <Icon
              name={focused ? "ios-person" : "ios-person-outline"}
              size={20}
              color={tintColor}
              style={{ width: 20, height: 20, fontSize: 20 }}
            />
          );
        }
      }
    }
  },
  {
    swipeEnabled: false,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#5990f7",
      inactiveTintColor: "#a3b6d0",
      showIcon: true,
      style: {
        backgroundColor: "white",
        height: 50
      },
      labelStyle: {
        fontSize: 12
      }
    }
  }
);

module.exports = MyTabNav;
