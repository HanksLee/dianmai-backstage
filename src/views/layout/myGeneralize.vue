<template>
	<div class="app-wrapper generalize">
		<!--新增客户-->
		<el-row class="margin-high">
			<el-col>
				<span class="label">链接地址：</span>
				<span class="label-val"><el-input placeholder="" v-model="input" :disabled="true"></el-input>
              </span>
				<span><el-button v-if="dome=='1'" type="primary" @click="generate(input,true)">生成</el-button><el-button type="primary" @click="copy(input,false)">复制</el-button></span>
			</el-col>
				<div v-if="judge" style="padding-left:180px;padding-top:50px;"><img :src="url" width="150" height="150" atl="二维码"></div>
		</el-row>


	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
	.dialogMyGeneralize.dialog-large .dialog-page-con {
		padding-top: 35px;
	}
	
	.generalize {
		.margin-high span {
			display: inline-block;
		}
		.el-col-12 {
			width: 100%;
		}
		.label-val {
			width: 400px;
		}
	}
</style>
<script>
    import config from '@/api/config-client'
	import { commonRequest } from '@/api/api-systemmgmt'
	import Cookies from 'js-cookie'
	export default {
		data() {
			return {
				dome:'1',
				t: true,
				createTitle: '生成',
				channel_qr: 0,
				url: '',
				index: '',
				input: '',
				ib: '',
				judge: false,
				QRCode: '',
			}
		},
		methods: {
			// getMyList() {
			// 	getSystemmgmtAPI('myspreadurl').then(res => {
			// 		if(res.code == 200) {
			// 			this.input = res.data.spread_url
			// 			this.ib = res.data.ib
			// 		} else {
			// 			this.$message(res.msg)
			// 		}
			// 	})
			// },
			// 获取渠道列表
			getList() {
				commonRequest('mymarketurl').then(res => {
					if(res.code == 200) {
						this.input = res.data.market_url
					} else {
						this.$message(res.msg)
					}
				})
			},
			/*生成二维码*/
			generate() {
				const token = Cookies.get('token') || ''
				this.url = config.api + '/v1/user/qrimg?token='+ token
				//this.url = '//api.dianmai361.com/v1/user/qrimg?token='+token+''
				this.judge = true
			},
			/* 复制链接*/
			copy(val, t) {
				var textArea = document.createElement('textarea')
				textArea.style.position = 'fixed'
				textArea.style.left = '-10000px'
				textArea.style.top = '-10000px'
				document.body.appendChild(textArea)
				if(t == this.t) {
					textArea.value = val.spread_url
				} else {
					textArea.value = val
				}
				this.$message('已复制到剪贴板')
				textArea.select()
				document.execCommand('copy')
				document.body.removeChild(textArea)
			},
		},
		mounted() {
			var firstDomain = window.location.hostname.replace('broker.', '')
			if(firstDomain == 'kinderwy.com') {
				this.dome = '0'
			}
		},
		created() {
//			this.getMyList()
			this.getList()
		},
		destroyed() {}
	}
</script>