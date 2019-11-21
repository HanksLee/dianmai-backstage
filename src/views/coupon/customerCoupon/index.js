import { commonRequest } from '@/api/api-coupon.js'
import userScreening from 'components/userScreening/index.vue'
import paging from 'components/paging/index.vue'

export default {
	components: {
		userScreening,
		paging
	},
	data() {
		return {
			loading: false,
			
			list: [],
			page: {}, //存放分页数据
			keyword: '',
		}
	},
	methods: {
		getList() {
			this.loading = true
			commonRequest('customerCouponList', {
				keyword: this.keyword,
				page_no: this.$refs.subassemblyData.page_no, // 页码
				page_size: this.$refs.subassemblyData.page_size, // 条数
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				zone_ids: this.$refs.userScreeningDataInterface.user_id // 用户筛选
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.list = res.data.page_data || []
					this.page = res.data.page || {}
					this.formattedData()
				} else {
					this.loading = false
					this.$message(res.msg)
				}
			})
		},
		formattedData() {
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].div_money = Number(this.list[i].div_money)
				this.list[i].limit_money = Number(this.list[i].limit_money)
			}
		},
		searchList() {
			this.pageNo = 1
			this.getList()
		},
	},
	mounted() {
		this.getList()
	}
}