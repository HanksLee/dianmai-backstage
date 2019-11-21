import { commonRequest } from '@/api/api-risk'
import { formatDate } from '@/utils/data.js'
import paging from 'components/paging/index.vue'
import checkUserOutFeeBox from './check_outfee/index.vue'

export default {
	components: {
		paging,
		checkUserOutFeeBox
	},
	data() {
		return {
			s_time: [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()],
			pickerOptions1: this.timeData(),

			loading: false,

			list: [],
			page: {}, // 存放分页数据
			withdraw: {},
			checkData: {
				id: '',
				check_type: '',
				check_status: '', // 审核状态
				comment: '', // 审批意见
				title: '提现审核',
				show: false,
				type: ['审核通过', '拒绝申请', '废单处理'],
				loading: {
					'state1': false, // 审核通过
					'state2': false, // 拒绝申请
					'state3': false //废弃处理
				},
				short_name: '' // 归属
			},

			options: [{
				value: '',
				label: '全部'
			}, {
				value: '0',
				label: '未审核'
			}, {
				value: '1',
				label: '审核通过'
			}, {
				value: '2',
				label: '驳回申请'
			}],

			options1: [{
				value1: '',
				label: '全部'
			}, {
				value1: '0',
				label: '已划款'
			}, {
				value1: '1',
				label: '未划款'
			}],
			value1: '',

			payTypes: [],
			params: { // 搜索接口的数据  0-未审核，1-审核通过，2-审核拒绝
				start_time: '',
				end_time: '',
				user_name: '',
				check_status: '',
				charge_status: '',
				page_no: '',
				page_size: '',
				excel: null
				//              page_size: ''
			},
			downloadLoading: false, // 导出表格
			dialogShow: false, // 弹窗默认关闭
			dialogDetailShow: false, // 查看详情弹窗
			dialogTitle: "划款登记", // 弹窗的title
			dialogVisible: false,
			comment: '',
			url:''
		}
	},

	//	filters: {
	//		filter_payType(value, pay_types) {
	//			if(pay_types && pay_types.length > 0) {
	//				const type = pay_types.find(function(item, index, arr) {
	//					return item.pay_type == value
	//				})
	//				if(type) {
	//					return type.pay_name
	//				} else {
	//					return ''
	//				}
	//			} else {
	//				return ''
	//			}
	//		}
	//	},

	filters: {
		btnText(val) {
			return val > 0 ? '查看' : '审核'
		},
		//      fl_tree(val) {
		//          if (val) {
		//              var split_array = val.split('/')
		//              return split_array[split_array.length - 1]
		//          } else {
		//              return ''
		//          }
		//      },
	},

	methods: {
		//  简单格式化
		dateFormat(date) {
			return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
		},

		showCheckDialog(row) {
			this.checkData.loading.state1 = false // 审核通过
			this.checkData.loading.state2 = false // 拒绝申请
			this.checkData.loading.state3 = false // 废弃处理
			this.checkData.show = true // 审核窗口弹出
			this.checkData.id = row.id
			this.checkData.check_type = row.check_type
			this.checkData.check_status = row.check_status // 审核状态
			this.checkData.comment = row.comment // 审核意见
			this.checkData.title = '提现审核'
			this.checkData.short_name = row.short_name
			for (let item of this.options) {
				if (item.value == row.check_type) {
					this.checkData.title = item.label + '审核'
					break
				}
			}
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

		search() {
			this.params.page_no = 1;
			this.params.start_time = this.s_time[0] ? this.dateFormat(this.s_time[0]) : "";
			this.params.end_time = this.s_time[1] ? this.dateFormat(this.s_time[1]) : "";
			this.getList();
		},

		getList() {
			this.params.excel = null
			this.loading = true
			this.params.page_no = this.$refs.subassemblyData.page_no
			this.params.page_size = this.$refs.subassemblyData.page_size
			if (this.s_time != "" && this.s_time[0] != null) {
				this.params.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd hh:mm:ss');
				this.params.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd hh:mm:ss');
			}
			commonRequest("getWithdrawList", this.params).then(res => {
				this.loading = false
				if (res.code == '200') {
					this.page = res.data.page || {}
					this.list = res.data.page_data || []
					this.formattedData()
				} else {
					this.$message(res.msg)
				}
			}).catch(error => {
				this.loading = false
			})
		},
		formattedData() {
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].money = Number(this.list[i].money)
			}
		},
		statusChange(row, column, cellValue) {
			let mapType = {
				"0": "未审核",
				"1": "审核通过",
				"2": "驳回申请",
				"3": "废弃处理"
			}
			return mapType[cellValue];
		},

		checkSubmit(op_type) { // 提交审核
			commonRequest('withdrawCheck', {
				id: this.checkData.id,
				check_status: op_type,
				comment: this.checkData.comment || ''
			}).then(res => {
				if (res.code == '200') {
					this.checkData.show = false
					this.$message(res.msg)
					this.getList()

				} else {
					this.$message(res.msg)
				}
			})
		},
		//导出excel表格
		handleDownload() {
			this.downloadLoading = true
			this.params.excel = 1
			if (this.s_time != "" && this.s_time[0] != null) { // 默认选择时间范围
				this.params.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd hh:mm:ss');
				this.params.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd hh:mm:ss');
			}
			commonRequest("getWithdrawList", this.params).then(res => {
				this.downloadLoading = false
				if (res.code == 200) {
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
		//			this.params.start_time = this.s_time[0] ? this.dateFormat(this.s_time[0]) : "";
		//			this.params.end_time = this.s_time[1] ? this.dateFormat(this.s_time[1]) : "";
		const domain = document.domain
        const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
        this.url = firstDomain
		this.getList();
	}

}