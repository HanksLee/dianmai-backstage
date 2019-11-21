<template>
	<div class="page">
		<div class="page-header">资产报表</div>
		<div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<span class="demonstration">选择日期：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" @change="selectTime">
					</el-date-picker>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe border :summary-method="getSummaries" show-summary style="width:100%">
					<el-table-column prop="balance_time" label="结算日期" sortable min-width="120"></el-table-column>
					<el-table-column prop="cal_pay_in_money" label="入金" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_pay_out_money" label="出金" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_property" label="净入金" sortable min-width="100"></el-table-column>
					<el-table-column prop="real_wallet" label="资金余额" sortable min-width="100"></el-table-column>
					<el-table-column prop="frozen_money" label="冻结资金" sortable min-width="100"></el-table-column>
					<el-table-column prop="property" label="可用资金" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_profit" label="平台盈亏(资金余额 - 净入金)" sortable min-width="120"></el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>
<script type="text/javascript" src="./index.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>