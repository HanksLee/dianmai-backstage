import { commonRequest } from '@/api/api-risk'
import paging from 'components/paging/index.vue'
import Cookies from 'js-cookie'
import { getCookieUuid } from '@/utils/user'
import config from '@/api/config-client'

export default {
  components: {
    paging
  },
  data() {
    return {
      userinfo: {},
      keyword: '',
      page: {}, //存放分页数据
      emptyText: '数据加载中...',
      loading: false,
      disabled: false,
      list: [],
      collectArr:[{
        name:'开仓收取',
        key:'1'
      },{
        name:'平仓收取',
        key:'2'
      }],
      stockParams: {
        id: '',
        broker_id: '',
        organ_id: '',
        stock_code: '',
        market_name: '',
        market_id: '',
        stock_name: '',
        margin_left: '',
        //      grounding_status: '',
        //      grounding_date: '',
        margin_status: [],
        commis_type:'1',
        commission: '0',
        margin_rate: '0',
        price_min_charge: '0',
        broker_withhold: [],
        stock_type:'0',
        spread: '',
        contract_size: '',
        digits: '',
        pip_value: ''
      },
      margin_status: '',

      marketTypeOpts: [],
      market: '',

      marginStatusOpts: [{
        key: '0',
        name: '可买'
      }, {
        key: '1',
        name: '可卖'
      }],
      selltype: '',
      selltypeArr: [],

      groundingStatusOpts: [{
        key: '0',
        name: '正常'
      }, {
        key: '1',
        name: '下架'
      }],
      url: '',
      dialogShow: false,
      dialogTitle: '',
      is_importdata: false,
      api_root: config.api + '/v1_admin/stockmargin/import',
			dataObj: {
					uuid: getCookieUuid(),
					token: Cookies.get('token') || ''
        },
      downloadLoading: false,
      disabled1:true,
    }
  },
  methods: {
    add() {
      this.disabled1 = true
      this.dialogShow = true
      this.dialogTitle = '新增股票'
      this.disabled = false
      for (let i in this.stockParams) {
        this.stockParams[i] = ''
      }
      this.stockParams.broker_withhold = []
      this.stockParams.margin_status = []
      this.stockParams.broker_id = this.userinfo.broker_id
      this.stockParams.organ_id = this.userinfo.organ_id
      this.stockParams.stock_type = '0'
      this.url = 'stockMarginAdd'
    },
    //搜索
    searchList() {
      this.getList()
    },
    changeStatus() {
      this.getList()
    },
    querySearch(arg, cb) { // 自动检索股票信息
      commonRequest("searchStock", {
        keyword: arg,
        stock_type: this.stockParams.stock_type
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
      this.stockParams.market_id = arg.market_id
      console.log(arg.market_id)
      if(arg.market_id == '6' || arg.market_id == '7' || arg.market_id == '8' || arg.market_id == '9' || arg.market_id == '10'){
        this.disabled1 = false
      }else{
        this.disabled1 = true
      }
      for (let i = 0; i < this.marketTypeOpts.length; i++) {
        if (arg.market_id == this.marketTypeOpts[i].key) {
          this.stockParams.market_name = this.marketTypeOpts[i].name
        }
      }
    },
    handleCommand(data) {
      if (data.cmd == '1') { // 编辑
        this.dialogShow = true
        this.dialogTitle = '编辑股票'
        this.disabled = true
        let data1 = data.row
        for(let i in data1){
          for(let k in this.stockParams){
            if(i == k){
            this.stockParams[k] = data1[i]
            }
           }
        }
        for (let i = 0; i < this.marketTypeOpts.length; i++) {
          if (this.stockParams.market_id == this.marketTypeOpts[i].key) {
            this.stockParams.market_name = this.marketTypeOpts[i].name
          }
        }
        if(data.row.market_id == '6' || data.row.market_id == '7' || data.row.market_id == '8' || data.row.market_id == '9' || data.row.market_id == '10'){
          this.disabled1 = false
        }else{
          this.disabled1 = true
        }
        this.stockParams.margin_status = data.row.margin_status
        this.url = 'stockMarginEdit'
        this.handleSelect(data.row)
        console.log(data)
      } else if (data.cmd == '2') {
        this.$confirm('确定将"' + data.row.stock_name + '"股票删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              commonRequest('stockMarginDel', {
                id: data.row.id,
              }).then(res => {
                if (res.code == '200') {
                  this.$message(res.msg)
                  this.getList()
                  done()
                } else {
                  this.$message(res.msg)
                }
              })
            } else {
              done()
            }
          }
        })
      }
    },
    submit() {
      var data = this.stockParams
      if(data.margin_left == '' || data.margin_left == null) {
      	this.$message('请输入股票数量')
      } else if(data.margin_left == 0) {
      	this.$message('股票数量不能为0')
      }
      if(data.margin_status == '' || data.margin_status == null) {
      	this.$message('融买融卖请至少选择一项')
      }
      commonRequest(this.url, {
      	id: data.id,
        broker_id: data.broker_id,
        organ_id: data.organ_id,
        stock_code: data.stock_code,
        market_name: data.market_name,
        market_id: data.market_id,
        stock_name: data.stock_name,
        margin_left: data.margin_left,
        commis_type: data.commis_type,
        commission: data.commission,
        margin_rate: data.margin_rate,
        price_min_charge: data.price_min_charge,
        margin_status: data.margin_status.join(','),
        broker_withhold: data.broker_withhold.join(','),
        stock_type:data.stock_type,
        spread: data.spread,
        contract_size: data.contract_size,
        digits: data.digits,
        pip_value: data.pip_value
      }).then(res => {
        if (res.code == '200') {
          this.$message(res.msg)
          this.dialogShow = false
          this.getList()
        } else {
          this.$message(res.msg)
        }
      })
    },
    getList() {
      this.selltypeArr = this.selltype.join(',')
      commonRequest('stockMarginList', {
        page_no: this.$refs.subassemblyData.page_no,
        page_size: this.$refs.subassemblyData.page_size,
        selltype: this.selltypeArr,
        market: this.market,
        keyword: this.keyword,
      }).then(res => {
        if (res.code == '200') {
          this.userinfo = JSON.parse(localStorage.getItem("userinfo"))
          this.list = res.data.page_data || []
          this.page = res.data.page || {}
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].broker_withhold_name = []
            this.list[i].margin_status_name = []
            this.list[i].margin_status = this.list[i].margin_status.split(',')
            this.list[i].broker_withhold = this.list[i].broker_withhold ? this.list[i].broker_withhold.split(',') : []
            for (let j = 0; j < this.list[i].broker_withhold.length; j++) {
              if (this.list[i].broker_withhold[j] == '1') {
                this.list[i].broker_withhold_name[j] = '开仓代扣'
              } else{
                this.list[i].broker_withhold_name[j] = '平仓代扣'
              }
            }
            for (let j = 0; j < this.list[i].margin_status.length; j++) {
              if (this.list[i].margin_status[j] == '0') {
                this.list[i].margin_status_name[j] = '可买'
              } else {
                this.list[i].margin_status_name[j] = '可卖'
              }
            }
            this.list[i].broker_withhold_name = this.list[i].broker_withhold_name.join(',')
            this.list[i].margin_status_name = this.list[i].margin_status_name.join(',')
          }
          this.emptyText = '暂无数据'
        } else {
          this.$message(res.msg)
          this.emptyText = '暂无数据'
        }
      })
    },
    getMarketType() {
      this.marketTypeOpts = []
      commonRequest('marketType').then(res => {
        if (res.code == '200') {
          this.marketTypeOpts = res.data
        }
      })
    },
    //上传成功回调
			successFn(response) {
				this.$message(response.msg)
				this.getList()
				this.is_importdata = false
				this.loading.close();
			},
			handbeforeupload(file) {
				// console.log(file)
				// if(file.type != 'application/vnd.ms-excel') {
				// 	this.$message('请使用模板文件上传')
				// 	return false
				// }
				this.is_importdata = true
				this.loading = this.$loading({
					lock: true,
					text: '数据导入中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				})
			},
			//上传失败回调
			errorFn(err) {
				var msg = '';
				if(err.msg == '') {
					msg = '导入上传失败'
				} else {
					msg = err.msg
				}
				this.$message(msg)
				this.is_importdata = false
				this.loading.close();
      },
//下载模板
downloadTemplate() {
	this.downloadLoading = true
	this.$confirm('确定下载excel模板?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		const nameData = ['交易市场', '股票名称', '股票代码', '交易类型', '股票数量','融买融卖','券商代扣方式','手续费','最小波动价位','最低交易操作资金','点差','合约大小',,'小数点位数','单位']
		const fieldData = ['market_id_name', 'stock_name', 'stock_code', 'stock_type_name', 'margin_left','margin_status_name','broker_withhold_name','commission','price_min_charge','margin_rate','spread','contract_size','digits','pip_value']
    const listData = this.list
    this.downloadLoading = false
    for(let i=0;i<listData.length;i++){
       if(listData[i].market_id == '0'){
        listData[i].market_id_name = '上证'
       }
       if(listData[i].market_id == '1'){
        listData[i].market_id_name = '深圳主板'
       } 
       if(listData[i].market_id == '2'){
        listData[i].market_id_name = '深圳创业主板'
       }
       if(listData[i].market_id == '3'){
        listData[i].market_id_name = '港股'
       }   
       if(listData[i].market_id == '4'){
        listData[i].market_id_name = '美股'
       } 
       if(listData[i].market_id == '5'){
        listData[i].market_id_name = 'ETF'
       } 
       if(listData[i].market_id == '6'){
        listData[i].market_id_name = '上期所'
       } 
       if(listData[i].market_id == '7'){
        listData[i].market_id_name = '大商所'
       }
       if(listData[i].market_id == '8'){
        listData[i].market_id_name = '郑商所'
       } 
       if(listData[i].market_id == '9'){
        listData[i].market_id_name = '中金所'
       } 
       if(listData[i].market_id == '10'){
        listData[i].market_id_name = '中金所'
       } 
       if(listData[i].market_id == '-1'){
        listData[i].market_id_name = '-1'
       } 
       if(listData[i].market_id === null){
        listData[i].market_id_name = '--'
       }  
       if(listData[i].stock_type == '0'){
        listData[i].stock_type_name = '股票'
       }
       if(listData[i].stock_type == '1'){
        listData[i].stock_type_name = '指数.'
       }
       if(listData[i].stock_type == '2'){
        listData[i].stock_type_name = '指数'
       }

    }
		//导出excel表格全局处理方法
		this.exportExcel('excel模板', nameData, fieldData, listData)
	}).catch(() => {
		this.downloadLoading = false
	})			
  }
},
mounted() {
    this.getList()
    this.getMarketType()
  }
}