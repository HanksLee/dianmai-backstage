// 去掉数组中的空元素
export function empty(arr) {
	for(let i = 0; i < arr.length; i++) {
		if(arr[i] === '' || arr[i] === null || arr[i] === undefined) {
			arr.splice(i, 1)
		}
	}
	return arr
}
/**
 * [清除掉首尾空格]
 */
export function trim(text) {
	if(text) {
		text = text + ''
		return text.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
	} else {
		return ''
	}
}
/**
 * [深复制]
 */
export function deepClone(source) {
	if(!source && typeof source !== 'object') {
		throw new Error('error arguments', 'shallowClone')
	}
	const targetObj = source.constructor === Array ? [] : {}
	for(const keys in source) {
		if(source.hasOwnProperty(keys)) {
			if(source[keys] && typeof source[keys] === 'object') {
				targetObj[keys] = source[keys].constructor === Array ? [] : {}
				targetObj[keys] = deepClone(source[keys])
			} else {
				targetObj[keys] = source[keys]
			}
		}
	}
	return targetObj
}
/**
 * [对象转数组]
 */
export function objectToArray(data) {
	if(data instanceof Array) {
		return data
	} else {
		if(data instanceof Object) {
			let data2 = [],
				i = 0
			for(const key in data) {
				data2[i] = data[key]
				i++
			}
			return data2
		} else {
			return []
		}
	}
}
/**
 * [判断对象是否为空]
 */
export function isEmptyObject(obj) {
	for(const name in obj) {
		return false　
	}
	return true
}
/**
 * [判断对象项数]
 */
export function objectKeyCount(obj) {
	var count = 0
	for(const name in obj) {
		count = count + 1
	}
	return count
}
/**
 * [时间格式化]
 */
export function formatTime(second) {
	if(second <= 0) {
		return({
			d: '00',
			h: '00',
			m: '00',
			s: '00'
		})
	}
	var d = Math.floor(second / (3600 * 24))
	d = d < 10 ? ('0' + d) : d
	var h = Math.floor((second - d * 3600 * 24) / 3600)
	h = h < 10 ? ('0' + h) : h
	var m = Math.floor((second - d * 3600 * 24 - h * 3600) / 60)
	m = m < 10 ? ('0' + m) : m
	var s = Math.floor(second - d * 3600 * 24 - h * 3600 - m * 60)
	s = s < 10 ? ('0' + s) : s

	return({
		d: d,
		h: h,
		m: m,
		s: s
	})
}
/**
 * [时间转字符串  format "yyyy-MM-dd hh:mm:ss"]
 */
export function formatDate(date, format) {
	if(!(date instanceof Date) && typeof(date) === 'number') {
		date = new Date(date)
	}
	const o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	}
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for(var k in o) {
		if(new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
		}
	}
	return format
}
/**
 * [创建唯一标识]
 */
export default function createUniqueString() {
	const timestamp = +new Date() + ''
	const randomNum = parseInt((1 + Math.random()) * 65536) + ''
	return(+(randomNum + timestamp)).toString(32)
}