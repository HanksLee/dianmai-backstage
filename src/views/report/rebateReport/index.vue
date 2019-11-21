<template>
	<div class="page">
		<div class="page-header">推广分红</div>
		<div class="page-con">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<span class="demonstration">选择日期：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="positionList" :row-class-name="tableRowClassName" stripe border style="width:100%" v-loading="loading" element-loading-text="数据加载中....">
					<el-table-column prop="account_name" label="姓名" min-width="120px">
					</el-table-column>
					<el-table-column prop="user_tree" label="归属" min-width="100px">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.user_tree | user_tree_filter" placement="right">
								<span>{{scope.row.user_tree | last_tree_filter(scope.row.account_name)}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="real_name7" label="手续费" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name8" label="递延费" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name9" label="管理费" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name10" label="盈利分成" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name11" label="结算时间" label-class-name="labelClass" min-width="100"></el-table-column>
				</el-table>
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