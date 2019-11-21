<template>
	<div class="page">
		<div class="page-header">
			<span>冲账管理</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/balance/add')">
					<el-button class="el-blue-btn" icon="el-icon-plus" @click="createBalance">新增</el-button>
				</div>
				<div class="item">
					<el-date-picker v-model="s_time" type="daterange" :picker-options="pickerOptions1" placeholder="冲账时间" @change="search">
					</el-date-picker>
				</div>
				<div class="item">
					<el-select v-model="params.direct_type" clearable placeholder="请选择" @change="search">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input v-model="params.user_name" placeholder="账号/姓名">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
				</div>
				<div class="item">
					<el-button style='margin-bottom:20px;' type="primary" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :summary-method="getSummaries" show-summary stripe style="width: 100%">
					<el-table-column prop="id" label="账户" width="130"></el-table-column>
					<el-table-column prop="real_name" label="姓名"></el-table-column>
					<el-table-column prop="short_name" label="归属" label-class-name="labelClass" min-width="88">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.short_name" placement="right">
								<span>{{scope.row.short_name}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="direct_type" label="方向">
						<template slot-scope="scoped">
							{{scoped.row.direct_type=="1" || scoped.row.direct_type=="出金"?"出金":"入金"}}
						</template>
					</el-table-column>
					<el-table-column prop="balance" label="金额" sortable>
					</el-table-column>
					<el-table-column prop="repay_type" label="冲账类型">
						<template slot-scope="scope">
							<div v-if="scope.row.repay_type == '0' || scope.row.repay_type == '客户入金'">客户入金</div>
							<div v-if="scope.row.repay_type == '1' || scope.row.repay_type == '客户出金'">客户出金</div>
							<div v-if="scope.row.repay_type == '2' || scope.row.repay_type == '内部转账'">内部转账</div>
							<div v-if="scope.row.repay_type == '3' || scope.row.repay_type == '虚拟入金'">虚拟入金</div>
							<div v-if="scope.row.repay_type == '4' || scope.row.repay_type == '平台赠送'">平台赠送</div>
							<div v-if="scope.row.repay_type == '5' || scope.row.repay_type == '信用利息'">信用利息</div>
							<div v-if="scope.row.repay_type == '6' || scope.row.repay_type == '交易返现'">交易返现</div>
							<div v-if="scope.row.repay_type == '7' || scope.row.repay_type == '积分兑换'">积分兑换</div>
							<div v-if="scope.row.repay_type == '8' || scope.row.repay_type == '出金手续费'">出金手续费</div>
							<div v-if="scope.row.repay_type == '9' || scope.row.repay_type == '账户闲置费'">账户闲置费</div>
							<div v-if="scope.row.repay_type == '10' || scope.row.repay_type == '其它'">其它</div>
						</template>
					</el-table-column>
					<el-table-column prop="order_id" label="订单号"></el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scoped">
							<!--{{scoped.row.status=="1" || scoped.row.status=="已充值"?"已充值":"未充值"}}-->
							<font color="red" v-if="scoped.row.status=='0'">未充值</font>
							<font color="green" v-if="scoped.row.status=='1'">已充值</font>
						</template>
					</el-table-column>
					<el-table-column prop="comment" label="备注"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" width="142"></el-table-column>
					<el-table-column prop="admin_user_name" label="操作人" algin="center"></el-table-column>
					<el-table-column label="操作" label-class-name="labelClass" algin="center">
						<template slot-scope="scope">
							<span class="table-btn-text" style="padding:0px;" @click="showDetail(scope.row)">详细</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页-->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
			<el-dialog title="新增冲帐" class="dialog1 dialog-s" :visible.sync="dialogShow">
				<div class="dialog-page">
					<div class="dialog-page-con">
						<div class="dialog-dl">
							<el-row class="mtb0">
								<el-col :span="24">
									<dl class="mt0">
										<dt>选择账户</dt>
										<dd class="text-con"> 
											<el-autocomplete popper-class="my-autocomplete" 
												v-model="userDetail.real_name" 
												:fetch-suggestions="querySearch" 
												custom-item="my-item-zh" 
												placeholder="请输入账户/姓名"
												@select="handleSelect">
												<template slot-scope="{ item }">
													<span class="name">{{ item.real_name }}</span>
					                        		<span>{{item.mobile}}</span>
							                    </template>
											</el-autocomplete>
										</dd>
									</dl>
								</el-col>
							</el-row>
							<div class="page-header" style="font-weight: normal;padding: 10px;background-color:#ddd;">
								<el-row class="mtb0">
									<el-col :span="8">
										<dl class="mt0">
											<dt>姓名</dt>
											<dd class="text-con">
												{{userDetail.real_name}}
											</dd>
										</dl>
									</el-col>
									<el-col :span="8">
										<dl class="mt0">
											<dt>客户归属</dt>
											<dd class="text-con">
												{{userDetail.short_name}}
											</dd>
										</dl>
									</el-col>
									<el-col :span="8">
										<dl class="mt0">
											<dt>可用余额</dt>
											<dd class="text-con">
												{{userDetail.remain}}
											</dd>
										</dl>
									</el-col>
								</el-row>
							</div>
							<el-row class="mtb10">
								<el-col :span="8">
									<dl class="mt0">
										<el-col :span="8">
											<dt>冲账方向</dt>
										</el-col>
										<el-col :span="12">
											<el-select style="margin-left:5px;" v-model="addBalanceParams.direct_type" placeholder="请选择" @change="changeDirectType">
												<el-option v-for="item in options_add" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</el-col>

									</dl>
								</el-col>
								<el-col :span="8">
									<dl class="mt0">
										<el-col :span="8">
											<dt>冲账金额</dt>
										</el-col>
										<el-col :span="12">
											<el-input v-model="addBalanceParams.balance" placeholder="金额"></el-input>
										</el-col>
									</dl>
								</el-col>
								<el-col :span="8">
									<el-col :span="8">
										<dt>冲账类型</dt>
									</el-col>
									<el-col :span="12">
										<el-select v-model="addBalanceParams.repay_type" clearable placeholder="请选择">
											<el-option v-for="item in options_repay_type" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-col>

								</el-col>
							</el-row>
							<el-row class="mtb10">
								<el-col :span="24">
									<dl class="mt0">
										<dt>备注</dt>
										<dd class="text-con">
											<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addBalanceParams.comment"></el-input>
										</dd>
									</dl>
								</el-col>
							</el-row>
						</div>
						<div style="text-align: center;padding-top: 15px;">
							<el-button type="primary" @click="submit" :loading="loadingA" class="btn-m">提交</el-button>
						</div>
					</div>

				</div>
			</el-dialog>
			<el-dialog title="详细信息" class="dialog1 dialog-s" :visible.sync="dialogShowDetail">
				<div class="dialog-page">
					<div class="dialog-page-con">
						<div class="dialog-dl">
							<el-row class="mtb0">
								<el-col :span="12">
									<dl class="mt0">
										<dt>账户</dt>
										<dd class="text-con">{{detailInfo.id}}</dd>
									</dl>
								</el-col>
								<el-col :span="12">
									<dl class="mt0">
										<dt>姓名</dt>
										<dd class="text-con">{{detailInfo.real_name}}</dd>
									</dl>
								</el-col>
							</el-row>
							<el-row class="mtb0">
								<el-col :span="12">
									<dl class="mt0">
										<dt>方向</dt>
										<dd class="text-con">{{detailInfo.direct_type=="1"?"出金":"入金"}}</dd>
									</dl>
								</el-col>
								<el-col :span="12">
									<dl class="mt0">
										<dt>金额</dt>
										<dd class="text-con">{{detailInfo.balance}}</dd>
									</dl>
								</el-col>
							</el-row>
							<el-row class="mtb0">
								<el-col :span="12">
									<dl class="mt0">
										<dt>冲账类型</dt>
										<dd class="text-con">{{detailInfo.repay_type=='1'?'客户出金':'客户入金'}}</dd>
									</dl>
								</el-col>
								<el-col :span="12">
									<dl class="mt0">
										<dt>创建时间</dt>
										<dd class="text-con">{{detailInfo.create_time}}</dd>
									</dl>
								</el-col>
							</el-row>
							<el-row class="mtb0">
								<el-col :span="12">
									<dl class="mt0">
										<dt>币种</dt>
										<dd class="text-con">{{detailInfo.currency_symbol}}</dd>
									</dl>
								</el-col>
								<el-col :span="12">
									<dl class="mt0">
										<dt>操作人</dt>
										<dd class="text-con">{{detailInfo.admin_user_name}}</dd>
									</dl>
								</el-col>
							</el-row>
							<el-row class="mtb0">
								<el-col :span="24">
									<dl class="mt0">
										<dt>备注</dt>
										<dd class="text-con">{{detailInfo.comment}}</dd>
									</dl>
								</el-col>

							</el-row>

						</div>
						<div style="text-align: center;padding-top: 15px;">
							<el-button type="primary" @click="dialogShowDetail = false" class="btn-m">关闭</el-button>
						</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss">
	.my-autocomplete {
		li {
			line-height: normal;
			padding: 7px;
			.name {
				text-overflow: ellipsis;
				overflow: hidden;
				margin-bottom: 10px;
			}
			.addr {
				font-size: 12px;
				color: #b4b4b4;
			}
			.highlighted .addr {
				color: #ddd;
			}
		}
	}
	
	.el-table .cell,
	.el-table th>div {
		white-space: normal;
	}
	.dialog-dl dd .el-input {
		width: inherit;
	}
</style>
<script src="./index.js" scoped>
</script>