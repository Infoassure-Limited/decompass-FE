import { createStore } from 'vuex'
import getters from './getters'
import app from './modules/app'
import clients from './modules/clients'
import navItems from './modules/navItems'
import permission from './modules/permission'
import user from './modules/user'

export default createStore({
  modules: {
    app,
    clients,
    navItems,
    permission,
    user
  },
  getters
  // strict: process.env.DEV,
})
