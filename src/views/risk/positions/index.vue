<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>头寸管理</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<!--<div class="item">
					<span class="demonstration">申请时间：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item">
					<el-select v-model="value" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>-->
				<div class="item">
					<el-input placeholder="股票代码/名称" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :empty-text="emptyText" border style="width:100%">
					<el-table-column prop="" label="股票代码/名称" label-class-name="labelClass" min-width="100" fixed="left">
						<template slot-scope="scope">
							{{scope.row.stock_code}} / {{scope.row.stock_name}}
						</template>
					</el-table-column>
					<el-table-column prop="customer_number" label="人数" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="volume_number" label="数量" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="price_number" label="价格" label-class-name="labelClass" min-width="100" v-if="domainFn()"></el-table-column>
					<el-table-column prop="price_number" label="均价" label-class-name="labelClass" min-width="100" v-else></el-table-column>
					<el-table-column prop="open_price" label="市价" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="marketvalue" label="市值" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="" label="盈亏" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							{{scope.row.profitandloss | numberFormat}}
						</template>
					</el-table-column>
					<el-table-column prop="" label="操作资金" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							{{scope.row.bond | numberFormat}}
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>

<script src="./index.js">
</script>

<style>

</style>