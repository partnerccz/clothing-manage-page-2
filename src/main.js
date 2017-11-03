import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import axiosIntence from './common/axiosIntence'
import './assets/common.css'
import {ajaxPrefix} from './common/const.js'

Vue.use(ElementUI) // 加载element组件

Vue.prototype.$http = axiosIntence // 将http设置到vue组件中

Vue.prototype._uploadFilePath = ajaxPrefix + '/manage/common/upload'// 上传地址
// Vue.prototype._ajaxPrefix = '/api/'// 测试使用，用于代理匹配，上线打包时需更改为/

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

// 这个注释不能删否则 eslint 会检测下面语法错误
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
