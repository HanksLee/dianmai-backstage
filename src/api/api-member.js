import service from './service-client'
import config from './config-client'
const root = config.api
const requestName = {
  'organList':'/v1_admin/organ/list',//机构列表
  'organAdd':'/v1_admin/organ/add',//新增机构
  'marketspread':'/v1_admin/organ/marketspread',//获取推广分成
  'organEdit': '/v1_admin/organ/edit',//编辑机构
  // 'organAuthorization': '/v1_admin/func/organ',//机构授权获取权限列表
  // 'organSetrole':'/v1_admin/organ/setrole',//机构授权提交
  'whitelist': '/v1_admin/broker/list',//机构管理
  // 'paymentList': '/v1_admin/paychanneltype/type',//支付通道
  'paymentList':'/v1_admin/paychanneltype/typeall',//支付通道
  'brokerAdd':'/v1_admin/broker/add',//经纪商添加
  'brokerEdit':'/v1_admin/broker/edit',//经纪商编辑
  // 'brokerAuthorization':'/v1_admin/func/broker',//经纪商授权
  // 'brokerSetrole':'/v1_admin/broker/setrole',//经纪商授权提交
  'brokerRedirectlogin':'/v1_admin/broker/redirectlogin',//经纪商、机构跳转
  'getSysList': '/v1_admin/broker/syslist', // 获取系统参数
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
