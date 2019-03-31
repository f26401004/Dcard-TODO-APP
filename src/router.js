import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/Home.vue'
import LoginPage from './views/Login.vue'
import RegisterPage from './views/Register.vue'
import ListPage from './views/List.vue'
import store from './store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        const uid = localStorage.getItem('uid')
        if (uid !== null) {
          next({ path: '/home' })
          return
        }
        next()
      }
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage,
      beforeEnter: (to, from, next) => {
        const uid = localStorage.getItem('uid')
        if (uid !== null) {
          next({ path: '/home' })
          return
        }
        next()
      }
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage,
      meta: {
        requireLogin: true
      }
    },
    {
      path: '/list/:type',
      name: 'ListPage',
      component: ListPage,
      meta: {
        requireLogin: true
      },
      beforeEnter: (to, from, next) => {
        const types = store.getters.getTypes
        if (!types.includes(to.params.type)) {
          next({ path: '/home' })
          return
        }
        next()
      }
    }
  ]
})
