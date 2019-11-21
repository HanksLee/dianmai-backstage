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
			withdraw: {},
			params: { // 搜索接口的数据
				organ_id: '',
				zone_id: '',
				zone_ids: '',
				check_status: '',
				start_time: '',
				end_time: '',
				user_name: '',
				page_no: '', // 页码
				excel: ''
				//page_size: '' // 条数
			},
			regParams: { // 划转登记参数
				id: '', // 记录id
				pay_sn: '', // 订单号
				real_name: '', // 用户姓名
				channel_id: '', // 支付渠道
				real_money: '', // 划款金额
				comment: ''
			},

			options: [{ // 搜索栏-审核状态
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
				label: '驳回'
			}],

			payTypes: [],

			detailDialogShow: false, // 查看详情弹窗
			dialogShow: false, // 划转登记弹窗
			dialogTitle: "划款登记", // 划转登记弹窗的title
			downloadLoading: false, // 导出excel表
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
			if(data.cmd == '2') { // 划转登记
				this.dialogShow = true
				this.withdrawStatus(data.row)
			}
		},

		// 查看详情
		showDetail(row) {
			this.detailDialogShow = true;
			this.withdraw = row;
			commonRequest('withdrawDetail', {
				id: this.withdraw.id
			}).then(res => {
				if(res.code == '200') {
					this.withdraw = res.data
				}
			})
		},

		// 划转登记-显示
		withdrawStatus(row) {
			commonRequest('withdrawStatus', {
				id: row.id
			}).then(res => {
				if(res.code == '200') {
					this.regParams = res.data
				}
			})
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

		submit() {
			commonRequest('withdrawChange', this.regParams).then(res => {
				if(res.code == '200') {
					this.dialogShow = false
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)
				}
			})
		},

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
			commonRequest('getWithdrawList', this.params).then(res => {
				this.loading = false
				if(res.code == '200') {
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
	const { columns, data } = param
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
		if(index === 8){
			sums[index] = Math.round(Number(sums[index]) * 100) / 100
		}else{
			sums[index] = '--'
		}
	  } else {
		sums[index] = '--'
	  }
	})
	return sums
  },
		// 获取支付类型
		getPayTypes(row) {
			//  获取支付类型
			commonRequest('getWithdrawPayTypes').then(res => {
				if(res.code == '200') {
					this.payTypes = res.data;
				}
			});
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
			commonRequest("getWithdrawList", this.params).then(res => {
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