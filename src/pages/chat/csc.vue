<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>闲聊数据</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchItem.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="tel">
        <el-input v-model="searchItem.tel" clearable></el-input>
      </el-form-item>
      <el-form-item label="扩展" prop="exts">
        <el-input v-model="searchItem.exts" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
        <el-button @click="resetForm('searchItem')">重置</el-button>
      </el-form-item>
      <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
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
    <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
      <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model="addList.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input type="text" v-model="addList.tel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="扩展" prop="exts">
          <el-input type="text" v-model="addList.exts" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addHandleConfirm('addList')" :loading="addBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import iTable from "@/components/table";
import {cscList, cscAdd, cscDel} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      addList: {//添加数据组
        name:"",
        tel:"",
        exts:""
      },
      searchItem:{//搜索数据组
        name:"",
        tel:"",
        exts:""
      },
      columns: [
        {
          prop: "name",
          label: "名称",
          align: "center",
          hasSort:true
        },
        {
          prop: "tels",
          label: "电话号码",
          align: "center",
          hasSort:true
        },
        {
          prop: "exts",
          label: "扩展",
          align: "center",
          hasSort:true
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
          name:[{ required: true, message: '请输入名称', trigger: 'change' }],
          tel:[{ required: true, message: '请输入电话号码', trigger: 'change' }],
          exts:[{ required: true, message: '请输入扩展', trigger: 'change' }],
      },
      addVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      seaBtnLoading:false,
      addBtnLoading:false
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
      this.seaBtnLoading = true
      this.getList();
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
    handleDel(index, row) {
      let delParams = {
        id:row.id
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          cscDel(delParams).then(res=>{
            if(res.data.code == 200){
                  this.$message({
                      message:'删除成功',
                      type:"success",
                      duration:1000
                  });
                  this.getList();
              }else{
                  this.$message({
                      message:res.data.errorMessage,
                      type:"error",
                      duration:1000
                  });
              }
          })
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
      let addParams = {
        name:this.addList.name,
        exts:this.addList.exts,
        tels:this.addList.tel
      }
      this.$refs[addList].validate((valid) => {
        if (valid) {
          this.addBtnLoading = true
          cscAdd(addParams).then(res=>{
            if(res.data.code == 200){
                this.$message({
                    message:'添加成功',
                    type:"success",
                    duration:1000
                });
                this.getList()
                this.addBtnLoading = false
                this.addVisible = false
            }else{
                this.addBtnLoading = false
                this.$message({
                    message:res.data.errorMessage,
                    type:"error",
                    duration:1000
                });
            }
          })
        } else {
          return false;
        }
      });
    },
    getList() {
      let params = {
        pgstr:this.currentPage,
        pcstr:this.pageSize,
        name:this.searchItem.name,
        exts:this.searchItem.exts,
        tel:this.searchItem.tel
      }
      cscList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    }
  }
};
</script>

<style scoped>
</style>
