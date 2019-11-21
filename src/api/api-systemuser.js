import service from './service-client'
import config from './config-client'

const root = config.api

const requestName = {
  permissionList: '/index.php?r=admin/fun/list', // 权限列表
  savePermission: '/index.php?r=admin/fun/add', // 新增、编辑权限
  module_page: '/index.php?r=admin/menu/list', // 模块栏目列表
  deletePermission: '/index.php?r=admin/fun/delete', // 删除权限
  roleInfo: '/index.php?r=admin/role/info', // 某个角色权限接口
  roleSet: '/index.php?r=admin/role/set', // 角色授权 @param {[type]} [func_ids] [权限id 多个用 逗号 隔开]
  getRoleList: '/index.php?r=admin/role/list', // 角色列表
  choserolelist:'/index.php?r=admin/role/choserolelist', // 管理员角色列表
  addRole: '/index.php?r=admin/role/add', // 添加角色 @param {[type]} [role_name] [角色名称]
  deleteRole: '/index.php?r=admin/role/delete', // 删除角色 @param {[type]} [id] [角色id]
  getAdminList: '/index.php?r=admin/admin/list', // 管理员列表
  resetPassword: '/index.php?r=admin/admin/resetpassword', // * 更改密码 @param {[type]} [user_id] [用户id] @param {[type]} [pwd] [新密码]
  deleteAdmin: '/index.php?r=admin/admin/delete', // 删除 @param {[type]} [user_id] [用户id]
  assignRoleToAdmin: '/index.php?r=admin/admin/setrole', // 分配角色 @param {[type]} [user_id] [用户id] @param {[type]} [role_ids] [角色id]
  start_forbidden: '/index.php?r=admin/admin/disable', // 禁用、启用 @param {[type]} [user_id] [用户id] @param {[type]} [delete_flag] [状态（0=》启用，2=》禁用]
  myUserSearch :'/index.php?r=admin/user/myusers' //用户自动搜索
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
