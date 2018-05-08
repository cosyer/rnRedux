/*
 * @Author: chenyu 
 * @Date: 2018-04-18 16:02:40 
 * @Last Modified by: chenyu
 * @Last Modified time: 2018-04-18 16:06:07
 */

import React, { Component } from "react"
import { Text, View, Image, Dimensions } from "react-native"

export default class DefaultLoading extends Component {
    render() {
        return (
            <View
                style={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height - 60,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: '#f3f4f5'
                }}
            >
                <Image
                    source={{ uri: "https://bm-oss.oss-cn-hangzhou.aliyuncs.com/arena/arenaprod/system/jzz.gif" }}
                    style={{ width: 49, height: 30 }}
                />
                <Text style={{ fontSize: 14, color: '#999999', marginTop: 16 }}>
                    加载中...
                </Text>
            </View>
        )
    }
}
