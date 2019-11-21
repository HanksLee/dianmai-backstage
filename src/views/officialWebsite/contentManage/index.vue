<template>
	<div class="page page-customer">
    <div class="page-header">
			<span>内容管理</span>
		</div>
      <el-tabs v-model="activeName" @tab-click="handleClick(activeName)" v-loading="loading" element-loading-text="加载中...">
        <el-tab-pane label="内容分类" name="contentClassify">
          <div class="operation-container">
              <div class="item" v-if="globalPermission('v1_admin/contenttype/add')">
                <el-button type="primary" icon="el-icon-plus" @click="addContentType">新增</el-button>
              </div>
            </div>
          <div class="table-data">
            <el-table :data="list" border style="width:100%">
                <el-table-column type="index" label="序号" label-class-name="labelClass" width="100">
                </el-table-column>
                <el-table-column prop="content_key" label="分类key" label-class-name="labelClass" min-width="100">
                </el-table-column>
                <el-table-column prop="content_name" label="名称" label-class-name="labelClass" min-width="100">
                </el-table-column>
                <el-table-column prop="content_desc" label="描述" label-class-name="labelClass" min-width="100">
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="editClassify(scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" v-if="scope.row.system_flag == '0'" @click="delContenttypeFn(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="内容列表" name="contentList">
          	<div class="operation-container">
              <div class="item">
                <el-button type="primary" icon="el-icon-plus" @click="addContent">新增</el-button>
              </div>
              <div class="item">
                <el-input placeholder="请输入分类名称/标题" clearable v-model="keyword">
                  <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
              </div>
            </div>
          <div class="table-data" style="padding-bottom:10px;overflow:hidden">
            <el-table :data="list1" border style="width:100%">
                <el-table-column type="index" label="序号" label-class-name="labelClass" width="100">
                </el-table-column>
                <el-table-column prop="content_name" label="所属分类" label-class-name="labelClass" min-width="100">
                </el-table-column>
                <el-table-column prop="title" label="内容标题" label-class-name="labelClass" min-width="100">
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" label-class-name="labelClass" min-width="100">
                </el-table-column>
                <el-table-column prop="show_flag" label="是否显示" label-class-name="labelClass" min-width="100">
                   <template slot-scope="scope">
                      <div v-if="scope.row.show_flag == '0'" style="color:#f00">不显示</div>
                      <div v-if="scope.row.show_flag == '1'" style="color:#67c23a;">显示</div>
                   </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="editContent(scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" v-if="scope.row.system_flag =='0'" @click="del(scope.row)">删除</el-button>
                    <el-button size="mini" type="text" @click="copyUrl(scope.row)">复制链接地址</el-button>
                  </template>
                </el-table-column>
              </el-table>
		    <!-- 分页 -->
			<paging :getList="getList" :page="page" ref="subassemblyData"></paging>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- //编辑分类 -->
      <el-dialog :title="title" class="dialog1 dialog-s" :visible.sync="classifyForm.dialogVisible">
          <div class="dialog-page">
            <div class="dialog-page-con">
              <div class="dialog-dl">
                <dl class="mt5">
                    <dt>分类名称</dt>
                    <dd>
                      <el-input placeholder="请输入分类名称" v-model="classifyForm.classifyName"></el-input>
                    </dd>
                </dl>
                <dl>
                    <dt>描述</dt>
                    <dd>
                      <el-input 
                        type="textarea"
                        :rows="2" 
                        placeholder="请输入分类名称" 
                        v-model="classifyForm.classifyDescribe">
                      </el-input>
                    </dd>
                </dl>
                <dl>
                  <dt>系统类型</dt>
                  <dd style="line-height:36px;">
                    <el-radio v-model="radio" label="1">是</el-radio>
                    <el-radio v-model="radio" label="0">否</el-radio>
                  </dd>
                </dl>
                <dl style="text-align:center">
                  <dd style="float:none;">
                    <el-button class="el-blue-btn commit-btn" @click="addSubmit">提交</el-button>
                    <el-button class="commit-btn" plain @click="classifyForm.dialogVisible=false">取消</el-button>
                  </dd>
                </dl>
              </div>
            </div>
          </div> 
      </el-dialog>
       <!-- //编辑分类结束 -->      
       <!-- 新增内容 -->
      <el-dialog :title="title1" id="dialog" class="dialog1 dialog-large dialog-bottom-fixed2" :visible.sync="contentListForm.dialogVisible">
				<div class="dialog-page">
            <div class="dialog-page-con d-detail" style="margin-top:20px;">
              <div class="dialog-dl">
                <dl class="mt5">
                    <dt>内容标题</dt>
                    <dd>
                      <el-input placeholder="请输入内容标题" v-model="contentListForm.contentTitle"></el-input>
                    </dd>
                </dl>
                <dl>
                    <dt>所属分类</dt>
                    <dd>
                      <el-select v-model="value" placeholder="请选择分类" @change="changeValue">
                        <el-option
                          v-for="item in options"
                          :key="item.content_type"
                          :label="item.content_name"
                          :value="item.content_type">
                        </el-option>
                      </el-select>
                    </dd>
                </dl>
                <dl>
                  <dt>内容</dt>
                  <dd>
                    <div class="editor-container" style="width:750px;height:500px;margin-bottom:15px;">
                      <editor :contentData="contentData" ref="editorData"></editor>
                    </div>  
                  </dd>
                </dl>
                <dl>
                  <dt style="color:#f00;">是否显示</dt>
                  <dd>
                    <el-checkbox v-model="contentListForm.checked" style="margin-top:9px;"></el-checkbox>
                  </dd>
                </dl>
              </div>
            </div>
          <div class="dialog-bottom">
                  <div style="text-align: center;padding-top:15px;">
                    <el-button class="el-blue-btn commit-btn" @click="submitContent">提交</el-button>
                    <el-button class="commit-btn" plain @click="contentListForm.dialogVisible=false">取消</el-button>
                  </div>
          </div>  
				</div>
      </el-dialog>  
      <!-- 新增内容结束 -->       
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-page{
	  dl{
		  padding-left:78px;
	  }
  }
</style>
<script src="./index.js"></script>

