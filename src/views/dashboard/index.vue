<template>
	<div class="page home-box">
		<div class="d-detail home-i">
			<div class="account-info">
				<div class="b2 clearfix">
					<div class="item itme-span">
						<span v-for="(item, index) in items" :key="index" v-bind:class="{active:isActive==index}" @click="tabFn(index)">{{item.message}}</span>
					</div>
					<div class="item">
						<span class="demonstration">自定义时间</span>
						<el-date-picker v-model="checkTime" type="daterange" placeholder="选择日期范围" @change="changeTm">
						</el-date-picker>
					</div>
				</div>
				<div class="b3 clearfix">
					<div class="item-box2">
						<div class="item item1">
							<p> {{ stasticsData.position_user || 0 }} </p>
							<p>持仓人数</p>
						</div>
						<div class="item item2">
							<p> {{ stasticsData.position_num || 0 }} </p>
							<p>持仓笔数</p>
						</div>
						<div class="item item3">
							<p> {{ Math.round(Number(stasticsData.market_value) * 100) / 100 || 0 }} </p>
							<p>持仓市值</p>
						</div>
						<div class="item item4">
							<p> {{ Math.round(Number(stasticsData.position_cal) * 100) / 100 || 0 }} </p>
							<p>持仓盈亏</p>
						</div>
						<div class="item item5">
							<p> {{ Math.round(Number(stasticsData.init_margin) * 100) / 100 || 0 }} </p>
							<p>持仓操作资金</p>
						</div>
					</div>
					<div class="item-box1">
						<div class="item item6">
							<p> {{ stasticsData.customer_add || 0 }} </p>
							<p>新增客户</p>
						</div>
						<div class="item item7">
							<p> {{ stasticsData.trader_num || 0 }} </p>
							<p>交易笔数</p>
						</div>
						<div class="item item8">
							<p> {{ Math.round(Number(stasticsData.withdraw) * 100) / 100 || 0 }} </p>
							<p>出金</p>
						</div>
						<div class="item item9">
							<p> {{ Math.round(Number(stasticsData.deposite) * 100) / 100 || 0 }} </p>
							<p>入金</p>
						</div>
						<div class="item item10">
							<p> {{ Math.round(Number(stasticsData.cal_profit) * 100) / 100 || 0 }} </p>
							<p>累计盈亏</p>
						</div>
					</div>
				</div>
				<el-row class="demo-autocomplete">
					<el-col :span="24">
						<div class="tabTime">
							<div class="but-box">
								<strong v-bind:class="{active:isActive2==0}" @click="tendency"><i class="fa fa-line-chart"></i>曲线图</strong>
								<strong v-bind:class="{active:isActive2==1}" @click="columnar"><i class="fa fa-bar-chart-o"></i>柱状图</strong>
							</div>
						</div>
						<el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
							<el-tab-pane label="客户" name="1" v-loading="loading">
								<div class="components-container" style='height:600px;width:100%;' id="chartId">
									<div class='chart-container'>
										<account-chart :account_chart="account_chart" ref="account_fn" height='600' width='100%'></account-chart>
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="持仓笔数" name="2" v-loading="loading">
								<div class="components-container" style='height:600px;width:100%;'>
									<div class='chart-container'>
										<positionNumChart :position_num_chart="position_num_chart" :width_chart="width" ref="position_num_fn" height='600'></positionNumChart>
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="出入金" name="3" v-loading="loading">
								<div class="components-container" style='height:600px;width:100%;'>
									<div class='chart-container'>
										<entryAndExit :entryAndExit_chart="entryAndExit_chart" :width_chart="width" ref="entryAndExit_fn" height='600'></entryAndExit>
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="交易笔数" name="4" v-loading="loading">
								<div class="components-container" style='height:600px;width:100%;'>
									<div class='chart-container'>
										<transactionPenNumber :transactionPenNumber_chart="transactionPenNumber_chart" :width_chart="width" ref="transactionPenNumber_fn" height='600'></transactionPenNumber>
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="盈亏" name="5" v-loading="loading">
								<div class="components-container" style='height:600px;width:100%;'>
									<div class='chart-container'>
										<profitAndLoss :profitAndLoss_chart="profitAndLoss_chart" :width_chart="width" ref="profitAndLoss_fn" height='600'></profitAndLoss>
									</div>
								</div>
							</el-tab-pane>
							<el-tab-pane label="返佣" name="6" v-loading="loading">
								<div class="components-container" style='height:600px;width:100%;'>
									<div class='chart-container'>
										<maid :maid_chart="maid_chart" :width_chart="width" ref="maid_fn" height='600'></maid>
									</div>
								</div>
							</el-tab-pane>
						</el-tabs>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript" src="./dashboard.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.home-box {
		.el-pager li.active {
			border-radius: 50%;
			background: #0f86f0;
			color: #fff;
		}
		.el-pagination--small .el-pager li {
			width: 20px;
			height: 20px;
			padding: 0px;
			border: 0;
			min-width: 0;
		}
	}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
	.home-box {
		.fa {
			color: #0f86f0;
			font-size: 16px;
			margin-right: 5px;
			vertical-align: text-bottom;
		}
	}
	
	.page {
		img {
			width: 100%;
		}
	}
	
	.chart-container {
		position: relative;
		width: 100%;
		height: 80%;
	}
	
	.home-top {
		overflow: hidden;
		border: 1px solid #ddd;
		padding: 15px 15px 10px;
		border-radius: 4px;
		.con {
			float: left;
			width: 50%;
			.title {
				border-bottom: 1px solid #ccc;
				padding: 0 0 15px 15px;
				margin-bottom: 15px;
				font-size: 15px;
				color: #20a0ff;
			}
			.con-box {
				padding: 0px 8px;
				table,
				tbody,
				tr {
					width: 100%;
				}
				tr {
					height: 30px;
					.td_box {
						color: #20a0ff;
					}
					td {
						padding-left: 15px;
						color: #666;
					}
				}
				tr:nth-child(odd) {
					background: rgba(245, 245, 245, .5);
				}
			}
			.ad-pagination {
				float: right;
			}
		}
		.left {
			margin-right: 5%;
			width: 45%;
			.td_box {
				padding-right: 20px;
			}
			/*td:first-child{color:#f00;}*/
		}
	}
	
	.home-box {
		.home-i {
			.account-info {
				background: #fff;
				.b2 {
					.itme-span {
						span {
							line-height: 34px;
							margin: 0 10px;
							font-size: 14px;
							cursor: pointer;
							color: #666;
						}
						span.active,
						span:hover {
							color: #20a0ff;
						}
					}
					span.demonstration {
						margin-right: 16px;
						font-size: 14px;
						line-height: 34px;
					}
				}
				.b3 {
					.item-box1 {
						overflow: hidden;
						display: flex;
						padding-top: 15px;
					}
					.item {
						float: none;
						color: #fff;
						border: none;
						width: 20%;
						justify-content: space-between;
						vertical-align: middle;
						border-radius: 5px;
						padding-right:0;
						p {
							margin-bottom: 20px;
							font-size: 14px;
							margin: 11px 10px 11px 13px;
							span {
								padding-left: 7px;
							}
						}
					}
					.item1 {
						background: rgba(7, 105, 173, 1);
					}
					.item2 {
						background: rgba(76, 175, 80, 1);
					}
					.item3 {
						background: rgba(103, 59, 183, 1);
					}
					.item4 {
						background: rgba(127, 189, 66, 1);
					}
					.item5 {
						background: rgba(51, 153, 204, 1);
						margin-right: 0;
					}
					.item6 {
						background: #3598dc;
					}
					.item7 {
						background: #e7505a;
					}
					.item8 {
						background: #8E44AD;
					}
					.item9 {
						background: rgba(30, 43, 51, 1);
					}
					.item10 {
						margin-right: 0;
						background: rgba(51, 51, 51, 1);
					}
					.item-box2 {
						display: flex;
						.item {
							border: none;
						}
					}
				}
			}
		}
	}
	
	.tabTime {
		position: absolute;
		top: 15px;
		right: 13%;
		z-index: 10;
		span {
			dispaly: inline-block;
			margin-right: 18px;
			font-size: 14px;
			color: #666;
			cursor: pointer;
		}
		span.active,
		span:hover {
			color: #20a0ff;
		}
		.but-box {
			display: inline-block;
			strong {
				font-weight: normal;
				color: #666;
				border: 1px solid #d1dbe5;
				margin-right: 10px;
				padding: 6px 12px;
				border-radius: 5px;
				backgrund: #fff;
				cursor: pointer;
				i {
					color: #666;
				}
			}
			strong.active,
			strong:hover {
				color: #20a0ff;
				border: 1px solid #20a0ff;
				i {
					color: #20a0ff;
				}
			}
		}
	}
</style>