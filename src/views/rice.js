import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import Button from '../component/button'
import Button1 from '../component/button/rn-button'
import Button2 from '../component/button/rn-button2'
import CModal from '../component/custom-modal'
import Toast from '../component/toast'
import { showHUDMessage } from '../component/hud-tips'
import DialogLoading from '../component/dialog-loading'

export default class Rice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            dialogVisible: false
        }
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        return {
            headerTitle: "组件页",
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Button style={styles.btn} textStyle={styles.countBtnText} onPress={() => this.setState({ modalVisible: true })}>Modal按钮</Button>
                <CModal modalVisible={this.state.modalVisible} title="公告" content="我是一个confirm框"
                    onLeftPress={() => this.setState({ modalVisible: false })} onRightPress={() => this.setState({ modalVisible: false })} />
                <Button1
                    containerStyle={styles.btn}
                    disabledContainerStyle={{ backgroundColor: 'grey' }}
                    style={{ fontSize: 14, color: 'green' }}
                    onPress={() =>
                        // Toast.show("before my body dry", {
                        //     duration: Toast.durations.SHORT,
                        //     position: Toast.positions.CENTER,
                        //     shadow: true,
                        //     animation: true,
                        //     hideOnPress: true,
                        //     delay: 0,
                        // })
                        showHUDMessage("before my body dry", 1500)
                    }>
                    Tips按钮
                </Button1>
                <Button2 style={styles.btn} textStyle={{ fontSize: 14 }} onPress={() => {
                    this.setState({ dialogVisible: true })
                    setTimeout(() => this.setState({ dialogVisible: false }), 3000)
                }}>
                    Hello! dialogLoading
                </Button2>
                <DialogLoading visible={this.state.dialogVisible} title="加载中..." />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    btn: {
        marginTop: 10,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
        borderColor: '#EE735C',
        borderWidth: 1,
        borderRadius: 4,
    },
    countBtnText: {
        color: '#5aa9fa',
        textAlign: 'center',
        fontSize: 14,
    }
})
