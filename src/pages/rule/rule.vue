<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>规则定义</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
        <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="searchItem.ruleName" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
            <el-button @click="resetForm('searchItem')">重置</el-button>
        </el-form-item>
        <el-button class="success" size="mini" @click="buildAIML()" :loading="AIMLBtnLoading">生成AIML</el-button>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="editHandleClose" @close="closeFun('currentItem')">
        <el-form :label-position="'left'" label-width="80px" :rules="editRules" :model="currentItem" ref="currentItem">
            <el-form-item label="规则名称" prop="ruleName">
                <el-input type="text" v-model="currentItem.ruleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="sogou" prop="sogou">
                <el-input type="text" v-model="currentItem.sogou" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="duer" prop="duer">
                <el-input type="text" v-model="currentItem.duer" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="wenwen" prop="wenwen">
                <el-input type="text" v-model="currentItem.wenwen" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="naturali" prop="naturali">
                <el-input type="text" v-model="currentItem.naturali" auto-complete="off"></el-input>
            </el-form-item>
            <div style="font-size:12px; padding-left:80px">
                0:代表不使用此引擎. <br>
                2~4:可以使用，但需要等待其他优先级更高的引擎，相同优先级的不需要等待.<br>
                7：	优先 ，可以直接使用，不必等待其他引擎
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editHandleClose">取 消</el-button>
            <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="80px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="规则名称" prop="ruleName">
                    <el-input type="text" v-model="addList.ruleName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="sogou" prop="sogou">
                    <el-input type="text" v-model="addList.sogou" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="duer" prop="duer">
                    <el-input type="text" v-model="addList.duer" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="wenwen" prop="wenwen">
                    <el-input type="text" v-model="addList.wenwen" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="naturali" prop="naturali">
                    <el-input type="text" v-model="addList.naturali" auto-complete="off"></el-input>
                </el-form-item>
                <div style="font-size:12px; padding-left:80px">
                    0:代表不使用此引擎. <br>
                    2~4:可以使用，但需要等待其他优先级更高的引擎，相同优先级的不需要等待.<br>
                    7：	优先 ，可以直接使用，不必等待其他引擎
                </div>
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
import {ruleList, ruleAdd, ruleUpd, ruleDel, rulePub} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      currentItem: {//修改数据组
        id:"",
        ruleName: "",
        sogou: "",
        duer:"",
        wenwen:"",
        naturali:""
      },
      addList: {//添加数据组
        ruleName: "",
        sogou: "",
        duer:"",
        wenwen:"",
        naturali:""
      },
      searchItem:{//搜索数据组
        ruleName:""
      },
      columns: [
        {
          prop: "ruleName",
          label: "规则名称",
          align: "center",
          hasSort:true
        },
        {
          prop: "ruleResult",
          label: "规则配置",
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
        width: 150,
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
        ruleName:[{ required: true, message: '请输入规则名称', trigger: 'change' }],
        sogou:[{ required: true, message: '请输入sogou引擎优先级', trigger: 'change' }],
        duer:[{ required: true, message: '请输入duer引擎优先级', trigger: 'change' }],
        wenwen:[{ required: true, message: '请输入wenwen引擎优先级', trigger: 'change' }],
        naturali:[{ required: true, message: '请输入naturali引擎优先级', trigger: 'change' }]  
      },
      editRules:{
        ruleName:[{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        sogou:[{ required: true, message: '请输入sogou引擎优先级', trigger: 'blur' }],
        duer:[{ required: true, message: '请输入duer引擎优先级', trigger: 'blur' }],
        wenwen:[{ required: true, message: '请输入wenwen引擎优先级', trigger: 'blur' }],
        naturali:[{ required: true, message: '请输入naturali引擎优先级', trigger: 'blur' }]  
      },
      editVisible: false,
      addVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      seaBtnLoading:false,
      addBtnLoading:false,
      editBtnLoading:false,
      AIMLBtnLoading:false
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
      let updData = JSON.parse(row.ruleResult);
      this.currentItem = {
        id:row.id,
        ruleName: row.ruleName,
        sogou: updData.sogou,
        duer: updData.duer,
        wenwen: updData.wenwen,
        naturali: updData.naturali
      };
      this.editVisible = true
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
          ruleDel(delParams).then(res=>{
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
        ruleName:this.currentItem.ruleName,
        sogou:this.currentItem.sogou,
        wenwen:this.currentItem.wenwen,
        duer:this.currentItem.duer,
        naturali:this.currentItem.naturali
      }
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          this.editBtnLoading = true
          ruleUpd(updParams).then(res=>{
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
    handleAdd(){
      this.addVisible = true
    },
    addHandleConfirm(addList) {
      let addParams = {
        ruleName:this.addList.ruleName,
        sogou:this.addList.sogou,
        wenwen:this.addList.wenwen,
        duer:this.addList.duer,
        naturali:this.addList.naturali
      }
      this.$refs[addList].validate((valid) => {
        if (valid) {
          this.addBtnLoading = true
          ruleAdd(addParams).then(res=>{
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
    buildAIML(){
      this.AIMLBtnLoading = true
      setTimeout(()=>{
          this.AIMLBtnLoading = false
      },2000)
    },
    getList() {
      let params = {
        pgstr:this.pageSize,
        pcstr:this.currentPage,
        condition:this.searchItem.ruleName
      }
      ruleList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    }
  }
};
</script>

<style scoped>
</style>
