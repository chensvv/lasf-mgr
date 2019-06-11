/* eslint-disable no-undef */
/* eslint-disable import/first */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Itf from './utils/interface'

Vue.config.productionTip = false

// 使用element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 使用axios
import axios from 'axios'
Vue.prototype.$http = axios

Vue.prototype.$util = Itf.INTERCHILD

import '../mock/mock.js'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
// router.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     console.log(to.meta.title)
//     document.title = to.meta.title
//   }
// })
