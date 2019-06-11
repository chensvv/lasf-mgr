<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>ALSF KV</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/skill'}">应用列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/skill/detail',query:{index:this.index,d_mint:this.d_mint,d_title:this.d_title,d_url:this.d_url}}">应用详情</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    
    <el-form :inline="true" class="demo-form-inline" size="mini" style="text-align:right;">
        <div class="d_t">
            <span class="d_title">{{d_title}}  </span><span>{{d_info}}</span>
        </div>
        <el-form-item>
            <el-button class="success" size="mini" @click="release()">发布</el-button>
            <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
            <router-link :to="{ path: '/home/skill/detail/speak',query:{index:this.index,d_info:this.d_info,d_mint:this.d_mint,d_title:this.d_title,d_url:this.d_url}}">
                <el-button class="success" size="mini">说法列表</el-button>
            </router-link>
        </el-form-item>
        
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
        <el-form :label-position="'left'" label-width="0px" :rules="editRules" :model="currentItem" ref="currentItem">
            <el-form-item prop="ruleDes">
                <el-input type="text" v-model="currentItem.ruleDes" placeholder="在此处添加说明" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="ser" class="ser_text">
                <el-input type="textarea" v-model="currentItem.ser" placeholder="在此处添加答案" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editHandleClose">取 消</el-button>
            <el-button type="primary" @click="editHandleConfirm('currentItem')">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog title="添加答案" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="0px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item prop="ruleDes">
                    <el-input type="text" v-model="addList.ruleDes" placeholder="在此处添加说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="ser"  class="ser_text">
                    <el-input type="textarea" v-model="addList.ser" placeholder="在此处添加答案" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="addHandleClose">取 消</el-button>
                <el-button type="primary" @click="addHandleConfirm('addList')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="发布策略" :visible.sync="strVisible" width="300" :before-close="strHandleClose">
            <el-form :label-position="'left'" label-width="80px">
                <el-form-item label="软件版本" class="ver_text1">
                    <el-input type="text" v-model="strList.minVer" placeholder="最小版本" auto-complete="off"></el-input> - 
                    <el-input type="text" v-model="strList.maxVer" placeholder="最大版本" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="型号"  class="ver_text2">
                    <el-input type="text" v-model="strList.serIn" placeholder="in" auto-complete="off"></el-input>
                    <el-input type="text" v-model="strList.serCon" placeholder="contains" auto-complete="off"></el-input>
                    <el-input type="text" v-model="strList.serNot" placeholder="not" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="strHandleClose">取 消</el-button>
                <el-button type="primary" @click="strHandleConfirm">确 定</el-button>
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
      d_title:"",
      d_info:"",
      d_url:"",
      d_mint:"",
      index:"",
      currentItem: {//修改数据组
        ruleDes: "",
        state:""
      },
      addList: {//添加数据组
        ruleDes:"",
        ser:""
      },
      strList:{},
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
          label: "说明",
          align: "center",
          hasSort:true
        },
        {
          prop: "state",
          label: "启用",
          align: "center",
          hasSort:true,
          render: (h, params) => {
            return h("span",
            //   {
            //     props: {} // 组件的props
            //   },
              params.row.state === 0 ? "是" : "否"
            );
          }
        },
        {
          prop: "inc",
          label: "调用次数",
          align: "center",
          hasSort:true
        },
        {
            prop: "refreshTime",
            label: "修改时间",
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
        width: 200,
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
          },
          {
            id: "3",
            label: "策略",
            show: true,
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleStr(index, row);
            }
          }
        ]
      }, // 列操作按钮
      addRules:{
        ruleDes: [{ required: true, message: '请输入答案说明', trigger: 'blur' }],
        ser: [{ required: true, message: '请输入答案', trigger: 'blur' }],
      },
      editRules:{
        ruleDes: [{ required: true, message: '请输入答案说明', trigger: 'blur' }],
        ser: [{ required: true, message: '请输入答案', trigger: 'blur' }],
      },
      editVisible: false,
      addVisible: false,
      strVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 10,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1     // 总条数
    };
  },
  created() {
        this.d_title = this.$route.query.d_title
        this.d_info = this.$route.query.d_info
        this.d_url = this.$route.query.d_url
        this.d_mint = this.$route.query.d_mint
        this.index = this.$route.query.index
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
      // this.getList();
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.editVisible = true;
      this.currentItem = {
        ruleDes: row.ruleDes,
        ser: row.ser
      };
    },
    handleStr(){
        this.strVisible = true
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
    strHandleClose(){
        this.strList = {}
        this.strVisible = false
    },
    strHandleConfirm(){
        console.log(this.strList)
        this.strList = {}
        this.strVisible = false
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
.d_t{
    display: inline-block; 
    float: left; 
    font-size:12px;
}
.d_title{
    font-size: 16px;
}
</style>
