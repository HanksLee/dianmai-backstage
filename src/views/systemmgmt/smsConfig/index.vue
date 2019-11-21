<template>
	<div class="page" v-loading="loading" element-loading-text="加载中...">
		<div class="page-content">
			<el-tabs v-model="activeName">
				<!--  @tab-click="handleClick" -->
				<el-tab-pane label="短信配置" name="smsChannel">
					<div class="tab-page-header" v-if="globalPermission('v1_admin/smschannel/add')">
						<el-button class="el-blue-btn" icon="el-icon-plus" @click="addSmsChannel">添加</el-button>
					</div>
					<div class="table-data" style="margin-top:5px;">
						<el-table :data="smscList" style="width: 100%">
							<el-table-column prop="channel_name" label="通道类型名称"></el-table-column>
							<el-table-column prop="api_key" label="API KEY"></el-table-column>
							<el-table-column prop="other_params" label="其他参数"></el-table-column>
							<el-table-column prop="comment" label="备注"></el-table-column>
							<el-table-column prop="using_flag" label="启用状态" align="center">
								<template slot-scope="scope">
									<font color="green" v-if="scope.row.using_flag==1">启用</font>
									<font color="red" v-if="scope.row.using_flag==0">禁用</font>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="150" align="center">
								<template slot-scope="scope">
									<el-dropdown @command="smscHandleCommand" :row=scope.row>
										<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item :command="{type: 'usingFlag', row: scope.row}">
												{{scope.row.using_flag=="0"?"启用":"禁用"}}
											</el-dropdown-item>
											<el-dropdown-item :command="{type: 'edit', row: scope.row}">编辑</el-dropdown-item>
											<el-dropdown-item :command="{type: 'test', row: scope.row}">测试</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="短信模版" name="smsTemplate">
					<div class="table-data">
						<el-table :data="smstList" style="width: 100%">
							<el-table-column prop="id" label="ID" width="80"></el-table-column>
							<el-table-column prop="type_name" label="短信类型"></el-table-column>
							<el-table-column prop="content" label="短信内容"></el-table-column>
							<el-table-column prop="using_flag" label="启用状态" align="center">
								<template slot-scope="scope">
									<font color="green" v-if="scope.row.using_flag==1">启用</font>
									<font color="red" v-if="scope.row.using_flag==0">禁用</font>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="150" align="center">
								<template slot-scope="scope">
									<el-dropdown @command="smstHandleCommand" :row=scope.row>
										<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i> </span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item :command="{row: scope.row, type: 'usingFlag'}">
												{{scope.row.using_flag=="0"?"启用":"禁用"}}
											</el-dropdown-item>
											<el-dropdown-item :command="{row: scope.row, type: 'edit'}">编辑</el-dropdown-item>
											<el-dropdown-item :command="{row: scope.row, type: 'preview'}">预览</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<!-- 分页 -->
					<paging :getList="getSmsTemplateList" :page="page" ref="subassemblyData"></paging>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!--短信通道弹窗-->
		<el-dialog :title="smscDialogTitle" :visible.sync="smscDialogShow" class="dialog1 dialog-large dialog-bottom-fixed">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl" style="padding: 15px 0">
						<el-row>
							<el-col :span="18">
								<dl>
									<dt>通道类型</dt>
									<dd>
										<el-select v-model="smscParams.channel_type" :disabled="isDisabled" placeholder="请选择通道类型">
											<el-option v-for="item in channelTypeOptions" :key="item.id" :label="item.channel_name" :value="item.id">
											</el-option>
										</el-select>
									</dd>
								</dl>
								<dl>
									<dt>API Key</dt>
									<dd>
										<el-input v-model="smscParams.api_key" placeholder="API Key"></el-input>
									</dd>
								</dl>
							</el-col>
						</el-row>
						<div class="page-header" style="font-weight: normal; ">
						</div>
						<el-row>
							<el-col :span="18">
								<dl>
									<dt>其他参数</dt>
									<dd>
										<el-input v-model="smscParams.other_params" placeholder=""></el-input>
									</dd>
								</dl>
								<dl>
									<dt>备注</dt>
									<dd>
										<el-input type="textarea" v-model="smscParams.comment" placeholder=""></el-input>
									</dd>
								</dl>
								<dl>
									<dt>是否启用</dt>
									<dd>
										<el-switch v-model="isUsing" on-text="" off-text=""></el-switch>
									</dd>
								</dl>
							</el-col>
						</el-row>
					</div>
				</div>
				<div class="dialog-bottom">
					<div style="text-align: center;padding-top:20px;">
						<el-button @click="smscDialogShow = false">取 消</el-button>
						<el-button type="primary" @click="smscSubmit" class="btn-m">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!--短信模板弹窗-->
		<el-dialog :title="smstDialogTitle" :visible.sync="smstDialogShow" class="dialog1 dialog-large dialog-bottom-fixed">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl" style="padding: 15px 0">
						<dl class="mt5">
							<dt>短信类型</dt>
							<dd>
								<el-input v-model="smstParams.type_name" disabled></el-input>
							</dd>
						</dl>
						<dl>
							<dt>短信模版</dt>
							<dd>
								<el-input v-model="smstParams.content" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>是否启用</dt>
							<dd>
								<el-switch v-model="isUsing" on-text="" off-text=""></el-switch>
							</dd>
						</dl>
					</div>
				</div>
				<div class="dialog-bottom">
					<div style="text-align: center;padding-top:20px;">
						<el-button @click="smstDialogShow = false">取 消</el-button>
						<el-button type="primary" @click="smstSubmit" class="btn-m">提交</el-button>
						<el-button type="primary" @click="smstReset" class="btn-m">重置</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!--预览: 目前只显示短信模板的内容-->
		<el-dialog :title="preview.title" :visible.sync="smstDialogShowPreView" center class="dialog1 dialog-s">
			<span>{{preview.content}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="smstDialogShowPreView = false">关闭</el-button>
			</span>
		</el-dialog>
		<!-- 短信测试  -->
		<el-dialog title="短信测试" :visible.sync="smscDialogShowTest" class="dialog1 test">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="server-info">
						<div class="dialog-section">
							<el-form :model="smscTestParams">
								<el-row>
									<el-col :span="4"><span class="label"><span class="red">*</span>手机号码</span>
									</el-col>
									<el-col :span="12">
										<div class="label-val" style="width:400px">
											<el-form-item>
												<el-input v-model="smscTestParams.mobile" placeholder="请输入手机号码"></el-input>
											</el-form-item>
										</div>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="4"><span class="label">内容</span>
									</el-col>
									<el-col :span="12">
										<div class="label-val" style="width:400px">
											<el-form-item>
												<el-input type="textarea" v-model="smscTestParams.content" placeholder="请输入内容"></el-input>
											</el-form-item>
										</div>
									</el-col>
								</el-row>
							</el-form>
						</div>
					</div>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="smscDialogShowTest = false">取 消</el-button>
						<el-button type="primary" @click="sendSmsForm">发送</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script type="text/javascript" src="./index.js"></script>
<style lang="scss" scoped>
	.page-content {
		padding-top: 10px;
		.el-tabs__content {
			padding-bottom: 10px;
		}
	}
	
	.dialog-bottom-fixed .dialog-page-con {
		bottom: 80px !important;
	}
	
	.dialog-bottom-fixed .dialog-bottom {
		height: 80px;
	}
	
	.dialog-dl dt {
		width: 100px;
	}
	
	.el-tabs .el-tabs__content {
		overflow: inherit;
	}
	
	.tab-page-header {
		padding: 10px 0px;
	}
	
	.page .el-tabs__content {
		overflow: inherit;
	}
	
	.ke-dialog-body {
		display: block;
		width: 100%;
		height: 260px;
		font-family: "sans serif", tahoma, verdana, helvetica;
		font-size: 12px;
		border-color: #848484 #E0E0E0 #E0E0E0 #848484;
		border-style: solid;
		border-width: 1px;
		border: none;
	}
	
	.test .el-textarea__inner {
		min-height: 150px;
	}
	
	.mt5 {
		dd {
			position: relative;
			.el-input {
				margin-right: 0;
			}
		}
	}
	
	.smtplist {
		position: absolute;
		top: 0;
		right: 1px;
		width: 31px;
		height: 31px;
		line-height: 31px;
		text-align: center;
		background-color: #20a0ff;
		border-radius: 4px;
	}
	
	.el-icon-message {
		padding: 8px;
	}
</style>