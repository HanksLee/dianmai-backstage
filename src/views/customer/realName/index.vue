<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>实名认证</span>
		</div>
		<div class="page-con" v-loading="loading" element-loading-text="加载中...">
			<div class="operation-container">
				<div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
				</div>
				<div class="item">
					<span class="demonstration">申请时间：</span>
					<el-date-picker v-model="checkTime" type="daterange" :picker-options="pickerOptions1" placeholder="时间范围" class="w250" @change="changeStatus">
					</el-date-picker>
				</div>
				<div class="item">
					<el-select v-model="check_status" placeholder="请选择" @change="changeFn">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="table-data">
				<el-table :data="list" :emptyText="emptyText" border style="width:100%">
					<el-table-column prop="real_name" label="姓名" label-class-name="labelClass" min-width="100" fixed="left">
					</el-table-column>
					<el-table-column prop="mobile" label="账号" label-class-name="labelClass" min-width="100">
					</el-table-column>
					<el-table-column prop="parent_name" label="归属" label-class-name="labelClass" min-width="100">
					</el-table-column>
					<el-table-column prop="card_id" label="证件号码" label-class-name="labelClass" min-width="100">
					</el-table-column>
					<el-table-column prop="img_1" label="证件正面" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<el-popover placement="right" width="400" trigger="click">
								<img :src="scope.row.img_1" class="popover-image">
								<el-button type="text" slot="reference">查看</el-button>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="img_2" label="证件反面" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<el-popover placement="right" width="400" trigger="click">
								<img :src="scope.row.img_2" class="popover-image">
								<el-button type="text" slot="reference">查看</el-button>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="申请时间" label-class-name="labelClass" min-width="100">
					</el-table-column>
					<el-table-column prop="check_status" label="审核状态" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.check_status == '0'" color="red">未审核</div>
							<div v-if="scope.row.check_status == '1'" color="green">审核成功</div>
							<div v-if="scope.row.check_status == '2'" color="red">审核拒绝</div>
						</template>
					</el-table-column>
					<el-table-column prop="check_time" label="审核时间" label-class-name="labelClass" min-width="100">
					</el-table-column>
					<el-table-column prop="check_user_name" label="审核人" label-class-name="labelClass" min-width="100">
					</el-table-column>
					<el-table-column prop="" label="操作" label-class-name="labelClass" min-width="100">
						<template slot-scope="scope">
							<span class="table-btn-text" @click="showCheckDialog(scope.row)">{{scope.row.check_status | btnText}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
			<!-- 查看 -->
			<!--<el-dialog title="查看" class="el-dialog-see" :visible.sync="viewBox" width="30%">
				<div v-html="seeCheck_status" style="text-align:center;line-height:56px;font-size:16px;">{{seeCheck_status}}</div>
				<el-input type="textarea" disabled v-model="seeComment" :autosize="{ minRows: 2, maxRows: 2}" placeholder="请输入审核意见">
				</el-input>
			</el-dialog>-->
			<!--审核-->
			<el-dialog :title="checkData.title" :visible.sync="checkData.dialogVisible" class="dialog1 dialog-large dialog-bottom-fixed">
				<div class="dialog-page">
					<div class="dialog-page-con">
						<el-row style="padding:15px 0;border-bottom:1px solid #ccc;">
								<el-col :span="6" style="margin-left:40px;">
									<span class="label">姓名：{{real_name}}</span><span style="color:#f00">({{ demo_flag == '0'?'真实': '模拟' }})</span>
								</el-col>
								<el-col :span="6">
									<span class="label">账号：{{mobile}}</span>
								</el-col>
								<el-col :span="6">
									<span class="label">归属：{{parent_name}}</span>
								</el-col>
							</el-row>
						<div class="imgs">
							<el-row>
								<el-col :span="11">
									<el-popover ref="popover1" placement="left" width="500" trigger="hover">
										<img :src="pic.img_1" class="popover-image">
									</el-popover>
									<div class="r" v-popover:popover1>
										<div class="hp">
											<p v-if="pic.showToast1">{{pic.toastTaxt1}}</p>
											<img v-if="!pic.showToast1" :src="pic.img_1">
										</div>
									</div>
								</el-col>
								<el-col :span="11">
									<el-popover ref="popover2" placement="left" width="500" trigger="hover">
										<img :src="pic.img_2" class="popover-image">
									</el-popover>
									<div class="r" v-popover:popover2>
										<div class="hp">
											<p v-if="pic.showToast2">{{pic.toastTaxt2}}</p>
											<img v-if="!pic.showToast2" :src="pic.img_2">
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</div>
					<div class="dialog-bottom">
						<div class="check-box">
							<el-input v-model="checkData.comment" type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="请输入审核意见"></el-input>
							<div class="check-btns" v-if="checkData.check_status == '0'">
								<el-button class="el-green-btn" @click="checkSubmit(1)" :loading="checkData.loading.state1">审核通过</el-button>
								<el-button class="el-red-btn" @click="checkSubmit(2)" :loading="checkData.loading.state2">拒绝申请</el-button>
							</div>
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
	@import "../customerList/customer"
</style>