import store from '@/VuexStore'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/Directive.vue
 */
export default function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    // const roles = store.getters && store.getters.userData.all_roles
    const roles = store.getters && store.getters.userData.roles
    const requiredRoles = value

    const hasRole = roles.some((role) => requiredRoles.includes(role))
    return hasRole
  }
  console.error("Need roles! Like v-role=\"['admin','user']\"")
  return false
}
