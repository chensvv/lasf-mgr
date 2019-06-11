<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="网站名" prop="classnames">
                <el-input v-model="searchItem.classnames"></el-input>
            </el-form-item>
            <el-form-item label="来源" prop="was_from">
                <el-input v-model="searchItem.was_from"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="refreshTime">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.refreshTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="putTime">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.putTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
            </el-form-item>
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
            <el-form :label-position="'left'" label-width="120px" :rules="editRules" :model="currentItem" ref="currentItem">
                <el-form-item label="网站名称modify" prop="classnames">
                    <el-input type="text" v-model="currentItem.classnames" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="说法" prop="shuof">
                    <el-input type="text" v-model="currentItem.shuof" auto-complete="off"></el-input>
                    <span style="font-size:12px">(多个说法用' / '分隔。例：网址导航/联想导航)</span>
                </el-form-item>
                <el-form-item label="手机网址" prop="mobile_url">
                    <el-input type="text" v-model="currentItem.mobile_url" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="120px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="网站名称add" prop="classnames">
                    <el-input type="text" v-model="addList.classnames" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="说法" prop="shuof">
                    <el-input type="text" v-model="addList.shuof" auto-complete="off"></el-input>
                    <span style="font-size:12px">(多个说法用' / '分隔。例：网址导航/联想导航)</span>
                </el-form-item>
                <el-form-item label="手机网址" prop="mobile_url">
                    <el-input type="text" v-model="addList.mobile_url" auto-complete="off"></el-input>
                </el-form-item>
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
                classnames: "",
                shuof: "",
                mobile_url: "",
            },
            addList: {//添加数据组
                classnames: "",
                shuof: "",
                mobile_url: "",
            },
            searchItem:{//搜索数据组
                classnames:"",
                was_from:"",
                refreshTime:"",
                putTime:""
            },
            columns: [
                {
                    prop:"index",
                    label: "序号",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "classnames",
                    label: "网站名称",
                    align: "left",
                    hasSort:true
                },
                {
                    prop: "biem",
                    label: "别名",
                    align: "left",
                    hasSort:true
                },
                {
                    prop: "mobile_url",
                    label: "手机网址",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "url",
                    label: "WEB网址",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "was_from",
                    label: "来源",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "refreshTime",
                    label: "更新时间",
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
                width: 120,
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
                classnames:[{ required: true, message: '请输入网站名称add', trigger: 'blur' }],
                shuof:[{ required: true, message: '请输入说法', trigger: 'blur' }],
                mobile_url:[{ required: true, message: '请输入手机网址', trigger: 'blur' }],
            },
            editRules:{
                classnames:[{ required: true, message: '请输入网站名称add', trigger: 'blur' }],
                shuof:[{ required: true, message: '请输入说法', trigger: 'blur' }],
                mobile_url:[{ required: true, message: '请输入手机网址', trigger: 'blur' }],
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
                classnames: row.classnames,
                shuof: row.shuof,
                mobile_url: row.mobile_url
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
