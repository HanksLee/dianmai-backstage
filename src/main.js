import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import './permission' // 权限

Vue.use(ElementUI)
Vue.prototype.$message = function(message, type, duration) {
	type = type || 'info'
	duration = duration || 3000
	ElementUI.Message({
		message: message,
		type: type,
		duration: duration
	})
}

window.$message = Vue.prototype.$message

Vue.config.productionTip = false
// 全局权限控制
Vue.prototype.globalPermission = function(val) {
	const routerIds = store.getters.routerIds
	if(routerIds.indexOf(val) > -1) {
		return true
	} else {
		return false
	}
}
//全局弹框放大缩小方法
Vue.prototype.zoomFn = function(type) {
	let target = event.srcElement || event.target,
		dialog = event.srcElement.parentNode.parentNode.parentNode.parentNode
	dialog.style.transition = 'width .7s'
	if(type === 'enlarge') {
		dialog.style.width = "100%"
	} else {
		dialog.style.width = "980px"
	}
}
// 共用时间组件数据
Vue.prototype.timeData = function(val) {
	val = {
		shortcuts: [{
			text: '今天',
			onClick(picker) {
				const end = new Date()
				const date = new Date()
				picker.$emit('pick', [end, date])
			}
		}, {
			text: '昨天',
			onClick(picker) {
				const date = new Date()
				date.setTime(date.getTime() - 3600 * 1000 * 24)
				picker.$emit('pick', [date, date])
			}
		}, {
			text: '最近一周',
			onClick(picker) {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
				picker.$emit('pick', [start, end])
			}
		}, {
			text: '最近一个月',
			onClick(picker) {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
				picker.$emit('pick', [start, end])
			}
		}, {
			text: '当月',
			onClick(picker) {
				const end = new Date()
				const start = new Date()
				const d = end.getDate()
				const m = end.getMonth() + 1
				var dd = ''
				if(m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) {
					dd = d - 1
				} else if(m === 2) {
					dd = d + 2
				} else if(m === 4 || m === 6 || m === 9 || m === 11) {
					dd = d
				}
				start.setTime(start.getTime() - 3600 * 1000 * 24 * (d - 1))
				end.setTime(end.getTime() + 3600 * 1000 * 24 * (30 - dd))
				picker.$emit('pick', [start, end])
			}
		}, {
			text: '上月',
			onClick(picker) {
				const end = new Date()
				const start = new Date()
				const d = end.getDate()
				const m = end.getMonth() + 1
				var dy = ''
				var sy = ''
				if(m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) {
					dy = d - 1
					sy = 31
				} else if(m === 2) {
					dy = d + 2
					sy = 28
				} else if(m === 4 || m === 6 || m === 9 || m === 11) {
					dy = d
					sy = 30
				}
				start.setTime(start.getTime() - 3600 * 1000 * 24 * (d + sy))
				end.setTime(end.getTime() + 3600 * 1000 * 24 * (30 - dy - sy))
				picker.$emit('pick', [start, end])
			}
		}]
	}
	return val
}
//excel导出全局处理
Vue.prototype.exportExcel = function(title, nameData, fieldData, listData) {
	require.ensure([], () => {
		const {
			export_json_to_excel
		} = require('vendor/Export2Excel')
		const tHeader = nameData
		const filterVal = fieldData
		const list = listData
		const data = this.formatJsonExport(filterVal, list)
		export_json_to_excel(tHeader, data, '' + title + '报表excel')
	})
}
//excel导出全局处理
Vue.prototype.formatJsonExport = function(filterVal, jsonData) {
	return jsonData.map(v => filterVal.map(j => {
		if(j === 'timestamp') {
			return parseTime(v[j])
		} else {
			return v[j]
		}
	}))
}
//时间格式全局处理
Vue.prototype.timeFormatFn = function(dateData){
    let year1,month1,day1,year2,month2,day2,
        dataTime = {active_start_time: '',active_end_time: ''}
        console.log(dateData)
    if(dateData.length === 0) {
      return
    }
    year1 = dateData[0].getFullYear()
    month1 = dateData[0].getMonth()
    day1 = dateData[0].getDate()
    month1 = (month1 + 1) < 10 ? '0' + (month1 + 1) : (month1 + 1)
    day1 = day1 < 10 ? '0' + day1 : day1

	year2 = dateData[1].getFullYear()
	month2 = dateData[1].getMonth()
	day2 = dateData[1].getDate()
	month2 = (month2 + 1) < 10 ? '0' + (month2 + 1) : (month2 + 1)
	day2 = day2 < 10 ? '0' + day2 : day2
	dataTime.active_start_time = year1 + '-' + month1 + '-' + day1
	dataTime.active_end_time = year2 + '-' + month2 + '-' + day2
	return dataTime
}
//获取域名隐藏
Vue.prototype.domainFn = function(){
	const domain = document.domain
	const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
	if(firstDomain == 'dingmaohongsheng.com'){
        return true
	}else{
		return false
	}
}

//数字格式化保留两位小数
Vue.filter('numberFormat', function(val) {
	let num = Math.round(Number(val) * 100) / 100
	return Number(num)
})
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})