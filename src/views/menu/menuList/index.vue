<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>菜单列表</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<el-button type="primary" icon="el-icon-plus" @click="operation('create')">添加</el-button>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="menuList" border style="width:100%" @expand-change="expandChange" :row-key="getRowKeys" :expand-row-keys="expand">
					<!-- default-expand-all="true" 是否展开 -->
					<el-table-column label="" label-class-name="labelClass" type="expand">
						<template slot-scope="props">
							<el-table :data="menuSubList" border style="width:100%" :empty-text="emptyText">
								<el-table-column prop="menu_name" label="菜单名称" label-class-name="labelClass"></el-table-column>
								<el-table-column prop="sort" label="位置"></el-table-column>
								<el-table-column label="操作" label-class-name="labelClass">
									<template slot-scope="scope">
										<!--<el-button type="success" size="mini" @click="edit('add', scope.row, scope.$index)">添加</el-button>-->
										<el-button type="primary" size="mini" @click="operation('edit', scope.row, scope.$index)">编辑</el-button>
										<el-button size="mini" type="danger" @click="operation('delete', scope.row, scope.$index)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</el-table-column>
					<el-table-column prop="menu_name" label="菜单名称"></el-table-column>
					<el-table-column prop="parent_id" label="归属菜单">
						<template slot-scope="scope">
							<span v-if="scope.row.parent_id == '0'">无</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="位置"></el-table-column>
					<el-table-column label="操作" label-class-name="labelClass">
						<template slot-scope="scope">
							<el-button type="success" size="mini" @click="operation('add', scope.row, scope.$index)">添加</el-button>
							<el-button type="primary" size="mini" @click="operation('edit', scope.row, scope.$index)">编辑</el-button>
							<el-button size="mini" type="danger" @click="operation('delete', scope.row, scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
		<!-- 新增菜单开始 -->
		<el-dialog :title="menuDialogTitle" :visible.sync="menuDialogShow" class="dialog1 dialog-s">
			<div class="dialog-page">
				<div class="dialog-section">
					<el-form>
						<el-row :style="{display: isDisplay}">
							<el-col :span="4"><span class="label">归属菜单：</span></el-col>
							<el-col :span="14">
								<span>{{menuParams.parent_id}}</span>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">菜单名称：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-form-item>
										<el-input v-model="menuParams.menu_name" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="4"><span class="label">位置：</span>
							</el-col>
							<el-col :span="14">
								<div class="label-val">
									<el-form-item>
										<el-input v-model="menuParams.sort" style="width:340px"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="dialog-bottom">
					<div slot="footer" class="dialog-footer">
						<el-button @click="menuDialogShow = false">取 消</el-button>
						<el-button type="primary" @click="menuSubmit">提交</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 新增菜单结束 -->
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
	.dialog-page {
		dl {
			padding-left: 70px;
		}
		.dialog-section {
			margin-top: 0;
		}
		.el-col-14 {
			line-height: 32px;
		}
	}
</style>
<script src="./index.js"></script>