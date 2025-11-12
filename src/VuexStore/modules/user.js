import { createPinia } from 'pinia'
import { createApp, ref, unref } from 'vue'
import App from '@/App.vue'
import {
  confirmOTP,
  getInfo,
  login,
  logout,
  otherUserLogin,
  register,
  updatePassword
} from '@/api/auth'
import { resetRouter } from '@/router'
import store from '@/VuexStore'
import {
  getOtherToken,
  getToken,
  removeOtherToken,
  removeToken,
  removeUserRole,
  setOtherToken,
  setToken,
  setUserRole
} from '@/utils/auth'
import { get, set } from 'idb-keyval'

import { useAppStore } from '@/store/modules/app'
import { trim, setCssVar } from '@/utils'
import { useCssVar } from '@vueuse/core'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

const appStore = useAppStore()

// import store from '@/store'
function saveOtherUser(data) {
  set('other_user', JSON.stringify(data))
    .then()
    .catch((err) => console.log('Cannots save data!', err))
}
function loadOtherUserData() {
  get('other_user').then((value) => {
    if (value) {
      const otherUser = JSON.parse(value)

      store.dispatch('user/setOtherUserData', otherUser)
    }
  })
}

function setSystemTheme(color) {
  setCssVar('--el-color-primary', color)
  appStore.setTheme({ elColorPrimary: color })
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor)))
}
function setHeaderTheme(color) {
  appStore.setHeaderTheme(color)
}
function setMenuTheme(color) {
  appStore.setMenuTheme(color)
}

const state = {
  id: '',
  token: getToken(),
  other_user_token: getOtherToken(),
  otherUserData: {},
  userData: {
    id: '',
    name: '',
    email: '',
    phone: '',
    login_as: null,
    partner_id: null,
    client_id: null,
    vendor_id: null,
    introduction: '',
    modules: [],
    roles: [],
    all_roles: [],
    permissions: [],
    p_status: '',
    notifications: [],
    password_status: '',
    logo: '',
    navbar_bg: '',
    sidebar_bg: '',
    unreadNotificationCount: 0
  }
}

const mutations = {
  SET_USER_DATA(state, objValue) {
    Object.assign(state.userData, objValue)
  },
  UPDATE_SCHOOL_LOGO(state, logo) {
    state.userData.partner.logo = logo
  },
  UPDATE_NAVBAR_COLOR(state, color) {
    state.userData.partner.navbar_bg = color
  },
  UPDATE_SIDEBAR_COLOR(state, color) {
    state.userData.partner.sidebar_bg = color
  },

  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_OTHER_TOKEN(state, token) {
    state.other_user_token = token
  },
  SET_OTHER_USER_DATA(state, data) {
    Object.assign(state.otherUserData, data)
  },
  SET_ID(state, id) {
    state.id = id
  },
  SET_NOTIFICATIONS: (state, notifications) => {
    state.userData.notifications = notifications
  },
  SET_UNREADNOTIFICATION_COUNT: (state, count) => {
    state.userData.unreadNotificationCount += count
  },
  ADD_NEW_NOTIFICATION: (state, notification) => {
    state.userData.notifications.unshift(notification)
  }
}

const actions = {
  addNewNotifications({ commit }, notification) {
    commit('ADD_NEW_NOTIFICATION', notification)
  },
  updateSchoolLogo({ commit }, logo) {
    commit('UPDATE_SCHOOL_LOGO', logo)
  },
  updateNavbarColor({ commit }, color) {
    commit('UPDATE_NAVBAR_COLOR', color)
  },
  updateSidebarColor({ commit }, color) {
    commit('UPDATE_SIDEBAR_COLOR', color)
  },
  setNotifications({ commit }, notifications) {
    commit('SET_NOTIFICATIONS', notifications)
  },
  setUnreadNotificationCount({ commit }, count) {
    commit('SET_UNREADNOTIFICATION_COUNT', count)
  },
  updateUserData({ commit }, data) {
    commit('SET_USER_DATA', data)

    const role = data.login_as !== null ? data.login_as : 'empty'

    setUserRole(role)
  },
  setOtherUserData({ commit }, data) {
    commit('SET_OTHER_USER_DATA', data)
  },

  loadOtherUserData() {
    return new Promise((resolve) => {
      loadOtherUserData()
      setTimeout(() => {
        resolve('success')
      }, 1000)
    })
  },
  register(userInfo) {
    // const { name, email, password, c_password } = userInfo;
    return new Promise((resolve, reject) => {
      register(userInfo)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((response) => {
          if (response.tk) {
            commit('SET_USER_DATA', response.data)
            commit('SET_TOKEN', response.tk)
            commit('SET_ID', response.data.id)
            setToken(response.tk)

            const role = response.data.login_as !== null ? response.data.login_as : 'empty'

            setUserRole(role)
            setSystemTheme(response.data.sidebar_bg)
            setHeaderTheme(response.data.navbar_bg)
          }
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  otherUserLogin({ commit }, userInfo) {
    const { email, password, product_module } = userInfo

    return new Promise((resolve, reject) => {
      otherUserLogin({ email: email.trim(), password, product_module })
        .then((response) => {
          if (response.token) {
            // We need this to be able to call backend apis
            commit('SET_USER_DATA', response.user)
            commit('SET_TOKEN', response.token)
            commit('SET_ID', response.user.id)
            setToken(response.tk)

            commit('SET_OTHER_TOKEN', response.token)
            commit('SET_OTHER_USER_DATA', response.user)
            setOtherToken(response.token)
            saveOtherUser(response.user)
          }
          // resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  logoutOtherUser({ commit }) {
    return new Promise((resolve) => {
      removeOtherToken()
      saveOtherUser('')
      commit('SET_OTHER_TOKEN', '')
      resolve()
    })
  },
  confirmOTP({ commit }, data) {
    const { id } = data

    return new Promise((resolve, reject) => {
      confirmOTP(id, data)
        .then((response) => {
          commit('SET_USER_DATA', response.data)
          commit('SET_TOKEN', response.tk)
          commit('SET_ID', response.data.id)

          const role = response.data.login_as !== null ? response.data.login_as : 'empty'

          setUserRole(role)
          setToken(response.tk)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { roles } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          // console.log(data)
          commit('SET_USER_DATA', data)
          commit('SET_ID', data.id)

          const role = response.data.login_as !== null ? response.data.login_as : 'empty'

          setUserRole(role)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updatePassword({ commit }, data) {
    return new Promise((resolve, reject) => {
      updatePassword(data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    // commit('SET_USER_DATA', '')
    // removeToken()
    // resetRouter()
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_USER_DATA', '')
          removeUserRole()
          removeToken()
          resetRouter()
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
