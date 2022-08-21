<script>
import { CheckVersion, localStorage, login } from "./utils/extend";
import { SK } from "./utils/constant";
export default {
  onLaunch: function () {
    let self = this;

    try {
      CheckVersion();
      this.globalData.isRestart = true;
      // 获取系统消息
      uni.getSystemInfo({
        success(res) {
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
    this.globalData.isNeedUpdetaCarList = true;
    login({}, this.$isResolve);
  },
  onHide: function () {
    console.log("App Hide");
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
