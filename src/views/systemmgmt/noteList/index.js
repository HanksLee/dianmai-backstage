import { commonRequest } from '@/api/api-systemmgmt'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			loading: false,
			list: [],
			page: {}, //存放分页数据
			keyword: '',
			checkTime: [],
			pickerOptions1: this.timeData(),
		}
	},
	methods: {
		getList() {
			this.loading = true
			const dataTimeObj = this.timeFormatFn(this.checkTime) || '' //获取全局时间处理方法
			commonRequest('smssendList', {
				keyword: this.keyword,
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20, // 条数
				start_time: dataTimeObj.active_start_time || '',
				end_time: dataTimeObj.active_end_time || ''
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.list = res.data.data
					this.page = res.data.page_data || {}
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			})
		},
		searchList(){
			this.getList()
		},
		changeStatus(val) { // val为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			if(val == null) {
				return false
			} else {
				this.getList()
			}
		},
	},
	mounted() {
		this.getList()
	}
}