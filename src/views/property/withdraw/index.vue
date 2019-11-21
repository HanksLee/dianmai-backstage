<template>
	<div class="page">
		<div class="page-header">
			<span>出金管理</span>
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
					<el-select v-model="params.check_status" placeholder="请选择" @change="search">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input placeholder="姓名" v-model="params.user_name">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe style="width:100%" border show-summary :summary-method="getSummaries">
					<el-table-column prop="real_name" label="姓名" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="short_name" label="归属" label-class-name="labelClass" min-width="88">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.short_name" placement="right">
								<span>{{scope.row.short_name}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="bank_province" label="省份" min-width="180"></el-table-column>
					<el-table-column prop="bank_city" label="城市" min-width="180"></el-table-column>
					<el-table-column prop="bank_card" label="银行卡号" min-width="180"></el-table-column>
					<el-table-column prop="bank_name" label="开户行" min-width="120"></el-table-column>
					<el-table-column prop="bank_branch" label="支行名称" min-width="120"></el-table-column>
					<el-table-column prop="create_time" label="申请时间" min-width="150"></el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="real_money" label="出金" min-width="100" sortable></el-table-column>
					<el-table-column v-else prop="money" label="出金" min-width="100" sortable></el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="money" label="预付金" min-width="100" sortable></el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="rate" label="费率" min-width="100" sortable>
					</el-table-column>
					<el-table-column prop="check_status" label="审核状态" min-width="100">
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.check_status == '0'">未审核</font>
							<font color="green" v-if="scope.row.check_status == '1'">审核通过</font>
							<font color="orange" v-if="scope.row.check_status == '2'">驳回</font>
							<font color="orange" v-if="scope.row.check_status == '3'">废单处理</font>
						</template>
					</el-table-column>
					<el-table-column prop="check_time" label="审核时间" min-width="150"></el-table-column>
					<el-table-column prop="check_user_name" label="审核人" min-width="150"></el-table-column>
					<el-table-column prop="charge_status" label="划款状态" min-width="100">
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.charge_status == '0'">未划款</font>
							<font color="green" v-else>已划款</font>
						</template>
					</el-table-column>
					<el-table-column prop="charge_user_name" label="划款人" min-width="150"></el-table-column>
					<el-table-column prop="pay_channel_name" label="划款通道" min-width="100"></el-table-column>
					<el-table-column prop="pay_sn" label="划款单号" min-width="150"></el-table-column>
					<el-table-column prop="charge_time" label="划款时间" min-width="150"></el-table-column>
					<el-table-column prop="comment" label="备注" min-width="150"></el-table-column>
					<el-table-column label="操作" align="center" fixed="right" min-width="100">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand" :row="scope.row">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{cmd: 1, row: scope.row}">查看详细</el-dropdown-item>
									<el-dropdown-item :command="{cmd: 2, row: scope.row}" v-if="globalPermission('v1_admin/cashesout/status') && scope.row.charge_status == '0'">划账登记</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!-- 划转登记 -->
		<el-dialog :title="dialogTitle" class="dialog1 dialog-s affiliation" :visible.sync="dialogShow">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl">
						<dl class="mt5">
							<dt>姓名</dt>
							<dd>
								<el-input v-model="regParams.real_name" :disabled="true" placeholder=""></el-input>
							</dd>
						</dl>
						<dl>
							<dt>划款单号</dt>
							<dd>
								<el-input v-model="regParams.pay_sn" placeholder="划款单号"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>通道类型</dt>
							<dd>
								<el-select v-model="regParams.channel_id" placeholder="请选择">
									<el-option v-for="item in payTypes" :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</dd>
						</dl>
						<dl>
							<dt>实付金额</dt>
							<dd>
								<el-input v-model="regParams.real_money" placeholder="实付金额"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>备注</dt>
							<dd class="text-con" style="width:500px;text-align:left;">
								<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入变更原因" v-model="regParams.comment">
								</el-input>
							</dd>
						</dl>
						<div style="text-align: center;padding-top: 15px;">
							<el-button type="primary" @click="submit" class="btn-m">提交</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
		<!--详细信息-->
		<el-dialog title="详细信息" class="dialog1 dialog-m" :visible.sync="detailDialogShow">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl">
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>出金账户</dt>
									<dd class="text-con">{{withdraw.customer_id}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>账户名称</dt>
									<dd class="text-con">{{withdraw.real_name}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>省份</dt>
									<dd class="text-con">{{withdraw.bank_province}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>城市</dt>
									<dd class="text-con">{{withdraw.bank_city}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>银行名称</dt>
									<dd class="text-con">{{withdraw.bank_name}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>银行卡号</dt>
									<dd class="text-con">{{withdraw.bank_card}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>支付方式</dt>
									<dd class="text-con">{{withdraw.channel_name}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>出金金额</dt>
									<dd v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" class="text-con">{{withdraw.real_money}}</dd>
									<dd v-else class="text-con">{{withdraw.money}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>出金币种</dt>
									<dd class="text-con" v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'">HKD</dd>
									<dd class="text-con" v-else>{{withdraw.currency}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>实付金额</dt>
									<dd class="text-con" v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'">{{withdraw.money}}</dd>
									<dd class="text-con" v-else>{{withdraw.real_money}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>实付币种</dt>
									<dd class="text-con">{{withdraw.real_currency}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>划款状态</dt>
									<dd class="text-con">{{withdraw.charge_status=="0"?"未划款":"已划款"}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>划款单号</dt>
									<dd class="text-con">{{withdraw.pay_sn}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>提交时间</dt>
									<dd class="text-con">{{withdraw.create_time}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>审核时间</dt>
									<dd class="text-con">{{withdraw.check_time}}</dd>
								</dl>
							</el-col>
							<el-col :span="12">
								<dl class="mt0">
									<dt>审核人</dt>
									<dd class="text-con">{{withdraw.check_user_name}}</dd>
								</dl>
							</el-col>
						</el-row>
						<el-row class="mtb0">
							<el-col :span="12">
								<dl class="mt0">
									<dt>审核状态</dt>
									<dd class="text-con">{{withdraw.check_status=="0"?"未审核":"已审核"}}</dd>
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
