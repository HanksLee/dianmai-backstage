<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>用户列表</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/useradmin/add')">
					<el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
				</div>
				<div class="item" v-if="mechanismData.length > 0">
					<el-select v-model="mechanismVlaue" placeholder="请选择机构" @change="changeFn">
						<el-option v-for="item in mechanismData" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input placeholder="请输入姓名/手机号" clearable v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :emptyText="emptyText" border style="width:100%">
					<el-table-column label-class-name="labelClass" min-width="100" type="expand">
						<template slot-scope="scope">
							<div>
								<recursive :row="scope.row"></recursive>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="real_name" label="姓名" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="mobile" label="手机" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="user_tree_name" label="归属" label-class-name="labelClass" min-width="100"></el-table-column>
					<!-- <el-table-column prop="div_commission" label="手续费分成" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_commission}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_delayfee" label="递延分成" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_delayfee}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_servicefee" label="管理费分成" label-class-name="labelClass" min-width="100" sortable> 
						<template slot-scope="scope">
							<div>{{scope.row.div_servicefee}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="div_profit" label="盈利分成" label-class-name="labelClass" min-width="100" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.div_profit}}</div>
						</template>
					</el-table-column> -->
					<el-table-column prop="role_name" label="角色" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.role_name" style="color:#67c23a">{{scope.row.role_name}}</div>
							<div v-else style="color:#f00">未授权</div>
						</template>
					</el-table-column>
					<el-table-column prop="role_zone" label="权限范围" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.role_zone == '0'">下级</div>
							<div v-if="scope.row.role_zone == '1'">机构</div>
							<div v-if="scope.row.role_zone == '2'">全局</div>
						</template>
					</el-table-column>
					<el-table-column prop="using_flag" label="状态" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.using_flag == '0'" style="color:#f00">禁用</div>
							<div v-if="scope.row.using_flag == '1'" style="color:#67c23a">启用</div>
						</template>
					</el-table-column>
					<el-table-column prop="op" label="操作" label-class-name="labelClass">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<!-- <el-dropdown-item :command="{cmd:1,row:scope.row}" v-if="globalPermission('v1_admin/useradmin/marketdiv')">分成</el-dropdown-item> -->
									<el-dropdown-item :command="{cmd:2,row:scope.row}" v-if="globalPermission('v1_admin/useradmin/setrole')">授权</el-dropdown-item>
									<el-dropdown-item :command="{cmd:3,row:scope.row}" v-if="globalPermission('v1_admin/useradmin/turn')">
										<div v-if="scope.row.using_flag == '0'">启用</div>
										<div v-if="scope.row.using_flag == '1'">禁用</div>
									</el-dropdown-item>
									<el-dropdown-item :command="{cmd:4,row:scope.row}" v-if="globalPermission('v1_admin/useradmin/redirectlogin')">跳转</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页-->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!-- 新增用户 -->
		<el-dialog title="新增用户" class="dialog1 dialog-s" :visible.sync="userForm.userMessageBox">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl dialog-dl1">
						<dl class="mt5" v-if="mechanismData.length > 0">
							<el-col :span="12">
								<dt>机构</dt>
								<dd>
									<el-select v-model="userForm.outfitValue" placeholder="请选择机构" @change="changeOutfit">
										<el-option v-for="item in userForm.outfit" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</dd>
							</el-col>
						</dl>
						<dl>
							<el-col :span="12">
								<dt>姓名</dt>
								<dd>
									<el-autocomplete :disabled="disabled1" v-model="userForm.name" :fetch-suggestions="querySearchAsync" placeholder="请输入用户名搜索" @select="handleSelect">
										<template slot-scope="{ item }">
											<span class="name" style="display:block;line-height:20px;">{{ item.value }}</span>
											<span class="addr">{{ item.mobile }}</span>
										</template>
									</el-autocomplete>

								</dd>
							</el-col>
							<el-col :span="12">
								<dt>归属</dt>
								<dd>
									<el-autocomplete :disabled="disabled" v-model="userForm.superiorValue" :fetch-suggestions="querySearchAsyncUp" placeholder="请输入归属搜索" @select="handleSelectUp">
										<template slot-scope="{ item }">
											<span class="name">{{ item.label }}</span>
										</template>
									</el-autocomplete>
								</dd>
							</el-col>
						</dl>
						<dl>
							<el-col :span="12">
								<dt>手机</dt>
								<dd>
									<el-input placeholder="请输入手机" :disabled="disabled" v-model="userForm.mobile"></el-input>
								</dd>
							</el-col>
							<el-col :span="12" v-if="!disabled">
								<dt>密码</dt>
								<dd>
									<el-input placeholder="请输入密码" v-model="userForm.password"></el-input>
								</dd>
							</el-col>
						</dl>
						<dl style="text-align:center">
							<dd style="float:none;">
								<el-button class="el-blue-btn commit-btn" @click="submitUser">提交</el-button>
								<el-button class="commit-btn" plain @click="userForm.userMessageBox=false">取消</el-button>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 分配角色 -->
		<el-dialog title="分配角色" class="dialog1 dialog-s" :visible.sync="roleMessageBox">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl divideInto-dl">
						<dl class="mt5">
							<el-col :span="22">
								<dt>姓名</dt>
								<dd>
									<el-input v-model="roleForm.name" :disabled="true"></el-input>
								</dd>
							</el-col>
						</dl>
						<dl>
							<el-col :span="22">
								<dt>角色</dt>
								<dd>
									<el-select v-model="roleForm.roleValue" placeholder="请选择角色">
										<el-option v-for="item in roleForm.roleData" :key="item.id" :label="item.role_name" :value="item.id">
										</el-option>
									</el-select>
								</dd>
							</el-col>
						</dl>
						<dl>
							<el-col :span="22">
								<dt>权限范围</dt>
								<dd>
									<el-select v-model="roleForm.powerValue" placeholder="请选择权限范围">
										<el-option v-for="item in roleForm.powerData" :key="item.key" :label="item.name" :value="item.key">
										</el-option>
									</el-select>
								</dd>
							</el-col>
						</dl>
						<dl style="text-align:center">
							<dd style="float:none;">
								<el-button class="el-blue-btn commit-btn" @click="distributionSubmit">提交</el-button>
								<el-button class="commit-btn" plain @click="roleMessageBox=false">取消</el-button>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 分成 -->
		<el-dialog title="分成" class="dialog1 dialog-s " :visible.sync="divideIntoMessageBox">
			<div class="dialog-page">
				<div class="dialog-page-con">
					<div class="dialog-dl divideInto-dl">
						<div style="text-align:center;color:#1f75cc;font-size:14px;">分给下级</div>
						<!-- 开启就显示 -->
						<dl>
							<dt>姓名：</dt>
							<dd>
								<el-input disabled v-model="name"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>佣金手续费：</dt>
							<dd>
								<el-input placeholder="请输入佣金手续费" v-model="divideIntoForm.div_commission"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>递延费：</dt>
							<dd>
								<el-input placeholder="请输入递延费" v-model="divideIntoForm.div_delayfee"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>盈利分红：</dt>
							<dd>
								<el-input placeholder="请输入盈利分红" v-model="divideIntoForm.div_profit"></el-input>
							</dd>
						</dl>
						<dl>
							<dt>管理费/技术服务费：</dt>
							<dd>
								<el-input placeholder="请输入管理费/技术服务费" v-model="divideIntoForm.div_servicefee"></el-input>
							</dd>
						</dl>
						<dl style="text-align:center">
							<dd style="float:none;">
								<el-button class="commit-btn" plain @click="divideIntoMessageBox=false">取消</el-button>
								<el-button class="el-blue-btn commit-btn" @click="divideIntoSubmit">提交</el-button>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
<script src="./index.js"></script>