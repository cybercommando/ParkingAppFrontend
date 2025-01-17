import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let apiAddress = 'https://parkingapp.gigalixirapp.com/api'

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user : {}
  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token, user){
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    userLogin({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: apiAddress + '/users/sign_in/', data: user, method: 'POST' })
        .then(resp => {
          const token = resp.data.jwt
          const user = resp.data.user
          localStorage.setItem('token', token)
          localStorage.setItem('userDetails', user)
          localStorage.setItem('userID', user.user_id)
          localStorage.setItem('userName', user.username)
          localStorage.setItem('paymentPreference', user.paymentpreference)
          axios.defaults.headers.common['Authorization'] = token
          commit('auth_success', token, user)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          localStorage.removeItem('userDetails')
          localStorage.removeItem('userID')
          localStorage.removeItem('userName')
          localStorage.removeItem('paymentPreference')
          reject(err)
        })
      })
    },
    register({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: apiAddress + '/users/sign_up/', data: user, method: 'POST' })
        .then(resp => {
          const token = resp.data.jwt
          const user = resp.data.user
          localStorage.setItem('token', token)
          localStorage.setItem('userDetails', user)
          localStorage.setItem('userID', user.user_id)
          localStorage.setItem('userName', user.username)
          localStorage.setItem('paymentPreference', user.paymentpreference)
          axios.defaults.headers.common['Authorization'] = token
          commit('auth_success', token, user)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('token')
          localStorage.removeItem('userDetails')
          localStorage.removeItem('userID')
          localStorage.removeItem('userName')
          localStorage.removeItem('paymentPreference')
          reject(err)
        })
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('userDetails')
        localStorage.removeItem('userID')
        localStorage.removeItem('userName')
        localStorage.removeItem('paymentPreference')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  }
})

