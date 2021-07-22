/**
 * 用于向浏览器缓存存取数据
 */
import store from "store2";

const USER_KEY = 'user'

const storageUtils = {
  //保存user
  saveUser(user) {
    // sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    //store.session(USER_KEY, user);
    store.session.set(USER_KEY, user);
  },
  //读取user
  getUser() {
    //return JSON.parse(sessionStorage.getItem(USER_KEY) || '{}');
    return store.session.get(USER_KEY);
  },
  //删除user
  removeUser() {
    //sessionStorage.removeItem(USER_KEY);
    store.session.remove(USER_KEY);
  },
};

export default storageUtils;