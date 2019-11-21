<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>直客分成</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<span class="demonstration">发布时间：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="selectTime">
					</el-date-picker>
				</div>
				<div class="item s-itme" style="margin-right:-3px;">
				    <el-select v-model="screenValue" placeholder="请选择">
						<el-option
							v-for="item in screenOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					 <el-input placeholder="姓名/股票名称/股票代码" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :emptyText="emptyText" border show-summary :summary-method="getSummaries" style="width:100%">
					<el-table-column prop="order_no" label="策略单号" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="real_name" label="客户姓名" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="parent_name" label="归属" label-class-name="labelClass" min-width="88"></el-table-column>
					<el-table-column prop="invite_name" label="推广人" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="stock_code" label="股票代码" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="div_rate" label="分成比率" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_rate | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_profit" label="盈利分成" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_profit | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="balance_time" label="结算时间" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="create_time" label="生成时间" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="balance_status" label="结算状态" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.balance_status == '0'" style="color:#F00">未结算</div>
							<div v-if="scope.row.balance_status == '1'" style="color:rgb(103, 194, 58)">已结算</div>
						</template>
					</el-table-column>
					<el-table-column prop="comment" label="备注" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="" label="操作" label-class-name="labelClass" min-width="100" fixed="right">
						<template slot-scope="scope">
							<span @click="$refs.obtainSublevel.policyDetails('direct','详情',scope.row.id)" style="color:#20a0ff;cursor: pointer;">查看详情</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
            <!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
<script src="./index.js"></script>