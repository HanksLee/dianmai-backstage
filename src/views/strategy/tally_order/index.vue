<template>
  <div class="page page-customer">
    <div class="page-header">
      <span>结算订单</span>
    </div>
    <div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
      <div class="operation-container">
        <div class="item">
          <!-- 用户筛选 -->
          <userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
        </div>
        <div class="item">
					<el-select v-model="ask_price_value" placeholder="请选择交易市场" @change="askPriceClick">
						<el-option
							v-for="item in marketTypeOpts"
							:key="item.key"
							:label="item.name"
							:value="item.key">
						</el-option>
					</el-select>
				</div>
        <div class="item">
          <span class="demonstration">时间：</span>
          <el-select v-model="warehouse" placeholder="请选择开仓时间或平仓时间">
            <el-option value="" label="全部"> </el-option>
             <el-option value="1" label="开仓时间"> </el-option>
             <el-option value="2" label="平仓时间"> </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="selectTime">
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
            <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
          </el-input>
        </div>
        <div class="item">
          <el-button style='margin-bottom:20px;' type="primary" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="list" :emptyText="emptyText" border show-summary :summary-method="getSummaries" style="width:100%">
          <el-table-column prop="id" label="订单号" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
          <el-table-column prop="real_name" label="客户姓名" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="parent_name" label="归属" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="open_time" label="买入时间" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="market_id" label="交易市场" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.market_id == '0'">上证</div>
							<div v-if="scope.row.market_id == '1'">深圳主板</div>
							<div v-if="scope.row.market_id == '2'">深圳创业板</div>
							<div v-if="scope.row.market_id == '3'">港股</div>
							<div v-if="scope.row.market_id == '4'">美股</div>
							<div v-if="scope.row.market_id == '5'">ETF</div>
              <div v-if="scope.row.market_id=='6'">上期所</div>
							<div v-if="scope.row.market_id=='7'">大商所</div>
							<div v-if="scope.row.market_id=='8'">郑商所</div>
							<div v-if="scope.row.market_id=='9'">中金所</div>
							<div v-if="scope.row.market_id=='10'">上期所</div>
              				<div v-if="scope.row.market_id=='11'">科创板</div>
						</template>
					</el-table-column>
          <el-table-column prop="stock_type" label="交易类型" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.stock_type == '0'">股票</div>
              <div v-if="scope.row.stock_type == '1'">指数.</div>
              <div v-if="scope.row.stock_type == '2'">指数</div>
            </template>
          </el-table-column>
          <el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="stock_code" label="股票代码" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column v-if="url=='huachihk.com'||url=='huifengstocks.com'" prop="init_margin" label="冻结资金" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column v-else prop="init_margin" label="操作资金" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="cmd" label="方向" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.cmd == '0'">多</div>
              <div v-if="scope.row.cmd == '1'">空</div>
            </template>
          </el-table-column>
          <el-table-column prop="coupon_money" label="红包抵扣" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="leverage" label="资金配比" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="assign_status" label="成交状态" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.assign_status == '0'">全部成交</div>
              <div v-if="scope.row.assign_status == '1'">部分成交</div>
              <div v-if="scope.row.assign_status == '2'">未成交</div>
            </template>
          </el-table-column>
          <el-table-column prop="volume" label="卖出数量" label-class-name="labelClass" min-width="100" sortable>
            <template slot-scope="scope">
                <div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
									{{Number(scope.row.volume)}}
								</div>
								<div v-else>{{Number(scope.row.volume)}}</div>
						</template>
          </el-table-column>
          <el-table-column prop="close_time" label="卖出时间" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="close_profit" label="平仓盈亏" label-class-name="labelClass" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="policy_type" label="产品类型" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="assign_day" label="持仓时间" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div>{{scope.row.open_time | timeCalculation(scope.row.close_time)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="commission" label="手续费" label-class-name="labelClass" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="delay_fee" label="递延费" label-class-name="labelClass" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="service_fee" label="管理费" label-class-name="labelClass" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="other_charge" label="券商代扣" label-class-name="labelClass" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="sell_reason" label="平仓原因" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.sell_reason == '0'">手动平仓</div>
              <div v-if="scope.row.sell_reason == '1'">操作资金不足</div>
              <div v-if="scope.row.sell_reason == '2'">余额不足</div>
              <div v-if="scope.row.sell_reason == '3'">止盈平仓</div>
              <div v-if="scope.row.sell_reason == '4'">止损平仓</div>
              <div v-if="scope.row.sell_reason == '5'">爆仓平仓</div>
              <div v-if="scope.row.sell_reason == '6'">结束递延平仓</div>
              <div v-if="scope.row.sell_reason == '7'">合约期结束平仓</div>
              <div v-if="scope.row.sell_reason == '8'">风控执行</div>
							<div v-if="scope.row.sell_reason == '9'">期货结束交易</div>
              <div v-if="scope.row.sell_reason == '10'">风控超跌强平</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" label-class-name="labelClass" min-width="100" fixed="right">
            <template slot-scope="scope">
              <span @click="$refs.obtainSublevel.policyDetails('tally','策略详情',scope.row.id)" style="color:#20a0ff;cursor: pointer;">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页开始 -->
      <paging :getList="getList" :page="page" ref="subassemblyData"></paging>
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
