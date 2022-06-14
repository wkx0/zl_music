import Vue from 'vue'
import App from './App.vue'
//导入路由
import router from './router'
//导入vuex
import store from './store'
//导入element
import '@/plugins/element.js'
//导入全局过滤器
import '@/plugins/filter.js'
//导入全局样式
import '@/assets/css/global.css'

import timeToString from '@/plugins/timeToString/'
//导入阿里icon
import '@/assets/style/icon/iconfont.css'
//关闭生产环境提示
Vue.config.productionTip = false
Vue.use(timeToString)
new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
