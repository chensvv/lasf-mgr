<template>
    <div class="joke">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="内容" prop="joke_con">
                <el-input v-model="searchItem.joke_con"></el-input>
            </el-form-item>
            <el-form-item label="来自于" prop="state">
                <el-select v-model="searchItem.state" placeholder="--">
                    <el-option label="已审核" value="已审核"></el-option>
                    <el-option label="未审核" value="未审核"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
            </el-form-item>
        </el-form>
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

        <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="handleClose" @close="closeFun('currentItem')">
            <el-form :label-position="'left'" label-width="60px" :rules="editRules" :model="currentItem" ref="currentItem">
                <el-form-item label="内容" prop="joke_con">
                    <el-input type="textarea" v-model="currentItem.joke_con" auto-complete="off" rows="5"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleConfirm('currentItem')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import iTable from "@/components/table";
import {formatDate} from '@/utils/format.js'
export default {
    components:{iTable},
  data(){
    return{
      searchItem:{
        joke_con:"",
        state:""
      },
      currentItem:{
          joke_con:""
      },
      list:[],
      columns:[
        {
          prop:"index",
          label: "序号",
          align: "center",
          width: 100,
          hasSort:true
        },{
          prop:"joke_con",
          label: "内容",
          align: "left",
          hasSort:true
        },{
          prop:"state",
          label: "状态",
          width:100,
          align: "center",
          hasSort:true,
          render: (h, params) => {
            return h("span",
            //   {
            //     props: {} // 组件的props
            //   },
              params.row.state === 0 ? "已审核" : "未审核"
            );
          }
        },
        {
          prop:"putTime",
          label: "更新/入库时间",
          align: "center",
          width:150,
          hasSort:true,
          render: (h, params)=>{
            var timer = parseInt(params.row.refreshTime)
              return h('span',
              formatDate(new Date(timer), 'yyyy-MM-dd hh:mm'))
          }
        },
      ],
      options: {
        stripe: false, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
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
        joke_con:[{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      editVisible: false,
      addVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 10,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1     // 总条数
    }
  },
  created(){
    this.getList();
  },
  methods:{
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){
        let s_state = ""
        if(this.searchItem.state == '已审核')
            s_state = 0
        if(this.searchItem.state == '未审核')
            s_state = 1
      console.log(this.searchItem.joke_con,s_state)
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
      // this.getList();
    },
    checkState(index,row){
        if(row.state == 1)
        row.state = 0
    },
    handleClose() {
      this.editVisible = false;
    },
    handleEdit(index, row) {
      console.log(" index:", index);
      console.log(" row:", row);
      this.editVisible = true;
      this.currentItem = {
        joke_con:row.joke_con
      };
    },
    handleConfirm(currentItem) {
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          console.log(this.currentItem)
          this.editVisible = false;
        } else {
          return false;
        }
      });
    },
    handleDel(index, row){
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.list.splice(index,1)
        }).catch(() => {
            console.log("no");
        });
    }
  }
}
</script>

<style>

</style>
