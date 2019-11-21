<template>
  <div class="page">
    <div class="page-header">
      <span>汇率维护</span>
    </div>
    <div class="page-con" v-loading="loading" element-loading-text="加载中...">
      <div class="operation-container">
    <el-row v-for="(item,index) in rateList" :key="index" class="row-lineheight">
      <el-col :span="2" class="title-lineheight">
        <h4>{{item.comment}}</h4>
      </el-col>
			<el-col class="line" :span="1">——</el-col>
      <el-col class="line text-center" :span="2">买入汇率</el-col>
      <el-col :span="2">
        <el-input v-model="item.in_rate" placeholder="买入汇率"></el-input>
      </el-col>
      <el-col class="line text-center" :span="1">浮动</el-col>
      <el-col :span="3">
        <el-input v-model="item.price_in_offset" placeholder="精确到小数点后三位"></el-input>
      </el-col>
      <el-col class="line text-center" :span="2">卖出汇率</el-col>
      <el-col :span="2">
        <el-input v-model="item.out_rate" placeholder="卖出汇率"></el-input>
      </el-col>
      <el-col class="line text-center" :span="1">浮动</el-col>
      <el-col :span="3">
        <el-input v-model="item.price_out_offset" placeholder="精确到小数点后三位"></el-input>
      </el-col>
      <el-col class="line text-center" :span="2">
    		<el-checkbox :true-label="1" :false-label="0" v-model="item.price_auto">自动更新</el-checkbox>
    	</el-col>
      <el-col class="line" :span="1">——</el-col>
      <el-col :span="2">
        <el-button type="primary" @click="handleClick(rateList[index])" v-if="globalPermission('v1_admin/currencyrate/edit')">更新</el-button>
      </el-col>
    </el-row>
  </div>
    <div class="page-header">
      <span>维护历史</span>
    </div>
  <div class="table-data">
    <el-table :data="list" stripe border style="width:100%">
      <el-table-column prop="trade_currency_name" label="交易货币—>支付货币" label-class-name="labelClass">
        <template slot-scope="scope">
          {{scope.row.trade_currency_name+"—>"+scope.row.pay_currency_name}}
        </template>
      </el-table-column>
      <el-table-column prop="in_rate" label="买入汇率" label-class-name="labelClass">
      </el-table-column>
      <el-table-column prop="out_rate" label="卖出汇率" label-class-name="labelClass">
      </el-table-column>
      <el-table-column prop="admin_name" label="操作人" label-class-name="labelClass">
      </el-table-column>
      <el-table-column prop="create_time" label="时间" label-class-name="labelClass">
      </el-table-column>
    </el-table>
  </div>
 <!-- 分页-->
	<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
  </div>
</div>
</template>
<script type="text/javascript" src="./index.js">
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .row-lineheight{
    line-height: 30px;
  }
  .main-container .app-main .el-col-3.title-lineheight{
    height: 30px;
    line-height: 30px;
  }
  .operation-container{
    padding-top: 5px;

  }
  .text-center{
    text-align: center;
  }
</style>
