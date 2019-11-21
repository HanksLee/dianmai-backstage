/**
 * Created by hb on 2017/6/9.
 * 
 * api2.aaclplus.com
api2.zbxq360.com
api2.nncyb-c.com
api.dianmai365.com
api.dianmai361.com
 */

const domain = document.domain
let api_root = 0
console.log(document.domain)
if (domain === 'localhost') {
  // 当前阶段测试环境使用以下接口地址
  api_root = 'http://api2.huataistock.com'
  // api_root = 'http://api.dianmai361.com'
} else if (domain === 'broker.aaclplus.com') {
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  api_root = '//api2.' + firstDomain
} else if (domain === 'broker.zbxq360.com') {
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  api_root = '//api2.' + firstDomain
} else if (domain === 'broker.nncyb-c.com') {
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  api_root = '//api2.' + firstDomain
}else if (domain === 'broker.dingmaohongsheng.com') {
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  api_root = '//api2.' + firstDomain
}else if (domain === 'broker_h6.dianmai365.com') {
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  api_root = '//api4.' + firstDomain
}else {
  const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
  api_root = '//api.' + firstDomain
}
module.exports = {
  api: api_root,
  timeout: 100000
}
