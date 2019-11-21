<template>
	<div class="page">
		<div class="page-header">
			<span>红包领取</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<el-input placeholder="姓名" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe style="width:100%" border>
					<el-table-column prop="real_name" label="客户" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="parent_name" label="归属" label-class-name="labelClass" min-width="88">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.parent_name" placement="right">
								<span>{{scope.row.parent_name}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="coupon_code" label="红包编号" min-width="180"></el-table-column>
					<el-table-column prop="coupon_name" label="红包名称" min-width="120"></el-table-column>
					<el-table-column prop="div_money" label="红包金额" min-width="120" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_money | numberFormat}}</div>
						</template>	
					</el-table-column>
					<el-table-column prop="limit_money" label="满减" min-width="150" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.limit_money | numberFormat}}</div>
						</template>	
					</el-table-column>
					<el-table-column prop="create_time" label="领取时间" min-width="150"></el-table-column>
					<el-table-column prop="use_status" label="使用状态" min-width="150"></el-table-column>
					<el-table-column prop="expire_time" label="过期时间" min-width="150"></el-table-column>
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