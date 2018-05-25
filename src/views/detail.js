import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import Button from '../component/button'
import {
    StyleSheet,
    Dimensions,
    Text,
    Image,
    ActivityIndicator,
    FlatList,
    Modal,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    View
} from 'react-native'
import Actions from '../actions';
const width = Dimensions.get('window').width
const { detailParamsChange, queryCommentList, addComment } = Actions

const cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

@connect(state => ({
    detail: state.detail,
    list: state.list
}))
export default class Detail extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // 获取评论
        // this._queryCommentList()
        this._addComment()
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        const headRightView = (
            <TouchableOpacity activeOpacity={1} style={{ marginRight: 16 }} onPress={() => navigation.state.params.onEdit()}>
                <Icons
                    name='edit'
                    style={{
                        color: '#fff',
                        fontSize: 20,
                    }}
                />
            </TouchableOpacity>)
        return {
            // 这里面的属性和App.js的navigationOptions是一样的。
            headerTitle: "视频详情",
            headerRight: headRightView
        }
    }

    _queryCommentList = () => {
        let pageNum = this.props.detail.pageNum
        let user = this.props.list.user
        this.props.dispatch(queryCommentList(user, this.props.navigation.state.params.data, pageNum))
    }

    _addComment = () => {
        let pageNum = this.props.detail.pageNum
        let user = this.props.list.user
        this.props.dispatch(queryCommentList(user, this.props.navigation.state.params.data, '1212121'))
    }

    _backToList = () => {
        this.props.navigator.pop()
    }

    _onLoadStart = () => {
        console.log('start')
    }

    _onLoad = () => {
        console.log('load')
    }

    _onProgress = (data) => {
        let { videoOptions } = this.props.detail

        let duration = data.playableDuration
        let currentTime = data.currentTime
        let percent = Number((currentTime / duration).toFixed(2))
        videoOptions.videoTotal = duration
        videoOptions.currentTime = Number(data.currentTime.toFixed(2))
        videoOptions.videoProgress = percent

        if (!videoOptions.videoLoaded) {
            videoOptions.videoLoaded = true
        }
        if (!videoOptions.playing) {
            videoOptions.playing = true
        }
        this.props.dispatch(detailParamsChange({ name: 'videoOptions', value: videoOptions }))
    }

    _onEnd() {
        let { videoOptions } = this.props.detail
        videoOptions.playing = false
        videoOptions.videoProgress = 1
        this.props.dispatch(detailParamsChange({ name: 'videoOptions', value: videoOptions }))
    }

    _onError = (err) => {
        console.log(err)
        console.log('error')
    }

    _togglePause = () => {
        let { videoOptions } = this.props.detail
        videoOptions.pause = !videoOptions.pause
        this.props.dispatch(detailParamsChange({ name: 'videoOptions', value: videoOptions }))
    }

    _onError() {
        let { videoOptions } = this.props.detail
        videoOptions.videoOk = false
        this.props.dispatch(detailParamsChange({ name: 'videoOptions', value: videoOptions }))
    }

    // 获取评论
    _fetchData(page) {

        this.setState({
            isLoadingTail: true
        })

        request.get(config.api.base + config.api.comments, {
            accessToken: this.state.user.accessToken,
            creation: this.state.data._id,
            page: page
        })
            .then((data) => {
                if (data && data.success) {
                    if (data.data.length > 0) {
                        var items = cachedResults.items.slice()

                        items = items.concat(data.data);
                        cachedResults.nextPage += 1;
                        cachedResults.items = items;
                        cachedResults.total = data.total;

                        this.setState({
                            isLoadingTail: false,
                            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
                        })
                    }
                }
            })
            .catch((error) => {

                this.setState({
                    isLoadingTail: false
                })

                console.error(error);
            });
    }

    _hasMore() {
        return cachedResults.items.length !== cachedResults.total;
    }

    _fetchMoreData() {
        if (!this._hasMore() || this.state.isLoadingTail) {
            return
        }
        var page = cachedResults.nextPage;
        this._fetchData(page);
    }

    _renderFooter() {
        if (!this._hasMore() && cachedResults.total !== 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>
                        没有更多了
          </Text>
                </View>
            )
        }

        if (!this.state.isLoadingTail) {
            return (<View style={styles.loadingMore}></View>);
        }

        return (
            <ActivityIndicator
                style={styles.loadingMore}
            />
        )
    }

    // 评论列表的头
    _renderHeader() {
        var data = this.state.data
        return (
            <View style={styles.listHeader}>
                <View style={styles.infoBox}>
                    <Image style={styles.avatar}
                        source={{ uri: util.avatar(data.author.avatar) }} />
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>{data.author.nickname}</Text>
                        <Text style={styles.title}>{data.title} </Text>
                    </View>
                </View>
                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput placeholder="敢不敢评论一个..."
                            style={styles.content}
                            multiline={true}
                            onFocus={this._focus} />
                    </View>
                </View>
                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>精彩评论</Text>
                </View>
            </View>
        )
    }

    _renderRow(row) {
        return (
            <View key={row._id}
                style={styles.replyBox}>
                <Image style={styles.replyAvatar}
                    source={{ uri: util.avatar(row.replyBy.avatar) }} />
                <View style={styles.reply}>
                    <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
                    <Text style={styles.replyContent}>{row.content} </Text>
                </View>
            </View>
        )
    }

    _focus() {
        this._setModalVisible(true)
    }

    _blur() {

    }

    _closeModal() {
        this._setModalVisible(false)
    }

    _setModalVisible(isVisible) {
        this.setState({
            modalVisible: isVisible
        })
    }

    _submit() {
        var that = this;
        if (!this.state.content) {
            return AlertIOS.alert('评论不能为空')
        }
        if (this.state.isSending) {
            return AlertIOS.alert('正在评论中')
        }
        this.setState({
            isSending: true
        }, function () {
            var body = {
                accessToken: this.state.user.accessToken,
                comment: {
                    creation: this.state.data._id,
                    content: this.state.content
                }
            }
            var url = config.api.base + config.api.comments
            request.post(url, body)
                .then(function (data) {
                    if (data && data.success) {
                        var items = cachedResults.items.slice()
                        var content = that.state.content
                        items = data.data.concat(items);
                        cachedResults.items = items
                        cachedResults.total = cachedResults.total + 1
                        that.setState({
                            content: '',
                            isSending: false,
                            dataSource: that.state.dataSource.cloneWithRows(
                                cachedResults.items)
                        })
                        that._setModalVisible(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    that.setState({
                        isSending: false
                    })
                    that._setModalVisible(false)
                    AlertIOS.alert('评论失败，请稍后重试')
                })
        });
    }

    render() {
        let { videoOptions } = this.props.detail

        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.videoBox} onPress={this._togglePause} activeOpacity={1}>
                    <Video
                        ref="videoPlayer"
                        source={{ uri: videoOptions.source }}
                        style={styles.video}
                        volumn={videoOptions.volumn}
                        paused={videoOptions.pause}
                        rate={videoOptions.rate}
                        muted={videoOptions.muted}
                        resizeMode={videoOptions.resizeMode}
                        repeat={videoOptions.repeat}
                        onLoadStart={this._onLoadStart}
                        onLoad={this._onLoad}
                        onProgress={this._onProgress}
                        onEnd={this._onEnd}
                        onError={this._onError}
                    />
                    {
                        !videoOptions.videoOk &&
                        <Text style={styles.errorText}>视频播放错误</Text>
                    }
                    {
                        // 加载动画
                        !videoOptions.videoLoaded &&
                        <ActivityIndicator
                            color='#ee735c' style={styles.loading}
                        />
                    }

                    {
                        // 播放按钮
                        videoOptions.videoLoaded && videoOptions.pause
                            ?
                            <Icon
                                name='ios-play'
                                size={48}
                                style={styles.playIcon} />
                            : null
                    }
                    <View
                        style={styles.progressBox}
                    >
                        <View style={[styles.progressBar, {
                            width: width * videoOptions.videoProgress
                        }]}></View>
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={false}>
                    <View style={styles.modalContainer}>
                        <Icon
                            onPress={this._closeModal}
                            name='ios-close-outline'
                            style={styles.closeIcon} />

                        <View style={styles.commentBox}>
                            <View style={styles.comment}>
                                <TextInput placeholder="敢不敢评论一个..."
                                    style={styles.content}
                                    multiline={true}
                                    defaultValue={''}
                                    onChangeText={(text) => {
                                        console.log(112121)
                                    }} />
                            </View>
                        </View>
                        <Button style={styles.submitBtn} onPress={this._submit}>评论</Button>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    modalContainer: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff'
    },
    closeIcon: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#ee753c'
    },
    videoBox: {
        width: width,
        height: width * 0.56,
        backgroundColor: '#000'
    },
    video: {
        width: width,
        height: width * 0.56,
        backgroundColor: '#000'
    },
    loading: {
        position: 'absolute',
        left: 0,
        top: width * 0.28,
        width: width,
        alignSelf: 'center',
        backgroundColor: 'transparent'
    },
    progressBox: {
        width: width,
        height: 2,
        backgroundColor: '#ccc',
    },
    progressBar: {
        width: 1,
        height: 2,
        backgroundColor: '#ff6600'
    },
    playIcon: {
        position: 'absolute',
        top: width * 0.28 - 30,
        left: width / 2 - 30,
        width: 60,
        height: 60,
        paddingTop: 6,
        paddingLeft: 22,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        color: '#ed7b66'
    },
    submitBtn: {
        alignSelf: 'center',
        width: width - 20,
        padding: 16,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ee753c',
        borderRadius: 4,
        fontSize: 18,
        color: '#ee753c'
    },
    pauseBtn: {
        left: 0,
        top: 0,
        position: 'absolute',
        width: width,
        height: 360
    },
    errorText: {
        position: 'absolute',
        left: 0,
        top: 110,
        width: width,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'transparent'
    },
    resumeIcon: {
        position: 'absolute',
        top: 80,
        left: width / 2 - 30,
        width: 60,
        height: 60,
        paddingTop: 6,
        paddingLeft: 22,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        alignSelf: 'center',
        color: '#ed7b66'
    },
    infoBox: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    avatar: {
        width: 60,
        height: 60,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 30
    },
    descBox: {
        flex: 1
    },
    nickname: {
        fontSize: 18
    },
    title: {
        marginTop: 8,
        fontSize: 16,
        color: '#666'
    },
    replyBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    replyAvatar: {
        width: 40,
        height: 40,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20
    },
    replyNickname: {
        color: '#666'
    },
    replyContent: {
        marginTop: 4,
        color: '#666'
    },
    reply: {
        flex: 1
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    },
    listHeader: {
        width: width,
        marginTop: 10
    },
    commentBox: {
        marginTop: 10,
        marginBottom: 20,
        padding: 8,
        width: width
    },
    content: {
        paddingLeft: 2,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 14,
        height: 80
    },
    commentArea: {
        width: width,
        // marginTop:10,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    }
});