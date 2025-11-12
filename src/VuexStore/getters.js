const getters = {
  userData: (state) => state.user.userData,
  isAdmin: (state) => (state.user.userData.login_as === 'admin' ? true : false),
  userId: (state) => state.user.id,
  permissionRoutes: (state) => state.permission.routes,
  addRoutes: (state) => state.permission.addRoutes,
  baseServerUrl: (state) => import.meta.env.VITE_BASE_SERVER_URL,
  token: (state) => state.user.token,
  other_user_token: (state) => state.user.other_user_token,
  otherUserData: (state) => state.user.otherUserData,
  clients: (state) => state.clients.allClients,
  selectedClient: (state) => state.clients.selectedClient,
  partnerWithClients: (state) => state.clients.partnerWithClients,
  allModules: (state) => state.navItems.allModules,
  availableModules: (state) => state.navItems.availableModules,
  navMenuItems: (state) => state.navItems.navMenuItems,
  clientActivatedProjects: (state) => state.navItems.clientActivatedProjects,
  clientActivatedModules: (state) => state.navItems.clientActivatedModules,
  paystackKey: (state) => state.app.paystackKey,
  assetTypesList: (state) => state.app.assetTypesList
}
export default getters
