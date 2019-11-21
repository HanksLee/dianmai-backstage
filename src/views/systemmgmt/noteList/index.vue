<template>
	<div class="page page-accouttype">
		<div class="page-header">短信列表</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item">
					<el-input placeholder="请输入手机号" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
					</el-input>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" stripe border style="width:100%">
					<el-table-column prop="mobile" label="手机号" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="content" label="发送内容" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="create_time" label="发送时间" label-class-name="labelClass"></el-table-column>
					<el-table-column prop="result_text" label="发送结果" label-class-name="labelClass"></el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
		</div>
	</div>
</template>
<script src="./index.js"></script>
<style></style>