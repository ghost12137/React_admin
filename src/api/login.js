/**
 * 登录有关的api
 */
import request from './request';

//登录
export function HandleLogin(username, password) {
  return request({
    method: 'POST',
    url: '/login',
    data: {
      username,
      password
    },
  });
}