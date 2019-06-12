<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-button class="success" size="mini" @click="handleAdd()">添加</el-button> -->
    <div class="t_s">
      <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline" size="mini" label-width="70px">
      <el-form-item label="客户端平台" prop="applicationName" class="res_wid">
        <el-input v-model="searchItem.applicationName"></el-input>
      </el-form-item>
      <el-form-item label="用户ID" prop="mobile_num" class="res_wid">
        <el-input v-model="searchItem.mobile_num"></el-input>
      </el-form-item>
      <el-form-item label="客户端版本" prop="platform" class="res_wid">
        <el-input v-model="searchItem.platform"></el-input>
      </el-form-item>
      <el-form-item label="引擎版本" prop="cost" class="res_wid1">
        <el-input v-model="searchItem.cost"></el-input>
      </el-form-item>
      <el-form-item label="开发者" prop="mobile_url" class="res_wid1">
        <el-input v-model="searchItem.mobile_url"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="唤醒词类型" prop="vdm" class="res_wid ma15">
        <el-input v-model="searchItem.vdm"></el-input>
      </el-form-item>
      <el-form-item label="唤醒词" prop="was_from" class="res_wid ma15">
        <el-input v-model="searchItem.was_from"></el-input>
      </el-form-item>
      <el-form-item label="数据来源" prop="from" class="res_wid ma15">
        <el-input v-model="searchItem.from"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="refreshTime" class="res_wid1 ma15">
          <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.refreshTime" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="putTime" class="res_wid1 ma15">
          <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.putTime" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-form>
    <div>
      <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
      <el-button size="mini" @click="resetForm('searchItem')">重置</el-button>
    </div>
    </div>
    
      
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
        applicationName:"",
        mobile_num:"",
        platform:"",
        cost:"",
        mobile_url:"",
        vdm:"",
        was_from:"",
        from:"",
        refreshTime:"",
        putTime:""
      },
      columns: [
        {
          prop:"index",
          label: "序号",
          align: "center",
          width: 80,
          hasSort:true
        },
        {
          prop: "applicationName",
          label: "设备类型",
          align: "center",
          hasSort:true
        },
        {
          prop: "mobile_num",
          label: "用户ID",
          align: "center",
          hasSort:true
        },
        {
          prop: "platform",
          label: "客户端版本",
          align: "center",
          width: 110,
          hasSort:true
        },
        {
          prop: "cost",
          label: "引擎版本",
          align: "center",
          hasSort:true
        },
        {
          prop: "mobile_url",
          label: "开发者",
          align: "center",
          hasSort:true
        },
        {
          prop: "vdm",
          label: "唤醒词类型",
          align: "center",
          width:110,
          hasSort:true
        },
        {
          prop: "was_from",
          label: "唤醒词",
          align: "center",
          hasSort:true
        },
        {
          prop: "from",
          label: "数据来源",
          align: "center",
          hasSort:true
        },
        {
          prop: "putTime",
          label: "数据日期",
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
        show: false,
        list: [
          {
            id: "1",
            label: "下载文件",
            show: true,
            plain: true,
            disabled: false,
            method: (index, row) => {
                this.download(index, row);
            }
          }
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
    download(index,row){
      // console.log()
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
.t_s{
  display: flex;
  justify-content: space-evenly;
  padding: 10px 0 15px 0;
  align-items: center;
}
</style>
