<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/skill'}">应用列表</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <div class="d_t">
                <span class="d_title">{{skillDetail.appName}}  
                    </span><span>({{skillDetail.appType}})</span>
            </div>
            <el-form-item label="应用名称" prop="functionName">
                <el-input v-model="searchItem.functionName" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
            </el-form-item>
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
            <el-form :label-position="'left'" label-width="120px" :rules="editRules" :model="currentItem" ref="currentItem">
                <el-form-item label="技能描述" prop="functionName">
                <el-input type="text" v-model="currentItem.functionName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="技能描述" prop="skillName">
                <el-input type="text" v-model="addList.skillName" auto-complete="off"></el-input>
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
import {skillInfo, skillDetailAdd, skillDetailDel, skillDetailUpd} from '@/config/api'
export default {
    name: "applicationlist",
    components: { iTable },
    data() {
        return {
            appId:"",
            list: [],
            skillDetail:[],
            currentItem: {//修改数据组
                functionId:"",
                functionName:""
            },
            addList: {//添加数据组
                skillName:""
            },
            searchItem:{//搜索数据组
                functionName:"",
            },
            columns: [
                {
                    prop: "functionName",
                    label: "技能描述",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "说法数量",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "答案数量",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "调用次数",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "用户数",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "失败数",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "displayUpdateTime",
                    label: "修改时间",
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
                        label: "详情",
                        show: true,
                        plain: false,
                        disabled: false,
                        method: (index, row) => {
                        this.handleInfo(index, row);
                        }
                    }
                ]
            }, // 列操作按钮
            addRules:{
                skillName:[{ required: true, message: '请输入技能描述', trigger: 'change' }]
            },
            editRules:{
                functionName:[{ required: true, message: '请输入技能描述', trigger: 'blur' }]
            },
            editVisible: false,
            addVisible: false,
            // 分页
            currentPage: 1, //默认显示第几页
            pageSize: 10,   //默认每页条数
            pageSizes:[10, 20, 30],
            totalCount:1,     // 总条数
            seaBtnLoading:false,
            addBtnLoading:false,
            editBtnLoading:false
            
        };
    },
    created() {
        this.appId = this.$route.query.appId
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
            this.editVisible = true;
            this.currentItem = {
                functionId:row.id,
                functionName: row.functionName,
            };
        },
        handleDel(index, row) {
            console.log(row)
            let delParams = {
                functionId:row.id
            }
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                skillDetailDel(delParams).then(res=>{
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
            this.addList = {}
            this.addVisible = false
        },
        editHandleConfirm(currentItem) {
            let updParams = {
                functionId:this.currentItem.functionId,
                functionName:this.currentItem.functionName
            }
            this.$refs[currentItem].validate((valid) => {
                if (valid) {
                    this.editBtnLoading = true
                    skillDetailUpd(updParams).then(res=>{
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
            let addParams={
                id:this.appId,
                appName:this.addList.skillName
            }
            this.$refs[addList].validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true
                    skillDetailAdd(addParams).then(res=>{
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
        getList() {
            let params = {
                id:this.appId
            }
            skillInfo(params).then(res => {
                this.skillDetail = res.data
                this.list = res.data.functions;
                this.totalCount = res.data.count
            });
        },
        handleInfo(index, row) {
            this.$router.push({
                path:'/home/skill/detail/speak',
                query:{
                    functionId:row.id,
                    appId:row.appId
                }
            })
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
