import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * Check if it matches the current user right by meta.role
 * @param {String[]} roles
 * @param {String[]} permissions
 * @param route
 */
function canAccess(roles, permissions, modules, route) {
  if (route.meta) {
    let hasRole = true
    let hasPermission = true
    let hasModule = true
    let excluded = false
    if (route.meta.roles || route.meta.permissions || route.meta.modules) {
      // If it has meta.roles or meta.permissions, accessible = hasRole || permission
      hasRole = false
      hasPermission = false
      hasModule = false
      if (route.meta.roles) {
        hasRole = roles.some((role) => route.meta.roles.includes(role))
      }

      if (route.meta.permissions) {
        hasPermission = permissions.some((permission) =>
          route.meta.permissions.includes(permission)
        )
      }
      if (route.meta.modules) {
        hasModule = modules.some((module) => route.meta.modules.includes(module))
      }
    }
    if (route.meta.except) {
      excluded = roles.some((role) => route.meta.except.includes(role))
    }

    if (excluded) {
      return false
    }

    return hasRole || hasPermission || hasModule
  }

  // If no meta.roles/meta.permissions inputted - the route should be accessible
  return true
}

/**
 * Find all routes of this role
 * @param routes asyncRouterMap
 * @param roles
 */
function filterasyncRouterMap(routes, roles, permissions, modules) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (canAccess(roles, permissions, modules, tmp)) {
      if (tmp.children) {
        tmp.children = filterasyncRouterMap(tmp.children, roles, permissions, modules)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRouterMap.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { roles, permissions, modules }) {
    return new Promise((resolve) => {
      let accessedRoutes = ''

      //   if (roles.includes('admin')) {
      //     accessedRoutes = asyncRouterMap;
      //   } else {
      //     accessedRoutes = filterasyncRouterMap(asyncRouterMap, roles, permissions);
      //   }
      // accessedRoutes = asyncRouterMap;
      accessedRoutes = filterasyncRouterMap(asyncRouterMap, roles, permissions, modules)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  canAccess({ roles, permissions }, route) {
    return new Promise((resolve) => {
      if (route.meta) {
        let hasRole = true
        let hasPermission = true
        if (route.meta.roles || route.meta.permissions) {
          // If it has meta.roles or meta.permissions, accessible = hasRole || permission
          hasRole = false
          hasPermission = false
          if (route.meta.roles) {
            hasRole = roles.some((role) => route.meta.roles.includes(role))
          }

          if (route.meta.permissions) {
            hasPermission = permissions.some((permission) =>
              route.meta.permissions.includes(permission)
            )
          }
        }

        resolve(hasRole || hasPermission)
      }
      // If no meta.roles/meta.permissions inputted - the route should be accessible
      resolve(true)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
