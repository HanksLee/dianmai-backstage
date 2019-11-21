<template>
	<div class="page">
		<div class="page-header">品种报表</div>
		<div class="page-con">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<el-select change-on-select v-model="type" placeholder="请选择" @change="changeBelongData">
						<el-option label="持仓中" value="0"></el-option>
						<el-option label="已结算" value="1"></el-option>
					</el-select>
				</div>
				<div class="item">
					<span class="demonstration">选择日期：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w200" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="positionList" :summary-method="getSummaries" :row-class-name="tableRowClassName" stripe border show-summary style="width:100%" v-loading="loading" element-loading-text="数据加载中....">
					<el-table-column prop="symbol" label="股票名称/代码" sortable min-width="120px"></el-table-column>
					<el-table-column prop="nums" label="操作资金" :sortable="true"></el-table-column>
					<el-table-column prop="lots" label="成交量" sortable min-width="100px"></el-table-column>
					<el-table-column prop="nums" label="成交金额" sortable min-width="100px"></el-table-column>
					<el-table-column prop="profit" label="浮动/平仓盈亏" sortable min-width="100px"></el-table-column>
				</el-table>
				<!--用户筛选 -->
			</div>
			<div class="pagination">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[50,100,200,500]" :page-size="pageSize" :total="total" :current-page="pageNo">
				</el-pagination>
			</div>
		</div>
	</div>
</template>
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
<script src="./index.js">
</script>