/**
 * Simple RESTful helper class
 */

class Helper {
  // helper function to rank student result;
  rankResult(scoreAverage, resultAverages, option) {
    this.resultAveragesArray = []
    // convert resultAverages object to array
    // if (resultAverages) {
    //   for (const key in resultAverages) {
    //     console.log(key)
    //   // this.resultAveragesArray.push(resultAverages[key])
    //   }
    // }

    // console.log(resultAverages)

    Object.entries(resultAverages).map((item) => {
      // console.log(item)
      this.resultAveragesArray.push(item[1])
      // return item
    })
    // resultAverages.forEach(element => {
    //   resultAveragesArray.push(element)
    // })
    this.resultAveragesArray.sort((a, b) => b - a) // sort numerical array in descending order

    let position = `${this.resultAveragesArray.indexOf(scoreAverage) + 1}` // to get the index/position of this score in the sorted array
    if (option === 'position') {
      const strLength = position.length
      // console.log(position)
      if (
        position === '1' ||
        (strLength === '2' && position.substr(0, 1) !== '1' && position.substr(1) === '1')
      ) {
        position += 'st'
      } else if (
        position === '2' ||
        (strLength === '2' && position.substr(0, 1) !== '1' && position.substr(1) === '2')
      ) {
        position += 'nd'
      } else if (
        position === '3' ||
        (strLength === '2' && position.substr(0, 1) !== '1' && position.substr(1) === '3')
      ) {
        position += 'rd'
      } else {
        position += 'th'
      }
    }
    return position
  }

  checkRolesAndPermissionOnly(item, userData) {
    let hasRole = true
    let hasPermission = true
    const { roles, permissions } = userData

    if (item.acl) {
      if (item.acl.roles || item.acl.permissions) {
        // If it has meta.roles or meta.permissions, accessible = hasRole || permission
        hasRole = false
        hasPermission = false
        if (item.acl.roles) {
          hasRole = roles.some((role) => item.acl.roles.includes(role))
        }

        if (item.acl.permissions) {
          hasPermission = permissions.some((permission) =>
            item.acl.permissions.includes(permission)
          )
        }

        return hasRole || hasPermission
      }

      if (item.acl.except) {
        // we hide navigation for user whose role you have been excluded
        const exclude = roles.some((permission) => item.acl.except.includes(permission))
        return !exclude
      }
    }

    // If no meta.roles/meta.permissions inputted - the route should be accessible
    return true
  }

  canAccessLink(item, userData) {
    let hasModule = true
    const { modules } = userData

    if (item.acl) {
      if (item.acl.modules !== '' && item.acl.modules !== undefined) {
        hasModule = modules.some((eachModule) => item.acl.modules.includes(eachModule))
        return this.checkRolesAndPermissionOnly(item, userData) && hasModule
      }
      return this.checkRolesAndPermissionOnly(item, userData)
    }

    // If no meta.roles/meta.permissions inputted - the route should be accessible
    return true
  }
}
export { Helper as default }
