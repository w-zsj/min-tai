import { reqConfig } from '@/utils/constant.js'
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

function compareVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }

  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else {
      if (num1 < num2) {
        return -1;
      }
    }
  }

  return 0;
}

function openCustomerService() {
  const version = uni.getSystemInfoSync().SDKVersion;

  if (compareVersion(version, '2.19.0') >= 0) {
    uni.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc176badfe65e7f44f'
      },
      corpId: 'wwa820759ee3251132',

      success(res) { }
    });
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    uni.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    });
  }
}
/**
 *
 * @param {*} orderno 订单编号
 * @param paySource 支付来源 1:订单支付 2：vip会员卡支付
 * @param {*} onSuccess  // 支付成功回调
 * @param {*} onError  // 支付失败回调
 */

function openMiniProgramPay(params, onSuccess, onError) {
  let { orderno = '', paySource = 1, redirect_url = '' } = params || {},
    reqParams = {
      orderno,
      paySource,
      payType: reqConfig.payType,
    }
  uni.showToast({
    title: "支付中...",
    icon: "loading"
  })
  Resource.miniProgramPay
    .post({ type: `xcxPrepay` }, reqParams)
    .then((res) => {
    })
} // 深拷贝

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
/**
 * 获取节点信息
 * @param node 节点
 * @param all 是否选择全部
 */

function selectElement(node, all = false, _) {
  return new Promise((resolve, reject) => {
    uni.createSelectorQuery()
    [all ? 'selectAll' : 'select'](node)
      in (_)
        .boundingClientRect(function (rect) {
          if (rect) {
            resolve(rect);
          } else {
            reject('获取失败');
          }
        })
        .exec();
  });
}

function createCountDown() {
  let t = null;
  let queue = [];
  return {
    on(cb) {
      if (!t) {
        t = setInterval(() => {
          // console.log('倒计时----000000')
          queue.forEach((q) => q());
        }, 1000);
      }
      queue.push(cb);
    },

    off(cb) {
      // console.log('ttttt00000');
      const i = queue.indexOf(cb);
      queue.splice(i, 1);
      if (queue.length == 0) {
        // console.log('00000000')
        clearInterval(t);
        t = null;
      }
    },

    clear() {
      queue = [];
      clearInterval(t);
      t = null;
    }
  };
} // 倒计时

let countDownTimer = null;

function countDown(options) {
  if (!countDownTimer) {
    countDownTimer = createCountDown();
  }

  const app = getApp();
  let endtime = options.end_time; // 结束时间戳
  if (endtime <= 0) {
    return;
  }
  const down = () => {
    if (endtime < -1000) {
      console.log(endtime, 'down========util')
      setTimeout(() => {
        if (options.callback) {
          options.callback();
        }
      }, 0);
      return;
    }

    let day_ms = 24 * 60 * 60 * 1000;
    let hour_ms = 60 * 60 * 1000;
    let min_ms = 60 * 1000;
    let ss_ms = 1 * 1000;
    let day = Math.floor(endtime / day_ms); //天数

    let hour = Math.floor((endtime % day_ms) / hour_ms); //小时数

    let minutes = Math.floor((endtime % hour_ms) / min_ms); // 分钟数

    let seconds = Math.floor((endtime % min_ms) / ss_ms); // 秒数

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    // endtime -= 1000;

    const sheng = {
      day,
      hour,
      minutes,
      seconds
    };
    options.success({
      sheng: sheng,
      index: options.index,
      endtime: endtime
    });
    // index:如果是列表，则为列表下标
    endtime -= 1000;
  };

  down();
  countDownTimer.on(down);
  app.globalData.countDownTimer = countDownTimer; // 存定时器

  return () => {
    countDownTimer.off(down);
  };
};
// 轮播图点击
function bannerTap(e) {
  console.log(e);
  const {
    url,
    type
  } = e.currentTarget.dataset; //type: 1商品详情 2h5  3图片 4:开通vip页面
  const urlTypeArr = [1, 4]; //小程序内页面跳转
  const tabBarPages = ['/pages/mall/mall', '/pages/category/index', '/pages/mine/mine', '/pages/vip/members-rights/index']; //tabar页面
  if (urlTypeArr.includes(type)) {
    if (tabBarPages.includes(url)) {
      uni.switchTab({
        url: url
      });
    } else {
      uni.navigateTo({
        url: url
      });
    }
  } else {
    const nType = type == 2 ? 1 : 2;
    uni.navigateTo({
      url: `/pages/wine-test/notice/notice?type=${nType}&url=${url}`
    });
    // #ifdef H5
    window.location.href = url;
    // #endif
  }
};

module.exports = {
  formatTime,
  ToastInfo,
  debounce,
  openCustomerService,
  openMiniProgramPay,
  _clone,
  selectElement,
  countDown,
  bannerTap
};