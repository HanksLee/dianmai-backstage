import { asyncRouterMap, constantRouterMap } from '@/router'
import { deepClone } from '@/utils/data.js'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(routerIds, route) {
  if (!route.routerId) {
    return true
  } else {
    if (routerIds.length > 0 && route) {
      return routerIds.indexOf(route.routerId) > -1
    } else {
      return false
    }
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param allAsyncRouter
 * @param roles
 */
function filterAsyncRouter(allAsyncRouter, routerIds) {
  const accessedRouters = allAsyncRouter.filter(route => {
    if (hasPermission(routerIds, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, routerIds)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function filterAccessedRouters(data) {
  const result = data.filter(item => {
    if (item.children) {
      if (item.children.length == 0) {
        return false
      } else {
        filterAccessedRouters(item.children)
        return true
      }
    } else {
      return true
    }
  })
  return result
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    routerIds: [],
    // Astlvk
    unaudited: {},
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ROUTERIDS: (state, routerIds) => {
      state.routerIds = routerIds
    },
    CLEAR_ROUTER: (state, routers) => {
      state.routers = constantRouterMap
      state.addRouters = []
      state.routerIds = []
    },
    // Astlvk
    SET_UNAUDITED: (state, payload) => {
      state.unaudited = payload
    }
  },
  actions: {
    GenerateRoutes({ commit }, routerIds) {
      return new Promise(resolve => {
        const allAsyncRouter = deepClone(asyncRouterMap)
        let accessedRouters = filterAsyncRouter(allAsyncRouter, routerIds)
        accessedRouters = filterAccessedRouters(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ROUTERIDS', routerIds)
        resolve()
      })
    }
  },
}
console.log(permission)
export default permission
