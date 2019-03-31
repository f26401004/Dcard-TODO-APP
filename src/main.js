import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import VueNotification from 'vue-notification'

import 'normalize.css'
import '../src/assets/theme.scss'

// config firebase
import config from '../firebase.config.js'
firebase.initializeApp(config)

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(function (user) {
  console.log(user)
  if (user) {
    localStorage.setItem('uid', user.uid)
  }
})
// config check network status
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
const updateConnectionStatus = function () {
  if (navigator.onLine === false) {
    // set online status to false
    store.commit('SET_ONLINE_STATUS', false)
    Vue.notify({
      group: 'system-danger',
      title: 'System Message',
      text: `Network connection failed!! Please check the connection or try later.`,
      duration: 5000
    })
  } else {
    // set online status to false
    store.commit('SET_ONLINE_STATUS', true)
    Vue.notify({
      group: 'system-primary',
      title: 'System Message',
      text: `Network connection success!!`,
      duration: 5000
    })
  }
}
connection.addEventListener('change', updateConnectionStatus)
// config route hook
router.beforeEach(async (to, from, next) => {
  try {
    const uid = localStorage.getItem('uid')
    if (to.meta.requireLogin && uid === null) {
      next({ path: '/login' })
      return
    }
    if (uid !== null) {
      const docRef = firebase.firestore().collection('users').doc(uid)
      const value = await docRef.get()
      // set the user info
      store.commit('SET_USERID', value.id)
      store.commit('SET_USERNAME', value.data().username)
      store.commit('SET_TYPES', value.data().types)
      store.commit('SET_LIST', value.data().list)
    }
    next()
  } catch (error) {
    console.log(error)
  }
})
// config custom directive longpress
Vue.directive('longpress', {
  bind: function (el, binding, vNode) {
    // warn if the binding is not a function
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.comName
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
      if (compName) {
        warn += `Found in component '${compName}' `
      }
      console.warn(warn)
    }
    // initialize timer
    let pressTimer = null
    // start event to start timeout
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(function () {
          // execute the handler
          handler()
        }, 500)
      }
    }
    // cancel event to clear timeout
    const cancel = (e) => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    // handler to execute the function
    const handler = (e) => {
      binding.value(e)
    }

    // add event listener
    el.addEventListener('moudedown', start)
    el.addEventListener('touchstart', start)
    // cancel timeout
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
})
// config notification plugin
Vue.use(VueNotification)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
