import {
  showHUDLoading,
  hidenHUDLoading,
  showHUDMessage
} from "../component/hud-tips";

module.exports = {
  showTips: msg => {
    showHUDMessage(msg, 1500);
  },

  /**
   * @param msg 弹出消息内容
   * @param timeout 弹出消息展示时长(毫秒数)
   */
  showTipsInSeconds: (msg, timeout) => {
    showHUDMessage(msg, timeout || 1500);
  },

  showLoading: msg => {
    showHUDLoading(msg, {});
  },

  hideLoading: () => hidenHUDLoading()
};
