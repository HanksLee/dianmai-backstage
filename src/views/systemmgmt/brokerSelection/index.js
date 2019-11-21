import { commonRequest } from '@/api/api-systemmgmt.js'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			loading2:false,
			loading1:false,
			loading:false,
			brokerArr:[],//券商列表
			parameter:{
				id:'',
				broker_name_id:'',
				broker_ip:'',
				broker_port:'',
				broker_version:'',
				broker_yybID:'',
				broker_AccountNo:'',
				broker_TradeAccount:'',
				broker_JyPassword:'',
				broker_TxPassword:'',
				broker_status:'0'
			},
			broker_ip_broker_port:'',
			switchValue:false,//开始关闭
			keyword:null,
			broker_name_id:'',
			list:[],
			page:{},
			brokerArr1:[{
				label:'全部',
				value:''
			},{
				label:'未成交',
				value:'0'
			},{
				label:'部分成交',
				value:'1'
			},{
				label:'全部成交',
				value:'2'
			},{
				label:'委托失败',
				value:'3'
			}],
			status: '',
		}
	},
	methods: {
		//获取券商列表
		getnamelist(){
			commonRequest('namelist',{
			}).then(res =>{
				if(res.code == '200'){
				  this.brokerArr = res.data
				}
			})
		},
		//获取券商信息
		getlogininfo(){
			this.loading1 = true
			commonRequest('logininfo').then(res=>{
				this.loading1 = false
				if(res.code == '200' && res.data.length>0){
				 this.parameter = res.data[0]
				 this.parameter.broker_name_id = res.data[0].broker_name_id
				 this.broker_ip_broker_port = res.data[0].broker_ip +':'+res.data[0].broker_port
				 if(this.parameter.broker_status == '0'){
                   this.switchValue = true
				 }else{
				   this.switchValue = false
				 }
				}
			})
		},
		//保存券商信息
		getloginedit(){
			let broker_ip = this.broker_ip_broker_port.substring(0, this.broker_ip_broker_port.indexOf(':'))
			let broker_port = this.broker_ip_broker_port.substring(this.broker_ip_broker_port.indexOf(':')+1, this.broker_ip_broker_port.length)
			console.log(broker_ip)
			console.log(broker_port)
			this.loading2 = true
			this.parameter.broker_ip = broker_ip
			this.parameter.broker_port = broker_port
			let data = this.parameter
			if(this.switchValue){
				data.broker_status = '0'
			}else{
				data.broker_status = '1'
			}
			commonRequest('loginedit',
             data
			).then(res =>{
				this.loading2 = false
				if(res.code == '200'){
					this.getlogininfo()
					// this.getList()
					this.$message(res.msg)
				}else{
					this.$message(res.msg)
				}
			})
		},
		//获取订单列表
		getList(){
			this.loading = true
			commonRequest('order',{
				broker_name_id:this.broker_name_id,
				status:this.status,
				keyword:this.keyword,
				page_no: this.$refs.brokerSelectionData.page_no || 1, // 页码
				page_size: this.$refs.brokerSelectionData.page_size || 20 // 条数
			}).then(res=>{
				this.loading = false
				if(res.code == '200'){
					this.list = res.data.page_data
					this.page = res.data.page || {}
				}
			})
		},
		brokerageScreening(){
			this.getList()
		},
		stateSelection(){
			this.getList()
		},
		//搜索
		searchList(){
			this.getList()
		}	
	},
	mounted() {
	  this.getnamelist()
	  this.getlogininfo()
	  this.getList()
	}
}