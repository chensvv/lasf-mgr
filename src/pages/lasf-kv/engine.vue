<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search_box" size="mini" label-width="90px">
            <el-form-item label="更新时间：">
                <span>{{list[1]}}</span>
            </el-form-item>
            <el-form-item>
                <el-button class="success" size="mini" @click="handleEdit()">修改</el-button>
            </el-form-item>
        </el-form>
        <div class="table-box">
            <el-input type="textarea" v-model="list[0]" auto-complete="off" readonly class="textarea"></el-input>
        </div>
        <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="editHandleClose" @open="closeFun('currentItem')">
            <el-form :label-position="'left'" label-width="80px" :rules="editRules" :model="currentItem" ref="currentItem">
                <el-form-item label="修改密码" prop="asrpsd">
                    <el-input type="text" v-model="currentItem.asrpsd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="" class="edit_text" prop="asr">
                    <el-input type="textarea" v-model="currentItem.asr" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import iTable from "@/components/table";
import {checkTime} from '@/utils/timer.js'
import {engineView, engineUpd} from '@/config/api'
export default {
  name: "applicationlist",
  components: { iTable },
  data() {
    return {
      list: [],
      currentItem: {//修改数据组
        asrpsd:"",
        asr: "",
      },
      editRules:{
        asrpsd:[{ required: true, message: '请输入修改密码', trigger: 'blur' }],
        asr:[{ required: true, message: '请输入引擎规则', trigger: 'blur' }]
      },
      editVisible: false,
      // 分页
      currentPage: 1, //默认显示第几页
      pageSize: 10,   //默认每页条数
      pageSizes:[10, 20, 30],
      totalCount:1,     // 总条数
      editBtnLoading:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleEdit() {
      this.editVisible = true;
      this.currentItem.asr = this.list[0]
    },
    editHandleClose() {
      this.editVisible = false;
      
    },
    editHandleConfirm(currentItem) {
      let updParams = {
        pwd:this.currentItem.asrpsd,
        val:this.currentItem.asr
      }
      console.log(updParams)
      this.$refs[currentItem].validate((valid) => {
        if (valid) {
          this.editBtnLoading = true
          engineUpd(updParams).then(res=>{
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
    closeFun(currentItem){
      this.$nextTick(() => {
        if(this.$refs[currentItem]){
          this.$refs[currentItem].resetFields();
        }
      })
    },
    getList() {
      engineView().then(res => {
        this.list = res.data;
      });
    }
  }
};
</script>

<style scoped>
.search_box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
}
.el-form-item--mini.el-form-item{
    margin-bottom: 0;
}

</style>
