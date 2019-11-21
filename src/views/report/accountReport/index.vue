<template>
	<div class="page">
		<div class="page-header">账户报表</div>
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
					<el-table-column prop="real_name" label="姓名" min-width="120"></el-table-column>
					<el-table-column prop="parent_name" label="归属" min-width="100"></el-table-column>
					<el-table-column prop="cal_pay_in_money" label="入金" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_virtual_in_money" label="虚拟入金" sortable min-width="150"></el-table-column>
					<el-table-column prop="cal_present_in_money" label="平台赠送入金" sortable min-width="150"></el-table-column> 
					<el-table-column prop="cal_pay_out_money" label="出金" sortable min-width="100"></el-table-column>
					<!-- <el-table-column prop="cal_margin" label="投入操作资金" sortable min-width="100"></el-table-column> -->
					<el-table-column prop="cal_coupon_money" label="红包返现" sortable min-width="100"></el-table-column>
					<!-- <el-table-column prop="cal_buy_money" label="买入金额" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_sell_money" label="卖出金额" sortable min-width="100"></el-table-column> -->
					<el-table-column prop="cal_delay_fee" label="递延费" sortable min-width="84"></el-table-column>
					<el-table-column prop="cal_service_fee" label="管理费" sortable min-width="100"></el-table-column>
					<el-table-column prop="commission" label="手续费" sortable min-width="84"></el-table-column>
					<el-table-column prop="cal_other_fee" label="券商代扣" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_profit" label="平仓盈亏" sortable min-width="84"></el-table-column>
					<el-table-column prop="cal_div_profit" label="平台分成" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_market_money" label="推广分成" sortable min-width="100"></el-table-column>
					<el-table-column prop="real_wallet" label="资金余额" sortable min-width="100"></el-table-column>
					<el-table-column prop="frozen_money" label="冻结资金" sortable min-width="100"></el-table-column>
					<el-table-column prop="cal_user_wallet" label="可用余额" sortable min-width="100"></el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>
<script type="text/javascript" src="./index.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.filtrate-btn {
		text-align: center;
		margin-top: 20px;
		.el-blue-btn {
			padding: 0px 20px;
		}
	}
	
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