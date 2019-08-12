<template>
    <div class="joke">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>闲聊数据</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="内容" prop="con">
                <el-input v-model="searchItem.con" clearable></el-input>
            </el-form-item>
            <el-form-item label="审核状态" prop="state">
                <el-select v-model="searchItem.state" placeholder="--" clearable>
                    <el-option label="已审核" value="1"></el-option>
                    <el-option label="未审核" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
            </el-form-item>
            <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
        </el-form>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="handleClose" @close="closeFun('currentItem')">
            <el-form :label-position="'left'" label-width="60px" :rules="editRules" :model="currentItem" ref="currentItem">
                <el-form-item label="内容" prop="con">
                    <el-input type="textarea" v-model="currentItem.con" auto-complete="off" rows="5"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="edithandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="60px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="内容" prop="con">
                    <el-input type="textarea" v-model="addList.con" auto-complete="off" rows="5"></el-input>
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
import {checkTime} from '@/utils/timer.js'
import {jokeList, jokeAddUpd, jokeDel, jokeVeri} from '@/config/api'
export default {
    components:{iTable},
  data(){
    return{
      searchItem:{
        con:"",
        state:""
      },
      currentItem:{
        id:"",
        con:"",
        url:""
      },
      addList:{
        con:""
      },
      list:[],
      columns:[{
          prop:"con",
          label: "内容",
          align: "left",
          hasSort:true
        },{
          prop:"sta",
          label: "状态",
          width:100,
          align: "center",
          hasSort:true,
          render: (h, params) => {
            return h("span",
            
              params.row.sta == 1 ? "已审核" : "未审核"
            );
          }
        },
        {
          prop:"it",
          label: "更新/入库时间",
          align: "center",
          width:150,
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
        },
      ],
      options: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        border:false     //是否显示纵向边框
      },
      operates: {
        width: 200,
        show: false,
        list: [
            {
            id: "3",
            label: "审核",
            type:"danger",
            show: true,
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.checkState(index, row);
            }
          },
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
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleDel(index, row);
            }
          }
          
        ]
      }, // 列操作按钮
      editRules:{
        con:[{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      addRules:{
        con:[{ required: true, message: '请输入内容', trigger: 'change' }],
      },
      editVisible: false,
      addVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      seaBtnLoading:false,
      editBtnLoading:false,
      addBtnLoading:false
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList() {
      let params = {
        pgstr:this.currentPage,
        pcstr:this.pageSize,
        q:this.searchItem.con,
        ex:this.searchItem.state
      }
      jokeList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getList()
    },
    onSubmit(){
      this.seaBtnLoading = true
      this.getList();
      this.seaBtnLoading = false
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
    checkState(index,row){
      let veriParams = {
        id:row.id
      }
      jokeVeri(veriParams).then(res=>{
        if(res.data.code == 200){
            this.$message({
                message:'审核成功',
                type:"success",
                duration:1000
            });
            this.getList()
            this.editBtnLoading = false
            this.editVisible = false
        }else{
            this.$message({
                message:res.data.errorMessage,
                type:"error",
                duration:1000
            });
        }
      })
    },
    handleClose() {
      this.editVisible = false;
    },
    handleEdit(index, row) {
      this.editVisible = true;
      this.currentItem = {
        id:row.id,
        con:row.con
      };
    },
    edithandleConfirm(currentItem) {
      let updParams = {
        con:this.currentItem.con,
        url:this.currentItem.url,
        id:this.currentItem.id
      }
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          jokeAddUpd(updParams).then(res=>{
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
    handleDel(index, row){
      let delParams = {
        id:row.id
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(() => {
          jokeDel(delParams).then(res=>{
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
    addHandleClose(){
        this.addVisible = false
    },
    handleAdd(){
        this.addVisible = true
    },
    addHandleConfirm(addList) {
      let addParams={
          con:this.addList.con,
          url:''
      }
      this.$refs[addList].validate((valid) => {
          if (valid) {
            this.addBtnLoading = true
            jokeAddUpd(addParams).then(res=>{
              if(res.data.code == 200){
                  this.$message({
                    message:'添加成功',
                    type:"success",
                    duration:1000
                  });
                  this.getList();
                  this.addVisible = false
                  this.addBtnLoading = false
              }else{
                  this.$message({
                      message:res.data.errorMessage,
                      type:"error",
                      duration:1000
                  });
                  this.addBtnLoading = false
              } 
            })
          } else {
              return false;
          }
      });
    },
  }
}
</script>

<style>

</style>
