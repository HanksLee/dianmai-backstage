<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>委托记录</span>
		</div>
		<div class="page-con">
			<div class="operation-container">
				<div class="item">
				    <!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<span class="demonstration">发布时间：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="selectTime">
					</el-date-picker>
				</div>
				<div class="item">
					 <el-input placeholder="姓名/股票名称/股票代码" v-model="account">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
				<div class="item">
					<el-select v-model="value" placeholder="所有类型">
						<el-option v-for="item in searchTypeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
		          	<el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownload">导出</el-button>
		        </div>
			</div>
			<div class="table-data">
				<el-table :data="list" border style="width:100%">
					<el-table-column prop="real_name1" label="订单号" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="real_name2" label="客户姓名" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name4" label="委托时间" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name5" label="股票名称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name6" label="股票代码" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name7" label="操作资金" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name10" label="资金配比" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name13" label="委托状态" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name14" label="委托数量" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name15" label="成交数量" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_name16" label="成交状态" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="" label="操作" label-class-name="labelClass" min-width="100" fixed="right">
						<template slot-scope="scope">
							<span @click="$refs.obtainSublevel.policyDetails('strategy','策略详情')" style="color:#20a0ff;cursor: pointer;">查看详情</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页开始 -->
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="PagingNumber" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageCount">
				</el-pagination>
			</div>
			<!-- 分页结束 -->
		</div>
		<!-- 查看详情开始 -->
			<!-- 策略查看详细 -->
	         <detailedFrame ref="obtainSublevel"></detailedFrame>
		    <!-- 查看详情结束 -->
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
	.filtrate-btn {
		text-align: center;
		margin-top: 20px;
	}
	
	.nameBut {
		background: #409EFF;
		color: #fff;
		border-radius: 25px;
		line-height: 28px;
		cursor: pointer;
		-webkit-transition: .6s;
		transition: .6s;
	}
	
	.nameBut:hover {
		background: #1d4583;
		-webkit-transition: .6s;
		transition: .6s;
	}
</style>
<script src="./index.js"></script>