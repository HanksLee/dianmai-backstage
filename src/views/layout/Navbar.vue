<template>
	<el-menu class="navbar" mode="horizontal">
		<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
		<levelbar></levelbar>
		<tabs-view></tabs-view>
		<div class="float">
			<div v-if="userInfo.role_zone != 0" style="display:inline-block;padding-right:30px;font-size:16px;color:#20a0ff">
				<span style="padding-right:20px;">机构：{{userInfo.organ_name}}</span>
				<span>编码：{{userInfo.organ_code}}</span>
			</div>
			<!-- <div class="message" @click="getNotification">
				<el-dropdown trigger="click" @command="handleCommand">
					<span class="el-dropdown-link message-tip"><i class="fa fa-envelope"></i></span>
					<el-dropdown-menu class="w500" slot="dropdown">
						<div class="close" @click="closeFn"><i class="fa fa-close" style="font-size:18px;font-weight:normal;"></i></div>
						<el-dropdown-item v-model="messageList" v-for="item in messageList" :command="item.id" class="border clearfix" :key="item.content" :label="item.content" :value="item">
							<div>
								<strong>{{item.subject}}</strong><small style="float: right;">{{item.create_time}}</small>
							</div>
						</el-dropdown-item>
						<div class="pagination">
							<el-pagination small layout="prev, pager, next" @current-change="pageChange" :page-size="msgPage.page_size" :total="total" :current-page="msgPage.page_no">
							</el-pagination>
						</div>
					</el-dropdown-menu>
				</el-dropdown>
			</div> -->
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<!--<img class="user-avatar" src="static/images/common/avatar.png">-->
					<span class="user-name"><i class="fa fa-user"></i>{{userInfo.user_name}}</span>
					<i class="el-icon-caret-bottom"></i>
				</div>
				<el-dropdown-menu class="user-dropdown" slot="dropdown">
					<el-dropdown-item>
						<a id="crmHref" href="" target="_blank">我的CRM</a>
					</el-dropdown-item>
					<el-dropdown-item :class="{ popLink: isHide }"><span @click="myGeneralize" style="display:block;">我的推广</span></el-dropdown-item>
					<el-dropdown-item><span @click="xiu" style="display:block;">修改密码</span></el-dropdown-item>
					<el-dropdown-item><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<!-- 查看信息详情 -->
		<el-dialog :title="dialogTitle2" :visible.sync="dialogTableVisible" style="top:0;">
			<div class="message-box">
				<div class="massege-body">
					<div v-html="msgDetail.content"></div>
				</div>
				<div class="massege-foot">
					<p>{{msgDetail.create_time}}</p>
				</div>
			</div>
		</el-dialog>
		<!-- 我的推广链接 -->
		<el-dialog :title="dialogtitle" :visible.sync="dialogFormVisible4" class="dialog1 dialog-large dialog-bottom-fixed2 dialogMyGeneralize">
			<myGeneralize></myGeneralize>
		</el-dialog>
		<!-- 修改密码 -->
		<el-dialog :title="dialogTitle1" :visible.sync="dialogFormVisible1" class="dialog1 dialog-s">
			<div class="dialog-page">
				<div class="dialog-section">
					<el-form :model="form1" ref="form1" :rules="rule1">
						<el-row>
							<el-col :span="3"><span class="label"><span class="red">*</span>旧密码：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val" style="margin-bottom:10px;">
									<el-form-item prop="oldpwd">
										<el-input type="password" v-model="form1.oldpwd" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label"><span class="red">*</span>新密码：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val" style="margin-bottom:10px;">
									<el-form-item prop="newpwd">
										<el-input type="password" v-model="form1.newpwd" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label"><span class="red">*</span>确认新密码：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val" style="margin-bottom:5px;">
									<el-form-item prop="newpwd1">
										<el-input type="password" v-model="form1.newpwd1" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible1 = false">取 消</el-button>
						<el-button type="primary" @click="changePassword1">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</el-menu>
