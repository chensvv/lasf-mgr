<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/skill'}">应用列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/skill/detail',query:{functionId:this.functionId, appId:this.appId}}">应用详情</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    
    <el-form :inline="true" class="demo-form-inline" size="mini" style="text-align:right;">
        <div class="d_t">
            <span class="d_title">{{skillDetail.appName}}  >> </span><span>{{skillDetail.functionName}}</span>
        </div>
        <el-form-item>
            <el-button class="success" size="mini" @click="release()" :loading="relBtnLoading">发布</el-button>
            <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
            <router-link :to="{ path: '/home/skill/detail/sersion',query:{functionId:this.functionId, appId:this.appId}}">
                <el-button class="success" size="mini">答案列表</el-button>
            </router-link>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="editHandleClose" @close="closeFun('currentItem')">
        <el-form :label-position="'left'" label-width="80px" :rules="editRules" :model="currentItem" ref="currentItem">
            <el-form-item label="说法" prop="speak">
                <el-input type="text" v-model="currentItem.speak" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="强制匹配" prop="state">
                <el-radio-group v-model="currentItem.state" size="medium">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="添加说法" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="80px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="说法" prop="speak">
                    <el-input type="text" v-model="addList.speak" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="强制匹配" prop="state">
                    <el-radio-group v-model="addList.state" size="medium">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                    </el-radio-group>
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
import {skillInfo, speakList, speakAdd, speakUpd, speakDel} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      appId:"",
      functionId:"",
      skillDetail:{
        appName:"",
        functionName:""
      },
      currentItem: {//修改数据组
        id:"",
        speak: "",
        state:""
      },
      addList: {//添加数据组
        speak:"",
        state:""
      },
      columns: [
        {
          prop: "speak",
          label: "说法",
          align: "center",
          hasSort:true
        },
        {
          prop: "state",
          label: "强制匹配",
          align: "center",
          hasSort:true,
          // render: (h, params) => {
          //   return h("span",
          //     params.row.state === 0 ? "是" : "否"
          //   );
          // }
        },
        {
          prop: "inc",
          label: "调用次数",
          align: "center",
          hasSort:true
        },
        {
            prop: "displayUpdateTime",
            label: "修改时间",
            align: "center"
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
        speak:[{ required: true, message: '请输入说法名称', trigger: 'change' }],
        state:[{ required: true, message: '请选择是否强制匹配', trigger: 'change' }]
      },
      editRules:{
        speak:[{ required: true, message: '请输入说法名称', trigger: 'blur' }],
        state:[{ required: true, message: '请选择是否强制匹配', trigger: 'blur' }]
      },
      editVisible: false,
      addVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      addBtnLoading:false,
      editBtnLoading:false,
      relBtnLoading:false
    };
  },
  created() {
        this.appId = this.$route.query.appId
        this.functionId = this.$route.query.functionId
        this.getList();
  },
  methods: {
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
      this.editVisible = true;
      this.currentItem = {
        id:row.id,
        speak: row.speak,
        state: row.state
      };
    },
    handleDel(index, row) {
      let delParams = {
        functionId:this.functionId,
        speakId:row.id
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          speakDel(delParams).then(res=>{
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
        speakId:this.currentItem.id,
        content:this.currentItem.speak
      }
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          this.editBtnLoading = true
          speakUpd(updParams).then(res=>{
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
        id:this.functionId,
        speak:this.addList.speak
      }
      this.$refs[addList].validate((valid) => {
        if (valid) {
          this.addBtnLoading = true
          speakAdd(addParams).then(res=>{
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
    release(){
      this.relBtnLoading = true
      setTimeout(()=>{
        this.relBtnLoading = false
      },2000)
    },
    getList() {
      let params = {
        appId:this.appId,
        functionId:this.functionId,
        pgstr:this.currentPage,
        pcstr:this.pageSize
      }
      speakList(params).then(res => {
        this.skillDetail.functionName = res.data.lasfControlFunction.functionName
        this.list = res.data.lasfControlSpeakPage.data;
        this.totalCount = res.data.lasfControlSpeakPage.total
      });
      let lastParams = {
          id:this.appId
      }
      skillInfo(lastParams).then(res => {
          this.skillDetail.appName = res.data.appName
      });
    }
  }
};
</script>

<style scoped>
.d_t{
    display: inline-block; 
    float: left; 
    font-size:12px;
}
.d_title{
    font-size: 16px;
}
</style>
