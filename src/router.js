import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)

const Main = resolve => require(['./components/sys/Home.vue'], resolve)
const Product = resolve => require(['./components/product/Index.vue'], resolve)
const Banner = resolve => require(['./components/banner/Index.vue'], resolve)
const TypeGroup = resolve => require(['./components/typeGroup/Index.vue'], resolve)
const Type = resolve => require(['./components/type/Index.vue'], resolve)
const Login = resolve => require(['./components/sys/login.vue'], resolve)

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
      redirect: '/product',
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
        }
      ]
    }
  ]
})
