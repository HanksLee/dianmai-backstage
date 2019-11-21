import {
  commonRequest,
} from '@/api/api-risk'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			list: [],
			marketList: [],
			market: 0,
			page: {},
			loading: false,
		}	
	},
	mounted() {
	  this.getMarketList()
	  this.getQuotation()
	},
	methods: {
		getMarketList() {
			commonRequest('marketList').then(res => {
				console.log(res)
				if (res.code === 200) {
					this.marketList = res.data
				} else {
					this.$message.error(res.msg)
				}
			})
		},

		getQuotation() {
			commonRequest('marketQuote', {
				market_id: this.market,
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if (res.code === 200) {
					this.list = res.data.page_data
					this.page = res.data.page || {}
				} else {
					this.$message.error(res.msg)
				}
			})
		},

		changeHandler(val) { // val为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			this.market = val
			this.getQuotation()
		},

		searchList() {
			this.getQuotation()
		},
	},
}