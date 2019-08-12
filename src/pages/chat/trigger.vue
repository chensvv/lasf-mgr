<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>闲聊数据</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-button class="success" size="mini" @click="handleAdd()">添加</el-button> -->
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline trigger" size="mini" label-width="70px">
          <el-form-item label="客户端平台" prop="dtp">
            <el-input v-model="searchItem.dtp" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户ID" prop="uid">
            <el-input v-model="searchItem.uid" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户端版本" prop="clientVersion">
            <el-input v-model="searchItem.clientVersion" clearable></el-input>
          </el-form-item>
          <el-form-item label="引擎版本" prop="engineVersion">
            <el-input v-model="searchItem.engineVersion" clearable></el-input>
          </el-form-item>
          <el-form-item label="开发者" prop="developer">
            <el-input v-model="searchItem.developer" clearable></el-input>
          </el-form-item>
          <el-form-item label="唤醒词类型" prop="keywordType">
            <el-select v-model="searchItem.keywordType" placeholder="--" clearable>
              <el-option label="联想" value="联想"></el-option>
              <el-option label="百度" value="百度"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="唤醒词" prop="keywordPhrase">
            <el-input v-model="searchItem.keywordPhrase" clearable></el-input>
          </el-form-item>
          <el-form-item label="数据来源" prop="origin">
            <el-input v-model="searchItem.origin" clearable></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="refreshTime" class="width140">
              <el-date-picker 
                type="date" 
                placeholder="选择日期" 
                v-model="searchItem.refreshTime" 
                style="width: 100%;"
                value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="putTime" class="width140">
              <el-date-picker 
                type="date" 
                placeholder="选择日期" 
                v-model="searchItem.putTime" 
                style="width: 100%;"
                value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item class="width140" style="text-align:right">
            <el-button size="mini" type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
            <el-button size="mini" @click="resetForm('searchItem')">重置</el-button>
          </el-form-item>
    </el-form>

    
      
    <div class="table-box">
      <i-table :list="list" :options="options" :columns="columns" :operates="operates"></i-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import iTable from "@/components/table";
import {checkTime} from '@/utils/timer.js'
import {triggerList} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      searchItem:{//搜索数据组
        dtp:"",
        uid:"",
        clientVersion:"",
        engineVersion:"",
        developer:"",
        keywordType:"",
        keywordPhrase:"",
        origin:"",
        refreshTime:"",
        putTime:""
      },
      columns: [
        {
          prop: "dtp",
          label: "设备类型",
          align: "center",
          hasSort:true
        },
        {
          prop: "uid",
          label: "用户ID",
          align: "center",
          hasSort:true
        },
        {
          prop: "clientVersion",
          label: "客户端版本",
          align: "center",
          hasSort:true
        },
        {
          prop: "engineVersion",
          label: "引擎版本",
          align: "center",
          hasSort:true
        },
        {
          prop: "developer",
          label: "开发者",
          align: "center",
          hasSort:true
        },
        {
          prop: "keywordType",
          label: "唤醒词类型",
          align: "center",
          hasSort:true
        },
        {
          prop: "keywordPhrase",
          label: "唤醒词",
          align: "center",
          hasSort:true
        },
        {
          prop: "origin",
          label: "数据来源",
          align: "center",
          hasSort:true
        },
        {
          prop: "displayDate",
          label: "数据日期",
          align: "center",
          hasSort:true,
        },
        {
            prop:"filePath",
            label: "操作",
            align: "center",
            render: (h, params)=>{
              return h('a',{
                attrs: {
                  download: 'pcm',
                  class:"downloadFile",
                  href: params.row.filePath
                },
              })
          }
        }
      ],
      options: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        border:false     //是否显示纵向边框
      },
      operates: {
        show: false,
        list: [
          
        ]
      }, // 列操作按钮
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      seaBtnLoading:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList()
    },
    onSubmit(){
      this.seaBtnLoading = true
      this.getList()
      this.seaBtnLoading = false
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`);
      this.getList();
    },
    getList() {
      let params = {
        pgstr:this.currentPage,
        pcstr:this.pageSize,
        startStr:this.searchItem.refreshTime,
        endStr:this.searchItem.putTime,
        dtp:this.searchItem.dtp,
        uid:this.searchItem.uid,
        clientVersion:this.searchItem.clientVersion,
        engineVersion:this.searchItem.engineVersion,
        developer:this.searchItem.developer,
        keywordType:this.searchItem.keywordType,
        keywordPhrase:this.searchItem.keywordPhrase,
        origin:this.searchItem.origin
      }
      triggerList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    }
  }
};
</script>

<style scoped>

</style>
