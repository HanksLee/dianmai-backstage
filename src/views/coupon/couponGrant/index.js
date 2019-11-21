import { commonRequest } from '@/api/api-coupon.js'
import { formatDate } from '@/utils/data.js'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			list: [],
			page: {},//存放分页数据
			loading: false,
			
			grantParams: {
				id: '',
				broker_id: '', //'机构ID',
				policy_type: [], //'产品类型，针对那个产品进行营销,ss_policy_info,多个逗号分开',
				coupon_name: '', //'红包名称',
				limit_money: '', //'满多少金额',
				div_money: '', //'红包金额',
				all_count: '', //'累计发放数量',
				get_count: '', //'领取数量',
				consume_count: '', //'消费数量',
				start_time: '', //'起始时间', //yyyy-mm-dd hh:mm:ss
				activity_time: '', //'截止时间', //yyyy-mm-dd hh:mm:ss
				expire_time: '', //'有效时间,过期作废', //yyyy-mm-dd hh:mm:ss
				comment: '', // '备注',
			},
			grantOptions: [],

			grantDialogShow: false, // 红包发放弹窗 默认关闭
			grantDialogTitle: '', // 红包发放弹窗标题
			
			url: '' // 接口
		}
	},
	methods: {
		// 添加红包
		add() {
			this.grantDialogShow = true;
			this.grantDialogTitle = '添加红包'
			this.url = 'addCouponGrant'
			for(let i in this.grantParams) {
				this.grantParams[i] = ''
			}
			this.grantParams.policy_type = []
			this.grantParams.broker_id = 0
		},
		handleCommand(dataSet) {
			const row = dataSet.row,
				type = dataSet.type
			switch(type) {
				case 'edit':
					// 编辑展示大框
					this.grantDialogShow = true
					this.grantDialogTitle = '编辑红包'
					this.url = 'editCouponGrant'
					// 赋值
					const keys = Object.keys(this.grantParams)
					for(const k of keys) {
						this.grantParams[k] = row[k]
					}
					this.grantParams.policy_type = row.policy_type.split(',')
					break
			}
		},
		getList() {
			this.loading = true
			commonRequest('couponGrantList', {
				page_no: this.$refs.subassemblyData.page_no, // 页码
				page_size: this.$refs.subassemblyData.page_size // 条数
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
		formattedData(){
				for(let i = 0;i<this.list.length;i++){
					this.list[i].div_money = Number(this.list[i].div_money) 
					this.list[i].limit_money = Number(this.list[i].limit_money) 
				}
		},
		submit() {
			const data = this.grantParams
			data.policy_type = data.policy_type.join(',')
			data.start_time = formatDate(new Date(data.start_time), 'yyyy-MM-dd hh:mm:ss')
			data.activity_time = formatDate(new Date(data.activity_time), 'yyyy-MM-dd hh:mm:ss')
			data.expire_time = formatDate(new Date(data.expire_time), 'yyyy-MM-dd hh:mm:ss')
			commonRequest(this.url, data).then(res => {
				if(res.code == '200') {
					this.grantDialogShow = false
					this.$message(res.msg)
					this.getList()
				} else {
					this.$message(res.msg)	
				}
			})
		},
		//获取适应产品
		getSuit(){
			commonRequest('producttype').then(res =>{
				if(res.code == '200'){
					this.grantOptions = res.data
				}
			})
		}
	},
	mounted() {
		this.getList()
		this.getSuit()
	}
}