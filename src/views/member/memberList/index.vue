<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>机构列表</span>
			<!-- 授权只有权限列表 -->
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<el-button type="primary" icon="el-icon-plus" @click="add" v-if="globalPermission('v1_admin/organ/add')">新增</el-button>
				</div>
				<div class="item">
					<el-input placeholder="请输入机构名称/联系人" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :empty-text="emptyText" border style="width:100%">
					<el-table-column prop="id" label="编码" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="company" label="机构名称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="short_name" label="机构简称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="contact" label="联系人" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="mobile" label="手机号码" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="div_commission" label="手续费分成" label-class-name="labelClass" min-width="100" sortable v-if="div_commissionTf">
						<template slot-scope="scope">
							<div>{{scope.row.div_commission | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_delayfee" label="递延分成" label-class-name="labelClass" min-width="100" sortable v-if="div_delayfeeTf">
						<template slot-scope="scope">
							<div>{{scope.row.div_delayfee | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_servicefee" label="管理费分成" label-class-name="labelClass" min-width="100" sortable v-if="div_servicefeeTf">
						<template slot-scope="scope">
							<div>{{scope.row.div_servicefee | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_profit" label="盈利分成" label-class-name="labelClass" min-width="100" sortable v-if="div_profitTf">
						<template slot-scope="scope">
							<div>{{scope.row.div_profit | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="220">
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="edit(scope.row)" v-if="globalPermission('v1_admin/organ/edit')">编辑</el-button>
							<el-button size="mini" type="text" @click="$refs.authorizeFn.roleAuthorize(scope.row,scope.row.company,'机构名称','organAuthorization','2')" v-if="globalPermission('v1_admin/organ/setrole')">授权</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
	       <!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<el-dialog :title="title" class="dialog1 dialog-large dialog-bottom-fixed2" :visible.sync="memberMessageBox">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<el-form>
						<div class="dialog-section">
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label"><span class="red">*</span>手机号：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="real_name">
					                  	<el-input placeholder="请输入手机号" v-model="memberForm.mobile"></el-input>
					                </el-form-item>
								</span>
								</el-col>
								<el-col :span="11" v-if="passwordTf">
									<span class="label"><span class="red">*</span>密码：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="real_name">
					                  	<el-input placeholder="请输入密码" v-model="memberForm.password"></el-input>
					                </el-form-item>
								</span>
								</el-col>
							</el-row>


							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label"><span class="red">*</span>机构名称：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="real_name">
					                  	<el-input placeholder="请输入机构名称" v-model="memberForm.company"></el-input>
					                </el-form-item>
								</span>
								</el-col>
								<el-col :span="11">
									<span class="label"><span class="red">*</span>简称：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="password">
					                  	<el-input placeholder="请输入简称" v-model="memberForm.short_name"></el-input>
					                </el-form-item>
					            </span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label"><span class="red">*</span>联系人：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="password">
					                  	<el-input placeholder="请输入联系人" v-model="memberForm.contact"></el-input>
					                </el-form-item>
					            </span>
								</el-col>
								<el-col :span="11">
									<span class="label"><span class="red">*</span>邮箱：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="password">
					                  	<el-input placeholder="请输入邮箱" v-model="memberForm.email"></el-input>
					                </el-form-item>
					            </span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
					            <el-col :span="11">
									<span class="label"><span class="red">*</span>联系地址：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="password">
					                  	<el-input placeholder="请输入联系地址" v-model="memberForm.address"></el-input>
					                </el-form-item>
					            </span>
								</el-col>
							</el-row>
						</div>
						<!-- <div class="dialog-section">
							<el-row class="margin-high">
								<span class="label"><span class="red">*</span>推广分成：</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none" prop="real_name">
					                  	<el-select v-model="market_div_type" multiple  style="width: 350px;">
					                  		<el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key"></el-option>
					                  	</el-select>
					                </el-form-item>
								</span>
							</el-row>
							<el-row>
								<el-col :span="11" v-if="div_commissionTf">
									<span class="label"><span class="red">*</span>手续费分成：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="password">
					                  	<el-input placeholder="请输入手续费分成" v-model="memberForm.div_commission"></el-input>
					                </el-form-item>
					            </span>
								</el-col>
								<el-col :span="11" v-if="div_delayfeeTf">
									<span class="label"><span class="red">*</span>递延费分成：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="real_name">
					                  	<el-input placeholder="请输入递延费分成" v-model="memberForm.div_delayfee"></el-input>
					                </el-form-item>
								</span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11" v-if="div_profitTf">
									<span class="label"><span class="red">*</span>盈利分成：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="real_name">
					                  	<el-input placeholder="请输入盈利分成" v-model="memberForm.div_profit"></el-input>
					                </el-form-item>
								</span>
								</el-col>
								<el-col :span="11" v-if="div_servicefeeTf">
									<span class="label"><span class="red">*</span>管理费分成：</span><span class="label-val">
					                <el-form-item label="" class="margin-none" prop="password">
					                  	<el-input placeholder="请输入管理费分成" v-model="memberForm.div_servicefee"></el-input>
					                </el-form-item>
					            </span>
								</el-col>
							</el-row>
						</div> -->
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="memberMessageBox = false">取 消</el-button>
						<el-button type="primary" @click="memberSubmit">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	<!-- //授权 -->	
<authorize ref="authorizeFn"></authorize>
	</div>
</template>
<script src="./index.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-data{
  .el-button{
	padding:0 1px;
}
}
.dialog-section {
  .label{line-height:40px;}
}
	.dialog-page {
		dl {
			padding-left: 26px;
		}
	}
	
	
	
	@import "./../../customer/customerList/customer"
</style>
