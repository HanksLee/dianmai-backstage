<template>
	<div class="page page-accouttype">
		<div class="page-header">异常信息</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
          <span class="demonstration">异常类型：</span>
          <el-select v-model="exceptionType" placeholder="异常类型" @change="exceptionTypeHandler">
						<el-option label="风控异常" value="0"></el-option>
						<el-option label="递延费异常" value="1"></el-option>
					</el-select>
        </div>
				<div class="item">
					<userScreening :getList="getExceptionList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<el-select v-model="market" placeholder="交易市场" @change="changeHandler">
						<el-option v-for="item in marketList" :key="item.key" :label="item.name" :value="item.key">
						</el-option>
					</el-select>
				</div>
				<div class="item">
          <span class="demonstration">时间：</span>
          <el-date-picker v-model="checkTime" type="daterange" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="selectTime">
          </el-date-picker>
        </div>
				<div class="item s-itme" style="margin-right:-3px;">
          <el-select v-model="screenValue" placeholder="请选择">
            <el-option v-for="item in screenOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-input placeholder="姓名/股票名称/股票代码" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="searchList">搜索</el-button>
          </el-input>
        </div>
			</div>
			<div class="table-data">
				<el-table :data="exceptionList" stripe border style="width:100%">
					<!-- <el-table-column fixed prop="id" label="记录ID" >
					</el-table-column> -->
					<template v-if="exceptionType === '0'">
						<el-table-column prop="real_name" label="客户名" >
						</el-table-column>
						<el-table-column prop="cust_id" label="客户ID" >
						</el-table-column>
						<el-table-column prop="order_id" label="订单号" ></el-table-column>
						<el-table-column prop="market" label="股票市场"  min-width="130">
						</el-table-column>
						<el-table-column prop="stock_code" label="股票代码" >
						</el-table-column>
						<el-table-column prop="stock_name" label="股票名称" >
						</el-table-column>
						<el-table-column prop="close_price" label="收盘价" ></el-table-column>
						<el-table-column prop="close_type" label="平仓原因"  min-width="110">
							<template slot-scope="scope">
								<div v-if="scope.row.close_type == '0'">手动平仓</div>
								<div v-if="scope.row.close_type == '1'">操作资金不足</div>
								<div v-if="scope.row.close_type == '2'">余额不足</div>
								<div v-if="scope.row.close_type == '3'">止盈平仓</div>
								<div v-if="scope.row.close_type == '4'">止损平仓</div>
								<div v-if="scope.row.close_type == '5'">爆仓平仓</div>
								<div v-if="scope.row.close_type == '6'">结束递延平仓</div>
								<div v-if="scope.row.close_type == '7'">合约期结束平仓</div>
								<div v-if="scope.row.close_type == '8'">风控执行</div>
								<div v-if="scope.row.close_type == '9'">期货结束交易</div>
								<div v-if="scope.row.close_type == '10'">风控超跌强平</div>
							</template>
						</el-table-column>
						<el-table-column prop="err_msg" label="错误信息"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="fail_num" label="失败次数"  min-width="70">
						</el-table-column>
						<el-table-column prop="create_time" label="创建时间"  min-width="130">
						</el-table-column>
						<el-table-column prop="exec_time" label="执行时间"  min-width="130">
						</el-table-column>
						<el-table-column prop="policy_type" label="产品名称" >
						</el-table-column>
					</template>
					<template v-else>
						<el-table-column prop="real_name" label="客户名" >
						</el-table-column>
						<el-table-column prop="customer_id" label="客户ID"  min-width="130">
						</el-table-column>
						<el-table-column prop="policy_id" label="策略ID"  min-width="70">
						</el-table-column>
						<el-table-column prop="market" label="股票市场"  min-width="130">
						</el-table-column>
						<el-table-column prop="stock_code" label="股票代码"  >
						</el-table-column>
						<el-table-column prop="stock_name" label="股票名称" >
						</el-table-column>
						<el-table-column prop="comment" label="异常说明" >
						</el-table-column>
						<el-table-column prop="policy_type" label="产品名称" >
							<template slot-scope="scope">
								{{ scope.row.policy_type }}
							</template>
						</el-table-column>
						<el-table-column prop="balance_time" label="异常日期" min-width="130">
						</el-table-column>
					</template>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getQuotation" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>

<script src="./index.js">
</script>

<style>

</style>