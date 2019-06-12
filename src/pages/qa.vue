<template>
  <div class="table">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
      <el-form-item label="问题" prop="ruleDes">
        <el-input v-model="searchItem.ruleDes"></el-input>
      </el-form-item>
      <el-form-item label="所属excel文件" prop="inc">
        <el-input v-model="searchItem.inc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetForm('searchItem')">重置</el-button>
      </el-form-item>
      <el-button class="success" size="mini" @click="buildAIML()">生成AIML</el-button>
      <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
      <el-button icon="el-icon-upload" class="success" size="mini" @click="importExcel()">导入Excel文件</el-button>
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
      <el-form :label-position="'left'" label-width="120px" :rules="editRules" :model="currentItem" ref="currentItem">
        <el-form-item label="问题" prop="ruleDes">
          <el-input type="textarea" v-model="currentItem.ruleDes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="classnames">
          <el-input type="text" v-model="currentItem.classnames" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editHandleClose">取 消</el-button>
        <el-button type="primary" @click="editHandleConfirm('currentItem')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
      <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
        <el-form-item label="问题" prop="ruleDes">
          <el-input type="text" v-model="addList.ruleDes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="classnames">
          <el-input type="textarea" v-model="addList.classnames" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHandleClose">取 消</el-button>
        <el-button type="primary" @click="addHandleConfirm('addList')">确 定</el-button>
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
            <el-button type="primary" @click="postFile()" :disabled="uploading">确 定</el-button>
          </div>
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
        classnames: "",
        ruleDes: "",
      },
      addList: {//添加数据组
        ruleDes: "",
        classnames: ""
      },
      searchItem:{//搜索数据组
        inc:"",
        ruleDes:"",
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
          label: "问题",
          align: "left",
          hasSort:true
        },
        {
          prop: "classnames",
          label: "答案",
          align: "left",
          hasSort:true
        },
        {
          prop: "inc",
          label: "所属excel文件",
          align: "center",
          hasSort:true
        },
        {
          prop: "refreshTime",
          label: "更新/入库时间",
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
        ruleDes:[{ required: true, message: '请输入问题', trigger: 'blur' }],
        classnames:[{ required: true, message: '请输入答案', trigger: 'blur' }]  
      },
      editRules:{
        ruleDes:[{ required: true, message: '请输入问题', trigger: 'blur' }],
        classnames:[{ required: true, message: '请输入答案', trigger: 'blur' }]  
      },
      editVisible: false,
      addVisible: false,
      uploadVisible: false,
      uploading: false,
      file: [],//文件上传
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
        classnames: row.classnames,
        ruleDes: row.ruleDes,
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
      this.uploading = true;
      this.$http.post('/url',headers,fileData)
        // method: "post",
        // url: url + "/upload",    //填写上传的接口
        // headers: headers,
        // data: fileData
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.$refs.upload.clearFiles()
          this.uploadVisible = false;
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
