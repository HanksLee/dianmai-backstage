<template>
	<div class="page">
		<div class="page-header">
			<span>红包发放</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/coupongrant/add')">
					<el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe style="width:100%" border>
					<el-table-column prop="coupon_code" label="红包编号" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="coupon_name" label="红包名称" label-class-name="labelClass" min-width="88"></el-table-column>
					<el-table-column prop="policy_name" label="适应产品" min-width="180"></el-table-column>
					<el-table-column prop="div_money" label="红包金额" min-width="180" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_money | numberFormat}}</div>
						</template>	
					</el-table-column>
					<el-table-column prop="limit_money" label="满减" min-width="120" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.limit_money | numberFormat}}</div>
						</template>	
					</el-table-column>
					<el-table-column prop="all_count" label="发放数量" min-width="100" sortable></el-table-column>
					<el-table-column prop="get_count" label="领取数量" min-width="100" sortable></el-table-column>
					<el-table-column prop="consume_count" label="消费数量" min-width="100" sortable></el-table-column>
					<el-table-column prop="start_time" label="开始时间" min-width="120"></el-table-column>
					<el-table-column prop="activity_time" label="截止时间" min-width="150"></el-table-column>
					<el-table-column prop="expire_time" label="过期时间" min-width="150"></el-table-column>
					<el-table-column label="操作" align="center" fixed="right">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand" :row="scope.row">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown" v-if="globalPermission('v1_admin/coupongrant/edit')">
									<el-dropdown-item :command="{type: 'edit', row: scope.row}">编辑</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-dialog :title="grantDialogTitle" class="dialog1 dialog-large dialog-bottom-fixed2" :visible.sync="grantDialogShow">
				<div class="dialog-page">
					<div class="dialog-page-con">
						<el-form>
							<div class="dialog-section">
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label">红包名称：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input v-model="grantParams.coupon_name" class="box-width"></el-input>
						                </el-form-item>
					                </span>
									</el-col>
									<el-col :span="11">
										<span class="label">红包金额：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input v-model="grantParams.div_money" class="box-width"></el-input>
						                </el-form-item>
					                </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label">适应产品：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-select v-model="grantParams.policy_type" multiple placeholder="请选择">
												<el-option v-for="item in grantOptions" :key="item.value" :label="item.policy_name" :value="item.value">
												</el-option>
											</el-select>
						                </el-form-item>
					                </span>
									</el-col>
									<el-col :span="11">
										<span class="label">满减：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input v-model="grantParams.limit_money" class="box-width"></el-input>
						                </el-form-item>
					                </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label">发放数量：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input v-model="grantParams.all_count" class="box-width"></el-input>
						                </el-form-item>
					                </span>
									</el-col>
									<el-col :span="11">
										<span class="label">开始时间：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<!--<el-input v-model="grantParams.start_time" placeholder="示例：2018-08-08" class="box-width"></el-input>-->
						                	<el-date-picker
										      v-model="grantParams.start_time"
										      type="datetime"
										      placeholder="请选择开始时间">
										    </el-date-picker>
						                </el-form-item>
					                </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label">截止时间：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<!--<el-input v-model="grantParams.activity_time" placeholder="示例：2018-08-08" class="box-width"></el-input>-->
						                	<el-date-picker
										      v-model="grantParams.activity_time"
										      type="datetime"
										      placeholder="请选择截止时间">
										    </el-date-picker>
						                </el-form-item>
					                </span>
									</el-col>
									<el-col :span="11">
										<span class="label">过期时间：</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<!--<el-input v-model="grantParams.expire_time" placeholder="示例：2018-08-08" class="box-width"></el-input>-->
						                	<el-date-picker
										      v-model="grantParams.expire_time"
										      type="datetime"
										      placeholder="请选择过期时间">
										    </el-date-picker>
						                </el-form-item>
					                </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<span class="label">备注：</span>
									<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                	<el-input v-model="grantParams.comment" type="textarea" style="width:500px" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
					                </el-form-item>
			                	</span>
								</el-row>
							</div>
						</el-form>
					</div>
					<div class="dialog-bottom">
						<div slot="footer" class="dialog-footer">
							<el-button @click="grantDialogShow = false">取 消</el-button>
							<el-button type="primary" @click="submit">提交</el-button>
						</div>
					</div>
				</div>
			</el-dialog>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>

<script src="./index.js">
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.dialog-section {
		border-bottom: none;
	}
</style>