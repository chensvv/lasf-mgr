<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>应用搜索</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="关键字" prop="name">
                <el-input v-model="searchItem.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="标准名" prop="stname">
                <el-input v-model="searchItem.stname" clearable></el-input>
            </el-form-item>
            <el-form-item label="起始时间" prop="refreshTime">
                <el-date-picker 
                  type="date" 
                  placeholder="选择日期" 
                  v-model="searchItem.refreshTime" 
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="putTime">
                <el-date-picker 
                  type="date" 
                  placeholder="选择日期" 
                  v-model="searchItem.putTime" 
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="btnLoading">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
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
import {wordList} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      searchItem:{//搜索数据组
        name:"",
        stname:"",
        refreshTime:"",
        putTime:""
      },
      columns: [
        {
          prop: "name",
          label: "原始名",
          align: "center",
          hasSort:true
        },
        {
          prop: "stname",
          label: "标准名",
          align: "center",
          hasSort:true
        },
        {
          prop: "snum",
          label: "别名",
          align: "center",
          hasSort:true
        },
        {
          prop: "source",
          label: "来源",
          align: "center",
          hasSort:true
        },
        {
                prop: "updateTime",
                label: "查询时间",
                align: "center",
                hasSort:true,
                render: (h, params)=>{
                    // console.log(params.row.createTime)
                    var timer = params.row.createTime
                    var date = new Date(timer)
                    return h('span',
                      date.getFullYear()+'-'+
                      checkTime(date.getMonth()+1)+'-'+
                      checkTime(date.getDate())+' '+
                      checkTime(date.getMonth())+':'+
                      checkTime(date.getMinutes())+':'+
                      checkTime(date.getSeconds()))
                }
            },
            {
                prop: "createTime",
                label: "入库时间",
                align: "center",
                hasSort:true,
                render: (h, params)=>{
                    var timer = params.row.createTime
                    var date = new Date(timer)
                    return h('span',
                      date.getFullYear()+'-'+
                      checkTime(date.getMonth()+1)+'-'+
                      checkTime(date.getDate())+' '+
                      checkTime(date.getMonth())+':'+
                      checkTime(date.getMinutes())+':'+
                      checkTime(date.getSeconds()))
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
        width: 120,
        show: false,
        list: [
        ]
      }, // 列操作按钮
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      btnLoading:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList();
    },
    onSubmit(){
      this.btnLoading = true
      this.getList();
      this.btnLoading = false
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
        name:this.searchItem.name,
        stname:this.searchItem.stname,
        startStr:this.searchItem.refreshTime,
        endStr:this.searchItem.putTime
      }
      wordList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    }
  }
};
</script>

<style scoped>
</style>
