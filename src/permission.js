import router from './router'
import store from './store'
import Cookies from 'js-cookie'
// import { goToLogin } from '@/utils/user'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

// permissiom judge
function hasPermission(routerIds, route) {
	if(!route.routerId) {
		return true
	} else {
		if(routerIds.length > 0 && route) {
			return routerIds.indexOf(route.routerId) > -1
		} else {
			return false
		}
	}
}

// register global progress.
NProgress.configure({
	showSpinner: false
})
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
	NProgress.start() // 开启Progress
	const token_store = store.getters.token || ''
	const addRouters = store.getters.addRouters
	const token = Cookies.get('token') || ''
	if(token_store !== token) { // cookie和store值不一致，页面过期
		router.go(0)
		return
	}
	if(token) { // 判断用户是否登录
		if(to.path === '/login') {
			next({
				path: '/'
			})
		} else {
			if(addRouters.length === 0) {
				const userinfo = JSON.parse(localStorage.getItem("userinfo"))
				let routerIds = []
				if(userinfo){
					for(let i in userinfo.auth){
						routerIds.push(userinfo.auth[i])
					}
				}
				store.dispatch('GenerateRoutes', routerIds).then(() => { // 生成可访问的路由表
					router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
					console.log(to)
					next({ ...to
					}) // hack方法 确保addRoutes已完成
				})
				// commonRequest('myAuth').then(res => {
				//   if (res.code == 200) {
				//     const routerIds = res.data
				//     store.dispatch('GenerateRoutes', routerIds).then(() => { // 生成可访问的路由表
				//       router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
				//       next({ ...to }) // hack方法 确保addRoutes已完成
				//     })
				//   } else {
				//     goToLogin()
				//   }
				// })
			} else {
				// 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
				if(hasPermission(store.getters.routerIds, to)) {
					next()
				} else {
					next({
						path: '/401',
						query: {
							noGoBack: true
						}
					})
				}
			}
		}
	} else {
		if(whiteList.indexOf(to.path) !== -1) { // 在免登录页面，直接进入
			next()
		} else {
			next('/login') // 否则全部重定向到登录页
			NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
		}
	}
})

router.afterEach(() => {
	if(document.getElementById('app-loading')) {
		const load_node = document.getElementById('app-loading')
		load_node.parentNode.removeChild(load_node)
	}
	NProgress.done() // 结束Progress
})