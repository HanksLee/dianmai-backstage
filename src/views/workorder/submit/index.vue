<template>
  <div>
    <div class="page center" style="margin-bottom: 15px;">
      <div class="page-header" style="position: relative">
        <el-button :plain="activeTable=='1'? false:true" type="primary" size="mini" @click="clickGd">客户工单</el-button>
        <el-button :plain="activeTable=='2'? false:true" type="primary" size="mini" @click="clickZsk">知识库</el-button>
        <el-button class="closePage" size="mini" type="primary" @click="closeWindow">退出</el-button>
        <el-button v-if="isSubmitWorkOrder == false" class="addPage" size="mini" type="primary" @click="addgongdan">新增</el-button>
      </div>
      <div v-if="activeTable=='1'">
        <el-row>
          <el-col :span="10">
            <div class="page-con">
              <div class="operation-container">
                <div class="item">
                  <el-input v-model="workOrderTitle" size="small" placeholder="请输入工单标题" icon="search" style="width: 200px;margin-top:30px"/>
                  <el-button type="primary" size="small" @click="workOrderList()">搜索</el-button>
                  <el-button type="primary" size="small" @click="resetTitle('gd')">重置</el-button>
                </div>
              </div>
              <div class="table-data" style="overflow-y: auto; margin: 20px 0">
                <el-table :data="knowList" height="569" @row-click="workOrderrow">
                  <el-table-column label="工单标题" align="center">
                    <template slot-scope="scope">
                      <el-button type="text">{{ scope.row.title }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="处理状态" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.state == '1'">待分配</span>
                      <span v-if="scope.row.state == '2'">处理中</span>
                      <span v-if="scope.row.state == '3'">处理完毕</span>
                      <span v-if="scope.row.state == '4'">暂停处理</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" align="center"/>
                  <el-table-column prop="processingTime" label="处理时间" align="center"/>
                </el-table>
              </div>
              <el-pagination
                :page-size="10"
                :current-page="pn1"
                :total="total1"
                style="text-align: center"
                layout="prev, pager, next"
                @current-change="handleCurrentChange1"
              />
            </div>
          </el-col>
          <el-col :span="14">
            <div v-if="isSubmitWorkOrder" class="dialog-page-con">
              <div class="dialog-dl dialogCenter" style="padding: 15px 0px">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="position: relative;margin-top: 65px">
                  <el-form-item prop="title" label="工单主题">
                    <el-input v-model="form.title" placeholder="工单主题" />
                  </el-form-item>
                  <el-form-item prop="priority" label="优先级">
                    <el-select v-model="form.priority">
                      <el-option label="一般" value="1"/>
                      <el-option label="紧急" value="2"/>
                      <el-option label="十万火急" value="3"/>
                    </el-select>
                  </el-form-item >
                  <!--<el-form-item prop="Introduction" label="简介">-->
                  <!--<el-input v-model="form.Introduction" placeholder="简介" />-->
                  <!--</el-form-item>-->
                  <!-- <el-form-item prop="source_platform" label="来源平台">
                    <el-input v-model="form.source_platform" placeholder="来源平台"></el-input>
                  </el-form-item> -->
                  <el-form-item prop="contactName" label="姓名">
                    <el-input v-model="form.contactName" placeholder="工单创建者" style="float:right;"/>
                  </el-form-item>
                  <el-form-item prop="contactWay" label="联系方式">
                    <el-input v-model="form.contactWay" placeholder="请输入手机号" style="float:right;"/>
                  </el-form-item>
                  <el-form-item prop="content" label="问题描述">
                    <el-input :rows="5" v-model="form.content" type="textarea" placeholder="请输入描述"/>
                  </el-form-item>
                  <el-form-item label="上传附件">
                    <el-upload
                      ref="upload"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :http-request="edit"
                      :auto-upload="false"
                      :file-list="fileList"
                      :on-change="addFile"
                      class="upload-demo"
                      list-type="picture"
                      action="">
                      <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                      <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
                      <!--&lt;!&ndash;<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;-->
                      <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="edits">一次传多个</el-button>-->
                    </el-upload>
                  </el-form-item>
                  <el-button class="submitPage btn-m" size="mini" type="primary" @click="submitForm">提交</el-button>
                </el-form>
              </div>
            </div>
            <div v-else>
              <div class="workOrder">
                <ul>
                  <li>{{ aWorkOrkOrder.createTime }}</li>
                  <li class="workOrder-title">
                    <el-popover
                      :content="aWorkOrkOrder.title"
                      placement="top-start"
                      width="300"
                      trigger="hover">
                      <span slot="reference">{{ aWorkOrkOrder.title }}</span>
                    </el-popover>
                  </li>
                  <li>{{ aWorkOrkOrder.contactName }}</li>
                  <li>{{ aWorkOrkOrder.contactWay }}</li>
                </ul>
                <div class="workOrder-information">
                  <el-input
                    :disabled="(aWorkOrkOrder.state == '3'|| aWorkOrkOrder.state == '4')"
                    :rows="4"
                    v-model="chatContent"
                    type="textarea"
                    placeholder="请输入内容"/>
                </div>
                <div class="workOrder-button">
                  <!--<el-button type="primary">上传<i class="el-icon-upload el-icon&#45;&#45;right"/></el-button>-->
                  <el-upload
                    ref="upload"
                    :disabled="(aWorkOrkOrder.state == '3'|| aWorkOrkOrder.state == '4')"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :http-request="edit"
                    :auto-upload="false"
                    :file-list="fileListReply"
                    :on-change="addFile2"
                    class="upload-demo"
                    list-type="picture"
                    action="">
                    <el-button slot="trigger" :disabled="(aWorkOrkOrder.state == '3'|| aWorkOrkOrder.state == '4')" size="small" type="primary">上传文件</el-button>
                    <el-button :disabled="(aWorkOrkOrder.state == '3'|| aWorkOrkOrder.state == '4')" type="primary" size="small" @click="chatFileReply">发送<i class="el-icon-edit el-icon--right"/></el-button>
                  </el-upload>
                </div>
                <div class="workOrder-chatRecord-box">
                  <el-tabs v-model="activTab" style="height: 400px;overflow: auto" type="border-card" @tab-click="chatFileList">
                    <el-tab-pane label="聊天记录" name="1">
                      <div class="workOrder-tabs">
                        <div v-for="(item, index) in chatContentLists" :key="index" class="cards">
                          <div v-if="item.replyType=='1'" class="cards-left">
                            <img src="./img/ren.png" alt="用户">
                          </div>
                          <div v-if="item.replyType=='2'" class="cards-left">
                            <img src="./img/kefu.png" alt="客服">
                          </div>
                          <div class="cards-right">
                            <ul style="padding: 0">
                              <li v-if="item.replyType=='1'">{{ aWorkOrkOrder.contactName }}</li>
                              <li v-if="item.replyType=='2'">{{ item.replyName }}</li>
                              <li>{{ item.createTime }}</li>
                            </ul>
                            <div class="cards-right-content">
                              <span class="cards-kefu">{{ item.content }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="聊天文件" name="2">
                      <div class="workOrder-tabs">
                        <div v-for="(item, index) in fileLis" :key="index" style="margin-bottom: 10px">
                          <span style="display:block;margin-bottom: 10px">{{ item.fileName }}</span>
                          <img v-if="item.filePath.split('.')[1] == 'png' || item.filePath.split('.')[1] == 'jpeg' || item.filePath.split('.')[1] == 'jpg'" :src="apiurl + '' + item.filePath" style="vertical-align: middle;width: 120px" alt="图片" @click="bigShow(apiurl + '' + item.filePath)">
                          <el-button v-else type="text"><a :href="apiurl + '' + item.filePath" style="color:#409EFF;">下载</a></el-button>
                        </div>
                      </div>
                    </el-tab-pane>
                    <!--<el-tab-pane label="时间轴" name="3">-->
                    <!--<div class="workOrder-tabs">4</div>-->
                    <!--</el-tab-pane>-->
                  </el-tabs>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="activeTable=='2'">
        <el-row>
          <el-col :span="8">
            <div class="page-con">
              <div class="operation-container">
                <div class="item">
                  <el-input v-model="knowledgeTitle" size="small" placeholder="请输入知识库标题" icon="search" style="width: 200px;margin-top:30px"/>
                  <el-button type="primary" size="small" @click="knowledgeList()">搜索</el-button>
                  <el-button type="primary" size="small" @click="resetTitle('zsk')">重置</el-button>
                </div>
              </div>
              <div class="table-data" style="overflow-y: auto;margin: 20px 0 ">
                <el-table key="2" :data="zsknowList" height="569" @row-click="knowledgerow">
                  <el-table-column label="标题" align="center">
                    <template slot-scope="scope">
                      <el-button type="text">{{ scope.row.title }}</el-button>
                    </template>
                  </el-table-column>
                  <!--<el-table-column prop="author"/>-->
                  <el-table-column label="创建时间" prop="createTime" width="200" align="center"/>
                </el-table>
              </div>
              <el-pagination
                :page-size="10"
                :current-page="pn2"
                :total="total2"
                style="text-align: center"
                layout="prev, pager, next"
                @current-change="handleCurrentChange2"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div class="zskcontent">
              <h2 style="color: #9d9dae;text-align: center;font-size: 25px">{{ knowledgeBase.title }}</h2>
              <div style="text-indent:2em" v-html="knowledgeBase.content">0</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--<div class="dialog-bottom">-->
      <!--<div style="text-align: center;padding-top:20px;">-->
      <!--<el-button class="closePage" size="mini" type="primary" @click="closeWindow">退出</el-button>-->
      <!--</div>-->
      <!--</div>-->
      <el-dialog :visible.sync="showDialog" width="100%" style="text-align:center;height: 100%">
        <img :src="bigImg" alt="" style="max-width: 100%">
      </el-dialog>
    </div>
  </div>
</template>

<script src="./workorder.js"></script>
<style rel="stylesheet/scss" lang="scss">
  .active1{
  }
  .active2{
  }
  .page-header {
    position: relative;
    padding: 20px 0 10px 0px;
    color: #333;
    font-weight: bold;
    font-size: 15px;
    border-bottom: 1px solid #dfe6ec;
  }
  .page.center{
    /*background-color: rgb(238,242,249);*/
    position: relative;
    .closePage,.addPage{
      position: absolute;
    }
    .closePage{
      top:24px;
      right: 0;
    }
    .addPage{
      right: 0;
      top: 90px;
      z-index: 200;
    }
    .submitPage{
      margin: 30px 0 0 220px;
    }
    /*知识库*/
    .zskcontent{
      overflow: auto;
      width: 90%;
      padding: 20px;
      height: 575px;
      border: 1px solid #d7e1ef;;
      margin: 78px auto 0;
    }
  }
  .el-table .cell {
    text-align: left;
  }
  .center {
    padding: 0 65px;
    margin: 0 auto;
  }
  .dialogCenter {
    width: 500px;
    margin: 0 auto;
  }
  .basics.submit-data .label{text-align:center}
  .basics.submit-data .label1 {
    background-color: #20a0ff;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
  .basics {
    .page-baseconfig .el-row .el-col-4 {
      margin-right: 0;
    }
    .page-baseconfig .el-row .mar4 {
      margin-right: 100px;
    }
    .el-form {
      padding-left: 60px;
    }
    .row-back30 {
      margin-bottom: 30px;
    }
    .row-back50 {
      margin-bottom: 50px;
    }
    .row-back50:nth-last-child(1) {
      margin-bottom: 0;
    }
    .update-but {
      text-indent: 80px;
      /*border-bottom: 1px solid #dfe6ec;*/
      padding-bottom: 15px;
    }
  }
  .workOrder{
    >ul{
      margin: 23px 0 0 60px;
      padding: 20px;
      width: 600px;
      font-size: 0;
      li{
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        color: #668fe4;
        font-weight: 600;
        margin-right: 20px;
      }
      .workOrder-title{
        max-width: 11em;
        overflow:hidden; // 超出的文本隐藏
        text-overflow:ellipsis; // 溢出用省略号显示
        white-space:nowrap; // 溢出不换行
      }
    }
    .workOrder-information{
      margin-left: 60px;
      width: 600px;
      border: 1px solid #dfe6ec;
    }
    .workOrder-button{
      margin: 20px 0 0 60px;
    }
    .workOrder-chatRecord-box{
      margin:20px 0 0 60px;
      width: 600px;
      .workOrder-tabs{
        height: 600px;
        overflow-y: auto;
        .cards{
          position: relative;
          padding: 10px 0;
          .cards-left{
            display: table-cell;
            vertical-align: top;
            img{
              width: 40px;
            }
          }
          .cards-right{
            display: table-cell;
            vertical-align: top;
            ul{
              margin: 0 0 10px 10px;
              li{
                margin-right: 10px;
                display: inline-block;
              }
            }
          }
          .cards-right-content{
            span{
              padding: 12px 14px;
              word-wrap: break-word;
              margin-left: 12px;
              color: #232323b5;
              letter-spacing: 1px;
              border-radius: 5px;
              display: inline-block;
              max-width: 400px;
              line-height: 20px;
              border: 1px solid #dcdee0ba;
              position: relative;
            }
            span::before{
              content: ' ';
              position: absolute;
              top: 16px;
              margin-top: -6px;
              width: 0;
              height: 0;
              border-bottom: 5px solid transparent;
              border-top: 5px solid transparent;
              right: 100%;
              z-index: 10;
            }
            .cards-kefu{
              background-color: rgb(255,255,255);
            }
            .cards-kefu::before{
              border-right: 5px solid rgb(255,255,255);
            }
            .cards-kefu::after{
              content: ' ';
              position: absolute;
              top: 15px;
              margin-top: -6px;
              width: 0;
              height: 0;
              border-right: 6px solid #dcdee0ba;
              border-bottom: 6px solid transparent;
              border-top: 6px solid transparent;
              left: -7px;
              z-index: 1;
            }
            .cards-kehu{
              background-color: rgb(158,234,106);
            }
            .cards-kehu::before{
              border-bottom: 7px solid transparent;
              border-top: 7px solid transparent;
              border-right: 7px solid rgb(158,234,106);
            }
          }
        }
      }
    }
  }
</style>
