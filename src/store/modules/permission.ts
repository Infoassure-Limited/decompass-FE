import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import { flatMultiLevelRoutes } from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

function filterAsyncRoutes(
  routes: AppRouteRecordRaw[],
  roles: string[],
  permissions: string[],
  modules: string[]
): AppRouteRecordRaw[] {
  const res: AppRouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (canAccess(roles, permissions, modules, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, permissions, modules)
      }
      res.push(tmp)
    }
  })

  return res
}
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
export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(roles, permissions, modules): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        const accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles, permissions, modules)
        routerMap = cloneDeep(accessedRoutes)
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: [
    {
      pick: ['routers'],
      storage: localStorage
    },
    {
      pick: ['addRouters'],
      storage: localStorage
    },
    {
      pick: ['menuTabRouters'],
      storage: localStorage
    }
  ]
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
