import { commonRequest } from '@/api/api-systemmgmt.js'
import { empty } from '@/utils/data'
export default {
	data() {
		return {
			urlList: [
				'gplrds.com',
				'zxcnmarkets.com',
				'huifengstocks.com',
				'huachihk.com',
				'jungdamarkets.com',
				'huataistock.com',
				'localhost'
			], // 根据域名判断使用
			spreadOpts: [], // 推广分成
			delayOpts: [], // 递延收取时间
			marketOpts: [], // 开放市场
            market_div_type: [],
            market_open_type: [],
            active_items: [],
			sysParams: {
				market_div_type: '', // 推广分成
				delay_fee_time_type: '', // 递延收取时间
				market_open_type: '', // 开放市场
				customer_div_profit: '',
				customer_div_signal: '',
				buy_condition: '',
				out_money_condition: '',
				ib_code_flag: '',
				risk_margin_limit: '',
				risk_margin_warning: '',
				risk_buy_up_limit: '',
				risk_sell_down_limit: '',
				risk_demo_money: '',
				add_buy_commission_limit: '',
				add_sell_buy_commission_limit: '',
				add_service_fee_limit: '',
				add_delay_fee_limit: '',
				delay_fee_time_type: '',
				test_mobile: '',
				active_items: '',
				out_money_max: '',
				out_money_min: '',
				currency_account_type: '',
				currency_exchange_base: '',
				profit_cond: '0',
				mail_must: '0',
				open_swing:{},
				tp_sl_witch:'0',//止盈止损0显示金额，1显示价格
				out_cond:{},
				stib_risk_buy_up: '', // 科创板买入涨跌幅
				stib_risk_sell_down: '', // 科创板卖出涨跌幅
				stib_flag: '', // 科创版15点之后行情检测开关
				freeze_delayfee: 0 // 是否冻结递延费
			},
			APPOpts: [],
			currency_list:[],
			trading_currency: [],//交易货币
			payment_of_money: [],//支付货币
			organ_currency: [], // 通道货币
			loading: false,
			amplitude_list:[],
			amplitude_arr:[],
			open_swing_arr:[],
			out_cond:{
				week_cond:'0',
				start_time:'9:00',
				end_time:'16:00'
			},
			checkList:[],
			url:null
		};
	},
	methods: {
		getList() {
			this.loading = true
			commonRequest('getSysList').then(res => {
				if(res.code == '200') {
					this.loading = false
					this.delayOpts = res.data.delay_time_type
					this.marketOpts = res.data.market_type
					this.spreadOpts = res.data.spread_type
					this.APPOpts = res.data.navigate_type
					this.sysParams = res.data.system
					this.market_div_type = empty(this.sysParams.market_div_type.split(','))
					this.market_open_type = empty(this.sysParams.market_open_type.split(','))
					this.active_items = empty(this.sysParams.active_items.split(','))
					this.currency_list = res.data.currency_list
					this.trading_currency = res.data.system.currency_account_type.split(',')
					this.payment_of_money = res.data.system.currency_exchange_base.split(',')
					this.organ_currency = res.data.system.organ_currency
					this.amplitude_arr = []
					for(let i=0;i<this.marketOpts.length;i++){
                        this.amplitude_arr.push({id:this.marketOpts[i].key,amplitude_val:''})
					}
					let open_swing_data = JSON.parse(res.data.system.open_swing)
					let out_condOgj = JSON.parse(res.data.system.out_cond)
					if(res.data.system.out_cond !== "{}"){
						this.out_cond.week_cond = out_condOgj.week_cond
						this.out_cond.start_time = out_condOgj.start_time
						this.out_cond.end_time = out_condOgj.end_time
						this.checkList = this.out_cond.week_cond.split(',')
					}
					for(let i in open_swing_data){
						this.amplitude_list.push(i)
						for(let j=0;j<this.amplitude_arr.length;j++){
							if(i == this.amplitude_arr[j].id){
								this.amplitude_arr[j].amplitude_val = open_swing_data[i]
							}
						}
					}
					// this.amplitude_list.push()
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			})
		},

		updata() {
			this.parameterProcessing()
			this.sysParams.market_div_type = this.market_div_type.join(',')
			this.sysParams.market_open_type = this.market_open_type.join(',')
			this.sysParams.active_items = this.active_items.join(',')
			this.sysParams.currency_account_type = this.trading_currency.join(',')
			this.sysParams.currency_exchange_base = this.payment_of_money.join(',')
			this.sysParams.organ_currency = this.organ_currency
			let out_cond = {
				week_cond:this.checkList.join(','),
				start_time:this.out_cond.start_time,
				end_time:this.out_cond.end_time
			}
			this.sysParams.out_cond = JSON.stringify(out_cond)
			commonRequest('SetSysParams', this.sysParams).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},
		checkboxGroupFn(val){
		},
		//振幅选中市场后数据处理，例如{'0':'0.1','1':'0.2','2':'0.3'}
		parameterProcessing(){
			let data = this.amplitude_list
			console.log(this.amplitude_list)
			this.open_swing_arr = []
			this.amplitude_arr.map((item,index)=>{
				for(let i=0;i<data.length;i++){
					if(item.id == data[i]){
						this.open_swing_arr.push(data[i])
						this.open_swing_arr.push(this.amplitude_arr[index].amplitude_val)
					}
				}
			})
			console.log(this.open_swing_arr)
			let len = this.open_swing_arr.length
			let arrNum = len % 2 === 0 ? len / 2 : Math.floor( (len / 2) + 1 )
			let num = 2
			let open_arr = []
			let open_swing_obj = new Object()
			for(let i=0;i<arrNum;i++){
                open_arr.push(this.open_swing_arr.slice(i*num,i*num+num))  
			}
			console.log(open_arr)
			for(let i=0;i<open_arr.length;i++){
				open_swing_obj[open_arr[i][0]] = open_arr[i][1]
			}
			this.sysParams.open_swing = JSON.stringify(open_swing_obj)
			console.log(this.sysParams.open_swing)
		},

		
	},
	created() {
		const domain = document.domain;
		const firstDomain = domain.substring(
		  domain.indexOf(".") + 1,
		  domain.length
		);
		this.url = firstDomain;
		this.getList()
	}
}