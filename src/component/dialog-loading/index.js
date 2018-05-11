/*
 * @Author: chenyu 
 * @Date: 2018-04-18 15:57:19 
 * @Last Modified by: chenyu
 * @Last Modified time: 2018-05-09 22:03:47
 */

import React, { Component } from "react"
import { View, Image, Modal, Text, Dimensions } from "react-native"

export default class DefaultLoading extends Component {

    static defaultProps = {
        visible: false
    }

    render() {
        return (
            <Modal visible={this.props.visible} animationType="slide" transparent={true}
            onRequestClose={() => {console.log("Modal has been closed.")}}
            >
                <View
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").width.height,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000000",
                        opacity: 0.5
                    }}
                >
                </View>
                <Image
                    source={{
                        uri: "https://bm-oss.oss-cn-hangzhou.aliyuncs.com/arena/arenaprod/cuser/uploading.gif"
                    }}
                    style={{ width: 100, height: 20, marginTop: -((Dimensions.get("window").width.height) / 2 + 50), marginLeft: (Dimensions.get("window").width - 100) / 2 }}
                />
                <Text style={{ fontSize: 14, color: '#ffffff', marginLeft: (Dimensions.get("window").width - 50) / 2, marginTop: 10 }}>
                    上传中...
                </Text>
            </Modal >
        )
    }
}
