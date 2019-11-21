import service from './service-client'
import config from './config-client'
const root = config.api
export function commonRequest(name, data) {
	const requestName = {
		'seoList':'/v1_admin/seoconfig/list',//seo数据
		'fileup':'/v1/upload/fileup',//图片上传
		'edit':'/v1_admin/seoconfig/edit',//保存
		'addContenttype':'/v1_admin/contenttype/add',//新增内容分类
		'contenttypeList':'/v1_admin/contenttype/list',//内容分类列表
		'contenttypeEdit':'/v1_admin/contenttype/edit',//内容分类编辑
		'delContenttype':'/v1_admin/contenttype/del',//内容分类列表删除
		'contentList':'/v1_admin/content/list',//内容列表
		'typelist':'/v1_admin/contenttype/typelist', //获取分类类型
		'editContent':'/v1_admin/content/edit', //内容列表编辑
		'addContent':'/v1_admin/content/add', //内容列表添加
		'delContent':'/v1_admin/content/del',//内容列表删除
		'uploadImage':'/v1/upload/image',
		
			
		
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
