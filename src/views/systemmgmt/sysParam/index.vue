<template>
  <div class="page page-baseconfig">
    <div class="page-header">系统参数</div>
    <div class="page-con" v-loading="loading" element-loading-text="加载中...">
      <div class="submit-data basics">
        <el-form>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">注册</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">邮箱：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.mail_must" label="1">是</el-radio>
                    <el-radio v-model="sysParams.mail_must" label="0">否</el-radio>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <span class="label label-long label1">推广</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">推广分成：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="market_div_type" multiple style="width: 100%;">
                      <el-option
                        v-for="item in spreadOpts"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">直客推广分红：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.customer_div_profit" placeholder="直客推广收益，客户盈利分红"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">投顾跟单分红：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.customer_div_signal"
                      prop="div_servicefee"
                      placeholder="直客成为投顾，推广跟单收益分红"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row> -->
          <el-row v-if="urlList.includes(url)">
            <el-col :span="12">
              <span class="label label-long label1">出金审核时间</span>
            </el-col>
          </el-row>
          <el-row class="pl50" v-if="urlList.includes(url)">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">时间段：</span>
                </el-col>
                <el-col :span="16">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox label="1">周一</el-checkbox>
                    <el-checkbox label="2">周二</el-checkbox>
                    <el-checkbox label="3">周三</el-checkbox>
                    <el-checkbox label="4">周四</el-checkbox>
                    <el-checkbox label="5">周五</el-checkbox>
                    <el-checkbox label="6">周六</el-checkbox>
                    <el-checkbox label="7">周日</el-checkbox>
                  </el-checkbox-group>
                  <div style="margin-bottom:10px;">
                    <span style="color:#666">起始时间：</span>                     
                    <el-time-select
                      placeholder="起始时间"
                      v-model="out_cond.start_time"
                      :editable="false"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00'
                      }">
                    </el-time-select>
                    </div>
                    <div>
                    <span style="color:#666">结束时间：</span> 
                    <el-time-select
                      placeholder="结束时间"
                      v-model="out_cond.end_time"
                      :editable="false"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00',
                      }">
                    </el-time-select>
                    </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">风控</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">递延收取时间：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="sysParams.delay_fee_time_type" style="width: 100%;">
                      <el-option
                        v-for="item in delayOpts"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">开放市场：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="market_open_type" multiple style="width: 100%;">
                      <el-option
                        v-for="item in marketOpts"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">平仓线：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.risk_margin_limit" placeholder="爆仓平仓先 <=净资产/操作资金"></el-input>
                  </div>
                  <p style="line-height:20px;color:#f00;">
                    说明：此风控是对整体账户资金的控制，当比值小于或等于此值时将对此客户的全部持仓进行强平（当天不能平仓的股票不强平），
                    计算公式为：资金市值/冻结操作资金 * 100%
                  </p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">爆仓预警线：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.risk_margin_warning"
                      placeholder="爆仓预警线 <= 净资产/操作资金"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">禁止买入涨跌幅：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.risk_buy_up_limit" placeholder="禁止买入涨跌幅"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">禁止卖出涨跌幅：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.risk_sell_down_limit" placeholder="禁止卖出涨跌幅"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">模拟资金初始值</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.risk_demo_money" placeholder="模拟资金初始值"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">最大出金金额：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.out_money_max" placeholder="请输入最大出金金额"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">最小出金金额：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.out_money_min"
                      prop="min_money"
                      placeholder="请输入最小出金金额"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
	           <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">科创板买入涨跌幅：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.stib_risk_buy_up"
                      prop="buy_up"
                      placeholder="请输入科创板买入涨跌幅"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">科创板卖出涨跌幅：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.stib_risk_sell_down"
                      prop="sell_down"
                      placeholder="请输入科创板卖出涨跌幅"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">科创板行情检测开关：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.stib_flag" label="1">打开</el-radio>
                    <el-radio v-model="sysParams.stib_flag" label="0">关闭</el-radio>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">设置止盈止损显示：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.tp_sl_witch" label="0">以金额显示</el-radio>
                    <el-radio v-model="sysParams.tp_sl_witch" label="1">以单价显示</el-radio>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">是否冻结递延费：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.freeze_delayfee" label="0">冻结</el-radio>
                    <el-radio v-model="sysParams.freeze_delayfee" label="1">不冻结</el-radio>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">买入条件：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.buy_condition" label="1">实名认证</el-radio>
                    <el-radio v-model="sysParams.buy_condition" label="0">不实名认证</el-radio>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">出金条件：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.out_money_condition" label="0">实名认证</el-radio>
                    <el-radio v-model="sysParams.out_money_condition" label="1">不实名认证</el-radio>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span class="label" style="width:100%">IB邀请码：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-radio v-model="sysParams.ib_code_flag" label="0">选填</el-radio>
                    <el-radio v-model="sysParams.ib_code_flag" label="1">必填</el-radio>
                  </div>
                </el-col>
                <!--<el-col :span="6">
									<div class="dialog-bottom update-but">
										<el-button type="primary" @click="currencyUpdate(currencyForm.currencyValue,currencyForm.dealCurrencyValue)">更新</el-button>
									</div>
                </el-col>-->
              </el-row>
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">测试手机号码：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6}"
                      v-model="sysParams.test_mobile"
                      placeholder="测试手机号码，无交易时间限制，多个用逗号隔开"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">加收费用上限</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">买入手续费：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.add_buy_commission_limit"
                      placeholder="加收买入手续费上限倍数"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">卖出手续费：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input
                      v-model="sysParams.add_sell_buy_commission_limit"
                      placeholder="加收卖出手续费上限倍数"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">管理费：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.add_service_fee_limit" placeholder="加收技术管理费上限倍数"></el-input>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">递延费：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-input v-model="sysParams.add_delay_fee_limit" placeholder="加收递延费加收上限倍数"></el-input>
                  </div>
                </el-col>
                <!--<el-col :span="5">
									<div class="dialog-bottom update-but">
										<el-button type="primary" @click="currencyUpdate(currencyForm.currencyValue,currencyForm.dealCurrencyValue)">更新</el-button>
									</div>
                </el-col>-->
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">APP产品配置</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">产品导航：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="active_items" multiple style="width: 100%;">
                      <el-option
                        v-for="item in APPOpts"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">货币类型</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">交易货币：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="trading_currency" multiple style="width: 100%;">
                      <el-option
                        v-for="item in currency_list"
                        :key="item.code"
                        :label="item.alias_name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">支付货币：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="payment_of_money" multiple style="width: 100%;">
                      <el-option
                        v-for="item in currency_list"
                        :key="item.code"
                        :label="item.alias_name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">通道货币：</span>
                </el-col>
                <el-col :span="14">
                  <div class="label-val">
                    <el-select v-model="organ_currency" style="width: 100%;">
                      <el-option
                        v-for="item in currency_list"
                        :key="item.code"
                        :label="item.alias_name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">盈利分成</span>
            </el-col>
          </el-row>
          <el-row class="pl50 yingli">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%"></span>
                </el-col>
                <el-col :span="18">
                  <div class="label-val" style="margin-left:80px;">
                    <el-radio v-model="sysParams.profit_cond" label="0">盈利先扣减掉手续费后，在分成</el-radio>
                  </div>
                  <div class="label-val" style="margin-left:80px;">
                    <el-radio v-model="sysParams.profit_cond" label="1">盈利先分成后，在扣减个人手续费</el-radio>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="label label-long label1">振幅配置</span>
            </el-col>
          </el-row>
          <el-row class="pl50">
            <el-col class="row-back30" :span="12">
              <el-row>
                <el-col :span="5">
                  <span class="label" style="width:100%">市场：</span>
                </el-col>
                <el-col :span="19" class="amplitude-box">
                  <div class="label-val">
                      <el-checkbox-group v-model="amplitude_list" @change="checkboxGroupFn">
                        <el-checkbox v-for="(item,index) in marketOpts" :key="item.key" :label="item.key">
                          <span class="market-name">{{item.name}}</span><el-input v-model="amplitude_arr[index].amplitude_val" placeholder="请输入振幅"></el-input>
                        </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="bottom: 0; text-align: center; margin: 30px 0;">
            <el-button type="primary" style="width:100px;" @click="updata">更新</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script src="./index.js">
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.yingli .el-radio {
  margin-left: 0;
}
.basics {
  margin-top: 30px;
  .el-form {
    padding-left: 60px;
    .pl50 {
      padding-left: 50px;
    }
  }
}

.basics.submit-data {
  .label1 {
    background-color: #20a0ff;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
  .label-val {
    width: 100%;
  }
}

.update-but {
  text-align: right;
}

.row-back30 {
  border: 1px #ccc dashed;
}
.amplitude-box{
   .market-name {
  width:132px;
  display:inline-block;
   }
   .el-input{
     width:150px;
   }
}
.el-checkbox{
  display:block;
  margin-bottom:15px;
}
.el-checkbox+.el-checkbox{
  margin-left:0;
}
.el-checkbox-group{
  margin-top:8px;
  .el-checkbox{
    display:inline-block;
    margin-right:18px;
  }
}
</style>
