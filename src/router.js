import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/Home.vue'
import LoginPage from './views/Login.vue'
import RegisterPage from './views/Register.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage
    }
  ]
})
