import { commonRequest } from '@/api/api-systemmgmt.js'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			list: [],
			page: {}, //存放分页数据
			loading: false,

			spParams: {
				id: '', //记录id 
				broker_id: '', //'机构ID',
				organ_id: '', //'机构机构ID',
				//-- -- --可选参数-- -- -- --
				demo_flag: '', //'0- 正常，1模拟(创建后类型不可以修改)',
				sell_type: '', // 持仓类型
				policy_name: '', //'产品名称 T+1,T+5 ,T+20',
				policy_money: '', //'操盘资金，多个用逗号分割单位万',
				money_add_step: '', //'自定义，购买策略投入本金必须是100的倍数',
				policy_leverage: '', //'平台策略资金配比倍数，多个逗号分割',
				policy_time: '', //'持仓时间',
				fee_time: '', //'推广免费时间，对递延利息免收取',
				using_flag: '', //'1 启用 0- 禁用',
				delay_flag: '', //'0-不允许递延，1可以递延',
				max_days: '', //'最大持仓时间，天数',
				max_money: '', //'买入最高金额',
				min_money: '', //'买入最小金额',
				buy_commission: '', //'买入手续费,最低5块钱',
				sell_commission: '', //'卖出手续费,最低5块钱',
				yinhua_tax: '', //'印花税',
				guohu_fee: '', //'过户费',
				jianguan_fee: '', //'证券监管费用，创业板收，主板不收',
				gui_fee: '', //'交易规费',
				delay_fee: '', //'递延费(管理费)',
				service_fee: '', //'账户管理费',
				buy_max_limit: '', //'禁止买入涨幅',
				buy_min_limit: '', //'当日跌幅止损',
				sell_min_limit: '', //'最小卖出数量',
				sell_div_flag: '', //'是否允许分批卖出持仓 0- 不能分批卖出  1可以分批卖出',
				tp_limit: '', //'止盈点数',
				sl_limit: '', //'止损点数',
				margin_limit: '', //'爆仓止损线 : 操作资金占比(市值/操作资金)',
				margin_warning: '', //'爆仓预警线 ：操作资金占比(市值/操作资金)',
				stop_redeem_rate: '', //'停牌赎回百分比 70%',
				stop_delay_fee: '', //'停牌递延费',
				win_div_rate: '', //'盈利分红(平台) 20%',
				comment: '', //'产品说明',
				etf_margin: '',//操作资金金额,
				tp_rate: '',//止盈比率
				sl_rate: '',//止损比率
				stock_type: '', //交易类型
			},

			spOptions: [{
				value: '1',
				label: '手续费'
			}, {
				value: '2',
				label: '递延费'
			}, {
				value: '3',
				label: '盈利分红'
			}],
			value: [],
			
			suitParams: [{
				id: '0',
				name: 'T+1'
			}, {
				id: '1',
				name: 'T+0'
			}],

			url: '',
			dialogFormVisible: false,
			dialogTitle: '',
			market_type: [],
			market_type_value: [],
			describe: '描述',
			options:[{
				value: '0',
				label: '股票'
			},{
				value: '1',
				label: '指数.'
			},{
				value: '2',
				label: '指数'
			}],
		}
	},
	// 计算属性 启用 禁用
	computed: {
		isUsing: {
			// getter
			get: function() {
				return this.spParams.using_flag == 1
			},
			// setter
			set: function(newValue) {
				this.spParams.using_flag = newValue ? 1 : 0
			}
		},
		sellUsingFlag: {
			get: function() {
				return this.spParams.sell_div_flag == 1
			},
			set: function(newValue) {
				this.spParams.sell_div_flag = newValue ? 1 : 0
			}
		},
		delayUsingFlag: {
			get: function() {
				return this.spParams.delay_flag == 1
			},
			set: function(newValue) {
				this.spParams.delay_flag = newValue ? 1 : 0
			}
		}
	},
	methods: {
		add() {
			this.dialogTitle = '添加产品类型';
			this.dialogFormVisible = true;
			this.market_type_value = []
			for(let i in this.spParams) {
				this.spParams[i] = ''
			}

			this.spParams.using_flag = 0
			this.spParams.sell_div_flag = 0
			this.spParams.delay_flag = 0
			this.spParams.sell_type = ''

			this.url = 'productAdd'
		},
		handleCommand(dataSet) {
			const type = dataSet.type,
				row = dataSet.row
			switch(type) {
				case 'edit':
					this.dialogTitle = '编辑产品类型'
					this.dialogFormVisible = true
					// 赋值
					//this.spParams = row
					for(let i in row){
						for(let k in this.spParams){
						  if(i == k){
							this.spParams[k] = row[i]
						  }
						}
					  }
					this.market_type_value = []
					// commonRequest('productDetail', {
					// 	id: row.id
					// }).then(res => {
					// 	if(res.code == '200') {
					// 		this.spParams = res.data
					// 	} else {
					// 		this.$message(res.msg)
					// 	}
					// })
					this.url = 'productEdit'
					if(row.market_open_type){
						this.market_type_value = row.market_open_type.split(',') || []
					} 
					break
				case 'usingFlag':
					// 如果未启用 则启用
					if(row.using_flag == '0') {
						row.using_flag = '1'
						this.getProductTurn(row.using_flag, row.id)
					}
					// 如果启用 则禁用
					else if(row.using_flag == '1') {
						row.using_flag = '0'
						this.getProductTurn(row.using_flag, row.id)
					}
					break
			}
		},
		submit() {
			const data = this.spParams
			console.log(this.market_type_value)
			      data.market_open_type = this.market_type_value.join(',')
			commonRequest(this.url, data).then(res => {
				if(res.code == '200') {
					this.dialogFormVisible = false
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},
		getList() {
			this.loading = true
			commonRequest('productList', {
				page_no: this.$refs.subassemblyData.page_no, // 页码
				page_size: this.$refs.subassemblyData.page_size // 条数
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.list = res.data.page_data || []
					this.page = res.data.page || {}
					this.market_type = res.data.market_type || []
					//添加适用市场类型字段
					for(let i=0;i<this.list.length;i++){
						if(this.list[i].market_open_type){
							const data = this.list[i].market_open_type.split(',') || []
							const data_text = []
							for(let j=0;j<data.length;j++){
								for(let k=0;k<this.market_type.length;k++){
									 if(data[j] == this.market_type[k].key){
										data_text.push(this.market_type[k].name)
									 } 
								} 
							}
							this.list[i].market_type_data = data_text.join(',')	
						}
					}
					console.log(this.list)
					this.formattedData()
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			})
		},
		// 格式化数据
		formattedData() {
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].buy_commission = Number(this.list[i].buy_commission)
				this.list[i].sell_commission = Number(this.list[i].sell_commission)
				this.list[i].yinhua_tax = Number(this.list[i].yinhua_tax)
				this.list[i].guohu_fee = Number(this.list[i].guohu_fee)
				this.list[i].gui_fee = Number(this.list[i].gui_fee)
				this.list[i].jianguan_fee = Number(this.list[i].jianguan_fee)
				this.list[i].delay_fee = Number(this.list[i].delay_fee)
				this.list[i].win_div_rate = Number(this.list[i].win_div_rate)
				this.list[i].stop_delay_fee = Number(this.list[i].stop_delay_fee)
				this.list[i].stop_redeem_rate = Number(this.list[i].stop_redeem_rate)
				this.list[i].service_fee = Number(this.list[i].service_fee)
				// this.list[i].policy_leverage = Number(this.list[i].policy_leverage)  
			}
		},
		// 产品管理启用禁用
		getProductTurn(val, id) {
			commonRequest('productTurn', {
				id: id,
				using_flag: val
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
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