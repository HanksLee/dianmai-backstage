import { commonRequest } from "@/api/api-user"
import paging from 'components/paging/index.vue'
import recursive from 'components/recursive/index.vue'
import { setUserCookie } from '@/utils/user'
export default {
	components: {
		paging,
		recursive
	},
	data() {
		return {
			list: [],
			page: {},
			loading: false,
			emptyText: '数据加载中...',
			mechanismVlaue: '0',
			mechanismData: [],
			keyword: '',
			userForm: {
				userMessageBox: false,
				name: '',
				mobile: '',
				email: '',
				outfitValue: '',
				outfit: [],
				superiorValue: '',
				password: '',
				user_id: '',
				parent_id: '',
			},
			divideIntoMessageBox: false,
			name: '',
			divideIntoForm: {
				div_commission: '',
				div_delayfee: '',
				div_profit: '',
				div_servicefee: '',
				user_id: '',
			},
			roleMessageBox: false,
			roleForm: {
				name: '',
				roleData: [],
				roleValue: '',
				powerData: [],
				powerValue: '',
				user_id: '',
			},
			disabled: false,
			disabled1: true,
		}
	},
	methods: {
		//获取机构列表
		getOrganlist() {
			commonRequest('organlist').then(res => {
				if(res.code == '200') {
					this.mechanismData = res.data
				}
			})
		},
		//点击机构搜索
		changeFn() {
			this.getList()
		},
		//新增用户
		add() {
			console.log(this.mechanismData.length)
			this.userForm.userMessageBox = true
			this.userForm.outfitValue = ''
			this.userForm.name = ''
			this.userForm.superiorValue = ''
			this.userForm.mobile = ''
			this.userForm.password = ''
			this.userForm.user_id = ''
			const outfitData = []
			this.mechanismData.map(itme => {
				if(itme.name != '全部') {
					outfitData.push({
						'value': itme.id,
						label: itme.name
					})
				}
			})
			this.userForm.outfit = outfitData
			if(this.mechanismData.length === 0) {
				this.disabled1 = false
			}
		},
		handleCommand(command) {
			let cmd = command.cmd
			let row = command.row
			if(cmd === 1) {
				this.divideIntoMessageBox = true
				this.name = row.real_name
				this.divideIntoForm.div_commission = row.div_commission
				this.divideIntoForm.div_delayfee = row.div_delayfee
				this.divideIntoForm.div_profit = row.div_profit
				this.divideIntoForm.div_servicefee = row.div_servicefee
				this.divideIntoForm.user_id = row.customer_id
			} else if(cmd === 2) {
				this.roleMessageBox = true
				this.roleForm.name = row.real_name
				this.roleForm.user_id = row.customer_id
				this.roleForm.roleValue = row.role_id
				this.roleForm.powerValue = Number(row.role_zone)
				commonRequest('roleAuthority', {
					user_id: row.customer_id
				}).then(res => {
					if(res.code == '200') {
						this.roleForm.roleData = res.data.role
						this.roleForm.powerData = res.data.zone_id
					}
				})
			} else if(cmd === 3) {
				let text, using_flag
				if(row.using_flag == '0') {
					text = '启用'
					using_flag = 1
				} else if(row.using_flag == '1') {
					text = '禁用'
					using_flag = 0
				}
				this.$confirm('确定将"' + row.real_name + '"设定为' + text + '?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							commonRequest('userTurn', {
								using_flag: using_flag,
								user_id: row.customer_id,
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
			} else if(cmd === 4) {
				this.jumpLogin(row)
			}
		},
		//获取用户列表
		getList() {
			this.loading = true
			commonRequest('userList', {
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
				keyword: this.keyword,
				organ_id: this.mechanismVlaue,
			}).then(res => {
				this.loading = false
				if(res.code == '200') {
					this.list = res.data.page_data || []
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
				this.list[i].div_commission = Number(this.list[i].div_commission)
				this.list[i].div_delayfee = Number(this.list[i].div_delayfee)
				this.list[i].div_servicefee = Number(this.list[i].div_servicefee)
				this.list[i].div_profit = Number(this.list[i].div_profit)
			}
		},
		//搜索
		searchList() {
			this.getList()
		},

		//新增选择机构
		changeOutfit(val) {
			if(val) {
				this.disabled1 = false
			}
		},
		//输入姓名搜索
		querySearchAsync(arg, cb) {
			commonRequest('searchname', {
				organ_id: this.userForm.outfitValue,
				keyword: arg
			}).then(res => {
				if(res.code == '200') {
					if(res.data.length === 0) {
						this.disabled = false
						this.userForm.mobile = ''
					}
					this.results = res.data
					for(const item of this.results) {
						item.value = item.real_name
						item.mobile = item.mobile
					}
					cb(this.results)
				}
			})
		},
		//输入姓名搜索后点击
		handleSelect(arg) {
			this.disabled = true
			this.userForm.mobile = arg.mobile
			this.userForm.email = arg.email
			this.userForm.user_id = arg.id
		},
		//输入归属搜索
		querySearchAsyncUp(arg, cb) {
			commonRequest('uplist', {
				organ_id: this.userForm.outfitValue,
				keyword: arg
			}).then(res => {
				if(res.code == '200') {
					this.results = res.data
					for(const item of this.results) {
						item.label = item.real_name
					}
					cb(this.results)
				}
			})
		},
		//输入归属搜索后点击
		handleSelectUp(arg) {
			this.userForm.superiorValue = arg.real_name
			this.userForm.parent_id = arg.id
		},
		//用户添加提交
		submitUser() {
			if(!this.userForm.name){
				this.$message('请输入姓名')
				return
			}
			if(!this.userForm.mobile){
				this.$message('请输入手机号')
				return
			}
			commonRequest('addUser', {
				user_id: this.userForm.user_id,
				organ_id: this.userForm.outfitValue,
				parent_id: this.userForm.parent_id,
				mobile: this.userForm.mobile,
				email: this.userForm.email,
				password: this.userForm.password,
				real_name: this.userForm.name
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.getList()
					this.userForm.userMessageBox = false
					this.disabled1 = true
					this.disabled = false
				} else {
					this.$message(res.msg)
				}
			})
		},
		//分成提交
		divideIntoSubmit() {
			commonRequest('marketdiv', this.divideIntoForm).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.divideIntoMessageBox = false
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},
		//分配提交
		distributionSubmit() {
			commonRequest('setrole', {
				user_id: this.roleForm.user_id,
				role_id: this.roleForm.roleValue,
				zone_id: this.roleForm.powerValue,
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.roleMessageBox = false
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},

		//跳转
		jumpLogin(row) { // 跳转登录
			let domain = document.domain
			let firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
			commonRequest('redirectlogin', {
				id: row.id
			}).then(res => {
				if(res.code === 200 && res.data) {
					setUserCookie(res.data.token)
					localStorage.setItem('userinfo', JSON.stringify(res.data)) //保存用户登陆信息
					this.$store.commit('SET_USERINFO', res.data)
					window.open('//broker.' + firstDomain)
				} else {
					res.msg = res.msg || '跳转失败，请重试'
					this.$message(res.msg)
				}
			}, () => {
				this.$message('跳转失败，请重试')
			})
		},
	},
	mounted() {
		this.getOrganlist()
		this.getList()
	}
}