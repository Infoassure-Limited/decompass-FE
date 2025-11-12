// import store from '@/store';
import store from '@/VuexStore'
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/Directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.userData.permissions
    const requiredPermissions = value

    const hasPermission = permissions.some((permission) => requiredPermissions.includes(permission))

    return hasPermission
  }
  console.error("Need permissions! Like v-permission=\"['manage permission','edit article']\"")
  return false
}
