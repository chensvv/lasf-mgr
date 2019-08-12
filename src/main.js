/* eslint-disable no-undef */
/* eslint-disable import/first */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'default-passive-events'
import axios from 'axios'
Vue.config.productionTip = false

// 使用element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 使用axios
import http from './config/http'
Vue.prototype.$http = http

import Itf from './utils/interface'
Vue.prototype.$http = axios
Vue.prototype.$util = Itf.INTERCHILD

import '../mock/mock.js'
import '../static/css/base.css'

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
