import Cookies from 'js-cookie'
import store from '@/store'
import router from '@/router'
/**
 * [设置uid, white_user_id]
 */
export function setCookieUWID (uid, wid) {
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  const date = new Date()
  date.setTime(date.getTime() + 5 * 60 * 60 * 1000)
  Cookies.set('uid', uid, { expires: date, path: '/', domain: firstDomain })
  Cookies.set('wid', wid, { expires: date, path: '/', domain: firstDomain })
}
/**
 * [设置uuid]
 */
export function getCookieUuid() {
  let uuid = Cookies.get('uuid')
  if (uuid) {
    return uuid
  } else {
    uuid = new Date().getTime() + '_' + Math.random(1000)
  }
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  Cookies.set('uuid', uuid, { expires: 365, path: '/', domain: firstDomain })
  return uuid
}
/**
 *
 *
 */
export function setUserCookie(token) {
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  const date = new Date()
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000)
  store.commit('SET_LOGIN', token)
  Cookies.set('token', token, { expires: date, path: '/', domain: firstDomain })
}

/**
 *设置新消息标识
 */
export function setUserCookieBs(bs) {
  const date = new Date()
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000)
  store.commit('SET_BS', bs)
  Cookies.set('bs', bs, { expires: date })
}



/**
 * [清除用户登录cookie]
 */
export function clearUserCookie() {
  // debugger
  const domain = document.domain
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  localStorage.removeItem("userinfo")
  store.commit('ClLEAR_LOGIN')
  store.commit('CLEAR_ROUTER')
  store.commit('SET_USERINFO')
  Cookies.set('token', '', { path: '/', domain: firstDomain })
}
/**
 * [跳转登录页面]
 */
export function goToLogin() {
  // debugger
  clearUserCookie()
  router.push('/login')
}
