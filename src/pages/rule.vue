<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
        <el-form-item label="规则名称" prop="ruleDes">
            <el-input v-model="searchItem.ruleDes"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('searchItem')">重置</el-button>
        </el-form-item>
        <el-button class="success" size="mini" @click="buildAIML()">生成AIML</el-button>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="editHandleClose" @close="closeFun('currentItem')">
        <el-form :label-position="'left'" label-width="80px" :rules="editRules" :model="currentItem" ref="currentItem">
            <el-form-item label="规则名称" prop="ruleDes">
                <el-input type="text" v-model="currentItem.ruleDes" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="sougou" prop="sougou">
                <el-input type="text" v-model="currentItem.sougou" auto-complete="off"></el-input>
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
            <el-button type="primary" @click="editHandleConfirm('currentItem')">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="80px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="规则名称" prop="ruleDes">
                    <el-input type="text" v-model="addList.ruleDes" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="sougou" prop="sougou">
                    <el-input type="text" v-model="addList.sougou" auto-complete="off"></el-input>
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
      currentItem: {//修改数据组
        ruleDes: "",
        sougou: "",
        duer:"",
        wenwen:"",
        naturali:""
      },
      addList: {//添加数据组
        ruleDes: "",
        sougou: "",
        duer:"",
        wenwen:"",
        naturali:""
      },
      searchItem:{//搜索数据组
        ruleDes:""
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
          prop: "ruleDes",
          label: "规则名称",
          align: "center",
          hasSort:true
        },
        {
          prop: "classnames",
          label: "规则配置",
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
        ruleDes:[{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        sougou:[{ required: true, message: '请输入sougou引擎优先级', trigger: 'blur' }],
        duer:[{ required: true, message: '请输入duer引擎优先级', trigger: 'blur' }],
        wenwen:[{ required: true, message: '请输入wenwen引擎优先级', trigger: 'blur' }],
        naturali:[{ required: true, message: '请输入naturali引擎优先级', trigger: 'blur' }]  
      },
      editRules:{
        ruleDes:[{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        sougou:[{ required: true, message: '请输入sougou引擎优先级', trigger: 'blur' }],
        duer:[{ required: true, message: '请输入duer引擎优先级', trigger: 'blur' }],
        wenwen:[{ required: true, message: '请输入wenwen引擎优先级', trigger: 'blur' }],
        naturali:[{ required: true, message: '请输入naturali引擎优先级', trigger: 'blur' }]  
      },
      editVisible: false,
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
    handleEdit(index, row) {
      console.log(index, row);
      this.editVisible = true;
      this.currentItem = {
        ruleDes: row.ruleDes,
        sougou: row.sougou,
        duer: row.duer,
        wenwen: row.sougou,
        naturali: row.naturali
      };
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
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          console.log(this.currentItem)
          this.editVisible = false;
        } else {
          return false;
        }
      });
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
