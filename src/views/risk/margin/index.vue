<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>操作资金预警</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
			<div class="operation-container">
				<div class="item">
					<el-input v-model="params.keyword" placeholder="姓名">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
				<div class="item">
					<span class="demonstration">风险值：</span>
					<div style="display: inline-block;">
						<el-input v-model="params.margin_warning_min" placeholder="请输入最小值"></el-input>
					</div>
					<span>-</span>
					<div style="display: inline-block;">
						<el-input v-model="params.margin_warning_max" placeholder="请输入最大值"></el-input>
					</div>
					<el-button type="primary" slot="append" icon="el-icon-search" @click="searchList"></el-button>
				</div>
				<div class="item">
					<el-button type="primary" @click="getHistoryList">历史查询</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" border style="width:100%">
					<el-table-column prop="real_name" label="姓名" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="parent_name" label="归属" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="frozen_money" label="操作资金" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_wallet" label="资金余额" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="profit" label="持仓盈亏" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							{{scope.row.profit | numberFormat}}
						</template>
					</el-table-column>
					<el-table-column prop="risk_value" label="风险值" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="" label="操作" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{cmd:1, row:scope.row}">强制平仓</el-dropdown-item>
									<el-dropdown-item :command="{cmd:2, row:scope.row}">查看详情</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 查看详情开始 -->
		<!-- 策略查看详细 -->
		<detailedFrame ref="obtainSublevel"></detailedFrame>
		<!-- 查看详情结束 -->
		<!--客户详情开始-->
		<customerFrame ref="obtainCustomer"></customerFrame>
		<!--客户详情结束-->
		<!--查看历史明细-->
		<el-dialog title="历史明细" :visible.sync="dealDetailVisible" class="dialog1 dialog-large dealDetail dialog-bottom-fixed">
			<div class="dialog-page">
				<div class="dialog-page-con" style="padding:15px 15px;">
					<div class="operation-container">
						<div class="item">
							<span class="demonstration">发生时间：</span>
							<el-date-picker v-model="s_time" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="historySearch">
							</el-date-picker>
						</div>
						<div class="item">
							<el-input v-model="historyParams.keyword" placeholder="姓名">
								<el-button slot="append" icon="el-icon-search" @click="historySearch"></el-button>
							</el-input>
						</div>
					</div>
					<div class="table-data">
						<el-table :data="historyList" border style="width:100%">
							<el-table-column prop="real_name" label="姓名" label-class-name="labelClass" min-width="100" fixed="left">
								<!-- <template slot-scope="scope">
									<div @click="$refs.obtainSublevel.policyDetails('warning','历史策略详情',scope.row.id)" class="'''nameBut'''">{{ scope.row.real_name }}<span v-if="scope.row.demo_flag =='1'" style="color:#f00">(模拟)</span></div>
								</template> -->
							</el-table-column>
							<el-table-column prop="parent_name" label="归属 " label-class-name="labelClass" min-width="100"></el-table-column>
							<el-table-column prop="create_time" label="发生时间" label-class-name="labelClass" min-width="100"></el-table-column>
							<el-table-column prop="msg_type" label="类型" label-class-name="labelClass" min-width="100">
								<template slot-scope="scope">
									<font color="#f7c712" v-if="scope.row.msg_type==0">预警</font>
									<font color="red" v-if="scope.row.msg_type==1">爆仓</font>
								</template>
							</el-table-column>
							<el-table-column prop="msg" label="备注" label-class-name="labelClass" min-width="100"></el-table-column>
							<el-table-column prop="" label="操作" label-class-name="labelClass" min-width="100">
								<template slot-scope="scope">
									<span @click="$refs.obtainCustomer.details('customer','详细信息',scope.row)" style="color:#20a0ff;cursor: pointer;">查看详情</span>
								</template>
							</el-table-column>
						</el-table>
						<!-- 分页 -->
						<el-pagination background :page-size="historyParams.page_size" :current-page="historyParams.page_no" layout="prev, pager, next" @current-change="changePage" :total="historyParams.total">
						</el-pagination>
					</div>
				</div>
			</div>
		</el-dialog>
		<!--强制平仓-->
		<el-dialog title="详细信息" class="dialog1 dialog-s" :visible.sync="dialogShow">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl">
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>订单号</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>产品类型</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>股票名称</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>股票代码</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>开仓时间</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>开仓价</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>可买数量</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>当前市价</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
							</el-row>
							<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>浮动盈亏</dt>
									<dd class="text-con"></dd>
								</dl>
							</el-col>
						</el-row>
					</div>
					<div style="text-align: center;padding-top: 15px;">
						<el-button @click="dialogShow = false" class="btn-m">取消</el-button>
						<el-button type="primary" class="btn-m">确定</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script src="./index.js">
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.el-pagination {
		margin-top: 8px;
		text-align: right;
	}
	
	.nameBut {
		color: #20a0ff;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
		-webkit-transition: .6s;
		transition: .6s;
	}
	
	.nameBut:hover {
		color: #317fb9;
		text-decoration: underline;
		-webkit-transition: .6s;
		transition: .6s;
	}
</style>