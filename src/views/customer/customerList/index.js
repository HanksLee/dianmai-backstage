import { commonRequest } from "@/api/api-customer"
import userScreening from 'components/userScreening/index.vue'
import detailedFrame from 'components/detailedFrame/index.vue'
import customerFrame from 'components/customerFrame/index.vue'
import paging from 'components/paging/index.vue'
import { trim } from '@/utils/data'
export default {
	components: {
		userScreening,
		detailedFrame,
		customerFrame,
		paging
	},
	data() {
		return {
			id: '',
			loading: false,
			page: {}, //存放分页数据
			emptyText: '数据加载中...',
			checkTime: [],
			pickerOptions1: this.timeData(),
			screenOptions: [{
				label: '姓名',
				value: '1'
			}, {
				label: '手机号',
				value: '2'
			}, {
				label: '客户编码',
				value: '6'
			}],
			screenValue: '1',
			title: '',
			dialogVisible: false,
			superiorData: [],
			url: '',
			addUser: {
				id: '',
				card_id: '',
				demo_flag: '0',
				real_name: '',
				email: '',
				mobile: '',
				password: '',
				parent_id: '',
				parent_name: '',
				id_certify_flag: '0',
				province: '',
				img_1: '',
				img_2: '',
				img_name1: '',
				img_name2: '',
				showToast1: true,
				showToast2: true,
				toastTaxt1: '请上传身份证正面照片',
				toastTaxt2: '请上传身份证反面照片',
			},
			hide: true, //控制编辑隐藏真实模拟
			disabled: false, //控制编辑归属不可更改

			keyword: '',
			list: [],
			form2: {
				pwd: '',
				name: '',
				id: '',
			},
			recentLanding: true,
			sharesTf: false,
			isActive: true,
			dialogFormVisible3: false,
			dialogFormVisible4: false,

			//调整费用
			costForm: {
				chargeAndCharge: '',
				sellingFee: '',
				deferredCharge: '',
				technicalManagementFee: '',
				id: ''
			},
			id: '',
			parent_id: '',
			balanceBox: false,
			mobile: '',
			real_name: '',
			real_wallet: '',
			demo_wallet: '',
			name: '',
			sysaddfeeData: {}, // 调整费用
			//移交划转
			moveCustomer: {
				show: false,
				real_name: '',
				parent_name: '',
				name: '',
				move_self: 1,
				parent_id: ''
			},
			//			status: null,
			//			options4: [
			//				{
			//					value: '',
			//					label: '全部'
			//				},
			//				{
			//					value: '0',
			//					label: '正常'
			//				},
			//				{
			//					value: '1',
			//					label: '禁用'
			//				},
			//				{
			//					value: '2',
			//					label: '只读'
			//				}
			//			],
		}
	},
	filters: {
		lastLoginTime(val) {
			if(val) {
				const val_split = val.split(' ')
				const day = val_split[0].split('-')
				const time = val_split[1].split(':')
				const time_ms = new Date(day[0], day[1] - 1, day[2], time[0], time[1], time[2]).getTime()
				const time_ms_now = new Date().getTime()
				const d_time = Math.floor((time_ms_now - time_ms) / 86400000)
				if(d_time < 1) {
					const d_hour = Math.floor((time_ms_now - time_ms) / 86400000 * 24)
					return d_hour + '小时前'
				} else {
					return d_time + '天前'
				}
			}
		},
		attributionFiltering(val) {
			let nameArr = val.split('/')
			let name = nameArr[nameArr.length - 1]
			nameArr.splice(nameArr.length - 1, 1)
			let nameArr1 = nameArr.join('/')
			return name
		},
		filter_the_superior(val) {
			let nameArr = val.split('/')
			nameArr.splice(nameArr.length - 1, 1)
			let name = nameArr.join('/')
			return name
		}
	},
	// computed: mapGetters([
	// 	'userinfo'
	// ]),
	methods: {
		//添加客户
		add() {
			this.title = "新增客户"
			this.dialogVisible = true
			this.hide = true
			this.disabled = false
			this.url = 'addCustomer'
			for(let i in this.addUser) {
				this.addUser[i] = ''
			}
			this.addUser.showToast1 = true
			this.addUser.showToast2 = true
			this.addUser.toastTaxt1 = '请上传身份证正面照片'
			this.addUser.toastTaxt2 = '请上传身份证反面照片'
		},
		// 图片上传    
		choiceImg: function(documentId) {
			document.getElementById(documentId).click()
		},
		getImg: function(elem, name, index) {
			let _t = this,
				target = elem.srcElement || elem.target,
				file = target.files[0],
				file_name = file.name
			const text = 'toastTaxt' + index
			const textShow = 'showToast' + index
			_t.addUser[text] = '图片正在加载...'
			_t.addUser[textShow] = true
			if(!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)) {
				_t.addUser.toastTaxt1 = '文件类型必须是jpeg,jpg,png中的一种'
				return false
			}
			if(file.size > 5 * 1024 * 1024) {
				_t.addUser.toastTaxt1 = '图片大小不能超过5M'
				return false
			}
			_t.fileToDataURL(name, file, index, file_name)
		},
		fileToDataURL: function(name, file, index, file_name) {
			const reader = new window.FileReader(),
				_t = this
			reader.onload = function(e) {
				let dataUrl = e.target.result,
					pos = dataUrl.indexOf('4') + 2
				dataUrl = dataUrl.substring(pos, dataUrl.length - pos) // 去掉Base64:开头的标识字符
				_t.uploadImg(dataUrl, name, index, file_name)
			}
			reader.readAsDataURL(file)
		},
		uploadImg: function(dataUrl, name, index, file_name) {
			var _t = this
			const text = 'toastTaxt' + index
			const textShow = 'showToast' + index
			_t.addUser[text] = '图片正在上传...'
			_t.addUser[textShow] = true
			//          var data = {}
			//          data[name] = encodeURI(dataUrl)
			commonRequest('picUpload', {
				pic: encodeURI(dataUrl),
				file_name: file_name
			}).then(res => {
				if(res.code === 200) {
					_t.addUser[textShow] = false
					console.log(name)
					if(name == 'img_1') {
						_t.addUser.img_1 = res.data.file
					} else {
						_t.addUser.img_2 = res.data.file
					}
				} else {
					this.$message(res.msg)
				}
			}, res => {
				this.$message(res.msg)
			})
		},
		// 图片上传结束    
		//获取归属数据
		//输入搜索
		querySearchAsync1(arg, cb) {
			commonRequest('searchuser', {
				keyword: arg
			}).then(res => {
				if(res.code == '200') {
					this.results = res.data
					for(const item of this.results) {
						item.value = item.name
					}
					cb(this.results)
				}
			})
		},
		//输入搜索后点击
		handleSelect1(arg) {
			this.addUser.parent_id = arg.id
			this.parent_id = arg.id
		},
		//资料提交
		dataSubmit() {
			if(!trim(this.addUser.real_name)){
				this.$message('请输入姓名')
				return
			}
			if(!trim(this.addUser.mobile)){
				this.$message('请输入手机号')
				return
			}
			//if(trim(!this.addUser.password)){
				//this.$message('请输入密码')
				//return
			//}
			commonRequest(this.url, {
				id: this.addUser.id,
				card_id: this.addUser.card_id,
				demo_flag: this.addUser.demo_flag,
				real_name: this.addUser.real_name,
				email: this.addUser.email,
				mobile: this.addUser.mobile,
				password: this.addUser.password,
				parent_id: this.addUser.parent_id,
				parent_name: this.addUser.parent_name,
				id_certify_flag: this.addUser.id_certify_flag,
				province: this.addUser.province,
				img_1: this.addUser.img_1,
				img_2: this.addUser.img_2
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.getList()
					this.dialogVisible = false
				} else {
					this.$message(res.msg)
				}
			})
		},
		// 查看状态
		changeStatus(val) { // val为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			if(val == null) {
				return false
			} else {
				this.pageNo = 1
				this.$refs.userScreeningDataInterface.user_id = ''
				this.getList()
			}
		},
		//更多操作
		handleCommand(command) {
			const _t = this
			let cmd = parseInt(command.cmd),
				row = command.row
			this.mobile = row.mobile
			this.real_name = row.real_name
			if(cmd === 1) {
				// 调整费用
				this.dialogFormVisible4 = true
				this.costForm.id = row.id
				this.costForm.chargeAndCharge = row.add_buy_commission || 0
				this.costForm.sellingFee = row.add_sell_commission || 0
				this.costForm.deferredCharge = row.add_delay_fee || 0
				this.costForm.technicalManagementFee = row.add_service || 0
			} else if(cmd === 2) {
				// 编辑资料
				console.log(row)
				this.title = "编辑资料"
				this.dialogVisible = true
				this.addUser.id = row.id
				this.name = row.real_name
				this.hide = false
				this.disabled = true
				this.url = 'editinfo'
				this.addUser.img_1 = row.img_1
				this.addUser.img_2 = row.img_2
				for(let i in row) {
					for(let k in this.addUser) {
						if(i === k) {
							this.addUser[k] = row[i]
						}
					}
				}
				if(!this.addUser.img_1) {
					this.addUser.showToast1 = true
					this.addUser.toastTaxt1 = '请上传身份证正面照片'
				} else {
					this.addUser.showToast1 = false
				}
				if(!this.addUser.img_2) {
					this.addUser.showToast2 = true
					this.addUser.toastTaxt2 = '请上传身份证反面照片'
				} else {
					this.addUser.showToast2 = false
				}
			} else if(cmd === 3) {
				this.dialogFormVisible3 = true
				this.form2.name = row.real_name
				this.form2.id = row.id
			} else if(cmd === 4) {
				// 设置启用
				this.id = row.id
				this.$confirm('确定将"' + row.real_name + '"设定为启用?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							_t.accountStatusChage(0).then(res => {
								if(res.code == 200) {
									this.$message(res.msg)
									done()
								} else {
									this.$message(res.msg)
								}
							})
						} else {
							done()
						}
					}
				})
			} else if(cmd === 5) {
				// 设置禁用
				this.id = row.id
				this.$confirm('确定将"' + row.real_name + '"设定为禁用?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							_t.accountStatusChage(1).then(res => {
								if(res.code == 200) {
									this.$message(res.msg)
									done()
								} else {
									this.$message(res.msg)
								}
							})
						} else {
							done()
						}
					}
				})
			} else if(cmd === 6) {
				// 设置只读
				this.id = row.id
				this.$confirm('确定将"' + row.real_name + '"设定为只读?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							_t.accountStatusChage(2).then(res => {
								console.log(res)
								if(res.code == 200) {
									this.$message(res.msg)
									done()
								} else {
									this.$message(res.msg)
								}
							})
						} else {
							done()
						}
					}
				})
			} else if(cmd === 7) {
				this.$confirm('确定将"' + row.real_name + '"客户删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							commonRequest('delCustomer', {
								id: row.id,
							}).then(res => {
								if(res.code == '200') {
									this.$message(res.msg)
									this.getList()
									done()
								} else {
									this.$message(res.msg)
								}
							})
						} else {
							done()
						}
					}
				})
			} else if(cmd === 8) {
				this.balanceBox = true
				this.id = row.id
				this.real_wallet = row.real_wallet
				this.demo_wallet = row.demo_wallet
			} else if(cmd === 9) {
				this.moveCustomer.show = true
				this.moveCustomer.real_name = row.real_name
				this.moveCustomer.parent_name = row.parent_name
				this.moveCustomer.name = ''
				this.id = row.id
			}
		},
		async accountStatusChage(status) {
			const _t = this
			var param = {
				id: this.id,
				status: status
			}
			const result = await commonRequest('banner', param).then(res => {
				if(res.code == 200) {
					this.$message(res.msg)
					this.getList()
					return res
				}
				this.$message(res.msg)
				return res
			}, res => {
				this.$message(res.msg)
				return res
			})
			return result
		},
		//计算可用资金
		formatter(row, column) {
			column.property = 'availableFunds'
			row.availableFunds = Number((Number(row.real_wallet) - Number(row.frozen_money)).toFixed(2))
			return row.availableFunds
		},
		//获取列表
		getList() {
			const dataTimeObj = this.timeFormatFn(this.checkTime) || '' //获取全局时间处理方法
			this.loading = true
			commonRequest('customerList', {
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
				keyword: this.keyword,
				screenValue: this.screenValue,
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				user_id: this.$refs.userScreeningDataInterface.user_id,
				start_time: dataTimeObj.active_start_time || '',
				end_time: dataTimeObj.active_end_time || ''
			}).then(res => {
				this.loading = false
				if(res.code == 200) {
					this.list = res.data.data || []
					this.page = res.data.page || {}
					this.emptyText = '暂无数据'
					this.formattedData()
				} else {
					this.emptyText = '暂无数据'
				}
			}).catch(error => {
				this.loading = false
			})
		},
		// 格式化数据
		formattedData() {
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].real_wallet = Number(this.list[i].real_wallet)
				this.list[i].frozen_money = Number(this.list[i].frozen_money)
				this.list[i].demo_wallet = Number(this.list[i].demo_wallet)
				this.list[i].market_wallet = Number(this.list[i].market_wallet)
			}
		},
		//重置密码
		resetPwd() {
			commonRequest('resetpassword', {
				id: this.form2.id,
				password: this.form2.pwd
			}).then(res => {
				if(res.code == '200') {
					this.dialogFormVisible3 = false
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
				}
			})
		},
		//调整费用
		submitCost() {
			commonRequest('changefee', {
				add_buy_commission: this.costForm.chargeAndCharge,
				add_sell_commission: this.costForm.sellingFee,
				add_delay_fee: this.costForm.deferredCharge,
				add_service: this.costForm.technicalManagementFee,
				id: this.costForm.id
			}).then(res => {
				if(res.code == '200') {
					this.dialogFormVisible4 = false
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},
		// //时间选择
		// changeStatus(val) {
		// 	this.getList()
		// },
		//搜索
		searchList() {
			this.getList()
		},
		//调整余额
		adjustmentBalance() {
			commonRequest('changewallet', {
				id: this.id,
				real_wallet: this.real_wallet,
				demo_wallet: this.demo_wallet
			}).then(res => {
				if(res.code == '200') {
					this.balanceBox = false
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},
		// 调整费用
		getsysaddfee() {
			commonRequest('sysaddfee').then(res => {
				if(res.code == '200') {
					this.sysaddfeeData = res.data
					if(typeof(res.data === Array)) {
						for(let i = 0; i < res.data.length; i++) {
							if(res.data[i].key == 'add_buy_commission_limit') {
								this.sysaddfeeData.add_buy_commission_limit = res.data[i].value
							}
							if(res.data[i].key == 'add_sell_buy_commission_limit') {
								this.sysaddfeeData.add_sell_buy_commission_limit = res.data[i].value
							}
							if(res.data[i].key == 'add_delay_fee_limit') {
								this.sysaddfeeData.add_delay_fee_limit = res.data[i].value
							}
							if(res.data[i].key == 'add_service_fee_limit') {
								this.sysaddfeeData.add_service_fee_limit = res.data[i].value
							}
						}
					}
				}
			})
		},
		//移交划转
		accountSearch(arg, cb) {
			commonRequest('searchuser', {
				keyword: arg
			}).then(res => {
				if(res.code == '200') {
					this.results = res.data
					for(const item of this.results) {
						item.value = item.name
					}
					cb(this.results)
				}
			})
		},
		// 移交划转-选择归属
		handleToAgentSelect(arg) {
			this.moveCustomer.parent_id = arg.id
			this.moveCustomer.name = arg.name
		},
		//移交提交
		moveCustomerSubmit() {
			commonRequest('parentchange', {
				admin_id: this.moveCustomer.parent_id,
				user_id: this.id,
				self: this.moveCustomer.move_self
			}).then(res => {
				if(res.code == '200') {
					this.getList()
					this.moveCustomer.show = false
				} else {
					this.$message(res.msg)
				}
			})
		}
	},

	mounted() {
		this.getList()
		this.getsysaddfee()
	}
}