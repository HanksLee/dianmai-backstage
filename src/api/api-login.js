import service from './service-client'
import config from './config-client'
import { getCookieUuid } from '@/utils/user'

const root = config.api
const uuid = getCookieUuid()
console.log(config.api)
/**
 * 登录验证码
 */
export function getLoginCode() {
  return root + '/v1/code/captcha?uuid='+uuid+'&t=' + new Date().getTime()
}

const requestName = {
  loginByUsername: '/v1/user/adminlogin',
  logout:'/v1/user/logout',
  changepwd:'/v1_admin/customer/changepwd'
}

// 统一的请求方法
export function commonRequest(name, data) {
  return new Promise((resolve, reject) => {
    service.post(root + requestName[name], data)
      .then(function(res) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
  })
}
