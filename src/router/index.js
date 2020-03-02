import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/User/Users'
import Rights from '@/components/Power/Rights'
import Roles from '@/components/Power/Roles'

Vue.use(Router)

const router= new Router({
  routes: [
    {path:'/',redirect:'/login'},
    {path:'/login',name:'Login',component:Login},
    {path:'/home',name:'Home',component:Home,redirect:'/welcome',children:[
      {
        path:'/welcome',
        name:'Welcome',
        component:Welcome
      },
      {
        path:'/users',
        name:'Users',
        component:Users
      },
      {
        path:'/rights',
        name:'Rights',
        component:Rights
      },
      {
        path:'/roles',
        name:'Roles',
        component:Roles
      }
    ]},

  ]
})
//挂载路由守卫
//to 来的链接
//from 去到的链接
//next() 放行 next('/login') 强制跳转到登录界面
router.beforeEach((to,from,next)=>{
  //next() 放行 next('/login) 强制跳转
  if(to.path === '/login') return next();
  //从sessionStorage中获取值token值
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})
export default router
