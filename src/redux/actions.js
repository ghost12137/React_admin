/**
 * 包含n个action creator函数的模块
 * 同步action: 对象{type: 'xxx', data: 数据值}
 * 异步action：函数 dipatch => {}
 */
import { 
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from "./action-types";
import { HandleLogin } from "../api/login";
import storageUtils from "@/utils/storageUtils";
import { message } from "antd";

/**
 * 设置头部标题的同步action
 */
export const setHeadTitle = headTitle => ({ type: SET_HEAD_TITLE, data: headTitle});
/**
 * 接收用户的同步action
 */
export const receiveUser = user => ({ type: RECEIVE_USER, data: user});
/**
 * 接收错误信息的同步action
 * @param {*} errorMsg 
 * @returns 
 */
export const showErrorMsg = errorMsg => ({ type: SHOW_ERROR_MSG, data: errorMsg });
/**
 * 退出登录的同步action
 */
export const loginOut = () => {
  storageUtils.removeUser();

  return { type: RESET_USER }
}

/**
 * 登录的异步action
 */
export const login = (username, password) => {
  return async dispatch => {
    //执行异步ajax请求
    const result = await HandleLogin(username, password);
    if (result.status === 0) {
      // 如果成功，分发成功的同步action
      const user = result.data;
      //保存到local
      storageUtils.saveUser(user);

      dispatch(receiveUser(user));
    } else {
      // 如果失败，分发失败的同步action
      const msg = result.msg;
      message.error('登录失败');
      dispatch(showErrorMsg(mag))
    }
  };
};