const getters = {
  sidebar: state => state.app.sidebar, // 侧边栏展开收起
  visitedViews: state => state.app.visitedViews,
  permission_routers: state => state.permission.routers, // 路由
  unaudited: state => state.permission.unaudited, // 未处理信息
  addRouters: state => state.permission.addRouters,
  routerIds: state => state.permission.routerIds,
  token: state => state.user.token, // token
  userinfo: state => state.user.userinfo, // 用户信息
  bs: state => state.user.bs // 用户信息
}
export default getters
