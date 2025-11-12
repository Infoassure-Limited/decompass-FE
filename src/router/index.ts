import { createRouter, createWebHistory /*createWebHashHistory*/ } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'RedirectWrap',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Authentication/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/login-as',
    component: () => import('@/views/modules/user/LoginAs.vue'),
    name: 'LoginAs',
    meta: {
      // layout: 'full',
      hidden: true
      // redirectIfLoggedIn: true,
    }
  },
  {
    path: '/vdd',
    component: () => import('@/views/modules/DUE-DILIGENCE/vendor/index.vue'),
    name: 'VDDUser',
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/views/Authentication/ResetPassword.vue'),
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/forgot-password',
    component: () => import('@/views/Authentication/ForgotPassword.vue'),
    name: 'ForgotPassword',
    meta: {
      hidden: true,
      // title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/register',
    component: () => import('@/views/Authentication/Register.vue'),
    name: 'Register',
    meta: {
      hidden: true,
      // title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/confirm-registration/:code',
    name: 'ConfirmRegistration',
    component: () => import('@/views/Authentication/ConfirmRegister.vue'),
    meta: {
      hidden: true,
      // title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/profile',
    name: 'User',
    meta: {
      title: t('router.personal'),
      hidden: true,
      canTo: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/modules/user/Profile.vue'),
        name: 'UserProfile',
        meta: {
          title: 'User Profile',
          hidden: true,
          canTo: true
        }
      }
    ]
  },
  // {
  //   path: '/personal',
  //   component: Layout,
  //   redirect: '/personal/personal-center',
  //   name: 'Personal',
  //   meta: {
  //     title: t('router.personal'),
  //     hidden: true,
  //     canTo: true
  //   },
  //   children: [
  //     {
  //       path: 'personal-center',
  //       component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'),
  //       name: 'PersonalCenter',
  //       meta: {
  //         title: t('router.personalCenter'),
  //         hidden: true,
  //         canTo: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Overview',
    meta: {
      title: t('router.dashboard'),
      icon: 'vi-ant-design:dashboard-filled'
      // alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Dashboard',
        meta: {
          icon: 'vi-ant-design:dashboard-filled',
          title: t('router.dashboard'),
          noCache: true,
          affix: true
        }
      }
      // {
      //   path: 'workplace',
      //   component: () => import('@/views/Dashboard/Workplace.vue'),
      //   name: 'Workplace',
      //   meta: {
      //     title: t('router.workplace'),
      //     noCache: true
      //   }
      // }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    name: 'Settings',
    redirect: '/settings/index/manage-users',
    meta: {
      title: t('router.settings'),
      icon: 'vi-ant-design:setting-outlined',
      except: ['super', 'partner'],
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/modules/settings/index.vue'),
        name: 'SettingsIndex',
        meta: {
          title: 'General Settings',
          icon: 'tabler:settings-cog'
        }
      }
    ]
  },
  {
    path: '/manage-client-users',
    component: Layout,
    name: 'ManageUsers',
    meta: {
      hidden: true,
      title: 'Manage Users',
      icon: 'tabler:users',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/modules/user/ClientUsers.vue'),
        name: 'ManageClientUsers',
        meta: {
          hidden: true,
          title: 'Manage Users',
          icon: 'tabler:users'
        }
      }
    ]
  },
  // {
  //   path: '/manage-projects',
  //   name: 'ManageProject',
  //   component: Layout,
  //   redirect: '/manage-projects/index',
  //   meta: {
  //     title: 'Manage Project',
  //     // permissions: ['manage-client-projects'],
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/modules/projects/ClientProjects.vue'),
  //       name: 'ManageProjectIndex',
  //       meta: {
  //         title: 'Manage Project',
  //         icon: 'vi-ant-design:project-outlined',
  //         permissions: ['manage-client-projects'],
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/modules',
    component: Layout,
    name: 'Modules',
    meta: {
      title: t('router.modules'),
      icon: 'tabler:packages',
      modules: ['bcms', 'isms', 'vdd', 'ndpa'],
      except: ['super', 'partner']
      // permissions: ['manage-project-subscription']
    },
    children: [
      {
        path: 'subscribe',
        component: () => import('@/views/modules/projects/ClientProjects.vue'),
        name: 'ManageProjectIndex',
        meta: {
          title: 'Subscriptions',
          icon: 'vi-ant-design:project-outlined',
          // permissions: ['manage-project-subscription']
          roles: ['admin']
        }
      },
      {
        path: 'bcms-index',
        component: () => import('@/views/modules/BCMS-ISO22301/index.vue'),
        name: 'BCMS',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'BCMS',
          hint: 'Business Continuity Management System',
          modules: ['bcms']
        }
      },
      {
        path: 'isms-index',
        component: () => import('@/views/modules/ISMS-ISO27001/index.vue'),
        name: 'ISMS',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'ISMS',
          hint: 'Information Security Management System',
          modules: ['isms']
        }
      },
      {
        path: 'ndpa-index',
        component: () => import('@/views/modules/NDPA/index.vue'),
        name: 'NDPA',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'NDPA',
          hint: 'Nigeria Data Protection Act',
          modules: ['ndpa']
          // except: ['super', 'partner']
        }
      },
      {
        path: 'vdd-index',
        component: () => import('@/views/modules/DUE-DILIGENCE/index.vue'),
        name: 'VDD',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'TPDD',
          hint: 'Third Party Due Diligence',
          modules: ['vdd']
        }
      }
    ]
  },
  // {
  //   path: '/documents',
  //   component: Layout,
  //   name: 'Documents',
  //   meta: {
  //     icon: 'tabler:users',
  //     roles: ['admin', 'user']
  //   },
  //   children: [
  //     {
  //       path: 'uploads',
  //       component: () => import('@/views/modules/DocumentUploads/index.vue'),
  //       name: 'DocumentUploads',
  //       meta: {
  //         title: 'Document Uploads',
  //         icon: 'tabler:file-upload'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/user-management',
    component: Layout,
    name: 'UserManagement',
    meta: {
      title: 'Manage Users',
      icon: 'tabler:users',
      roles: ['super', 'partner']
    },
    children: [
      {
        path: 'manage-partners',
        component: () => import('@/views/modules/user/Partners.vue'),
        name: 'ManagePartners',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'Manage Partners',
          roles: ['super']
        }
      },
      {
        path: 'manage-clients',
        component: () => import('@/views/modules/user/Clients.vue'),
        name: 'ManageClients',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'Manage Clients',
          roles: ['partner', 'super']
        }
      },
      {
        path: 'manage-staff',
        component: () => import('@/views/modules/user/index.vue'),
        name: 'ManageStaff',
        meta: {
          icon: 'tabler:arrow-badge-right',
          title: 'Manage Staff',
          roles: ['super']
        }
      }
    ]
  },
  {
    path: '/app-setup',
    name: 'AppSetup',
    component: Layout,
    meta: {
      title: 'App Setup',
      icon: 'tabler:settings',
      // permissions: ['manage-client-projects'],
      roles: ['super']
    },
    children: [
      {
        path: 'document-template',
        component: () => import('@/views/modules/app-setup/DocumentTemplates.vue'),
        name: 'DocumentTemplate',
        meta: {
          title: 'Template Library',
          icon: 'tabler:arrow-badge-right',
          roles: ['super']
        }
      },
      {
        path: 'modules-config',
        component: () => import('@/views/modules/ModuleSetup/index.vue'),
        name: 'ModuleSetup',
        meta: {
          title: 'Modules',
          icon: 'tabler:arrow-badge-right',
          roles: ['super']
        }
      },
      {
        path: 'module-packages',
        component: () => import('@/views/modules/packages/index.vue'),
        name: 'PackageSetup',
        meta: {
          title: 'Packages',
          icon: 'tabler:arrow-badge-right',
          roles: ['super']
        }
      },
      {
        path: 'acl',
        component: () => import('@/views/modules/access-control/index.vue'),
        name: 'AccessControl',
        meta: {
          title: t('setting.accessControl'),
          icon: 'tabler:lock-cog'
        }
      }
    ]
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Layout,
    meta: {
      icon: 'tabler:Notifications'
    },
    children: [
      {
        path: 'all',
        name: 'AllNotifications',
        component: () => import('@/views/modules/Notifications.vue'),
        meta: {
          title: 'Notifications',
          icon: 'tabler:bell'
        }
      }
    ]
  },
  {
    path: '/vendor',
    name: 'VendorThirdParty',
    component: Layout,
    meta: {
      title: 'Vendor / Third Party',
      // permissions: ['manage-client-projects'],
      roles: ['vendor']
    },
    children: [
      {
        path: 'third-party',
        component: () => import('@/views/modules/DUE-DILIGENCE/vendor/index.vue'),
        name: 'VendorThirdPartyIndex',
        meta: {
          title: 'TPDD',
          icon: 'tabler:user-search'
        }
      }
    ]
  }
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: '/error/404',
  //   name: 'Error',
  //   meta: {
  //     title: t('router.errorPage'),
  //     icon: 'vi-ci:error',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: '404-demo',
  //       component: () => import('@/views/Error/404.vue'),
  //       name: '404Demo',
  //       meta: {
  //         title: '404'
  //       }
  //     },
  //     {
  //       path: '403-demo',
  //       component: () => import('@/views/Error/403.vue'),
  //       name: '403Demo',
  //       meta: {
  //         title: '403'
  //       }
  //     },
  //     {
  //       path: '500-demo',
  //       component: () => import('@/views/Error/500.vue'),
  //       name: '500Demo',
  //       meta: {
  //         title: '500'
  //       }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