</template>
<script>
	import { mapGetters } from 'vuex'
	import Levelbar from './Levelbar'
	import TabsView from './TabsView'
	import Hamburger from 'components/Hamburger'
	import myGeneralize from './myGeneralize'
	import { commonRequest } from '@/api/api-login'
//	import { commonRequest } from '@/api/api-systemmgmt'
	import { goToLogin } from '@/utils/user'
	import { trim } from '@/utils/data'
	import { formatDate } from '@/utils/data.js'
	import Cookies from 'js-cookie'
	import store from '@/store'
	import { setUserCookieBs } from '@/utils/user'
	export default {
		components: {
			Levelbar,
			TabsView,
			Hamburger,
			myGeneralize
		},
		data() {
			return {
				isHide: false,
				messageList: [],
				msgDetail: '',
				create_time: '',
				userInfo:{},
				dialogFormVisible4: false,
				dialogtitle: '我的推广链接',
				dialogTitle1: '修改密码',
				dialogTitle2: '',
				dialogFormVisible1: false,
				total: 0,
				msgPage: {
					page_size: 3,
					page_no: 1,
				},
				form1: {
					user_id: '',
					oldpwd: '',
					newpwd: ''
				},
				rule1: {
					oldpwd: [{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}],
					newpwd: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}],
					newpwd1: [{
						required: true,
						message: '请再次输入新密码',
						trigger: 'blur'
					}],
				},
				dialogTableVisible: false
			}
		},
		computed: {
			...mapGetters([
				'sidebar',
				'name',
				'avatar'
			])
		},
		methods: {
			handleCommand(command) {
				this.checkMsg(command)
			},
			// checkMsg(id) {
			// 	getSystemmgmtAPI('notiDetail', {
			// 		id: id
			// 	}).then(res => {
			// 		if(res.code == 200) {
			// 			this.msgDetail = res.data
			// 			this.dialogTitle2 = this.msgDetail.subject
			// 		} else {
			// 			this.$message(res.msg)
			// 		}
			// 	})
			// 	this.dialogTableVisible = true
			// 	this.visible1 = false
			// },
			xiu() {
				this.dialogFormVisible1 = true
			},
			myGeneralize() {
				this.dialogFormVisible4 = true
			},
			toggleSideBar() {
				this.$store.dispatch('ToggleSideBar')
			},
			logout() {
				commonRequest('logout').then(res => {
					if(res.code === 200) {
						goToLogin()
					}
				})
			},
			pageChange(val) {
				this.msgPage.page_no = val
				// this.getNotification()
			},
			gotoCRM() {},
			getUserInfo() {
				this.userInfo = JSON.parse(localStorage.getItem("userinfo"))
				this.$store.commit('SET_USERINFO', JSON.parse(localStorage.getItem("userinfo")))
				// commonRequest('getUserInfo').then(res => {
				// 	if(res.code === 200) {
				// 		this.userInfo = res.data
				// 		this.form1.user_id = res.data.id
				// 		this.$store.commit('SET_USERINFO', res.data)
				// 	}
				// })
			},
			getRoot() {
				try {
					const domain = document.domain
					const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
					const root = window.location.protocol + '//trader.' + firstDomain
					document.getElementById('crmHref').href = root + '/admin/index.html#account/accountlist.html'
				} catch(error) {}
			},
			/* 更改密码*/
			changePassword1() {
				if(trim(this.form1.oldpwd) == '' || trim(this.form1.newpwd) == '' || trim(this.form1.newpwd1) == '') {
					this.$message('请输入您的密码')
				} else if(trim(this.form1.newpwd) == trim(this.form1.newpwd1)) {
					commonRequest('changepwd', {
						old_pwd: trim(this.form1.oldpwd),
						new_pwd: trim(this.form1.newpwd)
					}).then(res => {
						if(res.code == 200) {
							this.$message(res.msg)
							this.form1.oldpwd = ''
							this.form1.newpwd = ''
							this.form1.newpwd1 = ''
							this.dialogFormVisible1 = false
						} else {
							this.$message(res.msg)
						}
					})
				} else {
					this.$message('两次新密码输入一样')
				}
			},
			//  简单格式化
			dateFormat(date) {
				return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
			},
			closeFn() {
				this.visible1 = false
				setUserCookieBs('0')
			},
			/* 最新的站内消息 */
			// getNewNotification() {
			// 	const h = this.$createElement
			// 	getSystemmgmtAPI('newNotification', {
			// 		user_type: 1
			// 	}).then(res => {
			// 		if(res.code == 200) {
			// 			this.messageList = res.data
			// 			let bs = Cookies.get('bs') || ''
			// 			if(this.messageList == null || this.messageList == '') {
			// 				this.visible1 = false
			// 			} else if(bs === '0') {
			// 				this.visible1 = false
			// 			} else {
			// 				this.visible1 = true
			// 			}
			// 		} else {
			// 			this.$message(res.msg)
			// 		}
			// 	})
			// },
			/* 站内消息通知 */
			getNotification() {
				const _this = this
				// getSystemmgmtAPI('notification', {
				// 	user_type: 1,
				// 	page_no: this.msgPage.page_no,
				// 	page_size: this.msgPage.page_size
				// }).then(res => {
				// 	if(res.code == 200) {
				// 		this.messageList = res.data.page_data
				// 		this.create_time = this.messageList[0].create_time
				// 		this.total = parseInt(res.data.page.total)
				// 		if(this.messageList == null || this.messageList == '') {
				// 			this.visible1 = false
				// 		} else {
				// 			this.visible1 = true
				// 		}
				// 	} else {
				// 		this.$message(res.msg)
				// 	}
				// })
			}
		},
		mounted() {
			this.getUserInfo()
			// this.getRoot()
//			this.getNewNotification()
			var firstDomain = window.location.hostname.replace('broker.', '')
//			if(firstDomain == 'songshu361.com') {
//				this.isHide = true
//			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.pagination {
		float: none;
		text-align: right;
	}
	
	.popLink {
		display: none;
	}
	
	.close {
		text-align: right;
		padding-right: 20px;
		cursor: pointer;
	}
	
	.float {
		float: right;
	}
	
	.massege-body {
		font-size: 14px;
	}
	
	.massege-foot {
		text-align: right;
		padding-top: 20px;
	}
	
	.w500 {
		width: 500px;
		min-width: 300px;
	}
	
	.border {
		margin: 0 10px;
		border-bottom: 1px solid #e5e5e5;
	}
	
	.el-badge__content.is-fixed {
		top: 10px !important;
	}
	
	.navbar {
		height: 50px;
		border-radius: 0px !important;
		.hamburger-container {
			line-height: 58px;
			height: 50px;
			float: left;
			padding: 0 10px;
		}
		.errLog-container {
			display: inline-block;
			position: absolute;
			right: 150px;
		}
		.screenfull {
			position: absolute;
			right: 90px;
			top: 16px;
			color: red;
		}
		.message {
			display: inline-block;
			font-size: 14px;
			margin-right: 50px;
			vertical-align: middle;
			.message-tip {
				float: left;
				color: #97a8be;
			}
		}
		.avatar-container {
			height: 50px;
			display: inline-block;
			/*position: absolute;*/
			right: 20px;
			line-height: 0px;
			padding-right: 20px;
			.avatar-wrapper {
				cursor: pointer;
				position: relative;
				.user-name {
					display: inline-block;
					line-height: 50px;
					font-size: 15px;
					color: #97a8be;
				}
				.fa-user {
					color: #97a8be;
					font-size: 16px;
					margin-right: 5px;
				}
				.user-avatar {
					width: 36px;
					height: 36px;
					border-radius: 18px;
				}
				.el-icon-caret-bottom {
					position: absolute;
					right: -30px;
					top: 19px;
					font-size: 12px;
					color: #97a8be;
				}
			}
		}
		.tabs-view-container {
			line-height: 50px;
		}
		.dialog-section .label {
			width: 80px
		}
	}
	
	.massege-body {
		padding: 0 100px;
		line-height: 28px;
	}
</style>