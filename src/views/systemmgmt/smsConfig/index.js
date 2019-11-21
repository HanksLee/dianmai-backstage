import { commonRequest } from '@/api/api-systemmgmt'
import paging from 'components/paging/index.vue'

export default {
	components: {
		paging
	},
	data() {
		return {
			activeName: 'smsChannel', // 默认打开短信通道
			isDisabled: false, // 短信通道是否可以编辑
			loading: false,
			
			page: {},//存放分页数据
			
			smstList: [],
			smstParams: { // 短信模板编辑弹窗中的数据绑定
				id: '',
				type_name: '',
				content: '',
				using_flag: '', // 是否启用 0-禁用 1-启用
			},
			preview: { // 短信模板预览
				title: '',
				content: ''
			},
			smscList: [],
			smscParams: { // 短信通道编辑弹窗中的数据绑定
				id: '',
				api_id: '',
				api_key: '',
				channel_type: '',
				other_params: '',
				comment: '',
				using_flag: 0, // 是否启用 0-禁用 1-启用
			},
			channelTypeOptions: [], // 短信通道下拉框选项
			smscTestParams: {
				mobile: '',
				content: ''
			},

			smstDialogShow: false, // 短信模板编辑弹窗 默认关闭
			smstDialogShowPreView: false, // 短信模板预览弹窗 默认关闭
			smscDialogShow: false, // 短信通道编辑添加弹窗
			smscDialogShowTest: false, //短信通道测试弹窗

			smstDialogTitle: '', // 短信模板标题
			smscDialogTitle: '', // 短信通道标题
			url: '', // 接口变量
		}
	},
	// 计算属性 启用 禁用
	computed: {
		isUsing: {
			// getter
			get: function() {
				return this.smstParams.using_flag == 1 || this.smscParams.using_flag == 1
			},
			// setter
			set: function(newValue) {
				this.smstParams.using_flag = newValue ? 1 : 0
				this.smscParams.using_flag = newValue ? 1 : 0
			}
		},
	},
	methods: {
		// 添加短信通道
		addSmsChannel() {
			this.isDisabled = false
			this.smscDialogShow = true
			this.smscDialogTitle = '添加短信通道'
			this.url = 'smsChannelAdd'
			for(let i in this.smscParams) {
				this.smscParams[i] = ''
			}
			this.smscParams.using_flag = 0
		},
		
		// 短信通道操作
		smscHandleCommand(dataSet) {
			const row = dataSet.row,
				type = dataSet.type
			switch(type) {
				case 'usingFlag':
					// 如果未启用 则启用
					if(row.using_flag == '0') {
						row.using_flag = '1'
						this.getSmsChannelTurn(row.using_flag, row.id)
					}
					// 如果启用 则禁用
					else if(row.using_flag == '1') {
						row.using_flag = '0'
						this.getSmsChannelTurn(row.using_flag, row.id)
					}
					break
				case 'edit':
					// 编辑展示大框
					this.smscDialogShow = true
					this.url = 'smsChannelEdit'
					this.isDisabled = true
					this.smscDialogTitle = '编辑短信通道'
					// 赋值
					const keys = Object.keys(this.smscParams)
					for(const k of keys) {
						this.smscParams[k] = row[k]
					}
//					this.smscParams.channel_type = Number(row.channel_type)
					break
				case 'test':
					this.smscDialogShowTest = true
					break
			}
		},
		
		// 短信模板操作
		smstHandleCommand(dataSet) {
			const row = dataSet.row,
				type = dataSet.type
			switch(type) {
				case 'usingFlag':
					// 如果未启用 则启用
					if(row.using_flag == '0') {
						row.using_flag = '1'
						this.getSmsTemplateTurn(row.using_flag, row.id)
					}
					// 如果启用 则禁用
					else if(row.using_flag == '1') {
						row.using_flag = '0'
						this.getSmsTemplateTurn(row.using_flag, row.id)
					}
					break
				case 'edit':
					// 编辑展示大框
					this.smstDialogShow = true
					this.smstDialogTitle = '编辑短信模板'
					// 赋值
					this.smstParams.id = row.id
					this.smstParams.content = row.content
					this.smstParams.using_flag = row.using_flag
					this.smstParams.type_name = row.type_name
					break
				case 'preview':
					this.preview.title = row.type_name
					this.preview.content = row.content
					this.smstDialogShowPreView = true
					break
			}
		},
		
		// 重置短信模板
		smstReset() {
			this.smstParams.content = ''
			commonRequest('smstReset', {
				id: this.smstParams.id
			}).then(res => {
				if(res.code == '200') {
					this.smstParams.content = res.data.content
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 短信模板添加提交
		smstSubmit() {
			const data = this.smstParams
			commonRequest('smsTemplateEdit', data).then(res => {
				if(res.code == '200') {
					this.smstDialogShow = false
					this.$message(res.msg)
					this.getSmsTemplateList()
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 短信通道提编辑提交
		smscSubmit() {
			const data = this.smscParams
			commonRequest(this.url, data).then(res => {
				if(res.code == '200') {
					this.smscDialogShow = false
					this.$message(res.msg)
					this.getSmsChannelList()
				}
			})
		},

		// 获取短信模板列表
		getSmsTemplateList() {
			this.loading = true
			commonRequest('smsTemplateList', {
				page_no: this.$refs.subassemblyData.page_no || 1, // 页码
				page_size: this.$refs.subassemblyData.page_size || 20 // 条数
			}).then(res => {
				if(res.code == '200') {
					this.loading = false
					this.smstList = res.data.page_data
					this.page = res.data.page || {}
				} else {
					this.$message(res.msg)
				}
			})
		},
		
		// 短信模板启用禁用
		getSmsTemplateTurn(val, id) {
			commonRequest('smsTemplateTurn', {
				id: id,
				using_flag: val
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 获取短信通道列表
		getSmsChannelList() {
			commonRequest('smsChannelList').then(res => {
				if(res.code == '200') {
					this.smscList = res.data.page_data
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 获取短信通道类型
		getSmsChannelType() {
			commonRequest('smsChannelType').then(res => {
				if(res.code == '200') {
					this.channelTypeOptions = res.data
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 短信通道启用禁用
		getSmsChannelTurn(val, id) {
			commonRequest('smsChannelTurn', {
				id: id,
				using_flag: val
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
				}
			})
		},

		// 短信测试
		sendSmsForm() {
			if(this.smscTestParams.mobile == '') {
				this.$message('手机号码不能为空')
				return false
			}
			commonRequest('smsChannelTest', {
				mobile: this.smscTestParams.mobile,
				content: this.smscTestParams.content
			}).then(res => {
				if(res.code == '200') {
					this.$message(res.msg)
				} else {
					this.$message(res.msg)
					this.smscDialogShowTest = false
				}
			})
		},
	},
	mounted() {
		this.getSmsTemplateList()
		this.getSmsChannelList()
		this.getSmsChannelType()
	},
}