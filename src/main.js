import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
