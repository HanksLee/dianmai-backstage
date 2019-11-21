<template>
	<div class="page page-accouttype">
		<div class="page-header">行情信息</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<el-select v-model="market" placeholder="交易市场" @change="changeHandler">
						<el-option v-for="item in marketList" :key="item.market_id" :label="item.market" :value="item.market_id">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-button @click="searchList" type="primary" icon="el-icon-search">搜索</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe border style="width:100%">
					<el-table-column prop="stock_code" label="股票编号" label-class-name="labelClass">
					</el-table-column>
					<el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass">
					</el-table-column>
					<el-table-column prop="now_price" label="当前价格" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="price_date" label="报价日期" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="price_time" label="报价时间" label-class-name="labelClass">
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getQuotation" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>

<script src="./index.js">
</script>

<style>

</style>