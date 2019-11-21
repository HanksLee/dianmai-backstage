<template>
	<div class="page page-customer" v-loading="loading" element-loading-text="加载中...">
		<div class="page-header">
			<span>短信设置</span>
		</div>
		<div class="page-con">
			<div class="operation-container">
				<!--<div class="item">
					<el-button type="primary" icon="el-icon-plus" @click="add">添加短信配置</el-button>
				</div>-->
			</div>
			<div class="table-data">
				<el-table :data="list" border style="width:100%">
					<el-table-column prop="id" label="id" label-class-name="labelClass" min-width="100" fixed="left"></el-table-column>
					<el-table-column prop="channel_name" label="通道名称" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="api_url" label="API地址" label-class-name="labelClass" min-width="100"></el-table-column>
					<el-table-column prop="comment" label="备注" label-class-name="labelClass" min-width="100"></el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script src="./index.js">
</script>

<style rel="stylesheet" lang="scss" scoped>
	.dialog-section {
		border-bottom: none;
	}
</style>