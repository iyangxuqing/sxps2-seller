import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/base/directive/v-money'
import '@/common/stylus/index.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})