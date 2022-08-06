<script>
import { CheckVersion, localStorage, login } from "./utils/extend";
import { SK } from "./utils/constant";
const app = getApp();
export default {
  onLaunch: function () {
    let self = this;

    try {
      CheckVersion();
      this.globalData.isRestart = true;
      // 获取系统消息
      uni.getSystemInfo({
        success(res) {
          const { statusBarHeight, windowWidth } = res; // 得到右上角菜单的位置尺寸
          // #ifdef MP-WEIXIN ||MP-ALIPAY
          const menuButtonObject = uni.getMenuButtonBoundingClientRect();
          const { top, height, left } = menuButtonObject; // 计算导航栏的高度
          // 此高度基于右上角菜单在导航栏位置垂直居中计算得到
          const navBarHeight = height + (top - statusBarHeight) * 2;
          self.globalData.statusBarHeight = statusBarHeight;
          self.globalData.navBarHeight = navBarHeight;
          self.globalData.menuButtonLeft = windowWidth - left; //小程序胶囊左边界坐标(相对于右上角)
          // #endif

          self.globalData["deviceInfo"] = res.deviceId;
          self.globalData["sys"] = res;
          self.globalData["Inipx"] = !!(
            res.platform == "ios" || res.platform == "devtools"
          );
        },
        fail(res) { },
      });
    } catch (e) { }
  },
  onShow: function () {
    if (this.globalData.isRestart) {
      this.globalData.isRestart = false;
    } else {
      this.globalData.restart = 0;
    }
    login({}, this.$isResolve);
  },
  onHide: function () {
    console.log("App Hide");
  },
  // 设置订阅消息 只能真机调试
  // TEMPLATE_ID 接口返回
  requestMessage(TEMPLATE_ID, call = () => { }) {
    // _wx_begin_
    let _ = this,
      { hasmobile } = _.globalData,
      acceptIds = [],
      rejectIds = [];
    if (hasmobile()) {
      wx.requestSubscribeMessage({
        tmplIds: TEMPLATE_ID,
        success(res) {
          console.log("成功唤起订阅消息弹框----", res);
          // if (res.errMsg === "requestSubscribeMessage:ok") {
          //   acceptIds = TEMPLATE_ID.filter(i => res[i] === "accept") || []  // 暂时可不用
          //   rejectIds = TEMPLATE_ID.filter(i => res[i] === "reject") || []
          // }
          call();
          // 拒绝授权的id 数据埋点
          // if (rejectIds.length)
          //   _.logReport({ e: 'TEMPLATE_ID', p: { rejectids: rejectIds } }, 1)
        },
        fail(err) {
          console.error("唤起订阅消息弹框失败----", err);
          call("error:" + err);
        },
      });
    } else {
      console.log("未登录不能设置订阅消息");
      // call('not_login:未登录不能设置订阅消息')
    }
    return;
    // _wx_end_
    call();
  },
  // 全局变量使用 https://www.cnblogs.com/yuanyiming/p/11575935.html
  globalData: {
    restart: 1, //全局标识 0:热启动 1:冷启动
    login: login,
    hasmobile: () => Number(localStorage.get(SK.HAS_MOBILE) || "0"),
    isNeedUpdetaCarList: true,
  },
};
</script>

<style>
@import "./app.css";
/* 添加字体图标库 */
@import url("static/iconfont/iconfont.css");
</style>
