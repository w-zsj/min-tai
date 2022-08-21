import Vue from 'vue'
import App from './App'
import { $to } from './utils/extend'
import { localStorage } from "@/utils/extend";
import { SK } from "@/utils/constant";
import Mixin from './utils/mixins';
Vue.config.productionTip = false
Vue.prototype.$onLaunched = new Promise(resolve => {
  Vue.prototype.$isResolve = resolve
})
Vue.mixin(Mixin);
Vue.prototype.$to = $to
Vue.prototype.checkHasMobile = function (cb = () => { }) {
  if (localStorage.get(SK.HAS_MOBILE) == 1) cb(true)
  else cb(false)
}
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
