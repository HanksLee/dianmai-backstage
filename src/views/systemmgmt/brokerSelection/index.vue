<template>
  <div class="page page-accouttype">
    <div class="page-header">券商选择（通达信）</div>
    <div class="page-con">
      <div class="broker-selection" v-loading="loading1">
        <el-row>
          <el-col :span="6">
            <div class="item">券商选择：</div>
            <el-select v-model="parameter.broker_name_id" placeholder="请选择券商">
              <el-option
                v-for="item in brokerArr"
                :key="item.id"
                :label="item.broker_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <div class="item">服务器IP：</div>
            <el-input v-model="broker_ip_broker_port" placeholder="请输入服务器地址格式（ip:端口）"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item">软件版本号：</div>
            <el-input v-model="parameter.broker_version" placeholder="请输入版本号"></el-input>
          </el-col>
          <el-col :span="6">
            <div class="item">营业部代码：</div>
            <el-input v-model="parameter.broker_yybID" placeholder="请输入营业部代码"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item">登录账号：</div>
            <el-input v-model="parameter.broker_AccountNo" placeholder="请输入登录账号"></el-input>
          </el-col>
          <el-col :span="6">
            <div class="item">交易账户：</div>
            <el-input v-model="parameter.broker_TradeAccount" placeholder="请输入交易账户"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item">交易密码：</div>
            <el-input v-model="parameter.broker_JyPassword" placeholder="请输入交易密码"></el-input>
          </el-col>
          <el-col :span="6">
            <div class="item">通讯密码：</div>
            <el-input v-model="parameter.broker_TxPassword" placeholder="请输入通讯密码"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="item">关闭/开启：</div>
            <el-switch v-model="switchValue" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
        <div class="bnt-box">
          <div class="bnt" @click="getloginedit" v-loading="loading2">保存</div>
        </div>
      </div>
      <div class="operation-container">
        <div class="item1">
          <span>券商筛选：</span>
          <el-select v-model="broker_name_id" placeholder="请选择券商" @change="brokerageScreening">
            <el-option
              v-for="item in brokerArr"
              :key="item.id"
              :label="item.broker_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="item1">
          <span>状态：</span>
          <el-select v-model="status" placeholder="请选择状态" @change="stateSelection">
            <el-option
              v-for="item in brokerArr1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="item1">
          <el-input placeholder="请输入单号/券商名称/股票名称/股票代码/交易账号" clearable v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="list" stripe border style="width:100%" v-loading="loading">
          <el-table-column prop="src_orderid" label="订单号" label-class-name="labelClass"></el-table-column>
          <el-table-column prop="type" label="订单方向" label-class-name="labelClass">
            <template slot-scope="scope">
              <div v-if="scope.row.type == '0'">开仓</div>
              <div v-if="scope.row.type == '1'">平仓</div>
            </template>
          </el-table-column>
          <el-table-column prop="assign_time" label="委托时间" label-class-name="labelClass"></el-table-column>
          <el-table-column prop="succ_time" label="成交时间" label-class-name="labelClass"></el-table-column>
          <el-table-column prop="dst_orderid" label="委托单号" label-class-name="labelClass"></el-table-column>
          <el-table-column prop="broker_name" label="券商名称" label-class-name="labelClass"></el-table-column>
          <el-table-column prop="broker_TradeAccount" label="交易账号" label-class-name="labelClass"></el-table-column>
          <el-table-column prop="stock_code" label="股票(代码/名称)" label-class-name="labelClass">
            <template slot-scope="scope">
              <div>{{scope.row.stock_code}}/{{scope.row.stock_name}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="assign_price" label="价格(委托/成交)" label-class-name="labelClass">
            <template slot-scope="scope">
              <div>{{scope.row.assign_price}}/{{scope.row.succ_price}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="assign_volume" label="数量(委托/成交)" label-class-name="labelClass">
            <template slot-scope="scope">
              <div>{{scope.row.assign_volume}}/{{scope.row.succ_volume}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" label-class-name="labelClass">
            <template slot-scope="scope">
              <div v-if="scope.row.status == '0'">未成交</div>
              <div v-if="scope.row.status == '1'">部分成交</div>
              <div v-if="scope.row.status == '2'">全部成交</div>
              <div v-if="scope.row.status == '3'">委托失败</div>
            </template>
          </el-table-column>
           <el-table-column prop="comment" label="备注" label-class-name="labelClass"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <paging :getList="getList" :page="page" ref="brokerSelectionData"></paging>
  </div>
</template>
<script src="./index.js">
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.broker-selection {
  margin-top: -1px;
  padding: 10px 0 20px 0;
  background: #f5f5f5;
  width: 840px;
  border-radius: 0 0 7px 7px;
  border: 1px solid #dfe6ec;
  .el-col-6 {
    width: 400px;
  }
  .el-select {
    width: 260px;
  }
  .el-input {
    width: 260px;
  }
}
.item {
  display: inline-block;
  text-align: right;
  width: 120px;
}
.bnt-box {
  text-align: center;
  padding-top: 10px;
}
.bnt {
  color: #fff;
  display: inline-block;
  padding: 10px 38px;
  background: #3a8ee6;
  cursor: pointer;
  border-radius: 7px;
}
.operation-container {
  padding: 20px 0;
  .el-input {
    width: 360px;
  }
}
.item1 {
  display: inline-block;
  margin-right: 30px;
}
</style>