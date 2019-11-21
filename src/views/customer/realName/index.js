import { commonRequest } from "@/api/api-customer"
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
			emptyText: '数据加载中...',
			checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date()],
			pickerOptions1: this.timeData(),
			page: {},
			options: [{
					value: '',
					label: '全部'
				},
				{
					value: '0',
					label: '未审核'
				},
				{
					value: '1',
					label: '审核成功'
				},
				{
					value: '2',
					label: '审核失败'
				}
			],
			checkData: {
				id: '',
				check_type: '',
				check_status: '0', // 审核状态
				comment: '', // 审批意见
				title: '实名审核',
				dialogVisible: false,
				type: ['审核通过', '拒绝申请'],
				loading: {
					'state1': false, // 审核通过
					'state2': false, // 拒绝申请
					'state3': false //废弃处理
				},
			},
			check_status: '',
			list: [],
			pic: {
				img_1: '',
				img_2: '',
				img_name1: '',
				img_name2: '',
				showToast1: true,
				showToast2: true,
				toastTaxt1: '此用户没有上传身份证正面照',
				toastTaxt2: '此用户没有上传身份证反面照',
			},
			comment: '',
			id: '',
			real_name: '',
			mobile: '',
			parent_name: '',
			demo_flag: ''
		}
	},
	filters: {
		btnText(val) {
			return val > 0 ? '查看' : '审核'
		}
	},
	methods: {
		showCheckDialog(row) {
			this.checkData.loading.state1 = false // 审核通过
			this.checkData.loading.state2 = false // 拒绝申请
			this.checkData.loading.state3 = false // 废弃处理
			this.checkData.dialogVisible = true // 审核窗口弹出
			this.checkData.id = row.id
			this.checkData.check_type = row.check_type
			this.checkData.check_status = row.check_status // 审核状态
			this.checkData.comment = row.comment // 审核意见
			this.checkData.title = '实名审核'
			this.pic = row
			this.pic.showToast1 = true
			this.pic.showToast2 = true
			this.real_name = row.real_name
			this.mobile = row.mobile
			this.parent_name = row.parent_name
			this.demo_flag = row.demo_flag
			if(!this.pic.img_1) {
				this.pic.showToast1 = true
				this.pic.toastTaxt1 = '请上传身份证正面照片'
			} else {
				this.pic.showToast1 = false
			}
			if(!this.pic.img_2) {
				this.pic.showToast2 = true
				this.pic.toastTaxt2 = '请上传身份证反面照片'
			} else {
				this.pic.showToast2 = false
			}
		},

		//获取列表
		getList() {
			const dataTimeObj = this.timeFormatFn(this.checkTime) //获取全局时间处理方法
			this.loading = true
			commonRequest('realNameList', {
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
				organ_id: this.$refs.userScreeningDataInterface.mechanism.value,
				zone_id: this.$refs.userScreeningDataInterface.zone_id,
				user_id: this.$refs.userScreeningDataInterface.user_id,
				check_status: this.check_status,
				start_time: dataTimeObj.active_start_time || '',
				end_time: dataTimeObj.active_end_time || ''
			}).then(res => {
				this.loading = false
				if(res.code == 200) {
					this.list = res.data.page_data || []
					this.page = res.data.page || {}
					this.emptyText = '暂无数据'
				} else {
					this.emptyText = '暂无数据'
				}
			}).catch(error => {
				this.loading = false
			})
		},
		checkSubmit(val) {
			commonRequest('realNameAudit', {
				id: this.checkData.id,
				check_status: val,
				comment: this.checkData.comment
			}).then(res => {
				if(res.code == '200') {
					this.checkData.dialogVisible = false
					this.getList()
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
				}
			})
		},
		changeStatus(val) {
			this.getList()
		},
		//审核筛选
		changeFn(val) {
			this.check_status = val
			this.getList()
		},
	},
	mounted() {
		this.getList()
	}
}