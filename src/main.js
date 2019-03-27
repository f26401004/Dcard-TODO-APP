import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'

import 'normalize.css'
import '../src/assets/theme.scss'

// config firebase
import config from '../firebase.config.js'
firebase.initializeApp(config)

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    localStorage.setItem('uid', user.uid)
  }
})
// config route hook
router.beforeEach(async (to, from, next) => {
  try {
    const uid = localStorage.getItem('uid')
    if (to.meta.requireLogin && uid === null) {
      next({ path: '/login' })
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
