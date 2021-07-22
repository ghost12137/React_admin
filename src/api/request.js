/**
 * 发布axios的请求
 */
import axios from 'axios';
import {BASE_URL} from '../utils/constants';

export default function request(config) {
  //创建axios实例
  const instance = axios.create({
    baseURL: BASE_URL,  //http://159.75.128.32:5000/    http://120.55.193.14:5000/
    timeout: 5000,
    withCredentials: true,
  });

  //拦截器
  instance.interceptors.response.use(response => {
    return response.data;
  });
  return instance(config);
}