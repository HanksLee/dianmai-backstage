import service from './service-client'
import config from './config-client'

const root = config.api

const requestName = {
	'riskStockList': '/v1_admin/riskstock/list', // 股票管理列表 默认全部
	'riskStockAdd': '/v1_admin/riskstock/add', // 股票下架
	'riskStockDel': '/v1_admin/riskstock/del', // 股票上架 
	'marketType': '/v1/systype/markettype', // 股票交易市场
	
	'getWithdrawList': '/v1_admin/withdraw/list', // 提现申请-列表
	'withdrawDetail': '/v1_admin/withdraw/detail', // 提现申请-详细
	'withdrawStatus': '/v1_admin/withdraw/status', // 提现申请-查看
	'withdrawCheck': '/v1_admin/withdraw/change', // 提现申请-审核
	
	'positionList': '/v1_admin/position/list', // 头寸管理-列表
	'warningList': '/v1_admin/warning/list', // 操作资金预警-列表
	'historySearch': '/v1_admin/warning/history', // 操作资金预警-历史查询
	
	'searchStock': '/v1/stock/search', // 搜索股票名称/代码
	'stockMarginList': '/v1_admin/stockmargin/list', // 商家销售股票-列表
	'stockMarginAdd': '/v1_admin/stockmargin/add', // 商家销售股票-新增
	'stockMarginEdit': '/v1_admin/stockmargin/edit', // 商家销售股票-编辑
	'stockMarginDel': '/v1_admin/stockmargin/del', // 商家销售股票-删除
	'marketList': '/v1_admin/market/list', // 获取市场列表
  'marketQuote': '/v1_admin/market/quote', // 获取对应行情
  'riskInfo': '/v1_admin/abnormal/risk', // 风控异常信息
  'delayInfo': '/v1_admin/abnormal/delay' // 递延费异常信息
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

// Get
export function requestGet(name, data) {
  return new Promise((resolve, reject) => {
    service.get(root + requestName[name], data)
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      })
  })
}
