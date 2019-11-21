import {
  commonRequest,
} from '@/api/api-risk'
import paging from 'components/paging/index.vue'
import userScreening from 'components/userScreening/index.vue'

export default {
	components: {
		paging,
		userScreening
	},
	data() {
		return {
			exceptionType: '0', // 风控异常
			checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date()],
			pickerOptions1: this.timeData(),
			keyword: '',
			screenOptions: [{
				label: '姓名',
				value: '1'
			}, {
				label: '手机号',
				value: '2'
			}, {
				label: '股票编码',
				value: '3'
			}, {
				label: '股票名称',
				value: '4'
			}, {
				label: '订单号',
				value: '5'
			}, {
				label: '客户编码',
				value: '6'
			}],
			screenValue: '1',
			exceptionList: [],
			list: [],
			marketList: [],
			market: '',
			page: {},
			loading: false,
		}	
	},
	mounted() {
	  this.getMarketType()
		this.getExceptionList()
		// this.getQuotation()
	},
	methods: {
		exceptionTypeHandler(val) {
			this.checkTime = [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date()]
			this.keyword = ''
			this.screenValue = '1'
			this.market = ''
			this.$refs.userScreeningDataInterface.mechanism.value = '0'
			this.$refs.userScreeningDataInterface.nexus.value = '0'
			this.$refs.userScreeningDataInterface.zone_id = '0'
			this.$refs.userScreeningDataInterface.user_id = ''
			this.searchList()
		},

		//时间筛选
		selectTime(val) {
			console.log(val)
			if (val === null) {
				this.checkTime = [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date()]
			}
			this.searchList()
		},

		// 风控异常
		getExceptionList() {
			commonRequest('riskInfo', {
				active_start_time: this.checkTime[0],
				active_end_time: this.checkTime[1],
				keyword: this.keyword,
				market_id: this.market,
				screenValue: this.screenValue,
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				user_id: this.$refs.userScreeningDataInterface.user_id,
			}).then(res => {
				this.exceptionList = res.data.page_data
				this.page = res.data.page || {}
			})
		},

		// 递延费异常
		getDeferredList() {
			commonRequest('delayInfo', {
			  active_start_time: this.checkTime[0],
			  active_end_time: this.checkTime[1],
			  keyword: this.keyword,
			  market_id: this.market,
			  screenValue: this.screenValue,
			  organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
			  zone_id: this.$refs.userScreeningDataInterface.zone_id,
			  user_id: this.$refs.userScreeningDataInterface.user_id,
			}).then(res => {
			  this.exceptionList = res.data.page_data
				console.log(this.exceptionList)
			  this.page = res.data.page || {}
			})
		},

		getMarketType() {
		  this.marketTypeOpts = []
		  commonRequest('marketType').then(res => {
		    if (res.code == '200') {
		      this.marketList = res.data
		    }
		  })
		},

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
			this.searchList()
		},

		searchList() {
			this.exceptionList = []
			this.$nextTick(() => {
				if (this.exceptionType === '0') {
					this.getExceptionList()
				} else {
					this.getDeferredList()
				}
			})
		},
	},
}