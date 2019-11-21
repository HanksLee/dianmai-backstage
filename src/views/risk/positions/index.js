import userScreening from 'components/userScreening/index.vue'
import paging from 'components/paging/index.vue'
import { commonRequest } from '@/api/api-risk.js'

export default {
	components: {
		userScreening,
		paging
	},
	data() {
		return {
			emptyText: '数据加载中...',
			loading: false,
			page: {}, //存放分页数据
			keyword: '',
			list: [],
			
		}
	},
	methods: {
		searchList() {
			this.getList()
		},
		getList() {
			this.loading = true
			commonRequest('positionList', {
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				zone_ids: this.$refs.userScreeningDataInterface.user_id,
				keyword: this.keyword || ''
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.page = res.data.page || {}
					this.list = res.data.data
					this.emptyText = '暂无数据'
				} else {
					this.loading = false
					this.emptyText = '暂无数据'
					this.$message(res.msg)
				}
			}).catch(error => {
				this.loading = false
			})
		}
	},
	mounted() {
		this.getList()
	}
}