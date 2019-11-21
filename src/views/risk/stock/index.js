import { commonRequest } from '@/api/api-risk'
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
			loading: false,
			url: '',
			marketTypeOpts: [],
			mtVal: '',

			statusOpts: [{
				value: '',
				label: '全部'
			},{
				value: '0',
				label: '上架'
			}, {
				value: '3',
				label: '下架'
			}],
			statusVal: '',
		}
	},
	methods: {
		handleCommand(dataSet) {
			const row = dataSet.row,
				type = dataSet.type
			switch (type) {
				case 'usingFlag':
					// 如果禁用 则启用
					if (row.grounding_status == '0') {
						//row.status2 = '1'
						this.url = 'riskStockAdd' // 下架
						const data = {
							market_id: row.market_id,
							stock_code: row.stock_code,
							market: row.market,
							time_stamp: row.time_stamp,
							grounding_status: '1',
							grounding_date: row.grounding_date,
							operate_date: row.operate_date,
							user_admin_id: row.user_admin_id,
							user_admin_name: row.user_admin_name
						}
						this.opRiskStock(data)
					}
					// 如果启用 则禁用
					else if (row.grounding_status == '1') {
						//row.status2 = '0'
						this.url = 'riskStockDel' // 上架
						const data = {
							id: row.id,
							stock_code: row.stock_code
						}
						this.opRiskStock(data)
					}
					break
			}
		},

		opRiskStock(data) {
			commonRequest(this.url, data).then(res => {
				if (res.code == '200') {
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},

		changeStatus(val) { // val为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			if (val == null) {
				return false
			} else {
				this.getList()
			}
		},

		getList() {
			this.loading = true
			commonRequest('riskStockList', {
				keyword: this.keyword,
				market: this.mtVal,
				status: this.statusVal,
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if (res.code == '200') {
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
			this.marketTypeOpts = []
			commonRequest('marketType').then(res => {
				if (res.code == '200') {
					this.marketTypeOpts = res.data
					//					this.marketTypeOpts.unshift({
					//						'key': '',
					//						'name': '全部'
					//					})
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