import { commonRequest } from "@/api/api-report"
import userScreening from 'components/userScreening/index.vue'
import paging from 'components/paging/index.vue'
import subordinate from './subordinate/index.vue'
export default {
	components: {
		userScreening,
		paging,
		subordinate
	},
	data() {
		return {
			loading: false,
			downloadLoading: false,
			checkTime: [],
			pickerOptions1: this.timeData(),
			list: [],
			page: {},
			dataTime: {},
			excel:null
		}
	},
	methods: {
		//获取列表
		getList() {
			const dataTimeObj = this.timeFormatFn(this.checkTime) || {} //获取全局时间处理方法
			this.dataTime = dataTimeObj
				this.loading = true
				this.list = []
			commonRequest('earningList', {
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				user_id: this.$refs.userScreeningDataInterface.user_id,
				start_time: dataTimeObj.active_start_time || '',
				end_time: dataTimeObj.active_end_time || '',
				excel:this.excel
			}).then(res => {
				this.loading = false
				if(res.code == '200') {
					this.list = res.data.page_data || []
					this.page = res.data.page || {}
					this.emptyText = '暂无数据'
					this.formattedData()
				} else {
					this.emptyText = '暂无数据'
					this.$message(res.msg)
				}
			}).catch(error => {
				this.loading = false
			})
		},
		// 格式化数据
		formattedData() {
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].cal_pay_in_money = Math.round(Number(this.list[i].cal_pay_in_money) * 100) / 100
				this.list[i].cal_pay_out_money = Math.round(Number(this.list[i].cal_pay_out_money) * 100) / 100
				this.list[i].cal_margin = Math.round(Number(this.list[i].cal_margin) * 100) / 100
				this.list[i].cal_coupon_money = Math.round(Number(this.list[i].cal_coupon_money) * 100) / 100
				this.list[i].cal_buy_money = Math.round(Number(this.list[i].cal_buy_money) * 100) / 100
				this.list[i].cal_sell_money = Math.round(Number(this.list[i].cal_sell_money) * 100) / 100
				this.list[i].cal_delay_fee = Math.round(Number(this.list[i].cal_delay_fee) * 100) / 100
				this.list[i].cal_service_fee = Math.round(Number(this.list[i].cal_service_fee) * 100) / 100
				this.list[i].commission = Math.round(Number(this.list[i].commission) * 100) / 100
				this.list[i].cal_other_fee = Math.round(Number(this.list[i].cal_other_fee) * 100) / 100
				this.list[i].cal_profit = Math.round(Number(this.list[i].cal_profit) * 100) / 100
				this.list[i].cal_div_profit = Math.round(Number(this.list[i].cal_div_profit) * 100) / 100
				this.list[i].cal_market_money = Math.round(Number(this.list[i].cal_market_money) * 100) / 100
				this.list[i].real_wallet = Math.round(Number(this.list[i].real_wallet) * 100) / 100
				this.list[i].frozen_money = Math.round(Number(this.list[i].frozen_money) * 100) / 100
				this.list[i].cal_user_wallet = Math.round(Number(this.list[i].cal_user_wallet) * 100) / 100
		}
		},
		//计算合计
getSummaries(param) {
	const { columns, data } = param
	const sums = []
	columns.forEach((column, index) => {
	  if (index === 0) {
		sums[index] = '合计'
		return
	  }
	  const values = data.map(item => Number(item[column.property]))
	  if (!values.every(value => isNaN(value))) {
		sums[index] = values.reduce((prev, curr) => {
		  const value = Number(curr)
		  if (!isNaN(value)) {
			return prev + curr
		  } else {
			return prev
		  }
		}, 0)
		sums[index] = Math.round(Number(sums[index]) * 100) / 100
		sums[1] = '--'
		sums[2] = '--'
	  } else {
		sums[index] = '--'
	  }
	})
	return sums
  },	
		//时间搜索
		selectTime() {
			this.getList()
		},
		//导出
		handleDownload() {
			const dataTimeObj = this.timeFormatFn(this.checkTime) || {} //获取全局时间处理方法
			this.dataTime = dataTimeObj
			this.downloadLoading = true
			commonRequest('earningList', {
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				user_id: this.$refs.userScreeningDataInterface.user_id,
				start_time: dataTimeObj.active_start_time || '',
				end_time: dataTimeObj.active_end_time || '',
				excel:'1'
			}).then(res => {
				this.downloadLoading = false
				if(res.code == '200') {
					this.download(res.data.page_data.file)
				} else {
					this.$message(res.msg)
				}
			}).catch(error => {
				this.downloadLoading = false
			})
		},
		download (data) {
			if (!data) {
					return
			}
			let url = data
			let link = document.createElement('a')
			link.style.display = 'none'
			link.href = url
			link.setAttribute('download', '业绩报表.csv')
			document.body.appendChild(link)
			link.click()
   }
	},
	mounted() {
		const end = new Date()
		const start = new Date()
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
		this.checkTime = [start,end]
		this.getList()
	}
}