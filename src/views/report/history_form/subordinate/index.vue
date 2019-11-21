<template>
	<div class="sub-box">
		<el-table :data="list" border :emptyText="emptyText">
			<el-table-column type="expand">
				<template slot-scope="scope">
					<subordinate :row="scope.row" :dataTime="dataTime"></subordinate>
				</template>
			</el-table-column>
			<el-table-column prop="real_name" label="姓名" min-width="120"></el-table-column>
			<el-table-column prop="parent_name" label="归属" min-width="100"></el-table-column>
			<el-table-column prop="cal_pay_in_money" label="入金" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_pay_out_money" label="出金" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_margin" label="投入操作资金" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_coupon_money" label="红包返现" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_buy_money" label="买入金额" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_sell_money" label="卖出金额" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_delay_fee" label="递延费" sortable min-width="84"></el-table-column>
			<el-table-column prop="cal_service_fee" label="管理费" sortable min-width="100"></el-table-column>
			<el-table-column prop="commission" label="手续费" sortable min-width="84"></el-table-column>
			<el-table-column prop="cal_other_fee" label="券商代扣" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_profit" label="平仓盈亏" sortable min-width="84"></el-table-column>
			<el-table-column prop="cal_div_profit" label="平台分成" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_market_money" label="推广分成" sortable min-width="100"></el-table-column>
			<el-table-column prop="real_wallet" label="资金余额" sortable min-width="100"></el-table-column>
			<el-table-column prop="frozen_money" label="冻结资金" sortable min-width="100"></el-table-column>
			<el-table-column prop="cal_user_wallet" label="可用余额" sortable min-width="100"></el-table-column>
		</el-table>
	</div>
</template>
<script>
	import { commonRequest } from "@/api/api-report"
	import subordinate from './index.vue'
	export default {
		name: 'subordinate',
		data() {
			return {
				emptyText: '数据加载中...',
				list: [],
				tf: false
			}
		},
		props: {
			row: Object,
			dataTime: Object,
		},
		methods: {
				getList() {
					this.tf = true
					commonRequest('earningList', {
						customer_id: this.row.customer_id,
						start_time: this.dataTime.active_start_time || '',
				        end_time: this.dataTime.active_end_time || ''
					}).then(res => {
						if(res.code == '200') {
							if(!Array.isArray(res.data)) {
								this.list = res.data.page_data || []
								if(this.list.length === 0){
                                  this.emptyText = '没有下级数据了'
								}
								this.formattedData()
							} else {
								this.emptyText = '没有下级数据了'
							}
						}else{
							this.$message(res.msg)
						}
					})
				},
				// 格式化数据
				formattedData() {
					for(let i = 0; i < this.list.length; i++) {
						this.list[i].cal_pay_in_money = Number(Number(this.list[i].cal_pay_in_money).toFixed(2))
						this.list[i].cal_pay_out_money = Number(Number(this.list[i].cal_pay_out_money).toFixed(2))
						this.list[i].cal_margin = Number(Number(this.list[i].cal_margin).toFixed(2))
						this.list[i].cal_coupon_money = Number(Number(this.list[i].cal_coupon_money).toFixed(2))
						this.list[i].cal_buy_money = Number(Number(this.list[i].cal_buy_money).toFixed(2))
						this.list[i].cal_sell_money = Number(Number(this.list[i].cal_sell_money).toFixed(2))
						this.list[i].cal_delay_fee = Number(Number(this.list[i].cal_delay_fee).toFixed(2))
						this.list[i].cal_service_fee = Number(Number(this.list[i].cal_service_fee).toFixed(2))
						this.list[i].commission = Number(Number(this.list[i].commission).toFixed(2))
						this.list[i].cal_other_fee = Number(Number(this.list[i].cal_other_fee).toFixed(2))
						this.list[i].cal_profit = Number(Number(this.list[i].cal_profit).toFixed(2))
						this.list[i].cal_div_profit = Number(Number(this.list[i].cal_div_profit).toFixed(2))
						this.list[i].cal_market_money = Number(Number(this.list[i].cal_market_money).toFixed(2))
						this.list[i].real_wallet = Number(Number(this.list[i].real_wallet).toFixed(2))
						this.list[i].frozen_money = Number(Number(this.list[i].frozen_money).toFixed(2))
						this.list[i].cal_user_wallet = Number(Number(this.list[i].cal_user_wallet).toFixed(2))
					}
				},
			},
			created() {
				this.getList()
			}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>