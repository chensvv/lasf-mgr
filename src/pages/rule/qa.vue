<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规则定义</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
      <el-form-item label="问题" prop="question">
        <el-input v-model="searchItem.question" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属excel文件" prop="excel">
        <el-input v-model="searchItem.excel" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
        <el-button @click="resetForm('searchItem')">重置</el-button>
      </el-form-item>
      <el-button class="success" size="mini" @click="buildAIML()" :loading="AIMLBtnLoading">生成AIML</el-button>
      <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
      <el-button icon="el-icon-upload" class="success" size="mini" @click="importExcel()">导入Excel文件</el-button>
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
        <el-form-item label="问题" prop="question">
          <el-input type="textarea" v-model="currentItem.question" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input type="text" v-model="currentItem.answer" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editHandleClose">取 消</el-button>
        <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
      <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
        <el-form-item label="问题" prop="question">
          <el-input type="text" v-model="addList.question" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input type="textarea" v-model="addList.answer" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addHandleConfirm('addList')" :loading="addBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传文件" :visible.sync="uploadVisible" width="200" class="eldialog" :before-close="closeFile">
      <el-form ref="addForm" class="eldialogForm" id="addForm">
            <el-form-item label >
              <el-upload
                class="upload-demo"
                drag
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :limit="1"
                :http-request="uploadFile"
                multiple
                ref="upload"
                action
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">1、只能上传Excel文件，且不超过500kb</div>
                <div class="el-upload__tip" slot="tip">2、由于需要生成AIML，所以excle文件请使用全英文</div>
                <div class="el-upload__tip" slot="tip">3、请编辑excel文件时，‘设置单元格格式’->‘文本’</div>
                <div class="el-upload__tip" slot="tip">4、第一列为‘问题’，第二列为'答案'</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeFile()">取 消</el-button>
            <el-button type="primary" @click="postFile()" :loading="fileBtnLoading">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import iTable from "@/components/table";
import {checkTime} from '@/utils/timer.js'
import {qaList, qaSave, qaDel} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      currentItem: {//修改数据组
        id:"",
        answer: "",
        question: "",
      },
      addList: {//添加数据组
        question: "",
        answer: ""
      },
      searchItem:{//搜索数据组
        excel:"",
        question:"",
      },
      columns: [
        {
          prop: "question",
          label: "问题",
          align: "left",
          hasSort:true
        },
        {
          prop: "answer",
          label: "答案",
          align: "left",
          hasSort:true
        },
        {
          prop: "excel",
          label: "所属excel文件",
          align: "center",
          hasSort:true
        },
        {
          prop: "it",
          label: "更新/入库时间",
          align: "center",
          hasSort:true,
          render: (h, params)=>{
              // console.log(params.row.createTime)
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
        question:[{ required: true, message: '请输入问题', trigger: 'change' }],
        answer:[{ required: true, message: '请输入答案', trigger: 'change' }]  
      },
      editRules:{
        question:[{ required: true, message: '请输入问题', trigger: 'blur' }],
        answer:[{ required: true, message: '请输入答案', trigger: 'blur' }]  
      },
      editVisible: false,
      addVisible: false,
      uploadVisible: false,
      fileBtnLoading: false,
      file: [],//文件上传
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 30,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      seaBtnLoading:false,
      addBtnLoading:false,
      editBtnLoading:false,
      fileBtnLoading:false,
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
      console.log(index, row);
      this.editVisible = true;
      this.currentItem = {
        id:row.id,
        answer: row.answer,
        question: row.question,
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
          qaDel(delParams).then(res=>{
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
        q:this.currentItem.question,
        a:this.currentItem.answer
      }
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          this.editBtnLoading = true
          qaSave(updParams).then(res=>{
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
        q:this.addList.question,
        a:this.addList.answer
      }
      this.$refs[addList].validate((valid) => {
        if (valid) {
          this.addBtnLoading = true
          qaSave(addParams).then(res=>{
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
    importExcel(){
        this.uploadVisible = true
    },
    //上传excel表格
    beforeUpload(file) {
      const isText = file.type === "application/vnd.ms-excel";
      const isTextComputer =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isText && !isTextComputer) {
        this.$message.error("上传文件必须是Excel格式!");
      }
      return isText || isTextComputer;
    },
    // 上传文件个数超过定义的数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    },
    uploadFile(item) {
      this.file = item.file;
    },
    postFile() {
      const fileObj = this.file;
      var fileData = new FormData();
      fileData.append("file", fileObj);
      let headers = {
        "Content-Type": "multipart/form-data"
      };
      this.fileBtnLoading = true;
      this.$http.post('/url',headers,fileData)
        // method: "post",
        // url: url + "/upload",    //填写上传的接口
        // headers: headers,
        // data: fileData
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.$refs.upload.clearFiles()
          setTimeout(()=>{
            this.fileBtnLoading = false;
            this.uploadVisible = false
          },2000)
        } else {
          this.$message.error(res.data.msg);
        }
      });
      setTimeout(function() {
        this.uploadVisible = false;
      }, 1500);
    },
    closeFile() {
        this.$refs.upload.clearFiles()
        this.uploadVisible = false;
    },
    buildAIML(){
      this.AIMLBtnLoading = true
      setTimeout(()=>{
          this.AIMLBtnLoading = false
      },2000)
    },
    getList() {
      let params = {
        pgstr:this.currentPage,
        pcstr:this.pageSize,
        q:this.searchItem.question,
        ex:this.searchItem.excel
      }
      qaList(params).then(res => {
        this.list = res.data.data;
        this.totalCount = res.data.count
      });
    }
  }
};
</script>

<style scoped>
</style>
