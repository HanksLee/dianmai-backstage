<template>
	<div class="page">
		<div class="page-header">账户报表</div>
		<div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
			<div class="operation-container">
				<div class="item">
					<el-select change-on-select v-model="belong_type" placeholder="客户归属" @change="changeBelongData">
						<el-option v-for="item in belongTree" v-if="item.belong_type!=5 || (item.belong_type==5&&globalPermission('accountreport/getall'))" :key="item.belong_type" :label="item.belong_name" :value="item.belong_type">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<span class="demonstration">选择日期：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="positionList" :summary-method="getSummaries" :row-class-name="tableRowClassName" stripe border show-summary style="width:100%">
					<el-table-column prop="account_id" label="账户" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="account_name" label="姓名" sortable min-width="120">
					</el-table-column>
					<el-table-column prop="user_tree" label="归属" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="payment_in" label="入金" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="payment_out" label="出金" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="other_out_money" label="推广分成" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="payback" label="买入金额" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="commission" label="卖出金额" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="swap" label="手续费" sortable min-width="84">
					</el-table-column>
					<el-table-column prop="trading_lots" label="代扣" sortable min-width="84">
					</el-table-column>
					<el-table-column prop="trading_count" label="费" sortable min-width="120">
					</el-table-column>
					<el-table-column prop="profit" label="递延费" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="ratewin" label="平仓盈亏" sortable min-width="84" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="earnings" label="盈利分成" sortable min-width="100" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="equity" label="资金余额" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="balance" label="冻结资金" sortable min-width="100">
					</el-table-column>
					<el-table-column prop="floating" label="消费积分" sortable min-width="100" :formatter="formatter">
					</el-table-column>
					<el-table-column prop="floating" label="持仓市值" sortable min-width="100" :formatter="formatter">
					</el-table-column>
				</el-table>
				<!--用户筛选 -->
			</div>
			<div class="pagination">
				<el-pagination
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[50,100,200,500]"
					:page-size="pageSize"
					:total="total"
					:current-page="pageNo">
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" src="./index.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
	
	.dialog10 {
		.el-col-12 {
			font-size: 14px;
		}
		.margin-high {
			padding-left: 100px;
		}
		.label {
			font-size: 14px;
			text-align: left;
			text-indent: 6px;
		}
	}
</style>