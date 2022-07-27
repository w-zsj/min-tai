import md5 from "./md5.js"
import { reqConfig } from '../constant.js'
import { Base64 } from 'js-base64'
// 验签规则 地址:
// https://thoughts.aliyun.com/workspaces/607d446fd61dc1001a37cae8/docs/609b3c0358c5ce0001e8144a
// let key=  Base64.btoa(Base64.encode('jdsgfjdgjldfgfdj'))
const SpChar = ['-', '_', '!', '*', '(', ')', '.', '~', "'"] // 特殊字符 单独处理
function sign(jsonobj, isLog = 0) {
	var signstr = objtostr(sort_ASCII(jsonobj))
	for (let i in SpChar) {
		if (signstr.includes(SpChar[i]))
			signstr = signstr.replace(new RegExp("\\" + SpChar[i], 'gim'), escape(SpChar[i]))
	}
	isLog && console.log("参数验签失败:::", signstr)

	signstr = md5(signstr + Base64.decode(Base64.atob(reqConfig.key)));
	signstr = signstr.toLowerCase()

	return signstr
}
// 转换对象
function objtostr(args) {
	var keys = Object.keys(args)
	keys = keys.sort() //参数名ASCII码从小到大排序
	var newArgs = {}
	keys.forEach(function (key) {
		if (args[key] && args[key] != "" && args[key] != 'undefined' && args[key] != 'null' || args[key] ==
			0) { //如果参数的值为空不参与签名；
			newArgs[key] = args[key] //参数名区分大小写；
		}
	})
	var string = ''
	for (var k in newArgs) {
		let val = newArgs[k]

		if (val && val != "" && val != 'undefined' && val != 'null' || val == '0') {
			val = encodeURIComponent(deepArray(val))
			string += '&' + encodeURIComponent(k) + '=' + val
		}
	}
	string = string.substr(1)
	return string
}


//  递归对象
function deepArray(obj) {
	if (null == obj || 'object' != typeof obj) return obj;
	if (obj instanceof Array) {
		let copy = [];
		for (let i = 0, len = obj.length; i < len; ++i) {
			copy[i] = deepArray(obj[i]);
		}
		return copy.join(',');
	} else if (obj instanceof Object) {
		let copy = {};
		obj = sort_ASCII(obj)
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr))
				copy[attr] = deepArray(obj[attr])
		}
		return JSON.stringify(copy);
	}
}
// 对象排序
function sort_ASCII(obj) {
	var arr = new Array();
	var num = 0;
	for (var i in obj) {
		arr[num] = i;
		num++;
	}
	var sortArr = arr.sort();
	var sortObj = {};
	for (var i in sortArr) {
		sortObj[sortArr[i]] = obj[sortArr[i]];
	}
	return sortObj;
}

// 随机字符串
function nonce(e) {
	var e = e || 32,
		t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789",
		a = t.length,
		n = "";
	for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n
}
export {
	sign,
	nonce
}
