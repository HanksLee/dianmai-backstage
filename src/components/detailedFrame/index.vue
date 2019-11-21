<template>
	<div>
		<el-dialog :title="title" :emptyText="emptyText" :visible.sync="dialogFormVisible" id="dialog" class="dialog1 dialog-large dialog-bottom-fixed2">
			<div class="dialog-page" v-loading="loading">
				<div class="dialog-page-con" style="padding:15px 15px;">
					<div class="details-box">
						<el-row style="padding:0 0 6px;">
							<el-col :span="24">
								<h3><i class="fa fa-user"></i>{{detail.real_name}} <span style="padding-left:10px;font-size:12px;"><i class="fa fa-arrow-circle-o-right"></i>{{ detail.parent_name }}</span></h3></el-col>
						</el-row>
						<el-row>
							<div class="col-box">
								<div class="col" v-if="detail.market_id == '0'"><span>交易市场：</span>上证</div>
								<div class="col" v-if="detail.market_id == '1'"><span>交易市场：</span>深圳主板</div>
								<div class="col" v-if="detail.market_id == '2'"><span>交易市场：</span>深圳创业板</div>
								<div class="col" v-if="detail.market_id == '3'"><span>交易市场：</span>港股</div>
								<div class="col" v-if="detail.market_id == '4'"><span>交易市场：</span>美股</div>
								<div class="col" v-if="detail.market_id == '5'"><span>交易市场：</span>ETF</div>
								<div class="col" v-if="detail.market_id == '6'"><span>交易市场：</span>上期所</div>
								<div class="col" v-if="detail.market_id == '7'"><span>交易市场：</span>大商所</div>
								<div class="col" v-if="detail.market_id == '8'"><span>交易市场：</span>郑商所</div>
								<div class="col" v-if="detail.market_id == '9'"><span>交易市场：</span>中金所</div>
								<div class="col" v-if="detail.market_id == '10'"><span>交易市场：</span>上期所</div>
								<div class="col" v-if="detail.market_id == '11'"><span>交易市场：</span>科创板</div>
								<div class="col" v-if="detail.market_id == '3' || detail.market_id == '4'"><span>买入汇率：</span>{{detail.open_rate}}</div>
								<div class="col" v-if="!tf && detail.market_id == '3' || detail.market_id == '4'"><span>卖出汇率：</span>{{detail.close_rate}}</div>
							    <div class="col" v-if="detail.stock_type == '0'"><span>交易类型：</span>股票</div>
								<div class="col" v-if="detail.stock_type == '1'"><span>交易类型：</span>指数.</div>
								<div class="col" v-if="detail.stock_type == '2'"><span>交易类型：</span>指数</div>
							</div>
							<div class="col-box">
								<div class="col"><span>名称/代码：</span>{{detail.stock_name}} / {{detail.stock_code}}<em v-if="detail.stop_redeem_rate >0">(停牌赎回)</em></div>
								<div class="col"><span>产品类型：</span>{{detail.policy_type}}</div>
								<div class="col"><span>资金配比：</span>{{detail.leverage}}</div>
							</div>
							<div class="col-box">
								<div class="col">
									<span v-if="url=='huachihk.com'||url=='huifengstocks.com'">冻结资金：</span>
									<span v-else>操作资金：</span>
									{{detail.init_margin | numberFormat}}</div>
								<div class="col"><span>红包抵扣：</span>{{detail.coupon_money | numberFormat}}</div>
								<div class="col"><span>实际获利：</span>{{detail.huoli | numberFormat}}</div>
							</div>
							<div class="col-box" v-if="detail.market_id == '6' || detail.market_id == '7' || detail.market_id == '8' || detail.market_id == '9' || detail.market_id == '10'">
								<div class="col"><span>最低交易操作资金比率：</span>{{(Number(detail.margin.margin_rate) * 100).toFixed(2)}}%</div>
							</div>
						</el-row>
						<el-row>
							<div class="col-box">
								<div class="col"><span>方向<i class="duo-kong-hide" v-if="domainFn()">(多)</i>
								<i class="duo-kong-hide" v-if="!domainFn()">(多/空)</i>：</span><em v-if="detail.cmd == '0'">多</em><em v-else>空</em></div>
								<div class="col"><span>买入时间：</span>{{detail.open_time}}</div>
								<div class="col" v-if="detail.market_id == '3'"><span v-if="domainFn()">买入价格：</span><span v-else>买入均价：</span>HK${{Number(detail.open_price).toFixed(3)}}</div>
								<div class="col" v-else><span v-if="domainFn()">买入价格：</span><span v-else>买入均价：</span>￥{{Number(detail.open_price).toFixed(3)}}</div>
							</div>
							<div class="col-box">
								<div class="col" v-if="detail.market_id == '6' || detail.market_id == '7' || detail.market_id == '8' || detail.market_id == '9' || detail.market_id == '10'">
									<span>买入数量：</span>{{Number(detail.volume)}}
								</div>
								<div class="col" v-else>
									<span>买入数量：</span>{{detail.volume}}
								</div>
								<div class="col" v-if="detail.market_id == '3'"><span>买入金额：</span>HK${{detail.open_market_value | numberFormat}}</div>
								<div class="col" v-else><span>买入金额：</span>￥{{detail.open_market_value | numberFormat}}</div>
								<div class="col" v-if="detail.market_id == '6' || detail.market_id == '7' || detail.market_id == '8' || detail.market_id == '9' || detail.market_id == '10'">
									<span>可卖数量：</span>{{Number(detail.left_volume)}}
								</div>
								<div class="col" v-else><span>可卖数量：</span>{{detail.left_volume}}</div>
							</div>
							<div class="col-box">
								<div class="col"><span>卖出时间：</span>{{detail.close_time}}</div>
								<div class="col" v-if="detail.market_id == '3'"><span v-if="domainFn()">卖出价格：</span><span v-else>卖出均价：</span>HK${{Number(detail.close_price).toFixed(3)}}</div>
								<div class="col" v-else><span v-if="domainFn()">卖出价格：</span><span v-else>卖出均价：</span>￥{{Number(detail.close_price).toFixed(3)}}</div>
								<div class="col" v-if="detail.market_id == '3'"><span>转让盈亏：</span>HK${{detail.close_profit | numberFormat}}</div>
								<div class="col" v-else><span>转让盈亏：</span>￥{{detail.close_profit | numberFormat}}</div>
							</div>
							<div class="col-box" v-if="detail.market_id == '3'">
								<div class="col" v-if="tp_sl_witch == '1' && detail.tp>0"><span>止盈价：</span>HK${{detail.tp}}</div>
								<div class="col" v-if="tp_sl_witch == '1' && detail.sl>0"><span>止损价：</span>HK${{detail.sl}}</div>
								<div class="col" v-if="tp_sl_witch == '0' && detail.tp_money>0"><span>止盈金额：</span>HK${{detail.tp_money}}</div>
								<div class="col" v-if="tp_sl_witch == '0' && detail.sl_money>0"><span>止损金额：</span>HK${{detail.sl_money}}</div>
								<div class="col"><span>每手单位：</span>{{detail.lots_size}}</div>
							</div>
							<div class="col-box" v-else>
								<div class="col" v-if="tp_sl_witch == '1' && detail.tp>0"><span>止盈价：</span>￥{{detail.tp}}</div>
								<div class="col" v-if="tp_sl_witch == '1' && detail.sl>0"><span>止损价：</span>￥{{detail.sl}}</div>
								<div class="col" v-if="tp_sl_witch == '0' && detail.tp_money>0"><span>止盈金额：</span>￥{{detail.tp_money}}</div>
								<div class="col" v-if="tp_sl_witch == '0' && detail.sl_money>0"><span>止损金额：</span>￥{{detail.sl_money}}</div>
								<div class="col"><span>每手单位：</span>{{detail.lots_size}}</div>
							</div>
						</el-row>
						<el-row>
							<div class="col-box" v-if="detail.market_id == '3'">
								<div class="col"><span>当前价格：</span>HK${{Number(detail.now_price).toFixed(3)}}</div>
								<div class="col"><span>当前市值：</span>HK${{detail.now_market_value | numberFormat}}</div>
								<div class="col"><span>当前盈亏：</span>HK${{detail.now_profit | numberFormat}}</div>
							</div>
							<div class="col-box" v-else>
								<div class="col"><span>当前价格：</span>￥{{Number(detail.now_price).toFixed(3)}}</div>
								<div class="col"><span>当前市值：</span>￥{{detail.now_market_value | numberFormat}}</div>
								<div class="col"><span>当前盈亏：</span>￥{{detail.now_profit | numberFormat}}</div>
							</div>
						</el-row>
						<el-row v-if="detail.stock_type == '0'">
							<div class="col-box" style="padding-bottom:16px;">
								<span>买入费用(手续费+管理费+券商代扣)：</span>
								({{detail.buy_commission | numberFormat}} + {{detail.service_fee | numberFormat}} + {{ detail.buy_securities_fee | numberFormat}}) = {{ detail.buy_commission + detail.service_fee + detail.buy_securities_fee | numberFormat}}
							</div>
							<div class="col-box" style="padding-bottom:16px;">
								<span>卖出费用(手续费+券商代扣)：</span>({{detail.sell_commission | numberFormat}} + {{detail.sell_securities_fee | numberFormat}}) = {{ detail.sell_commission + detail.sell_securities_fee | numberFormat}}
							</div>
							<div class="col-box" style="padding-bottom:16px;" v-if="detail.stop_redeem_rate>0">
								<span>赎回手续费：</span>{{detail.stop_fee}}
							</div>
							<div class="col-box" style="padding-bottom:16px;" v-if="detail.stop_redeem_rate>0">
								<span>赎回费率：</span>{{Number(detail.stop_redeem_rate)*100}}%
							</div>
						</el-row>
						<el-row v-if="detail.stock_type == '1'">
							<div class="col-box" style="padding-bottom:16px;">
								<span>买入手续费：</span>
								{{detail.buy_commission | numberFormat}}
							</div>
							<div class="col-box" style="padding-bottom:16px;">
								<span>卖出手续费：</span>{{detail.sell_commission | numberFormat}}
							</div>
						</el-row>
						<el-row v-if="detail.stock_type == '0'">
							<div class="col-box">
								<div class="col"><span>递延费/递延天数：</span>{{detail.delay_fee | numberFormat}} / {{detail.delay_days | numberFormat}}</div>
								<div class="col"><span>平台盈利分成：</span>{{detail.real_div_profit | numberFormat}}</div>
							</div>
						</el-row>
						<el-row v-if="detail.stock_type == '1'">
							<div class="col-box">
								<div class="col"><span>递延费：</span>{{detail.delay_fee | numberFormat}}</div>
							</div>
						</el-row>
					</div>
					<div class="details-box">
						<div style="padding:10px 20px;border-bottom:1px solid #ccc;font-size:16px;color:#f00;">计算公式：</div>
						<el-row style="padding-bottom:10px;color:#f00;">
							<el-col :span="10">
								持仓订单：获利金额=买入费用*买入汇率*-1
							</el-col>
							<el-col :span="14">
								平仓订单：获利金额=买入费用*买入汇率*-1 + (转让盈亏-卖出费用-盈利分成)*卖出汇率
							</el-col>
						</el-row>
						<el-row style="color:#f00;">
							<el-col :span="14">
								平仓时计算获利金额：获利金额=(转让盈亏-卖出费用-盈利分成)*卖出汇率
							</el-col>
						</el-row>
					</div>
					<div class="details-tab">
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane label="买入明细" name="1">
								<div class="table-data">
									<el-table :data="buy_detail.list" border style="width:100%">
										<el-table-column prop="order_no" label="订单号" label-class-name="labelClass" min-width="100"></el-table-column>
										<el-table-column prop="stock_name" label="股票名称/代码" label-class-name="labelClass" min-width="100"></el-table-column>
										<el-table-column prop="volume" label="成交数量" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
													{{Number(scope.row.volume)}}
												</div>
												<div v-else>{{Number(scope.row.volume)}}</div>
											</template>
										</el-table-column>
										<el-table-column prop="open_price" label="成交价格" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{Number(scope.row.open_price).toFixed(3)}}</div>
										    </template>
										</el-table-column>
										<el-table-column prop="cmd" label="方向" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.cmd == '0'">多</div>
												<div v-if="scope.row.cmd == '1'">空</div>
											</template>
										</el-table-column>
										<el-table-column prop="open_time" label="成交时间" label-class-name="labelClass" min-width="145"></el-table-column>
									</el-table>
									<el-pagination class="pagination" small background :page-size="buy_detail.page_size" :current-page="buy_detail.page_no" :total="buy_detail.total" layout="prev, pager, next" @current-change="changePageBuyDetail">
									</el-pagination>
								</div>
							</el-tab-pane>
							<el-tab-pane label="卖出明细" name="2">
								<div class="table-data">
									<el-table :data="sell_detail.list" border style="width:100%">
										<el-table-column prop="order_no" label="订单号" label-class-name="labelClass" min-width="100" fixed="left">
										</el-table-column>
										<el-table-column prop="stock_name" label="股票名称/代码" label-class-name="labelClass" min-width="100">
										</el-table-column>
										<el-table-column prop="volume" label="成交数量" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
													{{Number(scope.row.volume)}}
												</div>
												<div v-else>{{Number(scope.row.volume)}}</div>
											</template>
										</el-table-column>
										<el-table-column prop="close_price" label="成交价格" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{Number(scope.row.close_price).toFixed(3)}}</div>
										    </template>
										</el-table-column>
										<el-table-column prop="cmd" label="方向" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.cmd == '0'">多</div>
												<div v-if="scope.row.cmd == '1'">空</div>
											</template>
										</el-table-column>
										<el-table-column prop="commission" label="手续费" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{scope.row.commission | numberFormat}}</div>
										    </template>
										</el-table-column>
										<el-table-column prop="close_profit" label="平仓盈亏" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{scope.row.close_profit | numberFormat}}</div>
										    </template>
										</el-table-column>
										<el-table-column prop="real_div_profit" label="平仓盈利分成" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{scope.row.real_div_profit | numberFormat}}</div>
										    </template>
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
										<el-table-column prop="close_time" label="成交时间" label-class-name="labelClass" min-width="145">
										</el-table-column>
										<el-table-column prop="op" label="操作" label-class-name="labelClass" min-width="100" right>
											<template slot-scope="scope">
												<el-button type="text" @click="seekDetailed(scope.row)">查看详细</el-button>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination class="pagination" small background :page-size="sell_detail.page_size" :current-page="sell_detail.page_no" :total="sell_detail.total" layout="prev, pager, next" @current-change="changePageSellDetail">
									</el-pagination>
								</div>
							</el-tab-pane>
							<el-tab-pane label="递延明细" name="3">
								<div class="table-data">
									<el-table :data="delay_detail.list" border style="width:100%">
										<el-table-column prop="order_no" label="订单号" label-class-name="labelClass" min-width="100" fixed="left">
										</el-table-column>
										<el-table-column prop="stock_name" label="股票名称/代码" label-class-name="labelClass" min-width="100">
										    <template slot-scope="scope">
												<div>{{scope.row.stock_name}} / {{scope.row.stock_code}}</div>
											</template>
										</el-table-column>
										<el-table-column prop="open_time" label="买入时间" label-class-name="labelClass" min-width="100">
										</el-table-column>
										<el-table-column prop="volume" label="可卖数量" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
													{{Number(scope.row.volume)}}
												</div>
												<div v-else>{{Number(scope.row.volume)}}</div>
											</template>
										</el-table-column>
										<el-table-column prop="delay_fee" label="费用" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{scope.row.delay_fee | numberFormat}}</div>
										    </template>
										</el-table-column>
										<el-table-column prop="trans_time" label="结算时间" label-class-name="labelClass" min-width="100">
										</el-table-column>
										<el-table-column prop="open_price" label="开仓价" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
											    <div>{{Number(scope.row.open_price).toFixed(3)}}</div>
										    </template>
										</el-table-column>
										<el-table-column prop="balance_status" label="扣款状态" label-class-name="labelClass" min-width="100">
											  <template slot-scope="scope">
												   <div v-if="scope.row.balance_status == '0'" style="color:#f00">失败</div>
												   <div v-if="scope.row.balance_status == '1'" style="color:rgb(103, 194, 58);">成功</div>
											  </template>
										</el-table-column>
										<el-table-column prop="comment" label="备注" label-class-name="labelClass" min-width="100">
										</el-table-column>
									</el-table>
									<el-pagination class="pagination" small background :page-size="delay_detail.page_size" :current-page="delay_detail.page_no" :total="delay_detail.total" layout="prev, pager, next" @current-change="changePageDelayDetail">
									</el-pagination>
								</div>
							</el-tab-pane>
							<el-tab-pane label="止盈止损明细" name="4">
                                <div class="table-data">
									<el-table :data="tp_sl_detail.list" border style="width:100%">
										<el-table-column prop="tp" label="止盈价" label-class-name="labelClass" min-width="100">
										</el-table-column>
										<el-table-column prop="sl" label="止损价" label-class-name="labelClass" min-width="100">
										</el-table-column>
										<el-table-column prop="create_time" label="时间" label-class-name="labelClass" min-width="100">
										</el-table-column>
									</el-table>
									<el-pagination class="pagination" small background :page-size="tp_sl_detail.page_size" :current-page="tp_sl_detail.page_no" :total="tp_sl_detail.total" layout="prev, pager, next" @current-change="changePageSlTlDetail">
									</el-pagination>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
				</div>
			</div>
		</el-dialog>
		<el-dialog title="成交明细" :visible.sync="dealDetailVisible" class="dialog1 dialog-large dealDetail dialog-bottom-fixed">
              <div class="dialog-page">
				<div class="dialog-page-con" style="padding:15px 15px;">
				    <el-table :data="dealDetailList" border style="width:100%">
						<el-table-column prop="order_no" label="订单号" label-class-name="labelClass" min-width="100" fixed="left">
						</el-table-column>
						<el-table-column prop="stock_code" label="股票代码 " label-class-name="labelClass" min-width="100">
						</el-table-column>
						<el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass" min-width="100">
						</el-table-column>
						<el-table-column prop="trans_time" label="成交时间" label-class-name="labelClass" min-width="100">
						</el-table-column>
						<el-table-column prop="volume" label="成交数量" label-class-name="labelClass" min-width="100">
							<template slot-scope="scope">
								<div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
									{{Number(scope.row.volume)}}
								</div>
								<div v-else>{{Number(scope.row.volume)}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="成交价格" label-class-name="labelClass" min-width="100">
							<template slot-scope="scope">
								<div>{{Number(scope.row.price).toFixed(3)}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="profit" label="转让盈亏" label-class-name="labelClass" min-width="100">
							<template slot-scope="scope">
								<div>{{scope.row.profit | numberFormat}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
              </div>
		</el-dialog>
	</div>
</template>
<script type="text/javascript" src="./index.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.dialog-page-con {
		h3 {
			color: #20a0ff;
			font-size: 16px;
		}
		.details-box {
			background-color: #f5f5f5;
			overflow: hidden;
			padding: 5px 0;
			color: #111;
			border-radius: 5px;
			border: 1px solid #ddd;
			margin-bottom: 20px;
			.el-row {
				color: #111;
				padding: 0 30px 0;
				border-bottom: 1px solid #ddd;
				.el-col-24 {
					padding-left: 30px;
					padding-bottom: 10px;
					i {
						padding-right: 5px;
					}
				}
				span {
					color: #333;
					font-weight:bold;
				}
				.col-box {
					width:100%;
					float:left;

				}
				.col {
					padding-bottom: 16px;
					width:33.33%;
					float: left;
				}
			}
			.el-row:nth-last-of-type(1) {
				border-bottom: none;
			}
		}
	}
	.dialog-bottom-fixed2 .dialog-page-con {
		bottom: 20px !important;
	}
</style>
