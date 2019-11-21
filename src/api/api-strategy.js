import service from './service-client'
import config from './config-client'
const root = config.api
const requestName = {
  'policyHistoryList': '/v1_admin/policyhistory/list', // 结算订单列表
  'policyHistoryDetail': '/v1_admin/policyhistory/detail', // 结算订单-查看详情
  'orderbuyList':'/v1_admin/orderbuy/list',//持仓订单列表
  
  'searchStock': '/v1/stock/search', // 搜索股票名称/代码
  'searchName': '/v1_admin/customer/searchname', // 搜索客户姓名
  'getProductType': '/v1_admin/product/type', // 获取产品类型
  'getBalance': '/v1_admin/customer/balance', // 获取用户的可用余额
  'orderBuy': '/v1_admin/orderbuy/buy', // 买入开仓-提交
  'orderSell': '/v1_admin/orderbuy/sell', // 卖出平仓-提交
  'marketType': '/v1/systype/markettype', // 股票交易市场
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