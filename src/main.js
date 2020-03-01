// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//导入全局样式表
import '@/assets/css/global.css'
//导入字体图标
import '@/assets/fonts/iconfont.css'


Vue.use(ElementUI)

//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//请求拦截器
axios.interceptors.request.use(config=>{
  // console.log(config);
  //最后必须 return config
  //需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http=axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
