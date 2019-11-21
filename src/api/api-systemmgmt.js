import service from './service-client'
import config from './config-client'

const root = config.api

const requestName = {
	'smsTemplateList': '/v1_admin/smstemplate/list', // 消息模板列表
	'smsTemplateEdit': '/v1_admin/smstemplate/edit', // 编辑消息模板
	'smsTemplateTurn': '/v1_admin/smstemplate/turn', // 短信模板启用禁用
	'smstReset': '/v1_admin/smstemplate/reset', // 短信模板重置
	
	'smsChannelList': '/v1_admin/smschannel/list', // 短信通道列表
	'smsChannelType': '/v1_admin/smschannel/type', // 短信通道类型
	'smsChannelAdd': '/v1_admin/smschannel/add', // 短信通道添加
	'smsChannelEdit': '/v1_admin/smschannel/edit', // 短信通道编辑
	'smsChannelTurn': '/v1_admin/smschannel/turn', // 短信通道启用禁用
	'smsChannelTest': '/v1_admin/smschannel/test', // 短信测试
	
	'productList': '/v1_admin/product/list', // 产品管理列表
	'productAdd': '/v1_admin/product/add', // 产品管理添加
	'productEdit': '/v1_admin/product/edit', // 产品管理编辑
	'productDetail': '/v1_admin/product/detail', // 展开编辑窗口
	'productTurn': '/v1_admin/product/switch', // 产品管理启用禁用
	
	'stockInfoList': '/v1_admin/stockinfo/list', //股票列表
	'stockInfoEdit': '/v1_admin/stockinfo/edit', // 股票列表编辑
	'stockInfoAdd': '/v1_admin/stockinfo/add', // 股票列表编辑
	'marketType': '/v1/systype/markettype', // 股票交易市场
	
	'getSysList': '/v1_admin/broker/syslist', // 获取系统参数
	'SetSysParams': '/v1_admin/broker/sysset', // 设置系统参数

	'mymarketurl':'/v1/user/mymarketurl',//推广链接
	'qrimg':'/v1/user/qrimg',//生成二维码,
	
	'navList': '/v1_home/activenavigate/list', //APP首页-动态导航
	'order':'/v1_admin/broker/order',//订单列表
	'namelist':'/v1_admin/broker/namelist',//券商列表
	'logininfo':'/v1_admin/broker/logininfo',//获取详细
	'loginedit':'/v1_admin/broker/loginedit',//保存
	'smssendList':'/v1/systype/smssend', //短信列表
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