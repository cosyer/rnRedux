import { DETAIL_PARAMS_CHANGE } from "../constants/actionsTypes";
import { AsyncStorage } from "react-native";
import Toast from "../component/toast";
import Request from "../utils/request";
import Config from "../utils/config";
import Mock from "mockjs";

const detailParamsChange = obj => ({
  type: DETAIL_PARAMS_CHANGE,
  payload: obj
});

// 查询详情
function queryDetail(phone) {
  return dispatch => {
    // dispatch(loginCodeSendChange())
    return Request.post(
      Config.api.base + Config.api.signup,
      { phoneNumber: phone },
      data => {
        console.log(Mock.mock(data));
      }
    );
  };
}

// 查询评论列表
function queryCommentList(user, data, pageNum) {
  return dispatch => {
    return Request.get(
      Config.api.base + Config.api.comments,
      {
        accessToken: user.accessToken,
        creation: data._id,
        page: pageNum
      },
      res => {
        console.log(res);
      }
    );
  };
}

// 新增评论
function addComment(user, data, content) {
  return dispatch => {
    return Request.get(
      Config.api.base + Config.api.comments,
      {
        accessToken: user.accessToken,
        comment: {
          creation: data._id,
          content: content
        }
      },
      res => {
        console.log(res);
      }
    );
  };
}

export default {
  detailParamsChange,
  queryCommentList,
  addComment,
  queryDetail
};
