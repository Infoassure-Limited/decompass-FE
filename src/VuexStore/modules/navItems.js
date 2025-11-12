// import navMenuItems from '@/navigation/vertical'
import store from '@/VuexStore'
// import dashboard from '@/navigation/vertical/nav-modules/dashboard'
// import appSetup from '@/navigation/vertical/nav-modules/app-setup'
// import links from '@/navigation/vertical/nav-modules/links'
// import adminSettings from '@/navigation/vertical/nav-modules/admin-settings'
// // import riskAssessment from '@/navigation/vertical/nav-modules/risk-assessment'
// import userManagement from '@/navigation/vertical/nav-modules/user-management'

import Resource from '@/api/resource'

const state = {
  navMenuItems: [],
  allModules: [],
  availableModules: [],
  clientActivatedProjects: [],
  clientActivatedModules: []
}

const mutations = {
  SET_NAV_ITEMS(state, navMenuItems) {
    state.navMenuItems = navMenuItems
  },

  SET_MODULES(state, modules) {
    state.availableModules = modules
  },

  SET_ALL_MODULES(state, modules) {
    state.allModules = modules
  },

  SET_CLIENT_ACTIVATED_PROJECTS(state, projects) {
    state.clientActivatedProjects = projects
  },

  SET_CLIENT_ACTIVATED_MODULES(state, modules) {
    state.clientActivatedModules = modules
  }
}

const actions = {
  setNavItems({ commit }) {
    const { availableModules } = store.getters
    // const navMenuItems = [...dashboard, ...appSetup, ...links, ...availableModules, ...riskAssessment, ...userManagement, ...adminSettings]
    const navMenuItems = [...availableModules]
    commit('SET_NAV_ITEMS', navMenuItems)
  },
  fetchActivatedModules({ commit }, client) {
    return new Promise((resolve, reject) => {
      const fetchCriteriaResource = new Resource('fetch-client-activated-projects')
      fetchCriteriaResource
        .list({ client_id: client.id })
        .then((response) => {
          commit('SET_CLIENT_ACTIVATED_PROJECTS', response.projects)
          commit('SET_CLIENT_ACTIVATED_MODULES', response.activated_modules)
          commit('SET_ALL_MODULES', response.all_modules)
          const modules = {
            title: 'Modules',
            icon: 'PackageIcon',
            acl: {
              roles: ['admin', 'user']
              // permissions: ['manage-client-projects'],
            },
            children: []
          }
          const children = []
          response.projects.forEach((project) => {
            const availableModule = project.available_module
            const features = project.feature_slug
            if (availableModule) {
              children.push({
                title: availableModule.name,
                slug: availableModule.slug,
                to: { name: `${availableModule.slug}-index` },
                features,
                acl: {
                  modules: [availableModule.slug]
                }
              })
              // modules.push({
              //   title: availableModule.name,
              //   slug: availableModule.slug,
              //   icon: 'PackageIcon',
              //   features,
              //   acl: {
              //     modules: [availableModule.slug],
              //   },
              //   children: [
              //     {
              //       title: 'Overview',
              //       route: `${availableModule.slug}-dashboard`,
              //       view: 'dashboard',
              //       moduleName: availableModule.slug,
              //     },
              //     {
              //       title: 'Activities',
              //       route: `manage-${availableModule.slug}`,
              //       view: 'manage',
              //       moduleName: `${availableModule.slug}`,
              //     },
              //     // {
              //     //   title: 'Reports',
              //     //   route: `${availableModule.slug}-report`,
              //     //   view: 'report',
              //     //   moduleName: `${availableModule.slug}`,
              //     // },
              //     // {
              //     //   title: 'Setup',
              //     //   route: `module-setup/${availableModule.slug}`,
              //     // },
              //   ],
              // })
            }
          })
          modules.children = children
          // if (modules.length === 1) {
          //   modules.unshift({ header: 'Active Module' })
          // }
          // if (modules.length > 1) {
          //   modules.unshift({ header: 'Active Modules' })
          // }
          commit('SET_MODULES', [modules])
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  // fetchAvailableModules({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     const fetchModulesResource = new Resource('fetch-available-modules')
  //     fetchModulesResource.list()
  //       .then(response => {
  //         const modules = []
  //         response.modules.forEach(availableModule => {
  //           modules.push({
  //             title: availableModule.name,
  //             icon: 'PackageIcon',
  //             acl: {
  //               modules: [availableModule.slug],
  //             },
  //             children: [
  //               {
  //                 title: 'Dashboard',
  //                 route: `${availableModule.slug}-dashboard`,
  //               },
  //               {
  //                 title: 'Activities',
  //                 route: `manage-${availableModule.slug}`,
  //               },
  //               {
  //                 title: 'Reports',
  //                 route: `${availableModule.slug}-report`,
  //               },
  //             ],
  //           })
  //         })
  //         commit('SET_MODULES', modules)
  //         resolve(response)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
