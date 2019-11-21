import service from './service-client'
import config from './config-client'
const root = config.api
const requestName = {
  'delayfeeList': '/v1_admin/delayfee/list',//递延明细
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
