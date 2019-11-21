import service from './service-client.js'
import config from './config-client.js'

const root = config.api

const requestName = {
	'couponGrantList': '/v1_admin/coupongrant/list', // 红包发放列表
	'addCouponGrant': '/v1_admin/coupongrant/add', // 红包发放添加
	'editCouponGrant': '/v1_admin/coupongrant/edit', // 红包发放编辑
	'producttype':'/v1/systype/producttype',//适应产品
	
	'customerCouponList': '/v1_admin/customercoupon/list', // 红包领取列表
}

// 统一的请求方法
export function commonRequest(name, data) {
	return new Promise((resolve, reject) => {
		service.post(root + requestName[name], data)
		  .then(res => {
			if(res.status == '200') {
				resolve(res.data)
			} else {
				reject(res.data)
			}
		})
	})
}
