import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(Router)

const Main = resolve => require(['./components/sys/Index.vue'], resolve)
const Hello = resolve => require(['./components/Hello.vue'], resolve)
const Demo = resolve => require(['./components/demo/Index.vue'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    }, {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }, {
      path: '/demo',
      name: 'Demo',
      component: Demo
    }
  ]
})
