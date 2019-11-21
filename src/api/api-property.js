import service from './service-client'
import config from './config-client'
const root = config.api
export function commonRequest(name, data) {
	const requestName = {
        'paychannelList':'/v1_admin/paychannel/list',//支付方式列表
		'addPaychannel':'/v1_admin/paychannel/add',//新增支付方式
		'editPaychannel':'/v1_admin/paychannel/edit',//编辑支付方式
		'detail':'/v1_admin/paychannel/detail',//编辑获取详情接口
		'switch':'/v1_admin/paychannel/switch',//启用禁用
		'moneytype':'/v1/systype/moneytype',//获取货币类型
		'paychanneltype':'/v1_admin/paychanneltype/type',//获取渠道类型
		
		'getDepositList':'/v1_admin/cashesin/list', // 入金管理列表
		'cashesoutList':'/v1_admin/cashesout/list',//出金列表
		'depositDetail': '/v1_admin/cashesin/detail', // 入金管理-查看详细
		'depositStatus': '/v1_admin/cashesin/status', // 入金管理 更改状态-显示
		'depositChange': '/v1_admin/cashesin/change', // 入金管理 更改状态-提交
		'getDepositPayTypes': '/v1_admin/cashesin/paychannels', // 入金管理 搜索栏-支付渠道搜索
		
		'getWithdrawList': '/v1_admin/cashesout/list', // 出金管理列表
		'withdrawDetail': '/v1_admin/cashesout/detail', // 出金管理-查看详情
		'withdrawStatus': '/v1_admin/cashesout/status', // 出金管理 划转登记-显示
		'withdrawChange':　'/v1_admin/cashesout/change', // 出金管理 划转登记-提交 // 
		'getWithdrawPayTypes': '/v1_admin/cashesout/paychannels', // 出金管理 搜索栏-支付渠道搜索
		'getBalanceList': '/v1_admin/balance/list', // 冲账管理-列表
		'getCusomersInfo': '/v1_admin/balance/customers', // 冲账管理-可选用户列表
		'addBalance': '/v1_admin/balance/add', // 冲账管理-添加
		'getBalanceDetail': '/v1_admin/balance/detail', // 冲账管理-详情
		'paychanneltypeForms':'/v1_admin/paychanneltype/forms',//动态输入框
		'currencyrateList':'/v1_admin/currencyrate/list',//汇率维护
		'currencyrateEdit':'/v1_admin/currencyrate/edit',//汇率维护更新
				'getInOut': '/v1_admin/currencyrate/inout', // 获取汇率数据
		'inOutEdit': '/v1_admin/currencyrate/in-out-edit', // 保存出入金汇率变更
		'getSysList': '/v1_admin/broker/syslist', // 获取系统参数

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
