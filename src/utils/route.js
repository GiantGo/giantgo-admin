export function checkRoleRoute (roles, route) {
  if (route.meta && route.meta.roles && route.meta.roles.length) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function checkPermissionRoute (permissions, route) {
  if (route.meta && route.meta.permissions && route.meta.permissions.length) {
    return permissions.some(permission => route.meta.permissions.includes(permission))
  } else {
    return true
  }
}
