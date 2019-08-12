<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="应用名称" prop="appName">
                <el-input v-model="searchItem.appName"></el-input>
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
                <el-form-item label="应用名称" prop="appName">
                <el-input type="text" v-model="currentItem.appName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="应用名称" prop="appName">
                <el-input type="text" v-model="addList.appName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用包名" prop="appPackageName">
                <el-input type="text" v-model="addList.appPackageName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用类型" prop="appType">
                <el-input type="text" v-model="addList.appType" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addHandleClose('addList')">取 消</el-button>
                <el-button type="primary" @click="addHandleConfirm('addList')" :loading="addBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import iTable from "@/components/table";
import {formatDate} from '@/utils/format.js'
import {skillList, skillAdd, skillUpd,skillDel} from '@/config/api'
export default {
    name: "applicationlist",
    components: { iTable },
    data() {
        return {
            list: [],
            currentItem: {//修改数据组
                id:"",
                appName:""
            },
            addList: {//添加数据组
                appName:"",
                appPackageName:"",
                appType:""
            },
            searchItem:{//搜索数据组
                appName:"",
            },
            columns: [
                {
                    prop: "appName",
                    label: "应用名称",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "技能数",
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
                    label: "调用用户数",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "inc",
                    label: "失败次数",
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
                appName:[{ required: true, message: '请输入应用名称', trigger: 'change' }],
                appPackageName:[{ required: true, message: '请输入应用包名', trigger: 'change' }],
                appType:[{ required: true, message: '请输入应用类型', trigger: 'change' }],
            },
            editRules:{
                appName:[{ required: true, message: '请输入应用名称', trigger: 'blur' }],
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
            editBtnLoading:false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        resetForm(searchItem) {
            this.$refs[searchItem].resetFields();
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
                appName: row.appName,
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
                skillDel(delParams).then(res=>{
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
        editHandleClose() {
            this.editVisible = false;
        
        },
        addHandClose() {
            this.addVisible = false
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
        addHandleClose(addList){
            this.addVisible = false
        },
        editHandleConfirm(currentItem) {
            let updParams = {
                id:this.currentItem.id,
                appName:this.currentItem.appName
            }
            this.$refs[currentItem].validate((valid) => {
                if (valid) {
                    this.editBtnLoading = true
                    skillUpd(updParams).then(res=>{
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
        handleAdd(addList){
            this.addVisible = true
        },
        addHandleConfirm(addList) {
            let addParams = {
                appName:this.addList.appName,
                appPackageName:this.addList.appPackageName,
                appType:this.addList.appType,
            }
            this.$refs[addList].validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true
                    skillAdd(addParams).then(res=>{
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
                pgstr:this.currentPage,
                pcstr:this.pageSize,
                appName:this.searchItem.appName
            }
            skillList(params).then(res => {
                this.list = res.data.data;
                this.totalCount = res.data.count
            });
        },
        handleInfo(index, row) {
            this.$router.push({
                path:'/home/skill/detail',
                query:{
                    appId:row.id
                }
            })
        }
    }
};
</script>

<style scoped>
</style>
