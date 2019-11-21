<template>
  <div class="page">
    <div class="page-header">
      <span>出入金汇率</span>
    </div>
    <div class="page-con" v-loading="loading" element-loading-text="加载中...">
      <div class='page-body'>
        <el-row class="content1">
          <el-col class="text-center item_width margin_value" :span="2"><h4>支付</h4></el-col>
          <el-col class="text-center item_width" :span="2"><h4>平台</h4></el-col>
          <el-col class="text-center item_width" :span="2"><h4>汇率</h4></el-col>
        </el-row>
        <el-row class="content1">
            <el-col :span="2" class="text-center">
                <h4>出金:</h4>
            </el-col>
            <el-select class='item_width' disabled v-model="optionsValue1" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.alias_name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-select class='item_width' disabled v-model="optionsValue2"  placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.alias_name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-input class='item_width' placeholder="汇率" v-model="out_rate"></el-input>
            <el-button @click="cancel('out')" class="btn-m">取消</el-button>
            <el-button type="primary" @click="submit('out')" class="btn-m">更新</el-button>
        </el-row>
        <el-row class="content1">
            <el-col :span="2" class="text-center">
                <h4>入金:</h4>
            </el-col>
            <el-select class='item_width' disabled v-model="optionsValue3"  placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.alias_name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-select class='item_width' disabled v-model="optionsValue4"  placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.alias_name"
                :value="item.code">
              </el-option>
            </el-select>
            <el-input class='item_width' placeholder="汇率" v-model="in_rate"></el-input>
            <el-button @click="cancel('in')" class="btn-m">取消</el-button>
            <el-button type="primary" @click="submit('in')" class="btn-m">更新</el-button>
        </el-row>
      </div>
     <div class="page-header">
      <span>维护历史</span>
    </div>
      <div class='history-table'>
          <el-table :data="list" stripe border style="width:100%">
              <el-table-column prop="comment" label="交易货币—>支付货币" label-class-name="labelClass">
              </el-table-column>
              <el-table-column prop="type" label="类型" label-class-name="labelClass">
              </el-table-column>
              <el-table-column prop="rate" label="汇率" label-class-name="labelClass">
              </el-table-column>
              <el-table-column prop="admin_name" label="操作人" label-class-name="labelClass">
              </el-table-column>
              <el-table-column prop="create_time" label="时间" label-class-name="labelClass">
              </el-table-column>
         </el-table>
      </div>
 <!-- 分页-->
	<paging :getList="getInOut" :page="page" ref="subassemblyData"></paging>
  </div>
</div>
</template>
<script type="text/javascript" src="./index.js">
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content1{
  height:30px;
  line-height:30px;
}
.text-center{
  text-align:center;
}
.history-table{
  margin-top:15px;
}
.item_width{
  width:200px;
}
.margin_value{
  margin-left: 100px;
}
</style>
