<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
      <el-form-item label="关键字" prop="inc">
        <el-input v-model="searchItem.inc"></el-input>
      </el-form-item>
      <el-form-item label="标准名" prop="inc">
        <el-input v-model="searchItem.inc"></el-input>
      </el-form-item>
      <el-form-item label="起始时间" prop="refreshTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.refreshTime" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="putTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.putTime" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetForm('searchItem')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-box">
      <i-table :list="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" :options="options" :columns="columns" :operates="operates"></i-table>
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
import {formatDate} from '@/utils/format.js'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      searchItem:{//搜索数据组
        inc:"",
        refreshTime:"",
        putTime:""
      },
      columns: [
        {
          prop:"index",
          label: "序号",
          align: "center",
          width: 100,
          hasSort:true
        },
        {
          prop: "inc",
          label: "原始名",
          align: "center",
          hasSort:true
        },
        {
          prop: "inc",
          label: "标准名",
          align: "center",
          hasSort:true
        },
        {
          prop: "inc",
          label: "别名",
          align: "center",
          hasSort:true
        },
        {
          prop: "was_from",
          label: "来源",
          align: "center",
          hasSort:true
        },
        {
          prop: "refreshTime",
          label: "查询时间",
          align: "center",
          hasSort:true,
          render: (h, params)=>{
            var timer = parseInt(params.row.refreshTime)
              return h('span',
              formatDate(new Date(timer), 'yyyy-MM-dd hh:mm'))
          }
        },
        {
          prop: "putTime",
          label: "入库时间",
          align: "center",
          hasSort:true,
          render: (h, params)=>{
            var timer = parseInt(params.row.refreshTime)
              return h('span',
              formatDate(new Date(timer), 'yyyy-MM-dd hh:mm'))
          }
        }
      ],
      options: {
        stripe: false, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        border:false     //是否显示纵向边框
      },
      operates: {
        width: 120,
        show: false,
        list: [
        ]
      }, // 列操作按钮
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 10,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1     // 总条数
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){
      console.log(this.searchItem)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`);
      // this.getList();
    },
    getList() {
      this.$http.get("/api/data").then(res => {
        this.list = res.data;
        res.data.forEach(item => {
          item.index = item.id % this.pageSize;
          if(item.index == 0){
            item.index = this.pageSize
          }
        });
        this.totalCount = this.list.length
        this.options.loading = false;
      });
    }
  }
};
</script>

<style scoped>
</style>
