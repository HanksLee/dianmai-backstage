import { commonRequest } from '@/api/api-risk'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	props: ['checkData'],
	data() {
		return {
			baseInfo: {}, // 出金基本信息
			list: [],
			page: {}, // 存放分页数据
			checked: true,
			belong_to_name_tree: '',
			pageSize: 5,
			page: {},
			url: ''
		}
	},
	watch: {
		'checkData.show'() {
      if (this.checkData.show) {
      	console.log(this.checkData.show)
        this.getwithdrawDetail()
        this.clearData()
      }
    }
	},
	methods: {
		getCheckInfo() { // 审核所需数据
			return {}
		},
		clearData() { // 清除所有数据
			this.list = []
			this.page = {
				total: 0,
				page_no: 1
			}
		},
		getwithdrawDetail() {
			commonRequest('withdrawDetail', {
				id: this.checkData.id,
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size
			}).then(res => {
				if(res.code == 200) {
					this.page = res.data.page || {}
					this.baseInfo = res.data
					this.list = res.data.list.page_data
					this.page = res.data.list.page || {}
				} else {
					this.$message('获取出金申请信息失败')
				}
			})
		},
	},
  mounted() {
        const domain = document.domain
        const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
        this.url = firstDomain
    this.getwithdrawDetail()
  }
}
