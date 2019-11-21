<template>
	<div class="page">
		<div class="page-header">
			<span>提现申请</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
			<div class="operation-container">
				<div class="item">
					<el-date-picker v-model="s_time" type="datetimerange" :picker-options="pickerOptions1" placeholder="申请时间" @change="search">
					</el-date-picker>
				</div>
				<div class="item">
					<el-select v-model="params.check_status" placeholder="请选择" @change="search">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-select v-model="params.charge_status" placeholder="请选择" @change="search">
						<el-option v-for="item in options1" :key="item.value1" :label="item.label" :value="item.value1">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input v-model="params.user_name" placeholder="姓名">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe style="width:100%" border>
					<el-table-column prop="real_name" label="姓名" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="short_name" label="归属" label-class-name="labelClass" min-width="88">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.short_name" placement="right">
								<span>{{scope.row.short_name}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="bank_province" label="省份" min-width="180"></el-table-column>
					<el-table-column prop="bank_city" label="城市" min-width="180"></el-table-column> -->
					<el-table-column prop="bank_card" label="银行卡号" min-width="180"></el-table-column>
					<el-table-column prop="bank_name" label="开户行" min-width="120"></el-table-column>
					<el-table-column prop="bank_branch" label="支行名称" min-width="120"></el-table-column>
					<el-table-column prop="create_time" label="申请时间" min-width="150"></el-table-column>
					<el-table-column v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" prop="real_money" label="出金" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.real_money | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column v-else prop="money" label="出金" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.money | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="check_status" :formatter="statusChange" label="审核状态" min-width="100">
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.check_status == '0'">未审核</font>
							<font color="green" v-if="scope.row.check_status == '1'">审核通过</font>
							<font color="orange" v-if="scope.row.check_status == '2'">驳回</font>
							<font color="#909399" v-if="scope.row.check_status == '3'">废弃处理</font>
						</template>
					</el-table-column>
					<el-table-column prop="check_time" label="审核时间" min-width="150"></el-table-column>
					<el-table-column prop="check_user_name" label="审核人" min-width="150"></el-table-column>
					<el-table-column prop="charge_status" label="冻结状态" min-width="100">
						<!-- scope.row.charge_status=="未划款"，为了解决表格导出list数据响应更新问题 -->
						<!--<template slot-scope="scope">
				              {{scope.row.charge_status=="0" || scope.row.charge_status=="未划款"?"未划款":"已划款"}}
				            </template>-->
						<template slot-scope="scope">
							<font color="red" v-if="scope.row.charge_status == '0'">未冻结</font>
							<font color="green" v-else>已冻结</font>
						</template>
					</el-table-column>
					<el-table-column prop="charge_user_name" label="划款人" min-width="150"></el-table-column>
					<el-table-column prop="pay_channel_name" label="划款通道" min-width="100"></el-table-column>
					<el-table-column prop="trade_number" label="划款单号" min-width="150"></el-table-column>
					<el-table-column prop="charge_time" label="划款时间" min-width="150"></el-table-column>
					<el-table-column label="操作" align="center" fixed="right" min-width="100">
						<template slot-scope="scope">
							<div class="table-btn-text-wrap">
								<span class="table-btn-text" @click="showCheckDialog(scope.row)">{{scope.row.check_status | btnText}}</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页-->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!--审核-->
		<el-dialog :title="checkData.title" :visible.sync="checkData.show" class="dialog1 dialog-large dialog-bottom-fixed">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<checkUserOutFeeBox :checkData="checkData" ref="checkOutfee"></checkUserOutFeeBox>
				</div>
				<div class="dialog-bottom">
					<div class="check-box">
						<el-input v-model="checkData.comment" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="请输入审核意见"></el-input>
						<div class="check-btns" v-if="checkData.check_status == '0'">
							<el-button class="el-green-btn" @click="checkSubmit(1)" :loading="checkData.loading.state1">审核通过</el-button>
							<el-button class="el-red-btn" @click="checkSubmit(2)" :loading="checkData.loading.state2">拒绝申请</el-button>
							<el-button class="el-grey-btn" @click="checkSubmit(3)" :loading="checkData.loading.state3">废弃处理</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script src="./index.js">
</script>
