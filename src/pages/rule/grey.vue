<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规则定义</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
      <el-form-item label="机型名称" prop="name">
        <el-input v-model="searchItem.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="机型" prop="inc">
        <el-input v-model="searchItem.inc" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
        <el-button @click="resetForm('searchItem')">重置</el-button>
      </el-form-item>
      <el-button class="success" size="mini"  @click="handleAdd()">添加</el-button>
      <router-link :to="{ path: '/home/devlist'}">
          <el-button class="success" size="mini">机型列表</el-button>
      </router-link>
      
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

    <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="editHandleClose" @close="closeFun('currentItem')">
      <el-form :label-position="'left'" label-width="120px" :rules="editRules" :model="currentItem" ref="currentItem">
        <el-form-item label="功能名称" prop="name">
          <el-input type="textarea" v-model="currentItem.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能代码" prop="code">
          <el-input type="textarea" v-model="currentItem.code" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editHandleClose">取 消</el-button>
        <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
      <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
        <el-form-item label="功能名称" prop="name">
          <el-input type="textarea" v-model="addList.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能代码" prop="code">
          <el-input type="textarea" v-model="addList.code" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addHandleConfirm('addList')" :loading="addBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="配置" :visible.sync="optVisible" width="300" :before-close="optHandleClose" @open="optShow()">
      <el-form :label-position="'left'" label-width="100px">
        <el-form-item label="功能名称">
          <el-input type="text" v-model="optList.name" auto-complete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="功能代码">
          <el-input type="text" v-model="optList.code" auto-complete="off" readonly></el-input>
          <el-table :show-header="false" :data="optList.pageDate" border ref="table" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
              prop="name">
            </el-table-column>
            <el-table-column
              prop="code">
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="optVisible = false">取 消</el-button>
        <el-button type="primary" @click="optHandleConfirm" :loading="optBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import iTable from "@/components/table";
import {checkTime} from '@/utils/timer.js'
import {greyList, greyAddUpd, greyDel, greyOpt, greyOptSave} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      currentItem: {//修改数据组
        id:"",
        code: "",
        name: "",
      },
      addList: {//添加数据组
        code: "",
        name: "",
      },
      searchItem:{//搜索数据组
        inc:"",
        name:"",
      },
      optList:{
          code:"",
          name:"",
          pageDate:[]
      },
      multipleSelection:[],
      selectId:"",
      columns: [
        {
          prop: "name",
          label: "功能名称",
          align: "center",
          hasSort:true
        },
        {
          prop: "code",
          label: "功能代码",
          align: "center",
          hasSort:true
        },
        {
          prop: "it",
          label: "更新/入库时间",
          align: "center",
          hasSort:true,
          render: (h, params)=>{
              var timer = params.row.it
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
        width:200,
        show: false,
        list: [
          {
            id: "1",
            label: "编辑",
            show: true,
            plain: true,
            disabled: false,
            method: (index, row) => {
              this.handleEdit(index, row);
            }
          },
          {
            id: "2",
            label: "删除",
            show: true,
            type:"danger",
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleDel(index, row);
            }
          },
          {
            id: "3",
            label: "配置",
            show: true,
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleOpt(index, row);
            }
          }
        ]
      }, // 列操作按钮
      addRules:{
        name:[{ required: true, message: '请输入功能名称', trigger: 'change' }],
        code:[{ required: true, message: '请输入功能代码', trigger: 'change' }]  
      },
      editRules:{
        name:[{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        code:[{ required: true, message: '请输入功能代码', trigger: 'blur' }]  
      },
      editVisible: false,
      addVisible: false,
      optVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      seaBtnLoading:false,
      addBtnLoading:false,
      editBtnLoading:false,
      optBtnLoading:false,
      
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
    handleEdit(index, row) {
      console.log(index, row);
      this.editVisible = true;
      this.currentItem = {
        id:row.id,
        code: row.code,
        name: row.name,
      };
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
          greyDel(delParams).then(res=>{
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
    closeFun(currentItem){
      this.$nextTick(() => {
        if(this.$refs[currentItem]){
          this.$refs[currentItem].clearValidate();
        }
      })
    },
    editHandleClose() {
      this.editVisible = false;
      
    },
    addHandleClose(){
      this.addVisible = false
    },
    editHandleConfirm(currentItem) {
      let updParams = {
        id:this.currentItem.id,
        n:this.currentItem.name,
        c:this.currentItem.code
      }
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          this.editBtnLoading = true
          greyAddUpd(updParams).then(res=>{
            if(res.data.code == 200){
                this.$message({
                    message:'修改成功',
                    type:"success",
                    duration:1000
                });
                this.getList()
                this.editBtnLoading = false
                this.editVisible = false
            }else{
                this.editBtnLoading = false
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
    handleAdd(){
      this.addVisible = true
    },
    addHandleConfirm(addList) {
      let addParams = {
        n:this.addList.name,
        c:this.addList.code
      }
      this.$refs[addList].validate((valid) => {
        if (valid) {
          this.addBtnLoading = true
          greyAddUpd(addParams).then(res=>{
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
    optShow(){
      this.$nextTick(() => {
        this.optList.pageDate.forEach(item => {
          if (item.check === 'checked') {
            this.$refs.table.toggleRowSelection(item, true)
          }
        })
      })
    },
    handleOpt(index,row){
    this.selectId = row.id
    let optId = {
      id:row.id
    }
    greyOpt(optId).then(res=>{
      this.optList.name = res.data.devName
      this.optList.code = res.data.devCode
      this.optList.pageDate = res.data.page.data
      this.optShow()
    })
    this.optVisible = true
    },
    handleSelectionChange(val) {
      val = val.map(item=>item.code)
      this.multipleSelection = val
    },
    optHandleClose(){
      this.optVisible = false
    },
    optHandleConfirm(){
      this.optBtnLoading = true
      let optParams = {
        id:this.selectId,
        chk:this.multipleSelection
      }
      greyOptSave(optParams).then(res=>{
        if(res.data.code == 200){
            this.$message({
                message:'配置成功',
                type:"success",
                duration:1000
            });
            this.getList()
            this.optBtnLoading = false
            this.optVisible = false
        }else{
            this.optBtnLoading = false
            this.$message({
                message:res.data.errorMessage,
                type:"error",
                duration:1000
            });
        }
      })
    },
    getList() {
      let params = {
        pgstr:this.currentPage,
        pcstr:this.pageSize,
        n:this.searchItem.name,
        c:this.searchItem.code
      }
      greyList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    }
  }
};
</script>

<style scoped>
</style>
