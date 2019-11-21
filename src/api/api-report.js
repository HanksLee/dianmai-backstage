import service from './service-client'
import config from './config-client'
const root = config.api
export function commonRequest(name, data) {
	const requestName = {
		'propertyList': '/v1_admin/customerfund/property', //资产报表
		'accountList': '/v1_admin/customerfund/account', //账户报表
		'earningList':'/v1_admin/customerfund/earning',//业绩报表
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