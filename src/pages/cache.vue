<template>
    <div class="joke">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
          <el-form-item label="名字" prop="applicationName">
            <el-input v-model="searchItem.applicationName"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="searchItem.type"></el-input>
          </el-form-item>
          <el-form-item label="类别" prop="platform">
            <el-input v-model="searchItem.platform"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="refreshTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.refreshTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="putTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.putTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <span>
            <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            <el-button @click="resetForm('searchItem')" size="mini">重置</el-button>
          </span>
        </el-form>
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
</template>

<script>
import iTable from "@/components/table";
import {formatDate} from '@/utils/format.js'
export default {
    components:{iTable},
  data(){
    return{
      searchItem:{
        applicationName:"",
        type:"",
        platform:"",
        refreshTime:"",
        putTime:""
      },
      list:[],
      columns:[
        {
          prop:"index",
          label: "序号",
          align: "center",
          width: 100,
          hasSort:true
        },{
          prop:"applicationName",
          label: "名字",
          align: "center",
          hasSort:true
        },{
          prop:"platform",
          label: "拼音",
          align: "center",
          hasSort:true
        },{
          prop:"type",
          label: "类型",
          align: "center",
          hasSort:true
        },{
          prop:"platform",
          label: "类别",
          align: "center",
          hasSort:true
        },{
          prop:"state",
          label: "是否别名",
          align: "center",
          hasSort:true,
          render: (h, params) => {
            return h("span",
            //   {
            //     props: {} // 组件的props
            //   },
              params.row.state === 0 ? "是" : "否"
            );
          }
        },{
          prop:"inc",
          label: "原名",
          align: "center",
          hasSort:true
        },{
          prop:"state",
          label: "是否索引",
          align: "center",
          hasSort:true,
          render: (h, params) => {
            return h("span",
            //   {
            //     props: {} // 组件的props
            //   },
              params.row.state === 0 ? "是" : "否"
            );
          }
        },{
          prop:"putTime",
          label: "更新时间",
          align: "center",
          hasSort:true,
          render: (h, params)=>{
            var timer = parseInt(params.row.refreshTime)
              return h('span',
              formatDate(new Date(timer), 'yyyy-MM-dd hh:mm'))
          }
        },
      ],
      options: {
        stripe: false, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        border:false     //是否显示纵向边框
      },
      operates: {
        show: false,
        list: [
          {
            id: "1",
            label: "删除",
            type:"danger",
            show: true,
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleDel(index, row);
            }
          }
          
        ]
      }, // 列操作按钮
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 10,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1     // 总条数
    }
  },
  created(){
    this.getList();
  },
  methods:{
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
    },
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
    handleDel(index, row){
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.list.splice(index,1)
        }).catch(() => {
            console.log("no");
        });
    }
  }
}
</script>

<style>

</style>
