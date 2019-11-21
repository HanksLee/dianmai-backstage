import { commonRequest } from '@/api/api-user'
export default {
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      emptyText:'数据加载中...',
      title: '',
      activeName: '1',
      detail: {}, // 策略详情
      buy_detail: { // 买入明细
        list: [],
        page_size: 2,
        page_no: 1,
      },
      sell_detail: {
        list: [],
        page_size: 2,
        page_no: 1,
      }, // 卖出明细
      delay_detail: {
        list: [],
        page_size: 2,
        page_no: 1,
      }, // 递延明细
      tp_sl_detail: {
        list: [],
        page_size: 2,
        page_no: 1,
      }, // 止盈止损
      dealDetailVisible: false,
      dealDetailList: [],
      type: '',
      id: '',
      detail_type: '',
      page_no: 1,
      tf: false,
      tp_sl_witch: 0,
      url: ''
    }
  },
  methods: {
    //查看策略详细
    policyDetails(type, val, id) {
      this.dialogFormVisible = true
      this.activeName = '1'
      this.title = val
      this.type = type
      this.id = id
      let url
      if(type === 'position') { // 持仓订单
        url = 'orderbuyDetail'
        this.tf = true
      } else if(type === 'tally') { // 结算订单
        url = 'policyHistoryDetail'
      } else if(type === 'market') { // 推广分成
        url = 'marketshareDetail'
      } else if(type === 'direct') { // 直客分成
        url = 'inviteprofitDetail'
      } else if(type === 'defer') { // 递延明细
        url = 'delayfeeDetail'
      } else if(type === 'purchase') { // 买入策略详情
        url = 'purchaseDetail'
        this.tf = true
      } else if(type === 'sellOut') { // 卖出策略详情
      	url = 'sellOutDetail'
      }
      this.loading = true
      commonRequest(url, {
        id: id,
      }).then(res => {
        this.loading = false
        if(res.code == '200') {
          this.detail = res.data.detail
          this.tp_sl_witch = this.detail.organ.tp_sl_witch
          this.buy_detail.list = res.data.buy_detail.page_data
          this.buy_detail.page_no = Number(res.data.buy_detail.page.page_no)
          this.buy_detail.total = Number(res.data.buy_detail.page.total)
          this.sell_detail.list = res.data.sell_detail.page_data
          this.sell_detail.page_no = Number(res.data.sell_detail.page.page_no)
          this.sell_detail.total = Number(res.data.sell_detail.page.total)
          this.delay_detail.list = res.data.delay_detail.page_data
          this.delay_detail.page_no = Number(res.data.delay_detail.page.page_no)
          this.delay_detail.total = Number(res.data.delay_detail.page.total)
          this.tp_sl_detail.list = res.data.tp_sl_detail.page_data
          this.tp_sl_detail.page_no = Number(res.data.tp_sl_detail.page.page_no)
          this.tp_sl_detail.total = Number(res.data.tp_sl_detail.page.total)
          this.emptyText = '暂无数据'
        } else {
        	this.emptyText = '暂无数据'
        	this.$message(res.msg)
        }
        
      })
    },
    changePageBuyDetail(val) {
      	this.page_no = val
      	let type = 'buy'
      	this.getPageData(type)
    },
    changePageSellDetail(val) {
      	this.page_no = val
      	let type = 'sell'
      	this.getPageData(type)
    },
    changePageDelayDetail(val) {
    	this.page_no = val
    	let type = 'delay'
      this.getPageData(type)
    },
    changePageSlTlDetail(val){
      this.page_no = val
    	let type = 'tp_sl'
      this.getPageData(type)
    },
    //分页
    getPageData(type) {
    	commonRequest('delayTypeDetail', {
    		id: this.id,
    		type: this.type,
    		detail_type: type,
    		page_no: this.page_no
    	}).then(res => {
    		if(res.code == '200') {
    			if(type == 'buy') {
    				this.buy_detail.page_no = Number(res.data.page.page_no)
    				this.buy_detail.list = res.data.page_data
    			} else if(type == 'sell') {
    				this.sell_detail.page_no = Number(res.data.page.page_no)
    				this.sell_detail.list = res.data.page_data
    			} else if(type == 'delay') {
    				this.delay_detail.page_no = Number(res.data.page.page_no)
    				this.delay_detail.list = res.data.page_data
    			}else{
            this.tp_sl_detail.page_no = Number(res.data.page.page_no)
    				this.tp_sl_detail.list = res.data.page_data
          }
    		}
    	})
    },
    handleClick() {
    	
    },
    //查看每次卖出的详细==成交明细
    seekDetailed(row) {
      this.dealDetailVisible = true
      commonRequest('orderbuydeal', {
        order_no: row.order_no
      }).then(res => {
        if(res.code == '200') {
          this.dealDetailList = res.data
        }
      })
    }

  },
  mounted() {
    const domain = document.domain
    const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
    this.url = firstDomain
  }
}
