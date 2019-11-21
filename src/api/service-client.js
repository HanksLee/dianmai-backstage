import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import config from './config-client'
import Cookies from 'js-cookie'
import store from '@/store'
import router from '@/router'
import { setUserCookie, goToLogin, getCookieUuid } from '@/utils/user'

//axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
  return config
}, () => {
  return Promise.resolve({
    status: 500,
    data: null
  })
})

axios.interceptors.response.use(response => {
  // response.data.data == undefined || response.data.data == [] || response.data.data == '' && response.data.code != '200'
  if (response.data && response.data.code === 999) {
    goToLogin()
  } else {
    return {
      status: 200,
      data: response.data
    }
  }
}, error => {
  console.log(error)
  let message = '服务器开小差了……'
  if (error.message === 'Network Error') {
    message = '网络异常……'
  } else if (error.message.indexOf('timeout') > -1) {
    message = '请求超时……'
  }
  window.$message(message)
  return Promise.resolve({
    status: 500,
    message: message,
    data: null
  })
})
export default {
  async post(url, data, silent) {
    const token_store = store.getters.token || ''
    const uuid = getCookieUuid()
    let token = Cookies.get('token') || ''
    data = data || {}
    data.language = Cookies.get('language') || 'zh-CN'
    data.token = token
    //data.token = data.token.replace(/\+/g,"%2B")
    data.uuid = uuid
    if (token_store !== data.token && !data.isLoginAjax) {
      router.go(0)
      return { msg: '检测到账号有变化' }
    } else {
      const conf = {
        method: 'post',
        url: url,
        data: qs.stringify(data),
        timeout: config.timeout,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
      if (silent) {
        conf.silent = true
      }
      // 延迟登录时间
      token = Cookies.get('token') || ''
      if (token) {
        setUserCookie(token)
      }
      const res = await axios(conf)
      return res
    }
  },

  async get(url, data, silent) {
    const token_store = store.getters.token || ''
    const uuid = getCookieUuid()
    let token = Cookies.get('token') || ''
    data = data || {}
    data.language = Cookies.get('language') || 'zh-CN'
    data.token = token
    data.uuid = uuid
    if (token_store !== data.token && !data.isLoginAjax) {
      router.go(0)
      return { msg: '检测到账号有变化' }
    } else {
      const conf = {
        method: 'get',
        url: url,
        data,
        timeout: config.timeout
      }
      if (silent) {
        conf.silent = true
      }
      // 延迟登录时间
      token = Cookies.get('token') || ''
      if (token) {
        setUserCookie(token)
      }
      const res = await axios(conf)
      return res
    }
  }
}
