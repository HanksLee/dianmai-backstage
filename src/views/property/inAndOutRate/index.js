import { commonRequest } from '@/api/api-property'
import paging from 'components/paging/index.vue'
export default {
  components: {
    paging
  },
  data() {
    return {
      loading: false,
      emptyText: '数据加载中...',
      buyRate1: '1.0',
      sellRate1: '0.9',
      buyRate2: '1.2',
      sellRate2: '1.6',
      page: {}, // 存放分页数据
      params: { // 搜索接口的数据
        page_no: '',
        page_size: 20
      },
      list: [],
      options: [],
      optionsValue1: '3',
      optionsValue2: '5',
      optionsValue3: '3',
      optionsValue4: '5',
      in_rate: 1,
      out_rate: 1,
      outData: '',
      inData: '',
      in_id: '',
      out_id: ''
    }
  },
  methods: {
    getSysList() {
      commonRequest('getSysList').then(res => {
        if (res.code == 200) {
          this.options = res.data.currency_list || []
        }
      })
    },
    getInOut() {
      this.loading = true
      this.params.page_no = this.$refs.subassemblyData.page_no
      this.params.page_size = this.$refs.subassemblyData.page_size || 20 // 条数
      commonRequest('getInOut', this.params).then(res => {
        this.loading = false
        if (res.code == 200) {
           // 0 入金  1出金
          if (res.data.data[0].type == 0) {
            this.inData = res.data.data[0]
            this.outData = res.data.data[1]
          } else {
            this.inData = res.data.data[1]
            this.outData = res.data.data[0]
          }
          this.optionsValue1 = this.outData.trader_currency_type
          this.optionsValue2 = this.outData.pay_currency_type
          this.optionsValue3 = this.inData.trader_currency_type
          this.optionsValue4 = this.inData.pay_currency_type
          this.in_rate = this.inData.rate
          this.out_rate = this.outData.rate
          this.in_id = this.inData.id
          this.out_id = this.outData.id
          this.list = res.data.history || []
          this.page = res.data.page || {}
          this.emptyText = '暂无数据'
        } else {
          this.emptyText = res.msg || '暂无数据'
        }
      }).catch(error => {
        this.loading = false
      })
    },
    // 获取当前值对应币种的名称
    getCurrencyName(value) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].code == value) {
          return this.options[i].alias_name
        }
      }
    },
    submit(value) {
      // 入金对象
      var trader_currency_type = value == 'in' ? this.optionsValue3 : this.optionsValue1
      var pay_currency_type = value == 'in' ? this.optionsValue4 : this.optionsValue2
      var trader_currency_name = this.getCurrencyName(trader_currency_type)
      var pay_currency_name = this.getCurrencyName(pay_currency_type)
      var comment = trader_currency_name + '兑换' + pay_currency_name
      commonRequest('inOutEdit', {
        trader_currency_type: trader_currency_type,
        trader_currency_name: trader_currency_name,
        pay_currency_type: pay_currency_type,
        pay_currency_name: pay_currency_name,
        comment: comment,
        type: value == 'in' ? 0 : 1,
        id: value == 'in' ? this.in_id : this.out_id,
        rate: value == 'in' ? this.in_rate : this.out_rate
      }).then(res => {
        if (res.code == 200) {
          this.getInOut()
          this.$message(res.msg)
        } else {
          this.$message(res.msg)
        }
      })
    },
    cancel(value) {
      // 保存本地数据
      if (value == 'in') {
        this.optionsValue3 = this.inData.trader_currency_type
        this.optionsValue4 = this.inData.pay_currency_type
        this.in_rate = this.inData.rate
      } else {
        this.optionsValue1 = this.outData.trader_currency_type
        this.optionsValue2 = this.outData.pay_currency_type
        this.out_rate = this.outData.rate
      }
    }
  },
  mounted() {
    this.getSysList()
    this.getInOut()
  }
}
