import { commonRequest } from '@/api/api-property'
import paging from 'components/paging/index.vue'
export default {
	components: {
		paging
	},
	name: 'payment',
	data() {
		return {
			loading: false,
			emptyText: '数据加载中...',
			list: [], // 列表数据
			page: {},
			url: '',
			dialogShow: false, // 弹窗默认关闭
			payTypes: [], // 支付类型初始化数据

			isSelect: false,
			lukeDl: 'dl-luke',
			dialogDl: 'dialog-dl',
			dialogDl2: 'dialog-dl2',
			isDH: false, //是否为电汇
			dialogTitle: '编辑支付方式', // 弹窗的title
			currency_pay_type: [],
			client_type: [], // 支付方式的适用范围
			payMentInfo: { // 编辑和更新数据的绑定
				pay_channel_id: '', // 支付渠道，例如：3   。0-电汇，1银行转账，2 智付， 3 国付宝
				show_name: '',
				bussiness_name: '', // 商户名称
				bussiness_no: '', // 商户编号
				card_no: '', // 结算账号
				public_key: '', // 公钥
				secret_key: '', // 私钥
				currency_pay_type: '', // 货币支持方式
				partner_key: '', //  商户key
				other_params: '', //  其它参数
				pay_domain: '',
				in_money_limit_min: '',
				in_money_limit: '',
				in_money_rate: '',
				direct_type: '',
				bank_union: '0', // 银行/三方
				login_url: '', // 三方登录url
				register_url: '', // 三方注册url
				client_type: '', // 支付方式的适用范围
				comment: '', // 备注
				in_money_cond: ''
				// code_money: '',//金额列表
			},
			id: '',
			payDH: {
				/*电汇*/
				pay_type: '', // 支付渠道，例如：3   。0-电汇，1银行转账，2 智付， 3 国付宝
				channel_name: '',
				bussiness_name: '', // 商户名称
				card_no: '', // 结算账号
				country: '', //收款行所在国家
				identification_code: '', //收款银行机构鉴定代码
				bank: '', //收款人开户行
				bank_address: '', //银行地址
				clearing_number: '', //清算号
				address: '', //收款人地址: '',
				in_money_limit_min: '',
				in_money_limit: '',
				in_money_rate: '', //手续费
				remark: '', //备注
			},
			// 初始化数据 用于添加时候重置数据
			originPayMentInfo: {},
			editId: '', // 当前编辑的记录id
			options: [],
			directTypeOptions: [{
					value: '0',
					name: '非直连'
				},
				{
					value: '1',
					name: '直连'
				},
				{
					value: '2',
					name: '快捷'
				},
				{
					value: '3',
					name: '扫码'
				},
				{
					value: '4',
					name: '快捷非直连'
				}
			],
			htmlData: [],
			payTypeOps: [{
				value: '1',
				name: 'PC'
			}, {
				value: '2',
				name: 　 '手机'
			}],
			htmlObj: {},
			disabled: false,
			ft: false,
			certificationData: [{
				value: 1,
				label: '需要'
			},{
				value: 0,
				label: '不需要'
			}]
		}
	},
	methods: {

		// 获取支付方式列表
		getList() {
			this.loading = true
			commonRequest('paychannelList', {
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
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
		formattedData() {
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].in_money_limit_min = Number(this.list[i].in_money_limit_min)
				this.list[i].in_money_limit = Number(this.list[i].in_money_limit)
				this.list[i].in_money_rate = Number(this.list[i].in_money_rate)
			}
		},
		//获取渠道类型列表
		getpaychanneltype() {
			commonRequest('paychanneltype').then(res => {
				if(res.code == '200') {
					this.payTypes = res.data
				}
			})
		},
		//获取货币类型列表
		getmoneytype() {
			commonRequest('moneytype').then(res => {
				if(res.code == '200') {
					this.options = res.data
				}
			})
		},
		//更多
		handleCommand(command) {
			const row = command.row,
				cmd = command.cmd
			if(cmd === 1) {
				this.disabled = true
				this.ft = false
				this.id = row.id
				this.chooseType(row.pay_channel_id,row.id)
				// commonRequest('detail', {
				// 	id: row.id
				// }).then(res => {
				// 	if(res.code == '200') {
				// 		this.url = 'editPaychannel'
				// 		this.dialogShow = true
				// 		for(let i in res.data) {
				// 			for(let k in this.payMentInfo) {
				// 				if(i === k) {
				// 					this.payMentInfo[k] = res.data[i]
				// 				}
				// 			}
				// 		}

				// 		if(this.payMentInfo.currency_pay_type != ''){
				// 			this.currency_pay_type = this.payMentInfo.currency_pay_type.split(',')
				// 		}
				// 		this.payMentInfo.id = row.id
				// 		this.payMentInfo.pay_channel_id = String(this.payMentInfo.pay_channel_id)
				// 		this.payMentInfo.bank_union = String(this.payMentInfo.bank_union)
				// 		this.payMentInfo.direct_type = String(this.payMentInfo.direct_type)
				// 		//this.chooseType()
				// 		// for(let i=0;i<this.htmlData.length;i++){
				// 		// 	this.htmlObj[this.htmlData[i].name] = ''
				// 		// }
				// 	} else {
				// 		this.$message(res.msg);
				// 	}
				// })

			}
			if(cmd === 2) {
				let status, text
				if(row.status == '0') {
					text = '启用'
					status = '1'
				} else {
					status = '0'
					text = '禁用'
				}
				this.$confirm('确定将"' + row.channel_name + '"支付方式设定为' + text + '?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if(action === 'confirm') {
							commonRequest('switch', {
								id: row.id,
								status: status,
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
			}
		},
		//关闭弹框
		closeFn(done) {
			this.htmlData = []
			done()
		},
		//新增
		add() {
			this.disabled = false
			this.htmlData = []
			this.url = 'addPaychannel'
			this.dialogShow = true
			for(let i in this.payMentInfo) {
				this.payMentInfo[i] = ''
			}
			this.currency_pay_type = []
			this.client_type = []
			
			this.htmlObj = {}
		},
		//提交
		submit() {
			this.payMentInfo.currency_pay_type = this.currency_pay_type.join(',')
			this.payMentInfo.client_type = this.client_type.join(',')
			for(let i in this.htmlObj) {
				this.payMentInfo[i] = this.htmlObj[i]
			}
			this.payMentInfo.id = this.id
			commonRequest(this.url, this.payMentInfo).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.getList()
					this.dialogShow = false
				} else {
					this.$message(res.msg);
				}
			})
		},
		changeChooseType(){
			this.ft = true
			this.chooseType(this.payMentInfo.pay_channel_id)
		},
		chooseType(pay_channel_id,id){
			commonRequest('paychanneltypeForms', {
				id: pay_channel_id
			}).then(res=>{
				if(res.code == '200'){
				  if(!Array.isArray(res.data)){
					  const formData = JSON.parse(res.data)
					  this.htmlData = formData.form
				  }else{
					this.htmlData = []
				  }	
				    if(!this.ft){
				        for(let i=0;i<this.htmlData.length;i++){
							this.htmlObj[this.htmlData[i].name] = ''
					    }
					  this.getdetail(id)
					}   
				}
			})
		},
		//获取详情
		getdetail(id){
			commonRequest('detail', {
				id: id
			}).then(res => {
				if(res.code == '200') {
					this.url = 'editPaychannel'
					this.dialogShow = true
					for(let i in res.data) {
						for(let k in this.payMentInfo) {
							if(i === k) {
								this.payMentInfo[k] = res.data[i]
							}
						}
					}
					if(this.payMentInfo.currency_pay_type != ''){
						this.currency_pay_type = this.payMentInfo.currency_pay_type.split(',')
					}
					this.payMentInfo.pay_channel_id = String(this.payMentInfo.pay_channel_id)
					this.payMentInfo.bank_union = String(this.payMentInfo.bank_union)
					this.payMentInfo.direct_type = String(this.payMentInfo.direct_type)
					let otherParams
					if(res.data.other_params){
					  otherParams = JSON.parse(res.data.other_params)
					}
					this.client_type = this.payMentInfo.client_type.split(',')
					console.log(this.htmlObj)
					console.log(otherParams)
					for(let i in otherParams){ 
                        for(let k in this.htmlObj){
                            if(i == k){
								this.htmlObj[k] = otherParams[i]
							}
						}
					}
					
				} else {
					this.$message(res.msg);
				}
			})
		}

	},
	mounted() {
		this.getList()
		this.getpaychanneltype()
		this.getmoneytype()
	}
}