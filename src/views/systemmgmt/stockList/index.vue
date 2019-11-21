<template>
	<div class="page page-accouttype">
		<div class="page-header">股票列表</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/stockinfo/add')">
					<el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
				</div>
				<div class="item">
					<el-select v-model="mtVal" placeholder="交易市场" @change="changeStatus">
						<el-option v-for="item in marketTypeOpts" :key="item.key" :label="item.name" :value="item.key">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-select v-model="statusVal" placeholder="停牌状态" @change="changeStatus">
						<el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="item">
					<el-input placeholder="股票名称/股票编号" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe border style="width:100%">
					<el-table-column prop="market_id" label="交易市场" label-class-name="labelClass">
						<template slot-scope="scope">
							<span v-if="scope.row.market_id=='0'">上证</span>
							<span v-if="scope.row.market_id=='1'">深圳主板</span>
							<span v-if="scope.row.market_id=='2'">深圳创业主板</span>
							<span v-if="scope.row.market_id=='3'">港股</span>
							<span v-if="scope.row.market_id=='4'">美股</span>
							<span v-if="scope.row.market_id=='5'">ETF</span>
							<span v-if="scope.row.market_id=='6'">上期所</span>
							<span v-if="scope.row.market_id=='7'">大商所</span>
							<span v-if="scope.row.market_id=='8'">郑商所</span>
							<span v-if="scope.row.market_id=='9'">中金所</span>
							<span v-if="scope.row.market_id=='10'">上期所</span>
							<span v-if="scope.row.market_id=='-1'">--</span>
							<span v-if="scope.row.market_id==null">--</span>
							<span v-if="scope.row.market_id=='11'">科创板</span>
						</template>
					</el-table-column>
					<el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="pinyin_code" label="简拼" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="stock_code" label="股票编码" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="stop_status" label="开牌状态" label-class-name="labelClass">
						<template slot-scope="scope">
							<font color="green" v-if="scope.row.stop_status=='0'">正常</font>
							<font color="red" v-if="scope.row.stop_status=='1'">停牌</font>
							<font color="gray" v-if="scope.row.stop_status=='2'">退市</font>
						</template>
					</el-table-column>
					<el-table-column prop="user_admin_name" label="操作人" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="time_stamp" label="更新时间" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="op" label="操作" width="120" label-class-name="labelClass">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{ type: 'edit', row: scope.row }" v-if="globalPermission('v1_admin/stockinfo/edit')">编辑</el-dropdown-item>
									<!--<el-dropdown-item :command="{ type: 'delete', row: scope.row }">删除</el-dropdown-item>-->
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
			<!-- 添加/编辑股票列表 -->
			<el-dialog :title="dialogTitle" :visible.sync="dialogShow" class="dialog1">
				<div class="dialog-page">
					<div class="dialog-page-con">
						<div class="dialog-section">
							<el-form>
								<el-row>
									<el-col :span="4"><span class="label">交易市场</span></el-col>
									<el-col :span="6">
										<el-form-item>
											<el-select v-model="mtVal1">
												<el-option v-for="item in marketTypeOpts1" :key="item.key" :label="item.name" :value="item.key" placeholder="交易市场"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="4"><span class="label">开牌状态</span></el-col>
									<el-col :span="6">
										<el-select v-model="statusVal1">
											<el-option v-for="item in statusOpts1" :key="item.value" :label="item.label" :value="item.value" placeholder="开牌状态"></el-option>
										</el-select>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="4"><span class="label">股票名称</span></el-col>
									<el-col :span="6">
										<el-form-item>
											<el-input v-model="stockInfoParams.stock_name" placeholder="股票名称"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="4"><span class="label">股票代码</span></el-col>
									<el-col :span="6">
										<el-form-item>
											<el-input :disabled="isDisabled" v-model="stockInfoParams.stock_code" placeholder="股票代码"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="4"><span class="label">简拼</span></el-col>
									<el-col :span="6">
										<el-form-item>
											<el-input v-model="stockInfoParams.pinyin_code" placeholder="拼音简写"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form>
						</div>
					</div>
					<div class="dialog-bottom">
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogShow = false">取 消</el-button>
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

<style>

</style>
