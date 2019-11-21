<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>支付设置</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<el-button type="primary" icon="el-icon-plus" @click="add">添加支付类型</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" border style="width:100%">
					<el-table-column prop="id" label="通道编码" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="channel_name" label="通道名称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="short_name" label="英文简称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="certify_type" label="认证方式" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.certify_type=='0'">MD5</span>
							<span v-else-if="scope.row.certify_type=='1'">RSA证书</span>
							<span v-else-if="scope.row.certify_type=='2'">RSA公私钥</span>
							<span v-else-if="scope.row.certify_type=='3'">3DES</span>
							<span v-else-if="scope.row.certify_type=='4'">其它</span>
						</template>
					</el-table-column>
					<el-table-column prop="class_name" label="类名" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="para_html" label="可变参数" label-class-name="labelClass" min-width="100"></el-table-column>
					<!--<el-table-column prop="comment" label="备注" label-class-name="labelClass" min-width="100"></el-table-column>-->
					<!--<el-table-column prop="create_time" label="创建时间" label-class-name="labelClass" min-width="100"></el-table-column>-->
					<el-table-column label="操作" width="150" align="center">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand" :row=scope.row>
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i> </span>
								<el-dropdown-menu slot="dropdown">
									<!--<el-dropdown-item :command="{type: 'usingFlag', row: scope.row}">
										{{scope.row.using_flag=="1"?"启用":"禁用"}}
									</el-dropdown-item>-->
									<el-dropdown-item :command="{type: 'edit', row: scope.row}">编辑</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getPayChannelList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!-- 添加支付类型开始 -->
		<el-dialog :title="paymentDialogTitle" class="dialog1 dialog-large dialog-bottom-fixed2" :visible.sync="paymentDialogShow">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<el-form>
						<div class="dialog-section">
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">通道名称:</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input class="box-width" v-model="paymentParams.channel_name"></el-input>
						                </el-form-item>
					                </span>
								</el-col>
								<el-col :span="11">
									<span class="label">通道编码:</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input class="box-width" v-model="paymentParams.id"></el-input>
						                </el-form-item>
					                </span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">英文简称：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input class="box-width" v-model="paymentParams.short_name"></el-input>
						                </el-form-item>
					                </span>
								</el-col>
								<el-col :span="11">
									<span class="label">编程类名：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input class="box-width" v-model="paymentParams.class_name"></el-input>
						                </el-form-item>
					                </span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">认证方式：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
							                <el-select v-model="paymentParams.certify_type" placeholder="请选择"  class="box-width">
							                  	<el-option v-for="item in certifyTypeOption" :key="item.value" :label="item.key" :value="item.value"></el-option>
							                </el-select>
						                </el-form-item>
									</span>
								</el-col>
								<el-col :span="11">
									<span class="label">API地址：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input class="box-width" v-model="paymentParams.api_url"></el-input>

						                </el-form-item>
					                </span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
								<span class="label">支持银行列表：</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                	<el-input v-model="paymentParams.bank_list" type="textarea" style="width:500px;" :autosize="{ minRows: 6, maxRows: 8}" ref="bank_list"></el-input>

					                </el-form-item>
			                	</span>
							</el-row>
							<el-row class="margin-high">
								<span class="label">添加银行：</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
								<el-select v-model="curr_bank" placeholder="请选择"  class="box-width" ref="opt_bank">
									<el-option v-for="item in std_banks" :key="item.value" :label="item.value" :value="item.key"></el-option>
								</el-select>
								<el-input class="box-width" v-model="curr_bank_id" ref="opt_bankid"></el-input>
								<el-button type="primary" @click="addBank">添加</el-button>
					                </el-form-item>
			                	</span>
							</el-row>
							<el-row class="margin-high">
								<span class="label">公钥/证书文件：</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                	<el-input v-model="paymentParams.public_key" type="textarea" style="width:500px;" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
					                </el-form-item>
			                	</span>
							</el-row>
							<el-row class="margin-high">
								<span class="label">可变参数：</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                	<el-input v-model="paymentParams.para_html" type="textarea" style="width:500px" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
					                </el-form-item>
				                </span>
							</el-row>
							<el-row class="margin-high">
								<span class="label">备注：</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                	<el-input v-model="paymentParams.comment" type="textarea" style="width:500px" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
					                </el-form-item>
			                	</span>
							</el-row>
						</div>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="paymentDialogShow = false">取 消</el-button>
						<el-button type="primary" @click="payChannelSubmit">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 添加支付类型结束 -->
	</div>
</template>

<script src="./index.js">
</script>

<style rel="stylesheet" lang="scss" scoped>
	.dialog-section {
		border-bottom: none;
	}
</style>