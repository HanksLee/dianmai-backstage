import Cookies from 'js-cookie'

/*
 * [get from localStorage]
 */
export function fetchFromLocal(key) {
  if (Storage) {
    try {
      return window.localStorage.getItem(key)
    } catch (e) {
      return null
    }
  }
}
/*
 * [set localStorage]
 */
export function saveToLocal(key, val) {
  if (Storage) {
    try {
      window.localStorage.setItem(key, val)
      return true
    } catch (e) {
      return false
    }
  }
}
/*
 * [remove from localStorage]
 */
export function removeFromLocal(key) {
  if (Storage) {
    try {
      return window.localStorage.getItem(key)
    } catch (e) {
      return null
    }
  }
}
/*
 * [从cookie取数据]
 */
export function getCookie(key) {
  return Cookies.get(key)
}
/*
 * [设置cookie]
 */
export function setCookie(key, val, expires, path) {
  return Cookies.set(key, val)
}
