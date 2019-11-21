import service from './service-client'
import config from './config-client'
const root = config.api
const requestName = {
  'customerList': '/v1_admin/customer/list',//客户列表
  'banner':'/v1_admin/customer/banner',//启用禁用
  'resetpassword':'/v1_admin/customer/resetpassword',//重置密码
  'changefee':'/v1_admin/customer/changefee',//费用调整
  'addCustomer':'/v1_admin/customer/add',//添加客户
  'editinfo':'/v1_admin/customer/editinfo',//编辑资料
  'delCustomer':'/v1_admin/customer/del',//删除客户
  'useradminLists':'/v1_admin/useradmin/uplist',//获取归属数据列表
  'belong':'/v1_admin/customer/belong',//分配归属
  'realNameList':'/v1_admin/customercertify/list',//实名列表
  'realNameAudit':'/v1_admin/customercertify/audit',//实名认证审核
  'agentcheckList':'/v1_admin/agentcheck/list',//经纪人申请 
  'agentcheck':'/v1_admin/agentcheck/audit',//经纪人申请审核
  'userfilter':'/v1/systype/userfilter',//用户筛选
  'nextuser':'/v1/systype/nextuser',//用户筛选列表点击
  'searchuser':'/v1/systype/searchuser',//用户筛选搜索
  'changewallet':'/v1_admin/customer/changewallet',//调整余额
  'detail':'/v1_admin/customer/detail',//详细信息
  'sysaddfee':'/v1_admin/broker/sysaddfee',//加收分成上限
  
  'picUpload': '/v1/upload/fileup', // 上传证件
  'parentchange':'/v1_admin/customer/parentchange',//移交归属提交
  usercheck:'/v1_admin/customer/usercheck',//查看敏感信息

 
  
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
