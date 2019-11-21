import { commonRequest } from '@/api/api-developer'
import paging from 'components/paging/index.vue'
export default {
	components: {
		paging
	},
	data() {
		return {
			list: [],
			page: {},//存放分页数据
			keyword: '',
			emptyText: '正在加载...',
			edit_title: '',
			edit_dialog_show: false,
			url: '',
			id: '',
			permission: {
				func: '',
				module: '',
				page: '',
				func_name: ''
			},
			loading: false,
			menuList: [],
			pageList: []
		}
	},
	methods: {
		//获取列表
        getList(){
			this.loading = true
			commonRequest('permissionList',{
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
				keyword: this.keyword
			}).then(res=>{
				this.loading = false
				if(res.code == '200'){
					this.list = res.data.page_data
					this.page = res.data.page || {}
                  	this.emptyText = '暂无数据'
				}else{
					this.emptyText = res.msg
				}
			}).catch(error =>{
				this.loading = false
			  })
		},
		//分页下拉选择
		handleSizeChange(val) {
			this.page_size = val
			this.getList() 
			scrollTo(0, 0)
		},
		//分页上下页
		handleCurrentChange(val) {
			this.page_no = val
			this.getList()
			scrollTo(0, 0)
		},
		//添加路由
        add(){
			this.edit_dialog_show = true
			this.edit_title = '新增权限'
			this.url = 'addPermission'
			this.id = ''
            for(let i in this.permission){
				this.permission[i] = ''
			}
			this.getModules()
		},
		//编辑路由
		edit(row){
			console.log(row)
			this.edit_dialog_show = true
			this.edit_title = '编辑权限'
			this.url = 'editPermission'
			this.permission.func = row.func
			this.permission.module = row.module
			this.permission.page = row.page
			this.permission.func_name = row.func_name
			this.id = row.id
			this.getModules()
			this.getListbymodule(row.module)
		},
		//添加-编辑路由提交
        submitPermission(){
			if(this.permission.func === '') {
				this.$message('路由不能为空')
				return false
			}
			if(this.permission.module === '') {
				this.$message('模块不能为空')
				return false
			}
			if(this.permission.page === '') {
				this.$message('页面不能为空')
				return false
			}
			this.loading = true
            commonRequest(this.url,{
				func: this.permission.func,
				module: this.permission.module,
				page: this.permission.page,
				func_name: this.permission.func_name,
				id: this.id 
			}).then(res=>{
				if(res.code == '200'){
					this.$message(res.msg)
					this.getList()
					this.edit_dialog_show = false
					this.loading = false
				}else{
					
					this.loading = false
					this.$message(res.msg)  
				}
			}).catch(error => {
				this.loading = false
			})
		},
		//删除路由
		del(row){
			this.$confirm('确定将"' + row.func + '"路由删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				beforeClose: (action, instance, done) => {
					if(action === 'confirm') {
						commonRequest('delPermission',{
							id: row.id
						}).then( res =>{
							if(res.code == '200'){
							   done()
							   this.$message(res.msg)
							   this.getList()
							}else{
								this.$message(res.msg)
							}
						})
					} else {
						done()
					}
				}
			})
		},
		//获取模块下拉列表
		getModules(){
			commonRequest('modules').then(res =>{
				if(res.code == '200'){
                    this.menuList = res.data
				}else{
					this.$message(res.msg)
				}
			})
		},
		//选择模块
		changeMoudle(val){
			this.getListbymodule(val)
		},
		//获取菜单下拉列表
		getListbymodule(val){
            commonRequest('listbymodule',{
				module_id: val
			}).then(res =>{
				if(res.code == '200'){
                    this.pageList = res.data
				}else{
					this.$message(res.msg)
				}
			}) 
		},
		//搜索
		search(){
			this.getList()
		}
		// getPermissionList() {
		// 	commonRequest('permissionList', {
		// 		page_size: this.page_size,
		// 		page_no: this.page_no,
		// 		keyword: trim(this.keyword)
		// 	}).then(res => {
		// 		if(res.code === 200) {
		// 			if(res.data) {
		// 				this.list_total = parseInt(0 + res.data.page.total)
		// 				this.list = res.data.page_data || []
		// 				if(this.list.length === 0) {
		// 					this.emptyText = '暂无数据'
		// 				}
		// 			} else {
		// 				this.emptyText = '暂无数据'
		// 			}
		// 		} else {
		// 			res.msg = res.msg || '加载失败，请重试'
		// 			this.$message(res.msg)
		// 		}
		// 	})
		// },
		// handleSizeChange(val) {
		// 	this.page_size = parseInt(val)
		// 	this.page_no = 1
		// 	this.getPermissionList()
		// 	scrollTo(0, 0)
		// },
		// pageChange(page_no) {
		// 	this.page_no = page_no
		// 	this.getPermissionList()
		// 	scrollTo(0, 0)
		// },
		// search() {
		// 	this.page_no = 1
		// 	this.getPermissionList()
		// },
		// enterKeySearch(event) {
		// 	if(event.keyCode === 13) {
		// 		this.search()
		// 	}
		// },
		// editPermission(type, data, index) {
		// 	data = data || {
		// 		module: '',
		// 		page: '',
		// 		func: '',
		// 		intro: '',
		// 		white_user_allow: 0,
		// 		agent_allow: 0,
		// 		agent_allow_default: 0
		// 	}
		// 	this.edit_type = type
		// 	this.permission = deepClone(data)
		// 	this.edit_index = index
		// 	this.edit_title = type === 'edit' ? '编辑权限' : '新增权限'
		// 	this.edit_dialog_show = true
		// 	this.permission.initData = true
		// 	if(type == 'edit') {
		// 		for(const item in this.menuList) {
		// 			if(this.menuList[item].id == this.permission.module) {
		// 				this.pageList = this.menuList[item].data
		// 			}
		// 		}
		// 	}
		// },
		// submitPermission() {
		// 	const data = this.permission
		// 	data.func = trim(data.func || '')
		// 	data.intro = trim(data.intro || '')
		// 	if(data.func === '') {
		// 		this.$message('路由不能为空')
		// 		return false
		// 	}
		// 	if(data.module === '') {
		// 		this.$message('模块不能为空')
		// 		return false
		// 	}
		// 	if(data.intro === '') {
		// 		this.$message('说明不能为空')
		// 		return false
		// 	}
		// 	this.saving = true
		// 	commonRequest('savePermission', data).then(res => {
		// 		this.saving = false
		// 		if(res.code === 200) {
		// 			if(this.edit_type === 'create') {
		// 				this.addToTable(res.data)
		// 			} else {
		// 				this.editTable(res.data)
		// 			}
		// 			this.edit_dialog_show = false
		// 		} else {
		// 			res.msg = res.msg || '提交失败'
		// 			this.$message(res.msg)
		// 		}
		// 	}, () => {
		// 		this.saving = false
		// 	})
		// },
		// addToTable(data) {
		// 	this.list.unshift(data)
		// },
		// editTable(data) {
		// 	// this.list[this.edit_index] = data
		// 	data.agent_allow = '' + data.agent_allow
		// 	data.agent_allow_default = '' + data.agent_allow_default
		// 	data.white_user_allow = '' + data.white_user_allow
		// 	this.$set(this.list, this.edit_index, data)
		// },
		// delPermission(perm) {
		// 	const func = perm.func
		// 	this.$confirm('是否删除路由为“' + func + '”的权限?', '提示', {
		// 		confirmButtonText: '确定',
		// 		cancelButtonText: '取消',
		// 		type: 'warning',
		// 		beforeClose: (action, instance, done) => {
		// 			if(action === 'confirm') {
		// 				const data = {
		// 					id: perm.id
		// 				}
		// 				commonRequest('deletePermission', data).then(res => {
		// 					if(res.code === 200) {
		// 						this.getPermissionList()
		// 						done()
		// 					} else {
		// 						res.msg = res.msg || '删除失败'
		// 						this.$message(res.msg)
		// 					}
		// 				}, () => {})
		// 			} else {
		// 				done()
		// 			}
		// 		}
		// 	})
		// },
		// getMenu() {
		// 	commonRequest('module_page').then(res => {
		// 		if(res.code === 200) {
		// 			this.menuList = res.data
		// 			for(const key in this.menuList) {
		// 				this.pageList = this.menuList[key].data
		// 				break
		// 			}
		// 		}
		// 	})
		// },
		// changeMoudle(val) {
		// 	for(const item in this.menuList) {
		// 		if(this.menuList[item].id == val) {
		// 			this.pageList = this.menuList[item].data
		// 			if(!this.permission.initData) {
		// 				this.permission.page = ''
		// 			} else {
		// 				this.permission.initData = false
		// 			}
		// 			break
		// 		}
		// 	}
		// }
	},
	mounted() {
		this.getList()
	}
}