<template>
    <div class="joke">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>应用搜索</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline cache" size="mini">
            <el-form-item label="名字" prop="name">
                <el-input v-model="searchItem.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-input v-model="searchItem.type" clearable></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="cn">
                <el-input v-model="searchItem.cn" clearable></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="refreshTime" class="width140">
                <el-date-picker 
                    type="date" 
                    placeholder="选择日期" 
                    v-model="searchItem.refreshTime" 
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="putTime" class="width140">
                <el-date-picker 
                    type="date" 
                    placeholder="选择日期" 
                    v-model="searchItem.putTime" 
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" size="mini" :loading="btnLoading">查询</el-button>
                <el-button @click="resetForm('searchItem')" size="mini">重置</el-button>
            </el-form-item>
            <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
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
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="应用名" prop="name">
                <el-input type="text" v-model="addList.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="别名" prop="alias">
                <el-input type="text" v-model="addList.alias" auto-complete="off"></el-input>
                <span style="font-size:12px;">别名对应的原始名—只对别名有效</span>
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
import {cacheList, cacheDel, cacheAdd} from '@/config/api'
export default {
    components:{iTable},
    data(){
        return{
            searchItem:{
                name:"",
                type:"",
                cn:"",
                refreshTime:"",
                putTime:""
            },
            addList: {//添加数据组
                name:"",
                alias:""
            },
            list:[],
            columns:[
                {
                    prop:"name",
                    label: "名字",
                    align: "center",
                    hasSort:true
                },{
                    prop:"pinyin",
                    label: "拼音",
                    align: "center",
                    hasSort:true
                },{
                    prop:"atype",
                    label: "类型",
                    align: "center",
                    hasSort:true
                },{
                    prop:"cname",
                    label: "类别",
                    align: "center",
                    hasSort:true
                },{
                    prop:"isAlias",
                    label: "是否别名",
                    align: "center",
                    hasSort:true,
                },{
                    prop:"sname",
                    label: "原名",
                    align: "center",
                    hasSort:true
                },{
                    prop:"isIndex",
                    label: "是否索引",
                    align: "center",
                    hasSort:true,
                },{
                    prop:"upTime",
                    label: "更新时间",
                    align: "center",
                    hasSort:true,
                    render: (h, params)=>{
                    // console.log(params.row.createTime)
                    var timer = params.row.upTime
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
                show: false,
                list: [
                    {
                        id: "1",
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
                name:[{ required: true, message: '应用名', trigger: 'change' }],
                alias:[{ required: true, message: '', trigger: 'change' }],
            },
            // 分页
            currentPage: 1, //默认显示第几页
            pageSize: 10,   //默认每页条数
            pageSizes:[10, 20, 30],
            totalCount:1,     // 总条数
            btnLoading:false,
            addVisible:false,
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
                startStr:this.searchItem.refreshTime,
                endStr:this.searchItem.putTime,
                name:this.searchItem.name,
                type:this.searchItem.type,
                cn:this.searchItem.cn
            }
            cacheList(params).then(res => {
                this.list = res.data.data;
                this.totalCount = res.data.count
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList();
        },
        onSubmit(){
            this.btnLoading = true
            this.getList()
            this.btnLoading = false
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
        handleDel(index, row){
            let delParams = {
                name:row.name
            }
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                cacheDel(delParams).then(res=>{
                    if(res.data.code == 200){
                        this.$message({
                                message:'删除成功',
                                type:"success",
                                duration:1000
                            });
                            this.getList();
                    }else{
                        this.$message.error('错误')
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
    addHandleClose(){
        this.addVisible = false
    },
    handleAdd(){
        this.addVisible = true
    },
    addHandleConfirm(addList) {
        let addParams = {
            name:this.addList.name,
            alias:this.addList.alias
        }
        this.$refs[addList].validate((valid) => {
            if (valid) {
                this.addBtnLoading = true
                cacheAdd(addParams).then(res => {
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
}
}
</script>

<style scoped>

</style>
