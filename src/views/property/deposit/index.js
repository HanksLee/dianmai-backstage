import { commonRequest } from '@/api/api-property'
import { formatDate } from '@/utils/data.js'
import userScreening from 'components/userScreening/index.vue'
import paging from 'components/paging/index.vue'
export default {
	components: {
		userScreening, // 用户筛选组件
		paging // 分页组件
	},
	data() {
		return {
			s_time: [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()],
			pickerOptions1: this.timeData(),
			page: {}, //存放分页数据
			loading: false,
			emptyText: '数据加载中...',
			list: [],
			deposit: {}, // 查看详细
			params: { // 搜索接口的数据
				organ_id: '',
				zone_id: '',
				zone_ids: '',
				pay_status: '',
				channel_name: '',
				start_time: '',
				end_time: '',
				user_name: '',
				page_no: '', // 页码
				keyword: '',
				excel: ''
				//				page_size: '' // 条数
			},
			payOptions: [{ // 搜索栏-支付状态下拉选项
				value: '',
				label: '全部'
			}, {
				value: '0',
				label: '未支付'
			}, {
				value: '1',
				label: '已支付'
			}],
            options:[
				{
					"name": "全部",
				    "id": ""
				},
				{
					"name": "存入金额",
				    "id": "money"
				},
				{
					"name": "支付单号",
				    "id": "pay_sn"
				},
				{
					"name": "姓名",
				    "id": "real_name"
				}
			],
			payTypes: [],
			status: { // 更改状态弹窗中的信息
				id: '',
				real_name: '',
				customer_id: '',
				pay_sn: '',
				pay_status: '',
				charge_status: '',
				comment: '',
				loading: false
			},
			paymentStatus: [{ // 更改状态弹窗中的支付状态
				id: '0',
				name: '未支付'
			}, {
				id: '1',
				name: '已支付'
			}],
			rechargeState: [{ // 更改状态弹窗中的充值状态
				id: '0',
				name: '未充值'
			}, {
				id: '1',
				name: '已充值'
			}],

			detailDialogShow: false, // 查看详情弹窗
			statusDialogShow: false, // 更改状态弹窗
			downloadLoading: false, // 导出excel表
			disabled: false,
			disabled1: false,
            url:''
		}
	},

	methods: {
		// 时间简单格式化
		dateFormat(date) {
			return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
		},

		// 操作
		handleCommand(data) {
			if(data.cmd == '1') { // 查看详情
				this.showDetail(data.row)
			}
			if(data.cmd == '2') { // 更改状态
				this.statusDialogShow = true
				this.disabled = false
				this.disabled1 = false
				this.depositStatus(data.row)
			}
		},

		// 查看详情
		showDetail(row) {
			this.detailDialogShow = true;
			this.deposit = row;
			commonRequest('depositDetail', {
				id: this.deposit.id
			}).then(res => {
				if(res.code == '200') {
					this.deposit = res.data
				}
			})
		},

		// 更改状态-显示
		depositStatus(row) {
			commonRequest('depositStatus', {
				id: row.id
			}).then(res => {
				if(res.code == '200') {
					this.status = res.data
					if(this.status.pay_status == '1'){
                        this.disabled = true  
					}
					if(this.status.charge_status == '1'){
                        this.disabled1 = true  
					}
				}
			})
		},
		//更改状态-提交
		modifyState() {
			this.status.loading = true
			const params = {
				id: this.status.id,
				pay_status: this.status.pay_status,
				charge_status: this.status.charge_status,
				comment: this.status.comment
			}
			commonRequest("depositChange", params).then(res => {
				if(res.code == 200) {
					this.status.loading = false
					this.statusDialogShow = false
					this.$message(res.msg)
					this.getList()
				} else {
					this.status.loading = false
					this.$message(res.msg)
				}
			});
		},

		moneyChange(row, column, cellValue) {
			// 暂时用此来代替
			let type = column.property == "from_money" ? row.from_currency_symbol : row.to_currency_symbol;
			return cellValue + type;
		},

		statusChange(row, column, cellValue) { //0-未审核，1-审核通过，2-审核拒绝，3-废单处理，4-审核失败
			const statusMap = {
				"0": "未审核",
				"1": "审核通过",
				"2": "未通过",
				"3": "废单处理",
				"4": "审核失败"
			};
			return statusMap[cellValue];
		},

		// 搜索栏-时间范围搜索
		selectTime() {
			this.params.pageNo = 1
			this.params.start_time = this.s_time[0] ? this.dateFormat(this.s_time[0]) : "";
			this.params.end_time = this.s_time[1] ? this.dateFormat(this.s_time[1]) : "";
			this.getList()
		},

		// 搜索栏-姓名
		search() {
			this.params.page_no = 1;
			this.getList();
		},

		// 搜索栏-支付状态和支付渠道搜索
		changeStatus() {
			this.getList()
		},

		// 获取入金列表
		getList() {
			this.params.excel = null
			this.loading = true
			this.params.page_size = this.$refs.subassemblyData.page_size || 20 // 条数
			this.params.page_no = this.$refs.subassemblyData.page_no || 1 // 页码
			this.params.organ_id = this.$refs.userScreeningDataInterface.mechanism.value
			this.params.zone_id = this.$refs.userScreeningDataInterface.zone_id
			this.params.zone_ids = this.$refs.userScreeningDataInterface.user_id // 用户筛选
			if(this.s_time != "" && this.s_time[0] != null) { // 默认选择时间范围
				this.params.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd hh:mm:ss');
				this.params.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd hh:mm:ss');
			}
			commonRequest("getDepositList", this.params).then(res => {
				this.loading = false
				if(res.code == 200) {
					this.page = res.data.page || {}
					this.list = res.data.page_data || []
					this.emptyText = '暂无数据'
					this.formattedData()
				} else {
					this.emptyText = '暂无数据'
				}
			}).catch(error => {
				this.loading = false
			})
		},
		formattedData() {
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].money = Math.round(Number(this.list[i].money) * 100) / 100
			}
		},
		//计算合计
		getSummaries(param) {
			const {
				columns,
				data
			} = param
			const sums = []
			columns.forEach((column, index) => {
				if(index === 0) {
					sums[index] = '合计'
					return
				}
				const values = data.map(item => Number(item[column.property]))
				if(!values.every(value => isNaN(value))) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr)
						if(!isNaN(value)) {
							return prev + curr
						} else {
							return prev
						}
					}, 0)
					if(index === 4) {
						sums[index] = Math.round(Number(sums[index]) * 100) / 100
					} else {
						sums[index] = '--'
					}
				} else {
					sums[index] = '--'
				}
			})
			return sums
		},
		typeChange(row, column, cellValue) {
			const mapType = this.payTypes || [{
					"pay_type": "0",
					"pay_name": "电汇"
				},
				{
					"pay_type": "1",
					"pay_name": "网银"
				},
				{
					"pay_type": "2",
					"pay_name": "银联"
				},
				{
					"pay_type": "3",
					"pay_name": "国付宝"
				}

			];
			for(let item of mapType) {
				if(item.pay_type == cellValue) {
					return item.pay_name;
				}
			}
			return "查不到类型";
		},

		// 获取支付类型
		getPayTypes() {
			//  获取支付类型
			commonRequest('getDepositPayTypes', {
				params: []
			}).then(res => {
				if(res.code == '200') {
					this.payTypes = res.data;
				}
			});
		},

       //类型筛选
		changeOptions(val){
           this.params.keyword = val
		},

		//导出excel表格
		handleDownload() {
			this.downloadLoading = true
			this.params.organ_id = this.$refs.userScreeningDataInterface.mechanism.value
			this.params.zone_id = this.$refs.userScreeningDataInterface.zone_id
			this.params.zone_ids = this.$refs.userScreeningDataInterface.user_id // 用户筛选
			this.params.excel = 1
			if(this.s_time != "" && this.s_time[0] != null) { // 默认选择时间范围
				this.params.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd hh:mm:ss');
				this.params.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd hh:mm:ss');
			}
			commonRequest("getDepositList", this.params).then(res => {
				this.downloadLoading = false
				if(res.code == 200) {
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = res.data.page_data.file
					//link.setAttribute('download', '持仓明细.csv')
					document.body.appendChild(link)
					link.click()	 
				} else {
					this.$message(res.msg)
				}
			}).catch(error => {
				this.downloadLoading = false
			})
			
		},
	},

  mounted() {
        const domain = document.domain
        const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
        this.url = firstDomain
    this.getList()
    this.getPayTypes()
  }

}
