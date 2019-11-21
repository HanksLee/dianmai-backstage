import service from './service-client'
import config from './config-client'

const root = config.api

const requestName = {
  permissionList: '/index.php?r=admin/fun/list', // 权限列表
  savePermission: '/index.php?r=admin/fun/add', // 新增、编辑权限
  module_page: '/index.php?r=admin/menu/list', // 模块栏目列表
  deletePermission: '/index.php?r=admin/fun/delete',// 删除权限
  whiteInfo: '/index.php?r=admin/admin/whiteinfo',
  whitelist: '/index.php?r=admin/admin/whitelist',//机构管理
  whiteadd: '/index.php?r=admin/admin/whiteadd',//新增机构
  whiteedit: '/index.php?r=admin/admin/whiteedit',//编辑机构
  whiteset: '/index.php?r=admin/admin/whiteset',//机构授权
  jumpLogin: '/index.php?r=admin/passport/login',//跳转登录
  getChanneltype: '/index.php?r=admin/notify/channeltype',//获取cloud通道列表
  addEmailChannel: '/index.php?r=admin/notify/emailsave',
  editEmailChannel: '/index.php?r=admin/notify/emailedit',
  crmchannel: '/admin/admin/crmchannel',//渠道商选择列表
  paytypelist:'/admin/admin/paytypelist',//支付方式选择列表
  lockwhitelabel:'/admin/admin/lockwhitelabel',//解锁锁定接口
  brokerreport:'/admin/admin/brokerreport'//业绩报表
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

//机构跳转登录
export function toLoginRequest(root, data) {
  return new Promise((resolve, reject) => {
    service.post(root + '/index.php?r=admin/passport/login', data)
      .then(function(res) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
  })
}