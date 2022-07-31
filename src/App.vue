<script>
import { CheckVersion, localStorage, login } from "./utils/extend";
import { SK } from "./utils/constant";
const app = getApp();
export default {
  onLaunch: function () {
    try {
      CheckVersion();
      login({}, this.$isResolve);
      this.globalData.isRestart = true;
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
