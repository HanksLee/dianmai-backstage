import detailedFrame from 'components/detailedFrame/index.vue'
import customerFrame from 'components/customerFrame/index.vue'
import { formatDate } from '@/utils/data.js'
import { commonRequest } from '@/api/api-risk.js'

export default {
	components: {
		detailedFrame,
		customerFrame
	},
	data() {
		return {
			s_time: [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()],
			pickerOptions1: this.timeData(),
			loading: false,

			dealDetailVisible: false,

			list: [],
			historyList: [],

			historyParams: {
				page_size: 5,
				page_no: 1,
				total: 0,
				keyword: '',
				start_time: '',
				end_time: ''
			},
			params: {
				keyword: '',
				margin_warning_min: '',
				margin_warning_max: ''
			},
			dialogShow: false,
		}
	},
	methods: {
		//  简单格式化
		dateFormat(date) {
			return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
		},
		
		// 操作
		handleCommand(data) {
			if(data.cmd == '1') { // 强制平仓
				this.dialogShow = true
			} else if(data.cmd == '2') { // 查看详情
				this.$refs.obtainCustomer.details('customer','详细信息',data.row)
			}
		},

		searchList() {
			this.getList()
		},

		historySearch() {
			this.historyParams.start_time = this.s_time[0] ? this.dateFormat(this.s_time[0]) : "";
			this.historyParams.end_time = this.s_time[1] ? this.dateFormat(this.s_time[1]) : "";
			this.getHistoryList()
		},

		getHistoryList() {
			this.dealDetailVisible = true
			if(this.s_time != "" && this.s_time[0] != null) {
				this.historyParams.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd hh:mm:ss');
				this.historyParams.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd hh:mm:ss');
			}
			commonRequest('historySearch', this.historyParams).then(res => {
				if(res.code == '200') {
					this.historyList = res.data.data
					this.historyParams.page_no = Number(res.data.page.page_no)
					this.historyParams.total = Number(res.data.page.total)
				} else {}
			})
		},
		
		changePage(val) {
			this.historyParams.page_no = val
			this.getHistoryList()
		},
		
		getList() {
			this.list = []
			this.loading = true
			commonRequest('warningList', {
				keyword: this.params.keyword,
				margin_warning_min: this.params.margin_warning_min,
				margin_warning_max: this.params.margin_warning_max
			}).then(res => {
				if(res.code == '200') {
					this.list = res.data
					this.loading = false
				} else {
					this.emptyText = '暂无数据'
					this.loading = false
				}
			})
		}
	},
	mounted() {
		this.getList()
	}
}