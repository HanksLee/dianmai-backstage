import { commonRequest } from "@/api/api-customer"
import detailedFrame from '../detailedFrame/index.vue'

export default {
	components: {
		detailedFrame
	},
	data() {
		return {
			isSee:false,
			url: '',
			loading: false,
			//查看详细
			detailed: {
				dialogVisible: false,
				purchaseList: [],
				activeNames: []
			},
			name: '',
			//详细信息
			code_id: '',
			login_type: '1',
			loading1: false,
			id_info: {},
			fund_info: {},
			list_info: [],
			info_page: {
				page_no: 1,
				page_size: 5,
				total: 0,
			},
			type1: '1',
			activeName: 'login',
			//最近出入金
			entryAndExit: {
				open: false,
				list: [],
				page_size: 5,
				page_no: 1,
				total: 0,
			},
			loading2: false,
			//持仓订单
			position: {
				open: false,
				list: [],
				page_size: 5,
				page_no: 1,
				total: 0,
			},
			loading3: false,
			//结算订单
			settlementOrder: {
				open: false,
				list: [],
				page_size: 5,
				page_no: 1,
				total: 0,
			},
			loading4: false,
			nick_name: '', //昵称
			capitalChange:{
				open: false,
				list: [],
				page_size: 5,
				page_no: 1,
				total: 0,
			},
			loading5: false,
			dialogFormVisible3:false,
			customer_id:null,
			passwd:null,
			type:null,
			eyeTf:false,
			userInfo:JSON.parse(localStorage.getItem("userinfo")),
			netAssets:0,
			valueAtRisk:0
		}
	},
	methods: {
		//查看敏感信息
		eyeFn(){
			this.dialogFormVisible3 = true
			this.passwd = null
		},
		eyeInfo(){
			commonRequest('usercheck', {
						customer_id:this.customer_id,  //查询的客户id
						passwd:this.passwd //当前账号密码
					}).then(res => {
						if(res.code == '200') {
							this.id_info.mobile = res.data.mobile
							this.id_info.email = res.data.email
							this.eyeTf = true
							this.dialogFormVisible3 = false
						}else{
							this.$message(res.msg)
						}
					})
		},
		//关闭详细弹框
		closeDetailed(done) {
			this.detailed.activeNames = ''
			this.entryAndExit.open = false
			this.position.open = false
			this.settlementOrder.open = false
			done();
		},
		//查看详细
		details(type, val, row) {
			this.eyeTf = false
			this.code_id = row.code_id
			this.detailed.dialogVisible = true
			this.nick_name = row.nick_name
			this.loading = true
			this.customer_id = row.id
			if(type === 'customer') {
				this.url = 'detail'
			}
			commonRequest(this.url, {
				code_id: this.code_id,
				type: '0',
			}).then(res => {
				this.loading = false
				if(res.code == '200') {
					this.id_info = res.data.id_info
					for(let i in res.data.fund_info) {
						this.fund_info[i] = Number(res.data.fund_info[i])
					}
					this.netAssets = Number(res.data.fund_info.frozen_money) + Number(res.data.fund_info.margin_free) + Number(res.data.fund_info.stock_profit)
				   if(Number(this.fund_info.frozen_money) !== 0){
					this.valueAtRisk = Math.round(this.netAssets / Number(res.data.fund_info.frozen_money)*100)
				   }
				} else {
					this.$message(res.msg)
				}
			})
			this.getLoginInfo()
		},
		//最近登陆自选股票
		handleClick(val) {
			if(val === 'login') {
				this.info_page.page_no = 1
				this.type1 = '1'
				this.getLoginInfo()
			} else if(val === 'shares') {
				this.info_page.page_no = 1
				this.type1 = '2'
				this.getLoginInfo()
			}
		},
		//获取最近登陆和自选股票
		getLoginInfo() {
			this.loading1 = true
			commonRequest('detail', {
				code_id: this.code_id,
				type: this.type1,
				page_no: this.info_page.page_no,
				page_size: 5,
			}).then(res => {
				this.loading1 = false
				if(res.code == '200') {
					this.list_info = res.data.page_data
					this.info_page = res.data.page
					this.info_page.page_no = Number(this.info_page.page_no)
					this.info_page.total = Number(this.info_page.total)
				} else {
					this.$message(res.msg)
				}
			})
		},
		// 最近登陆自选股票分页切换
		changePageInfo(val) {
			this.info_page.page_no = val
			this.getLoginInfo()
		},
		//最近出入金
		toggleOpen(val) {
			if(val === 'entryAndExit') {
				if(!this.entryAndExit.open) {
					this.entryAndExit.open = true
					this.getentryAndExitList()
				} else {
					this.entryAndExit.open = false
				}
			}
			if(val === 'position') {
				if(!this.position.open) {
					this.position.open = true
					this.getpositionList()
				} else {
					this.position.open = false
				}
			}
			if(val === 'settlementOrder') {
				if(!this.settlementOrder.open) {
					this.settlementOrder.open = true
					this.getsettlementOrderList()
				} else {
					this.settlementOrder.open = false
				}
			}
			if(val === 'capitalChange') {
				if(!this.capitalChange.open) {
					this.capitalChange.open = true
					this.getcapitalList()
				} else {
					this.capitalChange.open = false
				}
			}
		},
		//最近出入金列表
		getentryAndExitList() {
			this.loading2 = true
			commonRequest('detail', {
				code_id: this.code_id,
				type: '3',
				page_no: this.entryAndExit.page_no,
				page_size: 5,
			}).then(res => {
				this.loading2 = false
				if(res.code == '200') {
					this.entryAndExit.list = res.data.page_data
					this.entryAndExit.page_no = Number(res.data.page.page_no)
					this.entryAndExit.total = Number(res.data.page.total)
				} else {
					this.$message(res.msg)
				}
			})
		},
		//最近出入金分页
		changePageentryAndExit(val) {
			this.entryAndExit.page_no = val
			this.getentryAndExitList()
		},
		//持仓订单
		getpositionList() {
			this.loading3 = true
			commonRequest('detail', {
				code_id: this.code_id,
				type: '4',
				page_no: this.position.page_no,
				page_size: 5,
			}).then(res => {
				this.loading3 = false
				if(res.code == '200') {
					this.position.list = res.data.page_data
					this.position.page_no = Number(res.data.page.page_no)
					this.position.total = Number(res.data.page.total)
				} else {
					this.$message(res.msg)
				}
			})
		},
		//持仓订单分页
		changePageposition(val) {
			this.position.page_no = val
			this.getpositionList()
		},
		//结算订单列表
		getsettlementOrderList() {
			this.loading4 = true
			commonRequest('detail', {
				code_id: this.code_id,
				type: '5',
				page_no: this.settlementOrder.page_no,
				page_size: 5,
			}).then(res => {
				this.loading4 = false
				if(res.code == '200') {
					this.settlementOrder.list = res.data.page_data
					this.settlementOrder.page_no = Number(res.data.page.page_no)
					this.settlementOrder.total = Number(res.data.page.total)
				} else {
					this.$message(res.msg)
				}
			})
		},
		//结算订单分页 
		changePagesettlementOrder(val) {
			this.settlementOrder.page_no = val
			this.getsettlementOrderList()
		},
		//资金变动列表
		getcapitalList() {
			this.loading5 = true
			commonRequest('detail', {
				code_id: this.code_id,
				type: '6',
				page_no: this.capitalChange.page_no,
				page_size: 5,
			}).then(res => {
				this.loading5 = false
				if(res.code == '200') {
					this.capitalChange.list = res.data.page_data
					this.capitalChange.page_no = Number(res.data.page.page_no)
					this.capitalChange.total = Number(res.data.page.total)
				} else {
					this.$message(res.msg)
				}
			})
		},
		//资金变动分页 
		changePagecapitalChange(val) {
			this.capitalChange.page_no = val
			this.getcapitalList()
		},
	}
}