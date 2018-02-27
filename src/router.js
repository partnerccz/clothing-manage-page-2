import Vue from 'vue'
import Router from 'vue-router'
import {homeUrl} from './common/const.js'
// import Hello from '@/components/Hello'

Vue.use(Router)

const Main = resolve => require(['./components/sys/Home.vue'], resolve)
const Product = resolve => require(['./components/product/Index.vue'], resolve)
const Order = resolve => require(['./components/order/Index.vue'], resolve)
const Banner = resolve => require(['./components/banner/Index.vue'], resolve)
const TypeGroup = resolve => require(['./components/typeGroup/Index.vue'], resolve)
const Type = resolve => require(['./components/type/Index.vue'], resolve)
const Login = resolve => require(['./components/sys/login.vue'], resolve)
const Role = resolve => require(['./components/user/roles/Index.vue'], resolve)
const User = resolve => require(['./components/user/users/Index.vue'], resolve)
const Test = resolve => require(['./components/test/Index.vue'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: homeUrl,
      children: [
        {
          path: '/product',
          name: 'Product',
          component: Product
        }, {
          path: '/manage/banner',
          name: 'Banner',
          component: Banner
        }, {
          path: '/manage/typeGroup',
          name: 'TypeGroup',
          component: TypeGroup
        }, {
          path: '/manage/type',
          name: 'Type',
          component: Type
        }, {
          path: '/manage/role',
          name: 'Role',
          component: Role
        }, {
          path: '/manage/user',
          name: 'User',
          component: User
        }, {
          path: '/manage/order',
          name: 'Order',
          component: Order
        }, {
          path: '/manage/test',
          name: 'Test',
          component: Test
        }
      ]
    }
  ]
})
