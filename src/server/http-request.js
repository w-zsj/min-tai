/*
 * @Author: zhangsanjun 
 * @Date: 2022-07-25 17:27:23 
 * @Last Modified by: zhangsanjun
 * @Last Modified time: 2022-07-25 17:33:09
 */

import { ToastInfo } from '@/utils/util';
import { localStorage } from '@/utils/extend';
import { reqConfig } from '@/utils/constant.js'
import { sign } from '@/utils/sign'
const { SK } = require('@/utils/constant');
let timer = null;

const fetchMethod = (_url, _config) => {

    if (_config.loadingDelay) {
        timer = setTimeout(
            () => {
                uni.showLoading({
                    title: '加载中...',
                    mask: true
                });
            },
            _config.loadingDelay
        );
    }

    const requestHeader = {
        'content-type': 'application/json',
        version: reqConfig.version,
        os: reqConfig.os,
        deviceInfo: getApp().globalData['deviceInfo'],
        // "Authorization": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2MzM2NzA5NjksImp0aSI6IjE0MzU0MzYxNTYzNDI3Mzg5NDYiLCJsYXN0bG9naW50aW1lIjoxNjMxMDc4OTY5fQ.jD5Cpj8r680wO-jL5CIrfy5yRpPGitmcKhDcuzEmu3cbFMFxxinWM7xteet88tBcos1Q-jsDj0ihBHBkL_B5ew',
        // #ifdef H5
        Authorization: localStorage.get(SK.TOKEN) || '',
        // #endif
        // #ifdef MP-WEIXIN || MP-ALIPAY
        Authorization: _url.includes('/open/login') ? '' : localStorage.get(SK.TOKEN) || '',
        // #endif

    };
    return uni.getNetworkType().then((netRes) => {
        if (netRes.networkType == 'none') {
            // uni.hideLoading();
            return Promise.reject({
                code: -1,
                msg: 'NO_NETWORK'
            });
        } else {
            return new Promise(function (resolve, reject) {
                uni.request({
                    url: _url,
                    data: _config.data,
                    header: requestHeader,
                    method: _config.method,
                    success(res) {
                        // console.log(`${_url}`, res)
                        const { code, msg } = res.data;
                        /**
                         * code状态码 :
                         * 1成功 -1异常
                         * 100009请求拒绝没有操作权限
                         * 100003参数校验失败
                         * 100000 缺少参数
                         *
                         * **/
                        // 请求成功

                        if (code == 1) resolve(res.data);
                        else {
                            reject({ code, msg });
                            if (code === 100009) {
                                localStorage.del(SK.TOKEN);
                                ToastInfo('token已过期::请重新登录');
                            }
                        }

                    },
                    fail(error) {
                        reject(error);
                    },
                    complete() {
                        if (_config.loadingDelay) {
                            clearTimeout(timer);
                            uni.hideLoading();
                        }
                    }
                });
            });
        }
    });
};

const matchUrlSearchParams = (url, urlSearchParams) => {
    if (!urlSearchParams) {
        return url.replace(/\/:[^?]+/g, '');
    }
    let u = '';
    let _url = Object.keys(urlSearchParams).reduce((pre, next) => {
        if (pre.indexOf(':' + next) !== -1) {
            return pre.replace(':' + next, urlSearchParams[next]);
        } else {
            if (urlSearchParams[next] && urlSearchParams[next].constructor === Array) {
                urlSearchParams[next].forEach((value) => {
                    u += next + '=' + value + '&';
                });
            } else {
                u += next + '=' + urlSearchParams[next] + '&';
            }
            return pre;
        }
    }, url);

    _url = _url.replace(/\/:[^?]+/g, '');
    return _url + (u.toString() === '' ? '' : '?' + u.substring(0, u.length - 1));
};

class HttpRequset {
    url = '';
    constructor (_url) {
        this.url = _url;
    }
    get = (
        urlSearchParams,
        config = {
            dataType: 'json'
        }) => {
        return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), config);
    };
    post = (urlSearchParams, bodyParams = {}, config) => {
        var timestamp = Date.now() + '',
            data = bodyParams
        // 数组不验签
        if (Object.prototype.toString.call(data) === '[object Object]') {
            data = {
                ...bodyParams,
                timestamp,
                sign: sign({ ...bodyParams, timestamp }, reqConfig.key)
            }
        }
        return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            ...config
        })
            .then((res) => {
                if (res.code == 100003) sign(data, reqConfig.key, 1)
                return res
            })
            .catch((err) => {
                let message = err.msg || err.message || err.errMsg;
                if (err.errMsg == 'request:fail timeout') message = '网络不给力，请检查网络';
                err.message = message;
                return Promise.reject(err);
            });
    };
}

const HttpResource = (url) => {
    return new HttpRequset(url);
};

export { HttpResource };
