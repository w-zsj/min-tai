import {
	_clone,
	debounce
} from './util';
import {
	Resource
} from '@/server/resource-api';
import {
	SK
} from './constant.js'
import {
	IS_TEST
} from './constant.js';
/**
 * 判断是否是空对象
 */

const isEmpty = (obj) => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;
/**
 * @param {String} path  跳转地址 eg:login/login
 * @param {String} routeType  跳转类型
 */

const $to = debounce((path, routeType = 'navigate', isneedrec = false) => {
	if (routeType == 'back' || !path) {
		uni.navigateBack({
			delta: 1
		});
		return;
	}
	let routes = getCurrentPages(),
		data = {},
		tabBars = [
			'/pages/home/index',
			'/pages/category/index',
			'/pages/mall/index',
			'/pages/mine/index'
		],
		isTab = false,
		query = (path && path.split('?')) || []
	if (!/^\/?packPages|pages\/?/g.test(path) && path) {
		let firstOne = path.substr(0, 1) == '/';
		path = `/pages${firstOne ? `` : `/`}${path}`;

	}
	let key = path.replace(/^\//g, ''),
		pagePath = key + '.html'
	// 解析query参数
	if (query[1]) {
		query[1].split('&').map((q) => {
			data[q.split('=')[0]] = q.split('=')[1];
		});
	}
	isTab = tabBars.findIndex((t) => t.pagePath === pagePath || t.pagePath === key) > -1;
	let hasIdx = -1;
	if (routes && routes.length) {
		hasIdx = routes.findIndex(r => r?.route && r.route == key) || 0
	}
	if (isTab) routeType = 'switchTab';
	else {
		switch (routeType) {
			case 'navigate':
			default:
				if (hasIdx > -1 && isEmpty(data)) {
					// 处理 页面返回时 路径拼接参数 问题
					uni.navigateBack({
						delta: routes.length - 1 - hasIdx
					});
					return;
				} else {
					if (routes.length > 7) routeType = 'redirectTo';
					else routeType = 'navigateTo';
				}
				break;
			case 'redirect':
			case 'redirectTo':
				routeType = 'redirectTo';
				break;
			case 'reLaunch':
				routeType = 'reLaunch';
				break;
			case 'switchTab':
				routeType = 'switchTab';
				break;
		}
	}
	if (routeType) uni[routeType]({
		url: path
	})
}, 200);
/*
 * 本地存储
 * set(key,val) 1、设置给定键名存储 2、可以为对象 设置多个
 * get(key) 获取对应键名存储
 * del(key) 删除对应键名存储
 * clear() 清空本地存储
 */

class Storage {
	static _pre = 'taihaile_';

	set(key, val = '', isneedpre = true) {
		if (key instanceof Object) {
			if (!isEmpty(key)) {
				for (let k in key) {
					// #ifndef H5
					uni.setStorageSync(isneedpre ? Storage._pre + k : key, key[k]);
					// #endif
					// #ifdef H5
					window.localStorage.setItem(isneedpre ? Storage._pre + k : key, key[k])
					// #endif
				}
			}
		} else {
			if (key) {
				if (typeof val !== 'undefined' && val !== null) {
					// #ifndef H5
					uni.setStorageSync(isneedpre ? Storage._pre + key : key, val);
					// #endif
					// #ifdef H5
					window.localStorage.setItem(isneedpre ? Storage._pre + key : key, val)
					// #endif
				}
			}
		}
	}

	get(key) {
		let val = null;
		if (key) {
			// #ifndef H5
			val = uni.getStorageSync(Storage._pre + key) || uni.getStorageSync(key);
			// #endif
			// #ifdef H5
			val = window.localStorage.getItem(Storage._pre + key)
			// #endif
		}
		return val;
	}
	del(key, sync = false, isneedpre = true) {
		if (key) {
			if (isneedpre) {
				key = Storage._pre + key;
			} else {
				key = key;
			}
			// #ifndef H5
			if (sync) {

				uni.removeStorageSync(key);

			} else {
				uni.removeStorage({
					key
				});
			}
			// #endif
			// #ifdef H5
			window.localStorage.removeItem(key)
			// #endif
		}
	}
	clear() {
		// #ifndef H5
		uni.clearStorage();
		// #endif
		// #ifdef H5
		window.localStorage.clear()
		// #endif
	}
}

const localStorage = new Storage();
/** 检查小程序版本 */

const CheckVersion = () => {
	if (!IS_TEST) {
		const updMgr = !!uni.getUpdateManager ? uni.getUpdateManager() : null;
		if (updMgr) {
			updMgr.onCheckForUpdate((res) => {
				if (res.hasUpdate) {
					updMgr.onUpdateReady(() => {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updMgr.applyUpdate();
					});
				}
			});
		} else {
			console.warn('no UpdateManager');
		}
	} else console.log('测试环境不提示更新')

}; // 判断环境

const login = (params = {}, $isResolve = null) => {
	return new Promise((resolve, reject) => {
		let code = ''
		uni.login().then((res) => {
			console.log('获取code', res)
			code = res[1].code
			Resource.open
				.post({
					type: 'login'
				}, {
					code,
					...params
				})
				.then((res) => {
					if ($isResolve) $isResolve()
					if (res && res.data && res.data['token']) {
						let { token, nickName, image, phone, coin } = res.data;
						localStorage.set({
							[SK.TOKEN]: token,
							[SK.HAS_MOBILE]: phone ? 1 : 0,
							[SK.NICK_NAME]: nickName,
							[SK.USER_IMAGE]: image,
							[SK.USER_PHONE]: phone,
							[SK.COIN]: coin
						});
						if ($isResolve) $isResolve()
						resolve(res.data)
					}
				})
				.catch((e) => console.error(e));
			// #ifndef H5
		});
		// #endif
	});
}
export {
	CheckVersion,
	isEmpty,
	localStorage,
	$to,
	login
};