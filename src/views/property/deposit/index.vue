<template>
	<div class="page">
		<div class="page-header">
			<span>入金管理</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<el-date-picker v-model="s_time" type="datetimerange" :picker-options="pickerOptions1" placeholder="请选择时间范围" @change="selectTime">
					</el-date-picker>
				</div>
				<div class="item">
					<el-select v-model="params.pay_status" clearable placeholder="请选择" @change="changeStatus">
						<el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<!-- Astlvk -->
				<div class="item">
					<el-select v-model="params.channel_name" clearable placeholder="请选择" @change="changeStatus">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in payTypes" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-select v-model="params.keyword" clearable placeholder="请选择" @change="changeOptions">
						<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input placeholder="姓名/金额/支付单号" v-model="params.user_name">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
				</div>
			</div>

			<div class="table-data">
				<el-table :data="list" :emptyText="emptyText" stripe border show-summary :summary-method="getSummaries" style="width: 100%">
					<el-table-column prop="real_name" label="姓名" min-width="100"></el-table-column>
					<el-table-column prop="short_name" label="归属" label-class-name="labelClass" min-width="120">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.short_name" placement="right">
								<span>{{scope.row.short_name}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="show_name" label="支付方式" min-width="100"></el-table-column> -->
					<el-table-column prop="show_name" label="通道名称" min-width="100"></el-table-column>
					<el-table-column prop="bussiness_name" label="收款商户" min-width="100"></el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="real_money" label="存入金额" min-width="100" sortable>
					</el-table-column>
					<el-table-column v-else prop="money" label="存入金额" min-width="100" sortable>
					</el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="money" label="支付金额" min-width="100" sortable>
					</el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="rate" label="费率" min-width="100" sortable>
					</el-table-column>
					<el-table-column prop="pay_status" label="支付状态" min-width="70">
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.pay_status == '0'">未支付</font>
							<font color="green" v-else>已支付</font>
						</template>
					</el-table-column>
					<el-table-column prop="charge_status" label="充值状态" min-width="70">
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.charge_status == '0'">未充值</font>
							<font color="green" v-else>已充值</font>
						</template>
					</el-table-column>
					<el-table-column prop="pay_sn" label="支付单号" min-width="170"></el-table-column>
					<!--<el-table-column prop="check_status" :formatter="statusChange" label="审核状态" algin="center" min-width="70">
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.check_status == '0'">未审核</font>
							<font color="green" v-else-if="scope.row.check_status == '1'">审核通过</font>
							<font color="red" v-else>审核失败</font>
						</template>
					</el-table-column>-->
					<el-table-column prop="pay_time" label="提交时间" min-width="150"></el-table-column>
					<el-table-column prop="charge_time" label="回执时间" min-width="150"></el-table-column>
					<el-table-column prop="trade_number" label="回执单号" min-width="150"></el-table-column>
					<el-table-column label="操作" fixed="right" label-class-name="labelClass" algin="center" min-width="100">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{cmd: 1, row: scope.row}">查看详细</el-dropdown-item>
									<el-dropdown-item :command="{cmd: 2, row: scope.row}" v-if="globalPermission('v1_admin/cashesin/change')">更改状态</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<el-dialog title="详细信息" class="dialog1 dialog-s" :visible.sync="detailDialogShow">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl">
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>账户名</dt>
									<dd class="text-con">{{deposit.real_name}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>通道名称</dt>
									<dd class="text-con">{{deposit.show_name}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>存入金额</dt>
									<dd v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" class="text-con">{{deposit.real_money}}</dd>
									<dd v-else class="text-con">{{deposit.money}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>支付状态</dt>
									<dd class="text-con">{{deposit.pay_status=="0"?"未支付":"已支付"}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>支付单号</dt>
									<dd class="text-con">{{deposit.pay_sn}}</dd>
								</dl>
							</el-col>
							<!--<el-col :span="12">
								<dl class="mt0">
									<dt>审核状态</dt>
									<dd class="text-con">{{deposit.check_status=="0"?"未审核":"已审核"}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">-->
							<el-col :span="12">
								<dl class="mt0">
									<dt>手续费</dt>
									<dd class="text-con">{{parseFloat(deposit.in_money_rate).toFixed(2)}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>提交时间</dt>
									<dd class="text-con">{{deposit.create_time}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>审核时间</dt>
									<dd class="text-con">{{deposit.check_time}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>回执时间</dt>
									<dd class="text-con">{{deposit.charge_time}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>回执单号</dt>
									<dd class="text-con">{{deposit.trade_number}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="24">
								<dl class="mt0">
									<dt>备注</dt>
									<dd class="text-con" style="width:500px;text-align:left;">{{deposit.comment}}</dd>
								</dl>
							</el-col>
						</el-row>
					</div>
					<div style="text-align: center;padding-top: 15px;">
						<el-button type="primary" @click="detailDialogShow = false" class="btn-m">关闭</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 更改状态 -->
		<el-dialog title="更改状态" :visible.sync="statusDialogShow" class="dialog1 affiliation">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl">
						<dl class="mt5">
							<dt>姓名</dt>
							<dd>
								<el-input v-model="status.real_name" disabled></el-input>
							</dd>
						</dl>
						<dl>
							<dt>账户</dt>
							<dd>
								<el-input v-model="status.customer_id" disabled></el-input>
							</dd>
						</dl>
						<dl>
							<dt>支付单号</dt>
							<dd>
								<el-input v-model="status.pay_sn" disabled></el-input>
							</dd>
						</dl>
						<dl>
							<dt>支付状态</dt>
							<dd>
								<el-select v-model="status.pay_status" placeholder="请选择" :disabled="disabled">
									<el-option v-for="item in paymentStatus" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</dd>
						</dl>
						<dl>
							<dt>充值状态</dt>
							<dd>
								<el-select v-model="status.charge_status" placeholder="请选择" :disabled="disabled1">
									<el-option v-for="item in rechargeState" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</dd>
						</dl>
						<dl>
							<dt>变更原因</dt>
							<dd>
								<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入变更原因" v-model="status.comment">
								</el-input>
							</dd>
						</dl>
						<div style="text-align: center;padding-top: 15px;">
							<el-button class="el-blue-btn commit-btn" @click="modifyState" :loading="status.loading">提交</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
	.affiliation {
		dt {
			margin-left: 70px;
		}
	}
</style>
<script src="./index.js">
</script>
