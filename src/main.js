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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
