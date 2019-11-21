<template>
	<div class="page page-accouttype">
		<div class="page-header">产品管理</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/product/add')">
					<el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe border style="width:100%">
					<el-table-column prop="status" label="启用状态" label-class-name="labelClass">
						<template slot-scope="scope">
							<span v-if="scope.row.using_flag=='1'"><i class="el-icon-success" style="color:green;"></i></span>
							<span v-else><i class="el-icon-error" style="color:red;"></i></span>
						</template>
					</el-table-column>
					<el-table-column prop="policy_name" label="产品名称" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="stock_type" label="交易类型" label-class-name="labelClass">
						<template slot-scope="scope">
							<div v-if="scope.row.stock_type == '0'">股票</div>
							<div v-if="scope.row.stock_type == '1'">指数.</div>
							<div v-if="scope.row.stock_type == '2'">指数</div>
						</template>
					</el-table-column>
					<el-table-column prop="market_type_data" label="适应市场类型" label-class-name="labelClass">
					</el-table-column>
					<el-table-column prop="etf_margin" label="操作资金金额" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="policy_leverage" label="资金配比倍数" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="buy_commission" label="买入手续费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="sell_commission" label="卖出手续费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="yinhua_tax" label="印花税" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="guohu_fee" label="过户费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="gui_fee" label="交易规费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="jianguan_fee" label="证券监管费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="delay_fee" label="递延费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="win_div_rate" label="盈利分红" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="stop_delay_fee" label="停牌递延费" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="stop_redeem_rate" label="停牌赎回百分比" width="120" label-class-name="labelClass" sortable></el-table-column>
					<el-table-column prop="policy_time" label="持仓时间" label-class-name="labelClass"></el-table-column>
					<!--<el-table-column prop="delay_flag" label="是否递延" label-class-name="labelClass">
						<template slot-scope="scope">
							<span v-if="scope.row.delay_flag=='1'" style="color:green;">启用</span>
							<span v-else style="color:red;">禁用</span>
						</template>
					</el-table-column>-->
					<el-table-column prop="operate_user_name" label="操作人" label-class-name="labelClass"></el-table-column>
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand" :row=scope.row>
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i> </span>
								<el-dropdown-menu slot="dropdown" v-if="globalPermission('v1_admin/stockpolicy/edit')">
									<el-dropdown-item :command="{type: 'edit', row: scope.row}" v-if="globalPermission('v1_admin/product/edit')">编辑</el-dropdown-item>
									<el-dropdown-item :command="{type: 'usingFlag', row: scope.row}">
										{{scope.row.using_flag=="0"?"启用":"禁用"}}
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
			<!-- 编辑资料 -->
			<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" class="dialog1 dialog-large dialog-bottom-fixed2">
				<div class="dialog-page">
					<div class="dialog-page-con">
						<el-form>
							<div class="dialog-section">
								<el-row class="margin-high">
									<el-col :span="11">
									<span class="label"></span>
									<span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-radio label="0" v-model="spParams.demo_flag" style="font-weight: normal;color: #999;">真实</el-radio>
					                  		<el-radio label="1" v-model="spParams.demo_flag" style="font-weight: normal;color: #999;">模拟</el-radio>
						                </el-form-item>
						            </span>
						           </el-col>
								   <el-col :span="11">
									   <span class="label">交易类型：</span>
									   <span class="label-val">
										  <el-form-item label="" class="margin-none">
						                	<el-select v-model="spParams.stock_type" placeholder="请选择交易类型">
												<el-option
												v-for="item in options"
												:key="item.value"
												:label="item.label"
												:value="item.value">
												</el-option>
											</el-select>
						                  </el-form-item>
									   </span>
								   </el-col>
							    </el-row>   
						        <!--</el-row>
						        <el-row class="margin-high">-->
								<el-row class="margin-high">
                                   <el-col :span="11">
						            <span class="label">持仓类型：</span>
									<span class="label-val">
						                <el-form-item>
											<el-select v-model="spParams.sell_type" placeholder="请选择">
												<el-option v-for="item in suitParams" :key="item.id" :label="item.name" :value="item.id">
												</el-option>
											</el-select>
											<el-tooltip placement="top" v-if="spParams.sell_type">
												<div slot="content" v-if="spParams.sell_type == '1'">T+0表示当天可买可卖，可以做多做空</div>
												<div slot="content" v-if="spParams.sell_type == '0'">T+1表示隔天才能卖出，只能做多</div>
											   <span style="color:#f00;cursor: pointer;font-size:12px;">{{describe}}</span>
										    </el-tooltip>
										</el-form-item>
						            </span>
						           </el-col>
								    <el-col :span="11">
						            <span class="label">适用市场类型：</span>
									<span class="label-val">
						                <el-form-item>
											<el-select v-model="market_type_value" multiple placeholder="请选择">
												<el-option v-for="item in market_type" :key="item.key" :label="item.name" :value="item.key">
												</el-option>
											</el-select>
											<el-tooltip content="表示此产品那些股票适用" placement="top">
											   <span style="color:#f00;cursor: pointer;font-size:12px;">{{describe}}</span>
										    </el-tooltip>
										</el-form-item>
						            </span>
						           </el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>产品名称：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.policy_name" placeholder="参考值：T+1,T+5,T+20"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>持仓天数：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.policy_time" placeholder="参考值：1"></el-input>
							                </el-form-item>
										</span>
										<el-tooltip placement="top">
											<div slot="content"  v-if="spParams.policy_time == '0' || spParams.policy_time == ''">0表示长期持有<br />N表示持仓T+N天，即共1+N天，到第1+N天的14:50平台自动卖出</div>
											<div slot="content" v-if="Number(spParams.policy_time>0)">0表示长期持有<br />{{spParams.policy_time}}表示持仓T+{{spParams.policy_time}}天，即共1+{{spParams.policy_time}}天，到第{{ Number(spParams.policy_time) + 1}}天的14:50平台自动卖出</div>
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
										</el-tooltip>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>操盘资金(万)：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.policy_money" placeholder="参考值：0.1"></el-input>
							                </el-form-item>
										</span>
										<el-tooltip content="购买股票初始资金，即投入操作资金" placement="top">
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
									   </el-tooltip>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>盈利分红：</span>
										<span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.win_div_rate" placeholder="参考值：0.20"></el-input>
							                </el-form-item>
                                        </span>
										<el-tooltip content="客户股票盈利后平台参与分红百分比" placement="top">
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
									   </el-tooltip>
									</el-col>
								</el-row>
								<el-row class="margin-high">
                                    <el-col :span="11">
										<span class="label">操作资金金额：</span>
										<span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.etf_margin" placeholder="参考值：2500,5000,7500"></el-input>
							                </el-form-item>
							            </span>
										<el-tooltip content="此项可选填，非空，则显示对应可选操作资金项" placement="top">
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
									   </el-tooltip>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>资金配比倍数：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.policy_leverage" placeholder="参考值：1,3,4,5,6,7,8,9,10"></el-input>
							                </el-form-item>
							            </span>
										<el-tooltip content="给操作资金的杠杆数" placement="top">
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
									   </el-tooltip>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>买入手续费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.buy_commission" placeholder="参考值：0.0005"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>卖出手续费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.sell_commission" placeholder="参考值：0.0005"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>印花税：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.yinhua_tax" placeholder="参考值：0.001"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>过户费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.guohu_fee" placeholder="参考值：0.00002"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>交易规费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.gui_fee" placeholder="参考值：0.0000487"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>证券监管费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.jianguan_fee" placeholder="参考值：0.00002"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>递延费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.delay_fee" placeholder="参考值：0.0018"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>账户管理费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.service_fee" placeholder="参考值：0"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>停牌递延费：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.stop_delay_fee" placeholder="参考值：0.005"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>停牌赎回：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.stop_redeem_rate" placeholder="参考值：0.7"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>止盈：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.tp_limit" placeholder="参考值：0.0020"></el-input>
							                </el-form-item>
							            </span>
										<el-tooltip placement="top">
											<div slot="content" style="line-height:20px;">0表示不设置止盈线<br />大于0表示有止盈线，数值为百分比<br />
											  点买：止盈价=买入价*（1+产品止盈比）<br />
											  点卖：止盈价=买入价*（1-产品止盈比）
											</div>
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
										</el-tooltip>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>止损：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.sl_limit" placeholder="参考值：0.0008"></el-input>
							                </el-form-item>
										</span>
										<el-tooltip placement="top">
											<div slot="content" style="line-height:20px;">
												0表示不设置止损线<br />
												大于0表示有止损线，此止损线与杠杆倒数的止损线比较，<br />
												取最大值（或最小值）做为当前止损线，故可做为单只股票的风控。<br />
												点买：止损价=买入价*(1-1/杠杆比) 或 止损价=买入价*(1-产品止损比)。 两者取最大值做为止损线<br />
												点卖：止损价=买入价/（1-1/杠杆比）或 止损价=买入价/（1-产品止损比）。两者取最小值做为止损线
												</div>
											<span style="color:#f00;cursor: pointer;font-size:12px;line-height: 40px;display:inline-block;padding-left:3px;">{{describe}}</span>
										</el-tooltip>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>止盈比率：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.tp_rate" placeholder="参考值：0.2,0.3"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>止损比率：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.sl_rate" placeholder="参考值：0.2,0.3"></el-input>
							                </el-form-item>
										</span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<!--<el-col :span="11">
										<span class="label"><span class="red">*</span>递延最长天数：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.max_days" placeholder="参考值：1"></el-input>
							                </el-form-item>
										</span>
									</el-col>-->
									<el-col :span="11">
										<span class="label"><span class="red">*</span>递延免息日期：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.fee_time" placeholder="参考值：0"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>最小卖出数量：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.sell_min_limit" placeholder="参考值：100"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>买入最低金额：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.min_money" placeholder="参考值：1"></el-input>
							                </el-form-item>
										</span>
									</el-col>
									<el-col :span="11">
										<span class="label"><span class="red">*</span>买入最高金额：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="password">
							                  	<el-input v-model="spParams.max_money" placeholder="参考值：10000"></el-input>
							                </el-form-item>
							            </span>
									</el-col>
								</el-row>
								<!-- <el-row class="margin-high">
									<el-col :span="11">
										<span class="label"><span class="red">*</span>盈利分红：</span><span class="label-val">
							                <el-form-item label="" class="margin-none" prop="real_name">
							                  	<el-input v-model="spParams.win_div_rate" placeholder="参考值：0.20"></el-input>
							                </el-form-item>
										</span>
									</el-col>
								</el-row> -->
								<el-row class="margin-high">
									<!-- <el-col :span="11">
										<span class="label" style="width: 130px;"><span class="red">*</span>是否允许分批卖出：</span><span class="label-val">
							                <div class="label-val">
												<el-switch v-model="sellUsingFlag">
												</el-switch>
											</div>
							            </span>
									</el-col> -->
									<el-col :span="11">
										<span class="label"><span class="red">*</span>是否启用：</span><span class="label-val">
							                <div class="label-val">
												<el-switch v-model="isUsing" active-text="" off-text="">
												</el-switch>
											</div>
							            </span>
									</el-col>
								</el-row>
								<el-row class="margin-high">
									<!--<el-col :span="11">
										<span class="label"><span class="red">*</span>是否递延：</span><span class="label-val">
							                <div class="label-val">
												<el-switch v-model="delayUsingFlag">
												</el-switch>
											</div>
										</span>
									</el-col>-->
								</el-row>
							</div>
						</el-form>
					</div>
					<div class="dialog-bottom">
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="submit">提交</el-button>
						</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script src="./index.js">
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.page-accouttype .dialog-section .label,
	/*.dialog-section .label {
		width: 100%;
	}*/
	
	.page-accouttype .dialog-section {
		border-bottom: none;
	}
	
	.page-accouttype .el-form-item {
		margin-bottom: 10px;
	}
	
	.main-container .app-main .el-row {
		margin: 0 !important;
	}
	
</style>