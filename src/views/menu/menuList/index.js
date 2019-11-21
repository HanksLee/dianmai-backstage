import { commonRequest } from '@/api/api-developer'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			menuList: [], // 菜单列表
			page: {}, //存放分页数据
			loading: false,
            emptyText: '数据加载中...',
			menuSubList: [], // 菜单子列表
			isDisplay: 'block', // 弹框中归属菜单是否显示
			menuDialogTitle: '', // 菜单列表弹窗标题
			operation_type: '', // 菜单列表操作类型
			operation_index: '', // 菜单列表弹窗下标
			menuDialogShow: false, // 菜单列表弹窗 默认关闭
			menuParams: { // 菜单列表参数
				id: '',
				menu_name: '',
				parent_id: '',
				sort: '',
			},
			menu_id: '', // 展开子菜单需要向list接口传menu_id

			url: '', // 接口变量
			id: '',
			expand: [],
			getRowKeys(row) {
				return row.id
			  },
		}
	},
	methods: {
		// 菜单列表操作
		operation(type, data, index) {
			this.operation_type = type
			this.operation_index = index
			this.menuDialogTitle = type === 'edit' ? '编辑菜单' : '新增菜单'
			if(type == 'edit') {
				this.menuDialogShow = true
				this.menuParams.id = data.id
				this.menuParams.menu_name = data.menu_name
				this.menuParams.sort = data.sort
				this.isDisplay = 'none'
			} else if(type == 'create') {
				this.menuDialogShow = true
				this.isDisplay = 'none'
				this.menuParams.parent_id = 0
				this.menuParams.menu_name = ''
				this.menuParams.sort = ''
			} else if(type == 'add') {
				this.menuDialogShow = true
				this.isDisplay = 'block'
				this.menuParams.id = data.id
				this.menuParams.parent_id = data.menu_name
				this.menuParams.menu_name = ''
				this.menuParams.sort = ''
			} else if(type == 'delete') { // 删除菜单列表
				this.name = data.menu_name
				this.$confirm('确定将 "' + this.name + '" 删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							commonRequest('deleteMenu', {
								id: data.id
							}).then(res => {
								if(res.code == '200') {
									this.$message(res.msg)
									done()
									this.getList()
								} else {
									res.msg = res.msg || '加载失败'
									this.$message(res.msg)
								}
							}, res => {
								this.$message(res.msg)
							})
						} else {
							done()
						}
					}
				})
			}
		},

		// 菜单列表提交
		menuSubmit() {
			const data = this.menuParams
			if(this.operation_type == 'create' || this.operation_type == 'add') {
				this.url = 'addMenu'
				if(this.operation_type == 'create') {
					commonRequest(this.url, {
						parent_id: data.parent_id,
						menu_name: data.menu_name,
						sort: data.sort
					}).then(res => {
						if(res.code == '200') {
							this.$message(res.msg)
							this.menuDialogShow = false
							this.getList()
						} else {
							this.$message(res.msg)
						}
					})
				} else {
					data.parent_id = data.id
					commonRequest(this.url, {
						parent_id: data.parent_id,
						menu_name: data.menu_name,
						sort: data.sort
					}).then(res => {
						if(res.code == '200') {
							this.$message(res.msg)
							this.menuDialogShow = false
							this.getList()
						} else {
							this.$message(res.msg)
						}
					})
				}
			} else {
				this.url = 'editMenu'
				commonRequest(this.url, {
					id: data.id,
					parent_id: data.parent_id,
					menu_name: data.menu_name,
					sort: data.sort
				}).then(res => {
					if(res.code == '200') {
						this.$message(res.msg)
						this.menuDialogShow = false
						this.getList()
					} else {
						this.$message(res.msg)
					}
				})
			}
		},

		// 获取菜单列表
		getList() {
			this.loading = true
			commonRequest('menuList', {
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.menuList = res.data.page_data
					this.page = res.data.page || {}
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			})
		},

		// 展开子菜单列表
		expandChange(row) {
			this.emptyText = '数据加载中...'
			this.expand = []
			this.menuSubList = []
			if(this.id === row.id){
              return
			}
			this.expand.push(row.id)
			this.id = row.id
			commonRequest('menuList', {
				menu_id: row.id,
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if(res.code == '200') {
					this.menuSubList = res.data.page_data
				} else {
					this.$message(res.msg)
				}
			})

		}
	},
	mounted() {
		this.getList()
	}
}