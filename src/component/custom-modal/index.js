import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';

export default class CustomModal extends Component {
    PropTypes = {
        onLeftPress: PropTypes.func, // 左侧点击回调
        onRightPress: PropTypes.func // 右侧点击回调
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        title: '', // 标题
        content: '', // 内容
        type: 'confirm', // comfim:用于确认 info:用于提示(以右边操作为优先)
        leftBnText: '取消', // 左侧文本
        rightBnText: '确定', // 右侧文本
        transparent: true, // 是否透明
        animationType: 'fade', // 动画类型 slide、fade、none
        modalVisible: false // 显示 组件自身状态 组件初始化 this.props.modalVisible
    };

    _onLeftPress = () => {
        this.props.onLeftPress ? this.props.onLeftPress() : '';
    };

    _onRightPress = () => {
        this.props.onRightPress ? this.props.onRightPress() : '';
    };

    _onInfo = () => {
        this.props.onRightPress ? this.props.onRightPress() : this.props.onLeftPress ? this.props.onLeftPress() : '';
    };

    render() {
        return (
            <Modal
                visible={this.props.modalVisible}
                transparent={this.props.transparent}
                animationType={this.props.animationType}
                onRequestClose={() => { }}>
                <View style={styles.container}>
                    <View style={styles.modalContainer}>
                        {this.props.title ? <Text style={styles.modalTitle}>{this.props.title}</Text> : null}
                        <View
                            style={{
                                flex: 1,
                                height: 100,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={styles.modalContent}>{this.props.content}</Text>
                        </View>
                        <View style={styles.horizonLine} />
                        {this.props.type === 'confirm' && (
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.leftBn}
                                    onPress={this._onLeftPress}
                                    underlayColor={'#C5C5C5'}
                                    activeOpacity={0.5}>
                                    <Text style={styles.leftBnText}>{this.props.leftBnText}</Text>
                                </TouchableOpacity>
                                <View style={styles.verticalLine} />
                                <TouchableOpacity
                                    style={styles.rightBn}
                                    onPress={this._onRightPress}
                                    underlayColor={'#C5C5C5'}
                                    activeOpacity={0.5}>
                                    <Text style={styles.rightBnText}>{this.props.rightBnText}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {this.props.type === 'info' && (
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.leftBn}
                                    onPress={this._onInfo}
                                    underlayColor={'#C5C5C5'}
                                    activeOpacity={0.5}>
                                    <Text style={styles.rightBnText}>{this.props.rightBnText || this.props.leftBnText}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        height: 150,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    modalTitle: {
        color: '#000000',
        fontSize: 16,
        marginTop: 25
    },
    modalContent: {
        color: '#333',
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    horizonLine: {
        backgroundColor: '#dcdcdc',
        height: 0.5,
        alignSelf: 'stretch'
    },
    verticalLine: {
        backgroundColor: '#dcdcdc',
        width: 1,
        height: 50,
        alignSelf: 'stretch'
    },
    leftBn: {
        height: 50,
        borderBottomLeftRadius: 3,
        padding: 7,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftBnText: {
        fontSize: 16,
        color: '#666'
    },
    rightBn: {
        height: 50,
        borderBottomRightRadius: 3,
        padding: 7,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightBnText: {
        fontSize: 16,
        color: '#ffa61a'
    }
});
