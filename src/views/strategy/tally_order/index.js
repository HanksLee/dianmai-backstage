import userScreening from 'components/userScreening/index.vue'
import detailedFrame from 'components/detailedFrame/index.vue'
import { formatDate } from '@/utils/data.js'
import paging from 'components/paging/index.vue'
import { commonRequest } from '@/api/api-strategy.js'

export default {
  components: {
    userScreening,
    detailedFrame,
    paging
  },
  data() {
    return {
      loading: false,
      emptyText: '数据加载中...',
      checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date()],
      pickerOptions1: this.timeData(),
      page: {}, //存放分页数据
      list: [],
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
      downloadLoading: false,
      //用于导出表格做转换
      sell_reasonObj: {
        '0': '手动平仓',
        '1': '操作资金不足',
        '2': '余额不足',
        '3': '止盈平仓',
        '4': '止损平仓',
        '5': '爆仓平仓',
        '6': '结束递延平仓',
        '7': '合约期结束平仓',
        '8': '风控执行',
        '9': '期货结束交易',
        '10': '风控超跌强平'
      },
      ask_price_value: '',
      marketTypeOpts: [],
      warehouse: '',
      url: ''
    }
  },
  filters: {
    //计算持仓时间
    timeCalculation(val,value) {
      const time = (new Date(value).getTime() - new Date(val).getTime()) / 86400000
      let d = ''
      if (time < 1) {
        d = 1 + '天'
      } else {
        d = Math.ceil(time) + '天'
      }
      return d
    }
  },
  methods: {
    //获取列表
    getList() {
      const dataTimeObj = this.timeFormatFn(this.checkTime) // 获取全局时间处理方法
      this.loading = true
      commonRequest('policyHistoryList', {
        page_no: this.$refs.subassemblyData.page_no || 1, // 页码
        page_size: this.$refs.subassemblyData.page_size || 20, // 条数
        active_start_time: dataTimeObj.active_start_time,
        active_end_time: dataTimeObj.active_end_time,
        keyword: this.keyword,
        market_id: this.ask_price_value,
        screenValue: this.screenValue,
        organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
        zone_id: this.$refs.userScreeningDataInterface.zone_id,
        user_id: this.$refs.userScreeningDataInterface.user_id,
        warehouse: this.warehouse
      }).then(res => {
        this.loading = false
        if (res.code == '200') {
          this.list = res.data.page_data || []
          this.formattedData()
          this.page = res.data.page || {}
          this.emptyText = '暂无数据'
        } else {
          this.emptyText = '暂无数据'
        }
      })
    },
    askPriceClick(){
      this.getList()
    }, 
    getMarketType() {
			this.marketTypeOpts = []
			commonRequest('marketType').then(res => {
				if(res.code == '200') {
					this.marketTypeOpts = res.data
				}
			})
		},
    // 格式化数据
    formattedData() {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].init_margin = Math.round(Number(this.list[i].init_margin) * 100) / 100
        this.list[i].coupon_money = Math.round(Number(this.list[i].coupon_money) * 100) / 100
        this.list[i].leverage = Math.round(Number(this.list[i].leverage) * 100) / 100
        this.list[i].add_margin = Math.round(Number(this.list[i].add_margin) * 100) / 100
        this.list[i].volume = Math.round(Number(this.list[i].volume) * 100) / 100
        this.list[i].commission = Math.round(Number(this.list[i].commission) * 100) / 100
        this.list[i].delay_fee = Math.round(Number(this.list[i].delay_fee) * 100) / 100
        this.list[i].service_fee = Math.round(Number(this.list[i].service_fee) * 100) / 100
        this.list[i].other_charge = Math.round(Number(this.list[i].other_charge) * 100) / 100
        this.list[i].close_profit = Math.round(Number(this.list[i].close_profit) * 100) / 100
      }
    },
    // 计算合计
    getSummaries(param) {
      const {
        columns,
        data
      } = param
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
          sums[3] = '--'
          sums[4] = '--'
          sums[5] = '--'
          sums[7] = '--'
          sums[9] = '--'
          sums[10] = '--'
          sums[14] = '--'
          sums[20] = '--'
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },

    //搜索
    searchList() {
      this.getList()
    },
    //时间筛选
    selectTime() {
      this.getList()
    },
    //导出
    handleDownload() {
      this.downloadLoading = true
      const dataTimeObj = this.timeFormatFn(this.checkTime)
      commonRequest('policyHistoryList',{
        active_start_time: dataTimeObj.active_start_time,
        active_end_time: dataTimeObj.active_end_time,
        keyword: this.keyword,
        market_id: this.ask_price_value,
        screenValue: this.screenValue,
        organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
        zone_id: this.$refs.userScreeningDataInterface.zone_id,
        user_id: this.$refs.userScreeningDataInterface.user_id,
        warehouse: this.warehouse,
        excel:1
      }).then(res=>{
        this.downloadLoading = false
				if(res.code == 200) {
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = res.data.page_data.file
					document.body.appendChild(link)
					link.click()	 
				} else {
					this.$message(res.msg)
				}
      }).catch(error => {
				this.downloadLoading = false
			})

      
    }

  },
  mounted() {
    const domain = document.domain
    const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
    this.url = firstDomain
    this.getList()
    this.getMarketType()
  }
}
