<template>
  <div>
    <!-- 查看详细 -->
    <el-dialog title="详细信息" id="dialog" class="dialog1 dialog-large dialog-bottom-fixed2 details-dialog" :visible.sync="detailed.dialogVisible" :before-close="closeDetailed">
      <div class="detailed-but-box">
        <span @click="zoomFn('narrow')"><i class="fa fa-minus-circle"></i></span>
        <span @click="zoomFn('enlarge')"><i class="fa fa-plus-circle"></i></span>
      </div>
      <div class="dialog-page" v-loading="loading">
        <div class="dialog-page-con d-detail">
          <div class="dialog-dl">
            <div class="account-info">
              <div class="b1 clearfix">
                <div class="name">{{id_info.real_name}}({{nick_name}})</div>
                <div class="belong"><i class="fa fa-arrow-circle-o-right"></i>无</div>
              </div>
              <div class="b2 clearfix">
                <div class="item">
                  <i class="fa fa-map-marker"></i>
                  <span>{{id_info.city}}</span>
                </div>
                <div class="item">
                  <i class="fa fa-phone"></i>
                  <span>{{id_info.mobile}}</span>
                </div>
                <div class="item">
                  <i class="fa fa-envelope-o"></i>
                  <span>{{id_info.email}}</span>
                </div>
                <!-- <el-tooltip class="item" effect="dark" content="查看个人资料" placement="top"> -->
                  <div class="item ck" @click="eyeFn" v-if="!eyeTf && userInfo.role_zone === 2">
                    <i class="fa fa-eye"></i>
                  </div>
                <!-- </el-tooltip> -->
              </div>
              <div class="b3 clearfix b3-red">
                <div class="item">
                  <p>资金余额：<span>{{fund_info.balance | numberFormat}}</span></p>
                  <p>冻结资金：<span>{{fund_info.frozen_money | numberFormat}}</span></p>
                  <p>可用资金：<span>{{fund_info.margin_free | numberFormat}}</span></p>
                </div>
                <div class="item">
                  <p>推广分成：<span>{{fund_info.market_money | numberFormat}}</span></p>
                  <p>发生费用：<span>{{fund_info.cal_fee | numberFormat}}</span></p>
                  <p>红包返现：<span>{{fund_info.cal_coupon_money | numberFormat}}</span></p>
                </div>
                <div class="item">
                  <p>股票市值：<span>{{fund_info.stock_value | numberFormat}}</span></p>
                  <p>浮动盈亏：<span>{{fund_info.stock_profit | numberFormat}}</span></p>
                  <p>转让盈亏：<span>{{fund_info.cal_profit | numberFormat}}</span></p>
                </div>
                <div class="item">
                  <p>成交量：<span>{{fund_info.cal_buy_volume}}</span></p>
                  <p>成交额：<span>{{fund_info.cal_buy_money | numberFormat}}</span></p>
                  <p>成交笔数：<span>{{fund_info.cal_buy_count}}</span></p>
                </div>
                <div class="item">
                  <p>总入金：<span>{{fund_info.cal_pay_in_moey | numberFormat}}</span></p>
                  <p>总出金：<span>{{fund_info.cal_pay_out_moey | numberFormat}}</span></p>
                  <p>净入金：<span>{{fund_info.cal_pay_equity_moey | numberFormat}}</span></p>
                </div>
                <div class="item">
                  <p>出金冻结：<span>{{fund_info.out_frozen | numberFormat}}</span></p>
                  <p>净资产：<span>{{netAssets | numberFormat}}</span></p>
                  <p>风险值：<span>{{valueAtRisk | numberFormat}}%</span></p>
                </div>
                <div class="r-info">注册： | 渠道：</div>
              </div>
              <div class="clearfix">
                <div class="left-con">
                  <div class="card card-h">
                    <el-tabs v-model="activeName" @tab-click="handleClick(activeName)" v-loading="loading1">
                      <el-tab-pane label="最近登录" name="login">
                        <div class="con">
                          <div class="d-table">
                            <el-table :data="list_info" :show-header="false" style="width: 100%">
                              <el-table-column prop="login_from" label="登陆方式">
                                <template slot-scope="scope">
                                  <div v-if="scope.row.login_from == '0'">PC端</div>
                                  <div v-if="scope.row.login_from == '1'">手机</div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="login_time" label="登陆时间">
                              </el-table-column>
                              <el-table-column prop="login_ip" label="登陆ip">
                              </el-table-column>
                              <el-table-column prop="login_city" label="登陆城市">
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="自选股票" name="shares">
                        <div class="con">
                          <div class="d-table">
                            <el-table :data="list_info" :show-header="false" style="width: 100%">
                              <el-table-column prop="stock_name" label="股票名称">
                              </el-table-column>
                              <el-table-column prop="stock_code" label="股票代码">
                              </el-table-column>
                              <el-table-column prop="now_price" label="当前价格">
                                <template slot-scope="scope">
                                  <div>{{Number(scope.row.now_price).toFixed(3)}}</div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="dif_rate" label="涨跌浮">
                                <template slot-scope="scope">
                                  <div v-if="Number(scope.row.dif_rate) > 0" style="color:rgb(103, 194, 58)">{{scope.row.dif_rate || 0}}%</div>
                                  <div v-else style="color:#f00">{{scope.row.dif_rate || 0}}%</div>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </el-tab-pane>
                      <el-pagination small background :page-size="info_page.page_size" :current-page="info_page.page_no" layout="prev, pager, next" @current-change="changePageInfo" :total="info_page.total">
                      </el-pagination>
                    </el-tabs>
                  </div>
                </div>
                <div class="right-con">
                  <div class="card card-h">
                    <div class="h">
                      <span class="text">个人资料</span>
                      <i class="fa fa-eye ck" @click="eyeFn" v-if="!eyeTf && userInfo.role_zone === 2"></i>
                    </div>
                    <div class="con" v-if="eyeTf || customer_id == userInfo.user_id">
                      <div class="account-info2">
                        <div class="line">
                          <span>国家：{{id_info.country}}</span>
                        </div>
                        <div class="line">
                          <div class="row-span">
                            <span>省份：{{id_info.province}}</span>
                          </div>
                          <div class="row-span">
                            <span>城市：{{id_info.city}}</span>
                          </div>
                        </div>
                        <div class="line">
                          <span>地址：{{id_info.address}}</span>
                        </div>
                        <div class="line">
                          <span>证件号码：{{id_info.card_id}}</span>
                        </div>
                        <div class="line">
                          <div class="row-span">
                            <span>性别：{{id_info.sex}}</span>
                          </div>
                          <div class="row-span">
                            <span>生日：{{id_info.birthday}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card" :class="{'card-hide':!entryAndExit.open}">
              <div class="h" @click="toggleOpen('entryAndExit')">
                <span class="text">最近出入金</span>
                <span class="icon"><i class="fa fa-angle-up"></i></span>
              </div>
              <el-collapse-transition>
                <div class="con" v-show="entryAndExit.open" style="padding:15px;" v-loading="loading2">
                  <el-table :data="entryAndExit.list" border :show-header="false" style="width:100%">
                    <el-table-column prop="pay_time" label="时间" label-class-name="labelClass" min-width="60">
                    </el-table-column>
                    <el-table-column prop="device_type" label="终端" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div v-if="scope.row.device_type == '0'">PC端</div>
                        <div v-if="scope.row.device_type == '1'">手机</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="direct_type" label="出入金" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div v-if="scope.row.direct_type == '0'">入金</div>
                        <div v-if="scope.row.direct_type == '1'">出金</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="money" label="金额" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.money | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="pay_status" label="状态" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div v-if="scope.row.pay_status == '0'" style="color:#f00">未支付</div>
                        <div v-if="scope.row.pay_status == '1'" style="color:rgb(103, 194, 58)">已支付</div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination small background :page-size="entryAndExit.page_size" :current-page="entryAndExit.page_no" layout="prev, pager, next" @current-change="changePageentryAndExit" :total="entryAndExit.total">
                  </el-pagination>
                </div>
              </el-collapse-transition>
            </div>
            <div class="card" :class="{'card-hide':!position.open}">
              <div class="h" @click="toggleOpen('position')">
                <span class="text">持仓订单</span>
                <span class="icon"><i class="fa fa-angle-up"></i></span>
              </div>
              <el-collapse-transition>
                <div class="con" v-show="position.open" style="padding:15px;" v-loading="loading3">
                  <el-table :data="position.list" border style="width:100%">
                    <el-table-column prop="id" label="订单号" label-class-name="labelClass" min-width="60"></el-table-column>
                    <el-table-column prop="stock_code" label="代码" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="stock_name" label="名称" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="policy_name" label="策略类型" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="leverage" label="资金配比" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="init_margin" label="操作资金" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.init_margin | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cmd" label="方向" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.cmd == '0'">多</div>
												<div v-if="scope.row.cmd == '1'">空</div>
											</template>
										</el-table-column>
                    <el-table-column prop="coupon_money" label="红包返现" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.coupon_money | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="open_time" label="开仓时间" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="volume" label="数量" label-class-name="labelClass" min-width="90">
                        <template slot-scope="scope">
                          <div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
                              {{Number(scope.row.volume)}}
                            </div>
                            <div v-else>{{Number(scope.row.volume)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="left_volume" label="可卖" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                          <div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
                              {{Number(scope.row.left_volume)}}
                            </div>
                            <div v-else>{{Number(scope.row.left_volume)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="open_price" label="价格" label-class-name="labelClass" min-width="100" v-if="domainFn()">
                      <template slot-scope="scope">
                        <div>{{Number(scope.row.open_price).toFixed(3)}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="open_price" label="均价" label-class-name="labelClass" min-width="100" v-else>
                      <template slot-scope="scope">
                        <div>{{Number(scope.row.open_price).toFixed(3)}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="now_price" label="当前价" label-class-name="labelClass" min-width="100">
                      <template slot-scope="scope">
                        <div>{{Number(scope.row.now_price).toFixed(3)}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="dif_rate" label="涨跌浮" label-class-name="labelClass" min-width="100">
                      <template slot-scope="scope">
                        <div v-if="Number(scope.row.dif_rate) > 0" style="color:rgb(103, 194, 58)">{{scope.row.dif_rate}}%</div>
                        <div v-else style="color:#f00">{{scope.row.dif_rate}}%</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="market_value" label="持仓市值" label-class-name="labelClass" min-width="100">
                      <template slot-scope="scope">
                        <div>{{scope.row.market_value | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="now_profit" label="当前盈亏" label-class-name="labelClass" min-width="100">
                      <template slot-scope="scope">
                        <div>{{scope.row.now_profit | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="close_profit" label="转让盈亏" label-class-name="labelClass" min-width="100">
                      <template slot-scope="scope">
                        <div>{{scope.row.close_profit | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" label-class-name="labelClass" min-width="90" fixed="right">
                      <template slot-scope="scope">
                        <div @click="$refs.obtainSublevel.policyDetails('position','买入策略详情',scope.row.id)" class="see">查看详细</div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination small background :page-size="position.page_size" :current-page="position.page_no" layout="prev, pager, next" @current-change="changePageposition" :total="position.total">
                  </el-pagination>
                </div>
              </el-collapse-transition>
            </div>
            <div class="card" :class="{'card-hide':!settlementOrder.open}">
              <div class="h" @click="toggleOpen('settlementOrder')">
                <span class="text">结算订单</span>
                <span class="icon"><i class="fa fa-angle-up"></i></span>
              </div>
              <el-collapse-transition>
                <div class="con" v-show="settlementOrder.open" style="padding:15px;" v-loading="loading4">
                  <el-table :data="settlementOrder.list" border style="width:100%">
                    <el-table-column prop="policy_id" label="订单号" label-class-name="labelClass" min-width="60"></el-table-column>
                    <el-table-column prop="stock_code" label="股票代码" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="policy_name" label="策略类型" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="leverage" label="资金配比" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="init_margin" label="操作资金" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.init_margin | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cmd" label="方向" label-class-name="labelClass" min-width="100">
											<template slot-scope="scope">
												<div v-if="scope.row.cmd == '0'">多</div>
												<div v-if="scope.row.cmd == '1'">空</div>
											</template>
										</el-table-column>
                    <el-table-column prop="coupon_money" label="红包" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.coupon_money | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="open_time" label="开仓时间" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="open_price" label="开仓价" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{Number(scope.row.open_price).toFixed(3)}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="volume" label="交易量" label-class-name="labelClass" min-width="100">
                      <template slot-scope="scope">
                          <div v-if="scope.row.market_id == '6' || scope.row.market_id == '7' || scope.row.market_id == '8' || scope.row.market_id == '9' || scope.row.market_id == '10'">
                              {{Number(scope.row.volume)}}
                            </div>
                            <div v-else>{{Number(scope.row.volume)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="close_time" label="平仓时间" label-class-name="labelClass" min-width="60"></el-table-column>
                    <el-table-column prop="close_price" label="平仓价格" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{Number(scope.row.close_price).toFixed(3)}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="close_profit" label="转让盈亏" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.close_profit | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="commission" label="手续费" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.commission | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="securities_fee" label="券商代收" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.securities_fee | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="delay_fee" label="递延费" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.delay_fee | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="service_fee" label="管理费" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                        <div>{{scope.row.service_fee | numberFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" label-class-name="labelClass" min-width="90" fixed="right">
                      <template slot-scope="scope">
                        <div @click="$refs.obtainSublevel.policyDetails('tally','卖出策略详情',scope.row.id)" class="see">查看详细</div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination small background :page-size="settlementOrder.page_size" :current-page="settlementOrder.page_no" layout="prev, pager, next" @current-change="changePagesettlementOrder" :total="settlementOrder.total">
                  </el-pagination>
                </div>
              </el-collapse-transition>
            </div>
            <div class="card" :class="{'card-hide':!capitalChange.open}">
              <div class="h" @click="toggleOpen('capitalChange')">
                <span class="text">资金变动</span>
                <span class="icon"><i class="fa fa-angle-up"></i></span>
              </div>
              <el-collapse-transition>
                <div class="con" v-show="capitalChange.open" style="padding:15px;" v-loading="loading5">
                  <el-table :data="capitalChange.list" border style="width:100%">
                    <el-table-column prop="after_money" label="变动前金额" label-class-name="labelClass" min-width="60"></el-table-column>
                    <el-table-column prop="before_money" label="变动后金额" label-class-name="labelClass" min-width="60"></el-table-column>
                    <el-table-column prop="money" label="变动金额" label-class-name="labelClass" min-width="60"></el-table-column>
                    <el-table-column prop="type" label="类型" label-class-name="labelClass" min-width="90">
                      <template slot-scope="scope">
                         <div v-if="scope.row.type == '0'">出入金</div>
                         <div v-if="scope.row.type == '1'">冲账</div>
                         <div v-if="scope.row.type == '2'">递延费</div>
                         <div v-if="scope.row.type == '3'">手续费</div>
                         <div v-if="scope.row.type == '4'">解冻</div>
                         <div v-if="scope.row.type == '5'">交易</div>
                         <div v-if="scope.row.type == '6'">其他</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="时间" label-class-name="labelClass" min-width="90"></el-table-column>
                    <el-table-column prop="comment" label="备注" label-class-name="labelClass" min-width="90"></el-table-column>
                  </el-table>
                  <el-pagination small background :page-size="capitalChange.page_size" :current-page="capitalChange.page_no" layout="prev, pager, next" @current-change="changePagecapitalChange" :total="capitalChange.total">
                  </el-pagination>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="查看信息" :visible.sync="dialogFormVisible3" class="dialog1 dialog-s see-dialog">
			<div class="dialog-page">
				<div class="dialog-section">
					<el-form>
						<el-row>
							<el-col :span="7"><span class="label"><span class="red">*</span>密码：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-form-item prop="account_pwd">
										<el-input v-model="passwd" placeholder="请输入密码"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible3 = false">取 消</el-button>
						<el-button type="primary" @click="eyeInfo">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
    <!-- 查看详细结束 -->
    <!-- 策略查看详细 -->
    <detailedFrame ref="obtainSublevel"></detailedFrame>
    <!-- 策略查看详细结束 -->
  </div>
</template>

<script type="text/javascript" src="./index.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
.ck{
  cursor: pointer;
  padding-left:10px;
  font-size:16px
}
  .dialog-page {
    dl {
      padding-left: 6px;
    }
    .divideInto-dl {
      dt {
        width: 170px;
        padding-right: 10px;
      }
    }
  }
  .see {
    color: #409EFF;
    cursor: pointer;
  }
  .d-detail {
    .tab-h {
      .text {
        padding: 0 10px;
      }
      .text.active {
        color: #409EFF;
      }
    }
  }
  // .d-detail .account-info .b3 .item{
  //   margin-bottom:10px;
  //   width:160px;
  // }
</style>