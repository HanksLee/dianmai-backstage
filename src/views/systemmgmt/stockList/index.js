import { commonRequest } from '@/api/api-systemmgmt'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			list: [],
			page: {}, //存放分页数据
			keyword: '',
			isDisabled: false, // 短信通道是否可以编辑
			loading: false,

			stockInfoParams: {
				id: '', //记录id
				market: '', //交易所简称
				market_id: '', //股票市场 0-指数, 1-上海 ,2-深圳 ,3-港股,4-美股
				stock_name: '', //股票名称
				stock_code: '', //股票编号
				pinyin_code: '', //拼音简写
				stop_status: '',
				banner_status: '', //禁用：0 否， 1是
			},

			url: '',

			marketTypeOpts: [],
			marketTypeOpts1: [],
			mtVal: '',
			mtVal1: '',

			statusOpts: [{
				value: '',
				label: '全部'
			}, {
				value: '0',
				label: '正常'
			}, {
				value: '1',
				label: '停牌'
			}, {
				value: '2',
				label: '退市'
			}],
			statusVal: '',
			statusOpts1: [{
				value: '0',
				label: '正常'
			}, {
				value: '1',
				label: '停牌'
			}, {
				value: '2',
				label: '退市'
			}],
			statusVal1: '',

			dialogTitle: '',
			dialogShow: false,
		}
	},
	// 计算属性 启用 禁用
	computed: {
		isUsing: {
			// getter
			get: function() {
				return this.stockInfoParams.stop_status == 1
			},
			// setter
			set: function(newValue) {
				this.stockInfoParams.stop_status = newValue ? 1 : 0
			}
		},
	},
	methods: {
		handleCommand(dataSet) {
			const row = dataSet.row,
				type = dataSet.type
			switch(type) {
				case 'edit':
					this.dialogShow = true
					this.dialogTitle = "编辑股票"
					this.isDisabled = false
					// 赋值
					const keys = Object.keys(this.stockInfoParams)
					for(const k of keys) {
						this.stockInfoParams[k] = row[k]
					}
					this.marketTypeOpts1 = this.marketTypeOpts.slice(1, this.marketTypeOpts.length)
					this.mtVal1 = row.market_id
					this.statusVal1 = row.stop_status
					this.url = 'stockInfoEdit'
					break
//				case 'delete': // 删除菜单列表
//					this.name = row.stock_name
//					this.$confirm('确定将 "' + this.name + '" 删除吗?', '提示', {
//						confirmButtonText: '确定',
//						cancelButtonText: '取消',
//						type: 'warning',
//						beforeClose: (action, instance, done) => {
//							if(action === 'confirm') {
//								commonRequest('deleteMenu', {
//									id: data.id
//								}).then(res => {
//									if(res.code == '200') {
//										this.$message(res.msg)
//										done()
//										this.getList()
//									} else {
//										res.msg = res.msg || '加载失败'
//										this.$message(res.msg)
//									}
//								}, res => {
//									this.$message(res.msg)
//								})
//							} else {
//								done()
//							}
//						}
//					})
//					break
			}
		},

		add() {
			this.dialogShow = true
			this.dialogTitle = "添加股票"
			this.isDisabled = false
			this.marketTypeOpts1 = this.marketTypeOpts.slice(1, this.marketTypeOpts.length)
			for(let i in this.stockInfoParams) {
				this.stockInfoParams[i] = ''
			}
			this.url = 'stockInfoAdd'
			this.stockInfoParams.market_id = '0'
			this.mtVal1 = ''
			this.statusVal1 = ''
		},

		submit() {
			this.stockInfoParams.market_id = this.mtVal1
			this.stockInfoParams.stop_status = this.statusVal1
			commonRequest(this.url, this.stockInfoParams).then(res => {
				if(res.code == '200') {
					this.dialogShow = false
					this.getList()
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
				}
			})
		},

		opRiskStock(data) {
			commonRequest(this.url, data).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},

		changeStatus(val) { // val为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			if(val == null) {
				return false
			} else {
				this.getList()
			}
		},

		getList() {
			this.loading = true
			commonRequest('stockInfoList', {
				keyword: this.keyword,
				market: this.mtVal,
				status: this.statusVal,
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.list = res.data.page_data
					this.page = res.data.page || {}
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			})
		},

		getMarketType() {
			commonRequest('marketType').then(res => {
				if(res.code == '200') {
					this.marketTypeOpts = res.data
				} else {
					this.$message(res.msg)
				}
			})
		},

		searchList() {
			this.getList()
		},
	},
	mounted() {
		this.getList()
		this.getMarketType()
	}
}