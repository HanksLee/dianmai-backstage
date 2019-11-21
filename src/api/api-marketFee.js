import service from './service-client'
import config from './config-client'
const root = config.api
export function commonRequest(name, data) {
	const requestName = {
		'marketshareList':'/v1_admin/marketshare/list',//分成明细
		'inviteprofitList':'/v1_admin/inviteprofit/list',//直客分成
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
