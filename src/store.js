import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(Vuex)

const uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : r & 0x3 | 0x8
    return v.toString(16)
  })
}

export default new Vuex.Store({
  state: {
    uid: localStorage.getItem('uid') || '',
    username: '新用戶',
    list: [],
    types: []
  },
  getters: {
    getUserID: function (state) {
      return state.uid
    },
    getTypes: function (state) {
      return state.types
    },
    getTodos: function (state) {
      return state.list
    }
  },
  mutations: {
    'SET_USERID': function (state, data) {
      state.uid = data
    },
    'SET_USERNAME': function (state, data) {
      state.username = data
    },
    'SET_LIST': function (state, data) {
      state.list = data.slice()
    },
    'SET_TYPES': function (state, data) {
      state.types = data.slice()
    },
    'ADD_TYPE': function (state, data) {
      state.types.push(data)
    },
    'REMOVE_TYPE': function (state, data) {
      // remove type
      const targetIndex = state.types.findIndex(target => target === data)
      state.types.splice(targetIndex, 1)
      // remove tasks
      for (let i = state.list.length - 1; i > -1; --i) {
        if (state.list[i].type === data) {
          state.list.splice(i, 1)
        }
      }
    },
    'ADD_TODO': function (state, data) {
      data.tid = uuid()
      state.list.push(data)
    },
    'MODIFY_TODO': function (state, data) {
      const targetIndex = state.list.findIndex(target => target.tid === data.tid)
      for (let key in state.list[targetIndex]) {
        state.list[targetIndex][key] = data[key]
      }
    },
    'REMOVE_TODO': function (state, tid) {
      const targetIndex = state.list.findIndex(target => target.tid === tid)
      state.list.splice(targetIndex, 1)
    }
  },
  actions: {
    login: async function (context, data) {
      try {
        const result = await firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        context.commit('SET_USERID', result.user.uid)
        // confirm if the account is the login
        const docRef = firebase.firestore().collection('users').doc(result.user.uid)
        const value = await docRef.get()
        if (!value.exists) {
          firebase.firestore().collection('users').doc(result.user.uid).set({
            username: '',
            list: [],
            types: []
          })
        }
        // set the user info
        context.commit('SET_USERID', value.id)
        context.commit('SET_USERNAME', value.data().username)
        context.commit('SET_TYPES', value.data().types)
        context.commit('SET_LIST', value.data().list)
        // keep login status
        localStorage.setItem('uid', value.id)
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    },
    register: async function (context, data) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    },
    addType: async function (context, data) {
      try {
        if (context.state.types.includes(data)) {
          alert('There is already the same type!!')
          return
        }
        context.commit('ADD_TYPE', data)
        const docRef = firebase.firestore().collection('users').doc(context.state.uid)
        await docRef.update({
          types: context.state.types
        })
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    },
    removeType: async function (context, target) {
      try {
        context.commit('REMOVE_TYPE', target)
        await firebase.firestore().collection('users').doc(context.state.uid).update({
          types: context.state.types,
          list: context.state.list
        })
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    },
    addTodo: async function (context, data) {
      try {
        context.commit('ADD_TODO', Object.assign({}, data))
        await firebase.firestore().collection('users').doc(context.state.uid).update({
          list: context.state.list
        })
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    },
    modifyTodo: async function (context, data) {
      try {
        context.commit('MODIFY_TODO', data)
        const docRef = firebase.firestore().collection('users').doc(context.state.uid)
        await docRef.update({
          list: context.state.list
        })
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    },
    removeTodo: async function (context, tid) {
      try {
        context.commit('REMOVE_TODO', tid)
        const docRef = firebase.firestore().collection('users').doc(context.state.uid)
        await docRef.update({
          list: context.state.list
        })
        return true
      } catch (error) {
        console.log(error)
        alert(error)
        return false
      }
    }
  }
})
