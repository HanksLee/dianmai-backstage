import userScreening from 'components/userScreening/index.vue'
import paging from 'components/paging/index.vue'
import { commonRequest } from '@/api/api-developer'

export default {
	components: {
		userScreening,
		paging
	},
	data() {
		return {
			list: [],
			page: {},//存放分页数据
			loading: false,
			
			paymentParams: {
				id: '',
				channel_name: '',
				short_name: '',
				class_name: '',
				api_url: '',
				certify_type: '',
				bank_list: '',
				public_key: '',
				para_html: '',
				comment: '',
				
			},
			certifyTypeOption: [],
			
			paymentDialogShow: false,
			paymentDialogTitle: '',
			
			url: '',
			std_banks: [],
			curr_bank: '',
			curr_bank_id: '',
		}
	},
	methods: {
		add() {
			this.paymentDialogShow = true
			this.paymentDialogTitle = '添加支付类型'
			this.url = 'addPayChannelList'
			for(let i in this.paymentParams) {
				this.paymentParams[i] = ''
			}
		},

		handleCommand(dataSet) {
			const row = dataSet.row,
				type = dataSet.type
			switch(type) {
				case 'edit':
					// 编辑展示大框
					this.paymentDialogShow = true
					this.url = 'editPayChannelList'
					this.isDisabled = true
					this.paymentDialogTitle = '编辑支付类型'
					// 赋值
					const keys = Object.keys(this.paymentParams)
					for(const k of keys) {
						this.paymentParams[k] = row[k]
					}
					break
			}
		},

		// 获取支付通道列表
		getPayChannelList() {
			this.loading = true
			commonRequest('payChannelList', {
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.list = res.data.page_data
					this.page = res.data.page || {}
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			}, ()=>{
				this.loading = false
			})
		},


		// 支付通道认证方式
		payCertifyType() {
			commonRequest('payCertifyType').then(res => {
				if(res.code == '200') {
					this.certifyTypeOption = res.data
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 添加支付通道提交
		payChannelSubmit() {
			const data = this.paymentParams
			commonRequest(this.url, data).then(res => {
				if(res.code == '200') {
					console.log(res.data)
					this.paymentDialogShow = false
					this.$message(res.msg)
					this.getPayChannelList()
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 标准银行数据
		stdBanks() {
			commonRequest('stdBanks').then(res => {
				if(res.code == '200') {
					this.std_banks = res.data
				} else {
					this.$message(res.msg)
				}
			})
		},

		//银行类型添加
		addBank() {
			const self = this;
			var bank = this.$refs.opt_bank.value;
			var newid = this.$refs.opt_bankid.value;
			var bank_list = this.paymentParams.bank_list;
			var banks = [], flag = false, index = -1, item = -1;

			if(bank_list > "") {
				banks = JSON.parse(bank_list);
				for(var i in banks) {
					if(flag == true)
						break;
					for(var j in banks[i]){
						if(j == bank) {
							flag = true;
							index = i;
							item = j;
							break;
						}
					}
				}
				if(flag == true)
					banks[index][item] = newid;
				else{
					var json = JSON.parse("{\""+bank+"\":\""+newid+"\"}");
					banks.push(json);
				}
			} else {
				//banks[bank+""] = newid;
				//eval("banks.push({\""+bank+"\":\""+newid+"\"}");

				var json = JSON.parse("{\""+bank+"\":\""+newid+"\"}");
				banks.push(json);
			}

			//alert(banks);

			var str = JSON.stringify(banks);
			//this.$refs.bank_list.value = str;

			this.paymentParams.bank_list = str;
		},
	},
	mounted() {
		this.getPayChannelList()
		this.payCertifyType()
		this.stdBanks()
	}
}