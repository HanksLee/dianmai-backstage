import userScreening from 'components/userScreening/index.vue'
import detailedFrame from 'components/detailedFrame/index.vue'
import { formatDate } from '@/utils/data.js'
import { commonRequest } from '@/api/api-strategy.js'
import paging from 'components/paging/index.vue'
export default {
  components: {
    userScreening,
    detailedFrame,
    paging
  },
  data() {
    return {
      downloadLoading: false,
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
      dialogShow: false,
      orderDialogShow: false,
      stockParams: {
      	code_id: '',
      	cmd: '',
      	stock_code: '',
        stock_name: '',
        init_margin: '',
        leverage: 　 '',
        assign_price: '',
        assign_volume: '',
        open_time: '', // 开仓时间
        expire_date: '', // 到期日期
        tp: '',
        sl: '',
        policy_type: '',
        balance: '',
        real_name: '',
      },
      productParams: {},
      stockSellParams: {
      	id: '',
      	real_name: '',
      	stock_name: '',
        left_volume: '',
        customer_id: '',
      },
      close_price: null,
      create_time: new Date(),
      ask_price_value: '',
      marketTypeOpts: [],
      suspend_status:0,
      url: ''
    }
  },
  watch: {
  	'stockParams.init_margin': function (){
  		console.log(this.stockParams.init_margin)
			this.stockParams.init_margin = String(this.stockParams.init_margin).replace(/[^\d]/g, '')
		}
  },
  computed: {
  	assignVolume: function () {
  			this.stockParams.assign_volume = Math.floor(this.stockParams.init_margin * this.stockParams.leverage / parseFloat(this.stockParams.assign_price) / 100) * 100
        return  this.stockParams.assign_volume
      }
  },
  filters: {
    //计算持仓时间
    timeCalculation(val) {
      const time = (new Date().getTime() - new Date(val).getTime()) / 86400000
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
    add() {
      this.orderDialogShow = true
      for (let i in this.stockParams) {
        this.stockParams[i] = ''
      }
      this.stockParams.cmd = '0'
      this.getProductType()
    },

    querySearch(arg, cb) { // 自动检索股票信息
      commonRequest("searchStock", {
        keyword: arg
      }).then(res => {
        if (res.code == '200') {
          let results = res.data;
          cb(results);
        } else {
          this.$message(res.msg)
        }
      })
    },

    handleSelect(arg) {
      this.stockParams.stock_name = arg.stock_name
      this.stockParams.stock_code = arg.stock_code
      this.stockParams.assign_price = arg.now_price
      this.stockParams.dif_rate = arg.dif_rate
    },

    querySearchName(arg, cb) { // 自动检索姓名
      commonRequest("searchName", {
        keyword: arg
      }).then(res => {
        if (res.code == '200') {
          let results = res.data;
          cb(results);
        } else {
          this.$message(res.msg)
        }
      })
    },
    
    handleSelectName(arg) {
      this.stockParams.code_id = arg.code_id
      this.stockParams.real_name = arg.real_name
      commonRequest('getBalance', {
        code_id: arg.code_id
      }).then(res => {
        if (res.code == '200') {
          this.stockParams.balance = res.data.balance
        }
      })
    },

    // 操作
    handleCommand(data) {
      if (data.cmd == '1') { // 平仓卖出
        this.dialogShow = true
        this.suspend_status = 0
        this.stockSellParams = data.row
        if(data.row.market_id == '6' || data.row.market_id == '7' || data.row.market_id == '8' || data.row.market_id == '9' || data.row.market_id == '10'){
          this.stockSellParams.left_volume = Number(this.stockSellParams.left_volume)
        }else{
          this.stockSellParams.left_volume = this.stockSellParams.left_volume
        }
      } else if (data.cmd == '2') { // 查看详情
        this.$refs.obtainSublevel.policyDetails('position', '策略详情', data.row.id)
      }else if (data.cmd == '3'){
        this.dialogShow = true
        this.suspend_status = 1
        this.stockSellParams = data.row
        if(data.row.market_id == '6' || data.row.market_id == '7' || data.row.market_id == '8' || data.row.market_id == '9' || data.row.market_id == '10'){
          this.stockSellParams.left_volume = Number(this.stockSellParams.left_volume)
        }else{
          this.stockSellParams.left_volume = this.stockSellParams.left_volume
        }
      }
    },
    
    stockSubmit() {
    	var data = this.stockParams
    	data.open_time = formatDate(new Date(data.open_time), 'yyyy-MM-dd hh:mm:ss')
    	data.expire_date = formatDate(new Date(data.expire_date), 'yyyy-MM-dd')
    	commonRequest('orderBuy', data).then(res => {
    		if(res.code == '200') {
    			this.$message(res.msg)
    			this.orderDialogShow = false
    			this.getList()
    		} else {
    			this.$message(res.msg)
    		}
    	})
    },
    
    orderSell() {
      if(Number(this.close_price) === 0 || Number(this.close_price) === null){
        this.$message('请输入卖出价格')
        return
      }
      let create_time = formatDate(this.create_time, 'yyyy-MM-dd hh:mm:ss');
    	commonRequest('orderSell', {
    		policy_id: this.stockSellParams.id,
        volume: this.stockSellParams.left_volume,
        customer_id: this.stockSellParams.customer_id,
        close_price: this.close_price,
        create_time: create_time,
        suspend_status:this.suspend_status
    	}).then(res => {
    		if(res.code == '200') {
    			this.$message(res.msg)
    			this.dialogShow = false
    			this.getList()
    		} else {
    			this.$message(res.msg)
    		}
    	})
    },

    getProductType() {
      commonRequest('getProductType').then(res => {
        if (res.code == '200') {
          this.productParams = res.data
        }
      })
    },

    //获取列表
    getList() {
      let dataTimeObj = {
        active_start_time: null,
        active_end_time: null
      }
      if(this.checkTime){
        dataTimeObj = this.timeFormatFn(this.checkTime) //获取全局时间处理方法
      }
      this.loading = true
      commonRequest('orderbuyList', {
        page_no: this.$refs.subassemblyData.page_no,
        page_size: this.$refs.subassemblyData.page_size,
        active_start_time: dataTimeObj.active_start_time,
        active_end_time: dataTimeObj.active_end_time,
        keyword: this.keyword,
        market_id: this.ask_price_value,
        screenValue: this.screenValue,
        organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
        zone_id: this.$refs.userScreeningDataInterface.zone_id,
        user_id: this.$refs.userScreeningDataInterface.user_id
      }).then(res => {
        this.loading = false
        if (res.code == '200') {
          this.list = res.data.page_data || []
          this.page = res.data.page || {}
          this.emptyText = '暂无数据'
          this.formattedData()
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
        this.list[i].margin_rate = Math.round(Number(this.list[i].margin_rate) * 100) / 100
        this.list[i].volume = Math.round(Number(this.list[i].volume) * 100) / 100
        this.list[i].open_price = Number(Number(this.list[i].open_price).toFixed(3))
        this.list[i].sell_profit = Math.round(Number(this.list[i].sell_profit) * 100) / 100
        this.list[i].float_profit = Math.round(Number(this.list[i].float_profit) * 100) / 100
        this.list[i].profit_rate = Math.round(Number(this.list[i].profit_rate) * 100) / 100
        this.list[i].now_price = Number(Number(this.list[i].now_price).toFixed(3))
        this.list[i].market_value = Math.round(Number(this.list[i].market_value) * 100) / 100
        this.list[i].commission = Math.round(Number(this.list[i].commission) * 100) / 100
        this.list[i].delay_fee = Math.round(Number(this.list[i].delay_fee) * 100) / 100
        this.list[i].service_fee = Math.round(Number(this.list[i].service_fee) * 100) / 100
        this.list[i].other_recharge = Math.round(Number(this.list[i].other_recharge) * 100) / 100
      }
    },
    
    //搜索
    searchList() {
      this.getList()
    },
    
    //时间筛选
    selectTime() {
      this.getList()
    },
    
    //计算合计
    getSummaries(param) {
      console.log(param)
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
          sums[2] = '--'
          sums[3] = '--'
          sums[5] = '--'
          sums[6] = '--'
          sums[7] = '--'
          sums[8] = '--'
          sums[10] = '--'
          sums[12] = '--'
          sums[13] = '--'
          sums[27] = '--'
          sums[20] = '--'
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },

    // 导出
    handleDownload() {
      this.downloadLoading = true
      const dataTimeObj = this.timeFormatFn(this.checkTime)
      commonRequest('orderbuyList',{
        active_start_time: dataTimeObj.active_start_time,
        active_end_time: dataTimeObj.active_end_time,
        keyword: this.keyword,
        market_id: this.ask_price_value,
        screenValue: this.screenValue,
        organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
        zone_id: this.$refs.userScreeningDataInterface.zone_id,
        user_id: this.$refs.userScreeningDataInterface.user_id,
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
