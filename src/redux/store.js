/**
 * redux最核心的管理对象store
 */
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import reducer from './reducer';

//定义一个store
const store = createStore(reducer, applyMiddleware(thunk));
// 向外暴露store
export default store;