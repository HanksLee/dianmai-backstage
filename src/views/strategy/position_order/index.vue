<template>
  <div class="page page-customer">
    <div class="page-header">
      <span>持仓订单</span>
    </div>
    <div class="page-con" v-loading="loading" element-loading-text="数据加载中....">
      <div class="operation-container">
        <div class="item">
          <el-button type="primary" icon="el-icon-plus" @click="add" v-if="globalPermission('v1_admin/orderbuy/buy')">创建订单</el-button>
        </div>
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
          <span class="demonstration">发布时间：</span>
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
          <el-table-column prop="policy_type" label="产品类型" label-class-name="labelClass" min-width="100"></el-table-column>
		  <el-table-column prop="stock_type" label="交易类型" label-class-name="labelClass" min-width="100">
			<template slot-scope="scope">
			   <div v-if="scope.row.stock_type == '0'">股票</div>
			   <div v-if="scope.row.stock_type == '1'">指数.</div>
			   <div v-if="scope.row.stock_type == '2'">指数</div>
			</template>
		  </el-table-column>
          <el-table-column prop="open_time" label="买入时间" label-class-name="labelClass" min-width="170"></el-table-column>
          <el-table-column prop="expire_date" label="到期时间" label-class-name="labelClass" min-width="100"></el-table-column>
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
          <el-table-column prop="coupon_money" label="红包返现" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="leverage" label="资金配比" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="assign_status" label="成交状态" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.assign_status == '0'">全部成交</div>
              <div v-if="scope.row.assign_status == '1'">部分成交</div>
              <div v-if="scope.row.assign_status == '2'">未成交</div>
            </template>
          </el-table-column>
          <el-table-column prop="volume" label="买入数量" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
               <div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
									{{Number(scope.row.volume)}}
								</div>
								<div v-else>{{Number(scope.row.volume)}}</div>
						</template>
					</el-table-column>
          <el-table-column prop="open_price" label="买入价格" label-class-name="labelClass" min-width="100" sortable v-if="domainFn()"></el-table-column>
		  <el-table-column prop="open_price" label="买入均价" label-class-name="labelClass" min-width="100" sortable v-else></el-table-column>
          <el-table-column prop="left_volume" label="剩余数量" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
                <div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
									{{Number(scope.row.left_volume)}}
								</div>
								<div v-else>{{Number(scope.row.left_volume)}}</div>
						</template>
					</el-table-column>
          <el-table-column prop="sell_profit" label="转让盈亏" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="float_profit" label="浮动盈亏" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="profit_rate" label="盈亏比率(%)" label-class-name="labelClass" min-width="120" sortable></el-table-column>
          <el-table-column prop="now_price" label="当前价" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="market_value" label="市值" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.market_value * scope.row.pip_value}}</div>
						</template>
					</el-table-column>
          <el-table-column prop="assign_day" label="持仓时间" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.assign_time | timeCalculation}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="commission" label="手续费" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="delay_fee" label="递延费" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="service_fee" label="管理费" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <el-table-column prop="other_recharge" label="券商代扣" label-class-name="labelClass" min-width="100" sortable></el-table-column>
          <!-- <el-table-column prop="subscribe" label="自主/订阅" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.subscribe == '1'">自主</div>
              <div v-if="scope.row.subscribe == '0'">订阅</div>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" label-class-name="labelClass" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{cmd:1, row:scope.row}" v-if="globalPermission('v1_admin/orderbuy/sell') && scope.row.suspend_status == 0">卖出平仓</el-dropdown-item>
									<el-dropdown-item :command="{cmd:3, row:scope.row}" v-if="globalPermission('v1_admin/orderbuy/sell') && scope.row.suspend_status == 1">停牌赎回</el-dropdown-item>
                  <el-dropdown-item :command="{cmd:2, row:scope.row}">查看详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页开始 -->
      <!-- 分页 -->
      <paging :getList="getList" :page="page" ref="subassemblyData"></paging>
      <!-- 分页结束 -->
    </div>
    <!--创建订单-->
    <el-dialog title="买入开仓" class="dialog1 dialog-s" :visible.sync="orderDialogShow">
			<div class="dialog--page">
				<div class="dialog-section">
					<el-form>
						<el-row>
							<el-col :span="3"><span class="label">客户：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-autocomplete popper-class="my-autocomplete"
												v-model="stockParams.real_name"
												:fetch-suggestions="querySearchName"
												custom-item="my-item-zh"
												placeholder="姓名/手机号"
												@select="handleSelectName"
												style="width: 300px !important;">
												<template slot-scope="{ item }">
	                        <span class="name">{{item.real_name}}</span>
	                        <span>{{item.code_id}}</span>
		                    </template>
											</el-autocomplete>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">搜索股票：</span></el-col>
							<el-col :span="12">
								<div class="label-val">
									<el-form-item>
										<el-autocomplete popper-class="my-autocomplete"
												v-model="stockParams.stock_code"
												:fetch-suggestions="querySearch"
												custom-item="my-item-zh"
												placeholder="股票名称/代码"
												@select="handleSelect"
												style="width: 300px !important">
												<template slot-scope="{ item }">
                    			<span class="name">{{item.stock_name}}</span>
	                        <span>{{item.stock_code}}</span>
	                        <span>{{item.now_price}}</span>
	                        <span>{{item.dif_rate}}</span>
		                    </template>
											</el-autocomplete>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">策略类型：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-select v-model="stockParams.policy_type" placeholder="请选择">
												<el-option v-for="item in productParams" :key="item.id" :label="item.policy_name" :value="item.id">
												</el-option>
											</el-select>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="3">
								<span v-if="url=='huachihk.com'||url=='huifengstocks.com'" class="label">冻结资金：</span>
								<span v-else class="label">操作资金：</span>
							</el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-input onkeyup="this.value=this.value.replace(/\D/g, '')" v-model="stockParams.init_margin"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">投资人配比：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-input v-model="stockParams.leverage" placeholder="例如：3,4,5"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">买入价格：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										以 <el-input　v-model="stockParams.assign_price" style="width:120px" placeholder="请输入价格"></el-input> 价格买入
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="3"><span class="label">可买数量：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<span style="font-size: 14px;">{{assignVolume || 0}}</span>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">止盈：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-input onkeyup="this.value=this.value.replace(/[^\d\.]/g, '')" v-model="stockParams.tp"></el-input>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="3"><span class="label">止损：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-input v-model="stockParams.sl"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">开仓时间：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-date-picker
								      v-model="stockParams.open_time"
								      type="datetime"
								      placeholder="请选择开仓时间"
								      default-time="12:00:00">
								    </el-date-picker>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="3"><span class="label">到期日期：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-date-picker
								      v-model="stockParams.expire_date"
								      type="date"
								      placeholder="请选择到期日期">
								    </el-date-picker>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="3"><span class="label">方向：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<el-form-item>
										<el-radio label="0" v-model="stockParams.cmd" style="color: #999;">多</el-radio>
										<el-radio label="1" v-model="stockParams.cmd" style="color: #999;">空</el-radio>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="3"><span class="label">可用资金：</span></el-col>
							<el-col :span="8">
								<div class="label-val">
									<font style="font-size: 14px;color: #FF0000">{{stockParams.balance | numberFormat}}</font>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="orderDialogShow = false">取 消</el-button>
						<el-button type="primary" @click="stockSubmit">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
    <!--卖出平仓-->
    <el-dialog title="卖出平仓" :visible.sync="dialogShow" class="dialog1 dialog-s">
			<div class="dialog-page">
				<div class="dialog-section">
					<el-form>
						<el-row>
							<el-col :span="4"><span class="label">客户：</span></el-col>
							<el-col :span="14">
								<div class="label-val">
									<font>{{stockSellParams.real_name}}</font>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">股票名称：</span></el-col>
							<el-col :span="14">
								<div class="label-val">
									<font>{{stockSellParams.stock_name}}</font>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">买入价：</span></el-col>
							<el-col :span="14">
								<div class="label-val">
									<font>{{stockSellParams.open_price}}</font>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">方向：</span></el-col>
							<el-col :span="14">
								<div class="label-val">
									<font>{{stockSellParams.cmd == '1'?'空': '多'}}</font>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">卖出数量：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-input v-model="stockSellParams.left_volume" placeholder="请输入卖出数量"></el-input>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">卖出价格：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-input v-model="close_price" placeholder="请输入卖出价格"></el-input>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">平仓时间：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-date-picker
										v-model="create_time"
										type="datetime"
										placeholder="请输选择平仓时间">
									</el-date-picker>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogShow = false">取 消</el-button>
						<el-button type="primary" @click="orderSell">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
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
  .dialog-section {
    margin-top: 0;
  }
  .dialog1 .el-form-item {
  	margin-bottom: 0;
  }
  .dialog-section .label {
  	line-height: 40px;
  }
  font {
  	height: 40px;
  	line-height: 40px;
  }
</style>
<style>
	.el-form-item .el-form-item__content {
		font-size: 12px;
		color: #999;
  }
  .my-autocomplete li {
  	display: flex;
  	/*justify-content: space-between;*/
  }
  .my-autocomplete li span {
  	width: 25%;
  	text-align: center;
  }
</style>
<script src="./index.js"></script>
