<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>经纪商管理</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/broker/add')">
					<el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
				</div>
				<div class="item">
					<el-input placeholder="请输入经纪商名称" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :empty-text="emptyText" border style="width:100%">
					<el-table-column prop="id" label="编码" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="company" label="名称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="short_name" label="简称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="contact" label="联系人" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="mobile" label="手机号码" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="web_domain" label="官网域名" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="charging_time" label="计费日期" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="expire_time" label="到期日期" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							 <div>{{scope.row.expire_time}}</div>
							 <div style="color:#f00"> {{ scope.row.expire_time | lastLoginTime }} </div>
						</template>
					</el-table-column>
					<el-table-column prop="lock_status" label="状态" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.lock_status == '0'" style="color:#67c23a">正常</div>
							<div v-if="scope.row.lock_status == '1'" style="color:#f00">锁定</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{cmd:1,row:scope.row}" v-if="globalPermission('v1_admin/broker/edit')">编辑</el-dropdown-item>
									<el-dropdown-item :command="{cmd:2,row:scope.row}" v-if="globalPermission('v1_admin/broker/setrole')">授权</el-dropdown-item>
									<el-dropdown-item :command="{cmd:3,row:scope.row}" v-if="globalPermission('v1_admin/broker/redirectlogin')">跳转</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!-- 跳转跨域 -->
		<iframe id="message" name="message" src="" style="display:none;" frameborder="0"></iframe>
		<!-- 新增、编辑经纪商 -->
		<el-dialog :title="title" class="dialog1 dialog-m" :visible.sync="whitelisMessageBox">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl dialog-dl2 dl-dt">
						<div class="dialog-section">
						<dl class="mt5">
                            <dt>手机号码</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.mobile" placeholder="请输入手机号"></el-input>
							</dd>
							<dt v-if="passwordTf">密码</dt>
							<dd v-if="passwordTf">
								<el-input v-model.trim="whitelistForm.password" placeholder="请输入密码"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>经纪商名称</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.company" placeholder="请输入公司名称"></el-input>
							</dd>
							<dt>英文简称</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.short_name" placeholder="请输入英文简称"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>联系人</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.contact" placeholder="请输入联系人"></el-input>
							</dd>
							<dt>邮箱</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.email" placeholder="请输入邮箱"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>地址</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.address" placeholder="请输入地址"></el-input>
							</dd>
							<dt>官网域名</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.web_domain" placeholder="请输入官网域名"></el-input>
							</dd>
						</dl>
						</div>
						<dl>
							<dt>经纪人域名</dt>
							<dd>
								<el-input v-model.trim="whitelistForm.id_domain" placeholder="请输入经纪人域名"></el-input>
							</dd>
							<dt>渠道商</dt>
							<dd>
								<el-select v-model="whitelistForm.channel_id" placeholder="请选择渠道商">
									<el-option v-for="item in channelData" :key="item.id" :label="item.channel_name" :value="item.id">
									</el-option>
								</el-select>
							</dd>
						</dl>
						<dl>
							<dt>支付方式</dt>
							<dd>
								<el-select v-model="pay_channel" multiple placeholder="请选择支付方式">
									<el-option v-for="item in payment" :key="item.id" :label="item.channel_name" :value="item.id">
									</el-option>
								</el-select>
							</dd>
							<dt>计费日期</dt>
							<dd>
								<el-date-picker v-model="whitelistForm.charging_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
								</el-date-picker>
							</dd>
						</dl>
						<dl>
							<dt>到期日期</dt>
							<dd>
								<el-date-picker v-model="whitelistForm.expire_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
								</el-date-picker>
							</dd>
							<dt>注销状态</dt>
							<dd>
								<el-select v-model="whitelistForm.lock_status" placeholder="请选择注销状态">
									<el-option v-for="item in cancellationData" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</dd>
						</dl>
						<dl>
							<dt>市场配置</dt>
							<dd class="shichang">
								<el-select v-model="whitelistForm.market_trade_type" multiple placeholder="请选择渠道商">
									<el-option v-for="item in marketOpts" :key="item.key"
									:label="item.name"
									:value="item.key">
									</el-option>
								</el-select>
							</dd>
						</dl>
						<!-- <dl>
							<dt>经纪商标识</dt>
							<dd>
								<el-input v-model="whitelistForm.Identification" placeholder="请输入经纪商标识"></el-input>
							</dd>
						</dl> -->
						<!-- <dl>
							<dt>产品方向</dt>
							<dd style="margin-top:8px;">
								<el-checkbox-group v-model="checkList">
									<el-checkbox label="0">多头合约</el-checkbox>
									<el-checkbox label="1">空头合约</el-checkbox>
								</el-checkbox-group>
							</dd>
						</dl> -->
					</div>
					<div style="text-align: center; padding-top: 35px;">
						<el-button type="primary" class="btn-m" @click="submitWhiteInfo">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
<!-- 授权 -->
<authorize ref="authorizeFn"></authorize>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>

	.dl-dt {
		dl {
			dt {
				width: 110px;
			}
			dd {
				margin-right: 40px;
				&:nth-of-type(even) {
					margin-right: 0px;
				}
			}
		}
	}
	
	.dialog-page .dialog-dl2 dl {
		padding-left: 0;
	}
	
	.dialog-page {
		dl {
			padding-left: 26px;
		}
	}
	

	

</style>
<script src="./index.js"></script>