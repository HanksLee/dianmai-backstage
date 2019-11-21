import service from './service-client'
import config from './config-client'

const root = config.api

const requestName = {
  'menuList': '/v1_admin/menu/list', // 菜单管理
  'addMenu': '/v1_admin/menu/add', // 菜单-添加
	'editMenu': '/v1_admin/menu/edit', // 菜单-编辑
  'deleteMenu': '/v1_admin/menu/del', // 菜单-删除
  'permissionList': '/v1_admin/func/list', //路由-列表
  'addPermission': '/v1_admin/func/add', //路由-添加
  'delPermission': '/v1_admin/func/del', //路由-删除
  'editPermission': '/v1_admin/func/edit', //路由-编辑
  'modules': '/v1_admin/menu/modules', //获取模块下拉列表
  'listbymodule': '/v1_admin/menu/listbymodule', //获取菜单下拉列表
  'smsChannelTypeList': '/v1_admin/smschanneltype/list', // 短信设置
  'payChannelList': '/v1_admin/paychanneltype/list', // 获取支付通道列表
  'addPayChannelList': '/v1_admin/paychanneltype/add', // 添加支付通道
  'editPayChannelList': '/v1_admin/paychanneltype/edit', // 编辑支付通道
  'payCertifyType': '/v1/systype/paycrypt', // 支付认证方式
  'stdBanks': '/v1_admin/paychanneltype/stdbanks', // 标准银行编码
  
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
