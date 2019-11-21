import userScreening from 'components/userScreening/index.vue'
import detailedFrame from 'components/detailedFrame/index.vue'
import { formatDate } from '@/utils/data.js'
export default {
	components: {
		userScreening,
		detailedFrame
	},
	data() {
		return {
			checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date(new Date() - 1 * 24 * 3600 * 1000)],
			pickerOptions1: this.timeData(),
			time: [new Date(new Date() - 2 * 24 * 3600 * 1000), new Date()],
			pageNo: 1,
			pageSize: this.InitialBarNumber,
			pageCount: 1,
			start_time: '',
			end_time: '',
			begin_time: '',
			end_time: '',
			account: '',
			list: [{
				real_name1: '1929923',
				real_name2: '吴志君',
				real_name3: 'ME2RSZ',
				real_name4: '2018-07-19 14:49:32',
				real_name5: '东方网力',
				real_name6: '300367',
				real_name7: '1000.00',
				real_name8: '900.00',
				real_name9: '10',
				real_name10: '10',
				real_name11: '12900',
				real_name12: '1000.00',
				real_name13: '买/卖',
				real_name14: '20',
				real_name15: '19235.8',
				real_name16: '未成交/全部成交/部分成交',
				real_name17: '3',
				real_name18: '290.22',
				real_name19: 'T+1',
				real_name20: '1天',
				real_name21: '30',
				real_name22: '18',
				real_name23: '20'
			}],
			value: '',
			searchTypeList: [{
				value: '',
				label: '所有类型'
			},
			{
                value: '1',
                label: '买入中'
            },
            {
                value: '2',
                label: '买入成功'
            },
            {
                value: '3',
                label: '卖出中'
            },
            {
                value: '4',
                label: '卖出成功'
            },
			{
				value: '5',
				label: '已结算'
			},
			{
				value: '6',
				label: '买入撤单'
			},
			{
				value: '7',
				label: '卖出撤单'
			},
			{
				value: '8',
				label: '买入撤单中'
			},
			{
				value: '9',
				label: '卖出撤单中'
			}],
			nexus: {
				belongValue: '',
				value: '',
				options: []
			},
			UserScreening: {
				dialogVisible: false
			},
			userScreeningData: '',
		}
	},
	methods: {
		selectTime() {},
		searchList() {},
		getList() {},
		handleDownload() {
			const _t = this
			let start_time = '',
				end_time = ''
			if(this.time != '' && this.time[0] != null) {
				start_time = formatDate(this.time[0], 'yyyy-MM-dd hh:mm:ss')
				console.log(start_time)
				end_time = formatDate(this.time[1], 'yyyy-MM-dd hh:mm:ss')
			}

			const param = {
				belong_type: this.belong_store.type == '6' ? this.belong_store.type : this.belong_type,
				belong_value: this.belong_value,
				page_no: _t.pageNo,
				page_size: _t.pageSize,
				info_type: _t.searchType,
				info_content: _t.searchInput,
				cmd_type: _t.saleType,
				start_time: start_time,
				end_time: end_time
			}
			commonRequest('positionExport', param).then(res => {
				if(res.code == '201') {
					this.$message(res.msg)
					return
				}
				this.download(res)
			})
		},
		download(data) {
			if(!data) {
				return
			}
			let url = window.URL.createObjectURL(new Blob([`\ufeff${data}`]))
			let link = document.createElement('a')
			link.style.display = 'none'
			link.href = url
			link.setAttribute('download', '持仓明细.csv')
			document.body.appendChild(link)
			link.click()
		},
		// 分页
		handleSizeChange(val) {
			this.pageSize = parseInt(val)
			this.pageNo = 1
			this.getList()
			scrollTo(0, 0)
		},
		// 切换页码
		handleCurrentChange(val) {
			this.pageNo = val
			this.getNotifyLog()
			scrollTo(0, 0)
		},
	},
	created() {
	}
}