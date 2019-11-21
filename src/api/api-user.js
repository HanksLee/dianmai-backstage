import service from './service-client'
import config from './config-client'
const root = config.api
export function commonRequest(name, data) {
	const requestName = {
		'roleList': '/v1_admin/role/list', //角色列表
		'addRole': '/v1_admin/role/add', //新增角色
		'editRole': '/v1_admin/role/edit', //编辑角色
		'delRole': '/v1_admin/role/del', //删除角色
		'jurisdiction': '/v1_admin/role/zone', //授权获取权限列表
		'organlist': '/v1_admin/useradmin/organlist', //机构列表
		'userList': '/v1_admin/useradmin/list', //用户列表
		'getusertree': '/v1_admin/useradmin/next', // 获取用户树 
		'searchname': '/v1_admin/useradmin/searchname', //新增用户姓名搜索	
		'addUser': '/v1_admin/useradmin/add', //用户添加
		'uplist': '/v1_admin/useradmin/uplist', //归属搜索
		'roleAuthority': '/v1_admin/useradmin/rolelist', //获取角色列表,权限范围
		'setrole': '/v1_admin/useradmin/setrole', //分配角色提交
		'marketdiv': '/v1_admin/useradmin/marketdiv', //分成
		'userTurn': '/v1_admin/useradmin/turn', //用户启用禁用
		'setroleRole': '/v1_admin/role/setrole', //角色授权提交
		'next': '/v1_admin/useradmin/next', //获取下级

		'policyHistoryDetail': '/v1_admin/policyhistory/detail', // 结算订单-查看详情
		'orderbuyDetail': '/v1_admin/orderbuy/detail', // 持仓订单-查看详情
		'orderbuydeal': '/v1_admin/orderbuy/deal', //成交详细
		'marketshareDetail': '/v1_admin/marketshare/detail', //IB分成查看详情
		'inviteprofitDetail': '/v1_admin/inviteprofit/detail', //直客分成查看详情
		'delayfeeDetail': '/v1_admin/delayfee/detail', //递延明细详情
		'delayTypeDetail': '/v1_admin/orderbuy/typedetail', // 明细列表分页查询
		'warningDetail': '/v1_admin/warning/detail', // 操作资金预警-查看详情

		'organAuthorization': '/v1_admin/func/organ', //机构授权获取权限列表
		'organSetrole': '/v1_admin/organ/setrole', //机构授权提交
		'brokerAuthorization': '/v1_admin/func/broker', //经纪商授权
		'brokerSetrole': '/v1_admin/broker/setrole', //经纪商授权提交
		'redirectlogin': '/v1_admin/useradmin/redirectlogin', //跳转

	}
	return new Promise((resolve, reject) => {
		service.post(root + requestName[name], data)
			.then(function(res) {
				if(res.status === 200) {
					resolve(res.data)
				} else {
					reject(res.data)
				}
			})
	})
}