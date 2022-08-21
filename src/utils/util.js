import { Resource } from '@/server/resource-api';

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};
/**
 * @description Toast二次封装
 * @param icon:string success / fail / none(默认)
 * @param title :string 文字内容。
 * @param duration :Number 显示时长，单位为 ms，默认值为 3000。
 * @param mask :Boolean蒙层 false不显示 true显示 。
 */

const ToastInfo = (title, icon = 'none', duration = 2000, mask = true) => {
  setTimeout(() => {
    uni.showToast({
      title,
      icon,
      duration,
      mask,
      success() {
        setTimeout(() => {
          uni.hideToast()
        }, duration);
      }
    });
  }, 0)
};
/**
 *  防抖函数
 * @param {*} fn  回调函数
 * @param {*} delay 延迟时间
 */

const debounce = (func, wait, immediate) => {
  // 多个参数及传递和不传递的默认值处理
  if (typeof func !== 'function') {
    throw new TypeError('func must be a function');
  }

  if (typeof wait === 'undefined') {
    wait = 500;
  }

  if (typeof wait === 'boolean') {
    immediate = wait;
    wait = 500;
  }

  if (typeof immediate !== 'boolean') {
    immediate = false;
  } // 设定定时器返回值标识

  let timer = null;
  return function proxy(...params) {
    let that = this;
    let now = immediate && !timer; // timer是null，说明是第一次点击
    clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;

      if (!immediate) {
        func.call(that, ...params);
      } else {
        null;
      } // immediate不传或者false，才执行，这样就实现了只有第一次点击才会执行，之后的疯狂点击都不会执行了
    }, wait); // 第一次触发是否立即执行

    if (now) {
      func.call(that, ...params);
    } else {
      null;
    }
  };
}; // 版本号比较


function openCustomerService() {
  Resource.open.get({ type: 'home/kefu' }, { loadingDelay: true })
    .then(res => {
      if (res.code == 1 && res.data) {
        uni.navigateTo({ url: `/packPages/webview/index?url=${encodeURIComponent(res.data)}&type=img` });
      } else uni.makePhoneCall({
        phoneNumber: '0889066660'
      });
    })
}

// 深拷贝

const _clone = (obj) => {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) {
    return obj;
  } // Handle Date

  if (obj instanceof Date) {
    let copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  } // Handle Array

  if (obj instanceof Array) {
    let copy = [];

    for (let i = 0, len = obj.length; i < len; ++i) {
      copy[i] = _clone(obj[i]);
    }

    return copy;
  } // Handle Object

  if (obj instanceof Object) {
    let copy = {};

    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = _clone(obj[attr]);
      }
    }

    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

export {
  formatTime,
  ToastInfo,
  debounce,
  openCustomerService,
  _clone,
};