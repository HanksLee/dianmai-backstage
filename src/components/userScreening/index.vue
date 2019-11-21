<template>
  <div>
    <span class="demonstration">筛选：</span>
    <el-select v-model="mechanism.value" placeholder="请选择机构" @change="changeMechanism" v-if="mechanism.options.length > 0">
      <el-option
          v-for="item in mechanism.options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="nexus.value" placeholder="请选择" @change="changeBelongData">
					<el-option
						v-for="item in nexus.options"
						:key="item.id"
						:label="item.name"
						:value="item.id">
					</el-option>
		</el-select>
    <el-dialog title="用户筛选" class="dialog1 dialog-s" :visible.sync="UserScreening.dialogVisible" :before-close="close">
      <div class="dialog-page">
        <div class="dialog-page-con">
            <div class="dialog-dl">
              <div class="customer-filtrate-search clearfix">
                <div class="search-box" style="margin-left:10px;">
                    <el-autocomplete
                      v-model="state"
                      :fetch-suggestions="querySearchAsync"
                      placeholder="请输入用户名搜索"
                      @select="handleSelect">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                      </template>
                    </el-autocomplete>
                </div>
                <div class="current-select">
                	当前选择：
                  <el-tag
                    :key="selected"
                    v-if="selected"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(selected)">
                    {{selected}}
                  </el-tag>
                </div>
              </div>
              <div class="customer-cascader-box">
                  <ul v-for="(itme,index) in userListArr" :key="index" class="el-cascader-menu">
                      <li class="el-cascader-menu__item" v-for="(item1, index1) in userListArr[index]" :key="index1" @click="clickUser(item1.id,item1.name,index)" :class="{ active:isActive === item1.id }">{{item1.name}}</li>
                  </ul>
              </div>
              <div class="filtrate-btn">
                  <el-button class="el-blue-btn commit-btn" @click="userScreeningSearch">确定</el-button>
              </div>
            </div>
        </div>
      </div>
    </el-dialog> 
  </div>
</template>
<script type="text/javascript" src="./index.js"></script>
<style rel="stylesheet/scss" lang="scss">
.filtrate-btn {
  text-align: center;
  margin-top: 20px;
}
.customer-filtrate-search {
  margin-top: -5px;
  padding-bottom: 13px;
  .search-box {
    float: left;
    .box-width {
      width: 250px;
    }
  }
  .current-select {
    float: left;
    margin-left: 20px;
    line-height: 32px;
    width: 290px;
    overflow:hidden;
  }
}
.customer-cascader-box {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
  width: 100%;
  height: 306px;
  white-space: nowrap;
  .el-cascader-menu {
    display: inline-block;
    min-width: 140px;
    height: 300px;
    border-right: 1px solid #ddd;
  }
  .active {
    background: #eee;
  }
}
.el-autocomplete {
  width: 180px !important;
}
.dialog1.dialog-s .el-dialog {
  width: 800px !important;
}
</style>

