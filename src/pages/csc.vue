<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
      <el-form-item label="名称" prop="classnames">
        <el-input v-model="searchItem.classnames"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile_num">
        <el-input v-model="searchItem.mobile_num"></el-input>
      </el-form-item>
      <el-form-item label="扩展" prop="kuoz">
        <el-input v-model="searchItem.kuoz"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetForm('searchItem')">重置</el-button>
      </el-form-item>
      <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
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
    <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
      <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
        <el-form-item label="名称" prop="classnames">
          <el-input type="text" v-model="addList.classnames" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile_num">
          <el-input type="text" v-model="addList.mobile_num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="扩展" prop="kuoz">
          <el-input type="text" v-model="addList.kuoz" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addHandleConfirm('addList')">确 定</el-button>
      </span>
    </el-dialog>
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
      addList: {//添加数据组
        classnames:"",
        mobile_num:"",
        kuoz:""
      },
      searchItem:{//搜索数据组
        classnames:"",
        mobile_num:"",
        kuoz:""
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
          prop: "classnames",
          label: "名称",
          align: "center",
          hasSort:true
        },
        {
          prop: "mobile_num",
          label: "电话号码",
          align: "center",
          hasSort:true
        },
        {
          prop: "kuoz",
          label: "扩展",
          align: "center",
          hasSort:true
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
      addRules:{
          classnames:[{ required: true, message: '请输入名称', trigger: 'blur' }],
          mobile_num:[{ required: true, message: '请输入电话号码', trigger: 'blur' }],
          kuoz:[{ required: true, message: '请输入扩展', trigger: 'blur' }],
      },
      addVisible: false,
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
    handleDel(index, row) {
      console.log(row.id);
      console.log(index)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.list.splice(index,1)
        }).catch(() => {
          console.log("no");
        });
    },
    openFun(addList){
      this.$nextTick(() => {
        if(this.$refs[addList]){
          this.$refs[addList].resetFields();
        }
      })
    },
    addHandleClose(){
      this.addVisible = false
    },
    handleAdd(){
      this.addVisible = true
    },
    addHandleConfirm(addList) {
      this.$refs[addList].validate((valid) => {
        if (valid) {
          console.log(this.addList)
          this.addVisible = false;
        } else {
          return false;
        }
      });
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
