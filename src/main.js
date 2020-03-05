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

import TreeTable from 'vue-table-with-tree-grid'
//导入编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入样式表
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//全局引用

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

Vue.component('tree-table', TreeTable)
//全局引用父文本编辑框
Vue.use(VueQuillEditor)
//注册全局过滤器转换时间
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal);
  const y=dt.getFullYear();
  const m=(dt.getMonth()+1+'').padStart(2,'0');
  const d=(dt.getDate()+'').padStart(2,'0');
  const hh=(dt.getHours()+'').padStart(2,'0');
  const mm=(dt.getMinutes()+'').padStart(2,'0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');;
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

})
//注册全局可用组件

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
