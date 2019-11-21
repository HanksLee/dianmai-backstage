<template>
	<div>
		<div class="dialog-section">
			<el-row>
				<el-col :span="8">
					<span class="label">姓名：</span><span class="label-val">{{baseInfo.real_name}}</span>
				</el-col>
				<el-col :span="8">
					<span class="label">客户归属：</span><span class="label-val">{{baseInfo.short_name}}</span>
				</el-col>
			</el-row>

		</div>
		<div class="dialog-section">
			<el-row>
				<el-col :span="8">
					<span class="label" style="font-weight: bold;color: #000;">出金金额：</span>
					<span v-if="url=='huifengstocks.com'||url=='huachihk.com'||url=='dianmai361.com'" class="label-val" style="font-size: 16px; font-weight: bold; color: #f00;">{{baseInfo.real_money}}</span>
					<span v-else class="label-val" style="font-size: 16px; font-weight: bold; color: #f00;">{{baseInfo.money}} ({{baseInfo.currency}})</span>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<span class="label" style="color:#333;font-weight:600;">账户余额：</span><span class="label-val" style="color:#ff4949;">{{baseInfo.real_wallet}}</span>
				</el-col>
				<el-col :span="8">
					<span class="label" style="color:#333;font-weight:600;">可用资金：</span><span class="label-val" style="color:#ff4949;">{{baseInfo.usable_money}}</span><span class="label-val"></span>
				</el-col>
				<el-col :span="8">
					<span class="label" style="color:#333;font-weight:600;">冻结资金：</span><span class="label-val" style="color:#ff4949;">{{baseInfo.frozen_money}}</span><span class="label-val"></span>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<span class="label">收款银行：</span><span class="label-val">{{baseInfo.bank_name}}</span>
				</el-col>
				<el-col :span="8">
					<span class="label">银行卡号：</span><span class="label-val">{{baseInfo.bank_card}}</span>
				</el-col>
				<el-col :span="8">
					<span class="label">支行名称：</span><span class="label-val">{{baseInfo.bank_branch}}</span>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8"><span class="label">支付状态：</span><span class="label-val" v-if="baseInfo.pay_status == '0'">未支付</span><span class="label" v-if="baseInfo.pay_status == '1'">已支付</span></el-col>
			</el-row>
		</div>
		<el-row>
			<el-col :spen="24">
				<el-table :data="list" border style="width:100%">
					<!--<el-table-column prop="account_id" label="MT4单号" label-class-name="labelClass">
					</el-table-column>-->
					<el-table-column prop="money" label="发生金额" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="time" label="发生时间" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="comment" label="备注" label-class-name="labelClass"></el-table-column>
				</el-table>
				<!-- 分页-->
				<paging :getList="getwithdrawDetail" :page="page" ref="subassemblyData"></paging>
			</el-col>
		</el-row>
	</div>
</template>
<script type="text/javascript" src="./checkOutfeeBox.js"></script>
