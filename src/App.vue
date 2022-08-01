<script>
import { CheckVersion, localStorage, login } from "./utils/extend";
import { SK } from "./utils/constant";
const app = getApp();
export default {
  onLaunch: function () {
    let self = this;
    try {
      CheckVersion();
      login({}, this.$isResolve);
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
        fail(res) {},
      });
    } catch (e) {}
  },
  onShow: function () {
    if (this.globalData.isRestart) {
      this.globalData.isRestart = false;
    } else {
      this.globalData.restart = 0;
    }
  },
  onHide: function () {
    console.log("App Hide");
  },
  // 全局变量使用 https://www.cnblogs.com/yuanyiming/p/11575935.html
  globalData: {
    restart: 1, //全局标识 0:热启动 1:冷启动
    login: login,
    hasmobile: () => Number(localStorage.get(SK.HAS_MOBILE) || "0"),
  },
};
</script>

<style>
@import "./app.css";
/* 添加字体图标库 */
@import url("static/iconfont/iconfont.css");
</style>
