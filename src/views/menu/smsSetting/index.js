import userScreening from 'components/userScreening/index.vue'
import { commonRequest } from '@/api/api-developer'
export default {
	components: {
		userScreening,
	},
	data() {
		return {
			list: [],
			addPaymentDialog: false,
			loding: false,
			
			certify_type: [{
				value: '0',
				label: 'md5'
			}, {
				value: '1',
				label: 'RSA证书'
			}, {
				value: '2',
				label: 'RSA公钥私钥'
			}, {
				value: '3',
				label: '3DES'
			}],
			value: '',
		}
	},
	methods: {
		add() {
			this.addPaymentDialog = true
		},
		
		getList() {
			this.loading = true
			commonRequest('smsChannelTypeList').then(res => {
				if(res.code == '200') {
					this.loading = false
					this.list = res.data.page_data
				} else {
					this.loding = false
					this.$message(res.msg)
				}
			})
		}
	},
	created() {
		this.getList()
	}
}