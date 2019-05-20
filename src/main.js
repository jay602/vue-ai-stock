import Vue from 'vue'
import App from './App.vue'
import router from '@/router'

import lodash from 'lodash-es'

import fastclick from 'fastclick'

import './common/js/rem'
import './common/stylus/index.styl'

import './components/register'
import '@/router/permission'
import api from '@/api'

// 引入 Style 加载基础样式
import {
  // eslint-disable-next-line
  Style,
  Slide,
  Loading,
  Button,
  Dialog,
  Toast,
  Scroll,
  DatePicker
} from 'cube-ui'

Vue.use(Scroll)
Vue.use(Loading)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Toast)
Vue.use(DatePicker)
Vue.use(Slide)

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$lodash = lodash

fastclick.attach(document.body)

// 测试环境开启 vConsole
if (process.env.VUE_APP_CONSOLE === 'show') {
  const VConsole = require('vconsole')
  const vConsole = new VConsole()
  console.log(vConsole.version)
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
