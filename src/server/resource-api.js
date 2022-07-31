/*
 * @Author: zhangsanjun 
 * @Date: 2022-07-25 11:01:10 
 * @Last Modified by: zhangsanjun
 * @Last Modified time: 2022-07-31 22:27:09
 */

import {
  HttpResource
} from './http-request';
import {
  SERVER
} from '../utils/constant.js'; 
const API_HOST = SERVER
const SERVICE_NAME = ``;
console.log('API_HOST',API_HOST)
export const Resource = {
  // open
  open: HttpResource(`${API_HOST}/open/:type`),
  //上传图片
  uploadImage: HttpResource(`${API_HOST}/file/oss/upload`),
  // 分类
  classifyList: HttpResource(`${API_HOST}/productClassify/:type`),
  // 首页
  home: HttpResource(`${API_HOST}/home/:type`),

};