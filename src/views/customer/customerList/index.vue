<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>客户列表</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/customer/add')">
					<el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
				</div>
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" :list="list" ref="userScreeningDataInterface"></userScreening>
				</div>
				<!--<div class="item w130">
					<el-select placeholder="状态" v-model="status" @change="changeStatus">
						<el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>-->
				<div class="item">
					<span class="demonstration">注册日期：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item s-itme" style="margin-right:-3px;">
					<el-select v-model="screenValue" placeholder="请选择">
						<el-option v-for="item in screenOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input placeholder="请输入姓名/手机号" clearable v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :empty-text="emptyText" border style="width:100%">
					<el-table-column prop="mobile" label="手机" label-class-name="labelClass" min-width="100" fixed="left">
						<template slot-scope="scope">
							<div @click="$refs.obtainCustomer.details('customer','详细信息',scope.row)" class="nameBut">{{ scope.row.mobile }}<span v-if="scope.row.demo_flag =='1'" style="color:#f00">(模拟)</span></div>
						</template>
					</el-table-column>
					<el-table-column prop="real_name" label="姓名" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="nick_name" label="昵称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="fund_account" label="资金账户" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="code_id" label="客户编码" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="parent_name" label="归属" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div>
								<el-tooltip :content=" scope.row.parent_name | filter_the_superior " placement="top">
									<div>{{ scope.row.parent_name | attributionFiltering }}</div>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="inviter_id" label="邀请人" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="real_wallet" label="资产余额" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.real_wallet | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="availableFunds" label="可用资金" label-class-name="labelClass" min-width="100" sortable :formatter="formatter">
					</el-table-column>
					<el-table-column prop="frozen_money" label="冻结资金" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.frozen_money | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="demo_wallet" label="模拟金" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.demo_wallet | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="market_wallet" label="推广收益" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.market_wallet | numberFormat}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="id_certify_flag" label="实名认证" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.id_certify_flag == '0'" style="color:#f00;">未认证</div>
							<div v-if="scope.row.id_certify_flag == '1'" style="color:#67c23a;">已认证</div>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="注册日期" label-class-name="labelClass" min-width="130">
						<template slot-scope="scope">
							<div>{{scope.row.create_time}}</div>
							<div style="color:#f00">{{scope.row.create_time | lastLoginTime}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.status == '0'" style="color:#67c23a;">启用</div>
							<div v-if="scope.row.status == '1'" style="color:#f00;">禁用</div>
							<div v-if="scope.row.status == '2'" style="color:#ffa500;">只读</div>
						</template>
					</el-table-column>
					<el-table-column prop="op" label="操作" min-width="100" label-class-name="labelClass" fixed="right">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{cmd:1,id:scope.row.id,row:scope.row}" v-if="globalPermission('v1_admin/customer/changefee')">调整费用</el-dropdown-item>
									<el-dropdown-item :command="{cmd:2,row:scope.row}" v-if="globalPermission('v1_admin/customer/editinfo')">编辑资料</el-dropdown-item>
									<el-dropdown-item :command="{cmd:3,row:scope.row}" v-if="globalPermission('v1_admin/customer/resetpassword')">重置密码</el-dropdown-item>
									<el-dropdown-item :command="{cmd:4,row:scope.row}" v-if="globalPermission('v1_admin/customer/banner')&&scope.row.status=='1'||scope.row.status=='2'">设置启用</el-dropdown-item>
									<el-dropdown-item :command="{cmd:6,row:scope.row}" v-if="globalPermission('v1_admin/customer/banner')&&scope.row.status=='0'">设置只读</el-dropdown-item>
									<el-dropdown-item :command="{cmd:5,row:scope.row}" v-if="globalPermission('v1_admin/customer/banner')&&scope.row.status=='0'">设置禁用</el-dropdown-item>
									<el-dropdown-item :command="{cmd:7,row:scope.row}" v-if="globalPermission('v1_admin/customer/del')">删除客户</el-dropdown-item>
									<el-dropdown-item :command="{cmd:8,row:scope.row}" v-if="globalPermission('v1_admin/customer/changewallet')">调整余额</el-dropdown-item>
									<el-dropdown-item :command="{cmd:9,row:scope.row}" v-if="globalPermission('v1_admin/customer/parentchange')">移交划转</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!-- 调整费用开始  -->
		<el-dialog title="调整费用" :visible.sync="dialogFormVisible4" class="dialog1 dialog-s">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl divideInto-dl">
						<!-- 开启就显示 -->
						<dl>
							<dt>手机号：</dt>
							<dd>
								<el-input disabled v-model="mobile"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>姓名：</dt>
							<dd>
								<el-input disabled v-model="real_name"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>买入手续费加收：</dt>
							<dd>
								<el-input v-model="costForm.chargeAndCharge" placeholder="请输入买入手续费倍数"></el-input>
								<span style="line-height:35px;color:#f00;">上限倍数为{{sysaddfeeData.add_buy_commission_limit}}</span>
							</dd>
						</dl>
						<dl>
							<dt>卖出手续费加收：</dt>
							<dd>
								<el-input v-model="costForm.sellingFee" placeholder="请输入卖出手续费倍数"></el-input>
								<span style="line-height:35px;color:#f00;">上限倍数为{{sysaddfeeData.add_sell_buy_commission_limit}}</span>
							</dd>
						</dl>
						<dl>
							<dt>递延费加收：</dt>
							<dd>
								<el-input v-model="costForm.deferredCharge" placeholder="请输入递延费倍数"></el-input>
								<span style="line-height:35px;color:#f00;">上限倍数为{{sysaddfeeData.add_delay_fee_limit}}</span>
							</dd>
						</dl>
						<dl>
							<dt>管理费加收：</dt>
							<dd>
								<el-input v-model="costForm.technicalManagementFee" placeholder="请输入管理费倍数"></el-input>
								<span style="line-height:35px;color:#f00;">上限倍数为{{sysaddfeeData.add_service_fee_limit}}</span>
							</dd>
						</dl>
						<dl style="text-align:center">
							<dd style="float:none;">
								<el-button class="commit-btn" plain @click="dialogFormVisible4=false">取消</el-button>
								<el-button class="el-blue-btn commit-btn" @click="submitCost">提交</el-button>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 调整费用结束  -->
		<!-- 新增用户 -->
		<el-dialog :title="title" :visible.sync="dialogVisible" class="dialog1 dialog-large dialog-bottom-fixed2">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<el-form>
						<div class="dialog-section">
							<el-row class="margin-high" v-if="hide && globalPermission('v1_admin/customer/demo')">
								<span class="label">&nbsp;&nbsp;</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                  	<el-radio label="0" v-model="addUser.demo_flag" style="font-weight: normal;color: #999;">真实</el-radio>
					                  	<el-radio label="1" v-model="addUser.demo_flag" style="font-weight: normal;color: #999;">模拟</el-radio>
					                </el-form-item>
            					</span>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">姓名：</span>
									<span class="label-val">
						                <el-form-item label="" class="margin-none" prop="">
						                  	<el-input class="box-width" v-model="addUser.real_name" placeholder="请输入姓名"></el-input>
						                </el-form-item>
									</span>
								</el-col>
								<el-col :span="11">
									<span class="label">归属：</span><span class="label-val">
						              <el-form-item label="" class="margin-none">
											<el-autocomplete
												v-model="addUser.parent_name"
												:fetch-suggestions="querySearchAsync1"
												placeholder="请输入用户名搜索"
												:disabled="disabled"
												@select="handleSelect1">
												<template slot-scope="{ item }">
													<div class="name">{{ item.value }}</div>
												</template>
												</el-autocomplete>
						                </el-form-item>
									</span>
								</el-col>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">身份证：</span>
									<span class="label-val">
						                <el-form-item label="" class="margin-none">
						                  	<el-input class="box-width" v-model="addUser.card_id" placeholder="请输入身份证号码"></el-input>
						                </el-form-item>
						            </span>
								</el-col>
								<span class="label">实名认证:</span>
								<span class="label-val">
					                <el-form-item label="" class="margin-none">
					                	<el-radio label="1" v-model="addUser.id_certify_flag" style="font-weight: normal;color: #999;">已认证</el-radio>
				                  		<el-radio label="0" v-model="addUser.id_certify_flag" style="font-weight: normal;color: #999;">未认证</el-radio>
					                </el-form-item>
					            </span>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">手机：</span>
									<span class="label-val">
						                <el-form-item label="" class="margin-none">
						                  	<el-input class="box-width" v-model="addUser.mobile" placeholder="请输入手机号码"></el-input>
						                </el-form-item>
						            </span>
								</el-col>
								<span class="label">邮箱:</span><span class="label-val">
						                <el-form-item prop="addUser.email" label="" 
										class="margin-none">
						                	<el-input class="box-width" v-model="addUser.email" placeholder="请输入邮箱"></el-input>
						                </el-form-item>
					                </span>
							</el-row>
							<el-row class="margin-high">
								<el-col :span="11">
									<span class="label">密码：</span>
									<span class="label-val">
						                <el-form-item label="" class="margin-none">
						                  	<el-input class="box-width" v-model="addUser.password" placeholder="请输入密码"></el-input>
						                </el-form-item>
						            </span>
								</el-col>
								<span class="label">城市:</span><span class="label-val">
						                <el-form-item label="" class="margin-none">
						                	<el-input class="box-width" v-model="addUser.province" placeholder="请输入城市"></el-input>
						                </el-form-item>
					                </span>
							</el-row>
						</div>
						<div class="dialog-section">
							<div class="imgs">
								<el-row>
									<el-col :span="11">
										<el-popover ref="popover1" placement="left" width="500" trigger="hover">
											<img :src="addUser.img_1" class="popover-image">
										</el-popover>
										<div class="r" v-popover:popover1>
											<div class="hp" @click="choiceImg('uploadImgBtn1')">
												<p v-if="addUser.showToast1">{{addUser.toastTaxt1}}</p>
												<img v-if="!addUser.showToast1" :src="addUser.img_1">
											</div>
											<div class="img-name">{{addUser.img_name1}}</div>
										</div>
										<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn1" @change="getImg($event,'img_1',1)" style="display:none;">
									</el-col>
									<el-col :span="11">
										<el-popover ref="popover2" placement="left" width="500" trigger="hover">
											<img :src="addUser.img_2" class="popover-image">
										</el-popover>
										<div class="r" v-popover:popover2>
											<div class="hp" @click="choiceImg('uploadImgBtn2')">
												<p v-if="addUser.showToast2">{{addUser.toastTaxt2}}</p>
												<img v-if="!addUser.showToast2" :src="addUser.img_2">
											</div>
											<div class="img-name">{{addUser.img_name2}}</div>
										</div>
										<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn2" @change="getImg($event,'img_2',2)" style="display:none;">
									</el-col>
								</el-row>
							</div>
						</div>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div class="dialog-bottom-btn">
						<el-button class="el-blue-btn" @click="dataSubmit">保存</el-button>
						<el-button class="el-gray-btn" @click="dialogVisible=false">关闭</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 新增用户结束 -->
		<!-- 重置密码开始 -->
		<el-dialog title="重置密码" :visible.sync="dialogFormVisible3" class="dialog1 dialog-s">
			<div class="dialog-page">
				<div class="dialog-section">
					<el-form :model="form2" ref="form2">
						<el-row>
							<el-col :span="4"><span class="label">姓名：</span></el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-form-item prop="name">
										<el-input v-model="form2.name" :disabled="true" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label"><span class="red">*</span>新密码：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-form-item prop="account_pwd">
										<el-input v-model="form2.pwd" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible3 = false">取 消</el-button>
						<el-button type="primary" @click="resetPwd">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 重置密码结束 -->
		<!-- 查看详细 -->
		<!-- 查看详细结束 -->
		<customerFrame ref="obtainCustomer"></customerFrame>
		<!-- 调整余额 -->
		<el-dialog title="调整余额" :visible.sync="balanceBox" class="dialog1">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl divideInto-dl">
						<dl>
							<dt>手机号：</dt>
							<dd>
								<el-input disabled v-model="mobile"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>姓名：</dt>
							<dd>
								<el-input disabled v-model="real_name"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>资产余额：</dt>
							<dd>
								<el-input placeholder="请输入资产余额" v-model="real_wallet"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>虚拟余额：</dt>
							<dd>
								<el-input placeholder="请输入虚拟余额" v-model="demo_wallet"></el-input>
							</dd>
						</dl>
					</div>
					<div class="dialog-bottom">
						<div slot="footer" class="dialog-footer">
							<el-button type="primary" @click="adjustmentBalance">提交</el-button>
							<el-button @click="balanceBox = false">取 消</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 调整余额结束 -->
		<!-- 移交划转 -->
		<el-dialog title="移交划转" :visible.sync="moveCustomer.show" class="dialog1">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl">
						<dl class="mt5">
							<dt>姓名</dt>
							<dd>
								<el-input v-model="moveCustomer.real_name" disabled></el-input>
							</dd>
						</dl>
						<dl>
							<dt>原归属</dt>
							<dd>
								<el-input v-model="moveCustomer.parent_name" disabled></el-input>
							</dd>
						</dl>
						<dl>
							<dt>目标归属</dt>
							<dd>
								<el-autocomplete class="box-width" v-model="moveCustomer.name" popper-class="my-autocomplete" :fetch-suggestions="accountSearch" custom-item="account_template" placeholder="请输入用户名搜索(默认无归属)" @select="handleToAgentSelect"></el-autocomplete>
							</dd>
						</dl>
						<dl>
							<dt>&nbsp;</dt>
							<dd>
								<el-radio-group v-model="moveCustomer.move_self">
									<el-radio :label="1">包括自己</el-radio>
									<el-radio :label="0">不包括自己</el-radio>
								</el-radio-group>
							</dd>
						</dl>
						<dl style="margin-top: 8px;">
							<dt>&nbsp;</dt>
							<dd>
								<el-button class="el-blue-btn commit-btn" @click="moveCustomerSubmit" :loading="moveCustomer.loading">提交</el-button>
							</dd>
						</dl>
						<dl>
							<dt>&nbsp;</dt>
							<dd>
								<div class="move-tip">
									<p>【包括自己】相当于转移关系，将自己和下属客户都转移到他人名下</p>
									<p>【不包括自己】相当于将自己的客户移交给别人</p>
								</div>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 移交划转结束 -->
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
	.ascription {
		.label-val {
			width: 344px;
			.el-autocomplete {
				width: 100% !important;
			}
		}
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
	
	.dialog-section .label {
		line-height: 42px;
	}
	
	.nameBut {
		color: #20a0ff;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
		-webkit-transition: .6s;
		transition: .6s;
	}
	
	.nameBut:hover {
		color: #317fb9;
		text-decoration: underline;
		-webkit-transition: .6s;
		transition: .6s;
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
	
	.move-tip {
		font-size: 12px;
		line-height: 20px;
		color: #999;
		margin-top: 13px;
		margin-left: -5px;
	}
	
	@import "customer"
</style>
<script src="./index.js"></script>