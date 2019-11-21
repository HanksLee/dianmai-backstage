<template>
  <div class="treeBox">
     <el-table :data="list" border :emptyText="emptyText">
       <el-table-column  label-class-name="labelClass" min-width="100" type="expand">
         <template slot-scope="scope">
            <div>
               <recursive-html :row="scope.row"></recursive-html>
            </div>
         	</template>
       	</el-table-column>
        <el-table-column prop="real_name" label="姓名" label-class-name="labelClass" min-width="100"></el-table-column>
        <el-table-column prop="div_commission" label="手续费分成" label-class-name="labelClass" min-width="100"></el-table-column>
        <el-table-column prop="div_delayfee" label="递延分成" label-class-name="labelClass" min-width="100"></el-table-column>
        <el-table-column prop="div_servicefee" label="管理费分成" label-class-name="labelClass" min-width="100"></el-table-column>
        <el-table-column prop="div_profit" label="盈利分成" label-class-name="labelClass" min-width="100"></el-table-column>
     </el-table>
  </div>
</template>
<script type="text/javascript" src="./index.js"></script>
