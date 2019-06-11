<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="应用名称" prop="classnames">
                <el-input v-model="searchItem.classnames"></el-input>
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
                <el-form-item label="应用名称" prop="classnames">
                <el-input type="text" v-model="currentItem.classnames" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="应用名称" prop="classnames">
                <el-input type="text" v-model="addList.classnames" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用包名" prop="bagname">
                <el-input type="text" v-model="addList.bagname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用类型" prop="apptype">
                <el-input type="text" v-model="addList.apptype" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addHandleClose('addList')">取 消</el-button>
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
                classnames:""
            },
            addList: {//添加数据组
                classnames:"",
                bagname:"",
                apptype:""
            },
            searchItem:{//搜索数据组
                classnames:"",
            },
            columns: [
                {
                    prop:"index",
                    label: "序号",
                    width:100,
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "classnames",
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
                classnames:[{ required: true, message: '请输入应用名称', trigger: 'blur' }],
                bagname:[{ required: true, message: '请输入应用包名', trigger: 'blur' }],
                apptype:[{ required: true, message: '请输入应用类型', trigger: 'blur' }],
            },
            editRules:{
                classnames:[{ required: true, message: '请输入应用名称', trigger: 'blur' }],
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
        resetForm(searchItem) {
            this.$refs[searchItem].resetFields();
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
            this.$refs[currentItem].validate((valid) => {
                if (valid) {
                    console.log(this.currentItem)
                    this.editVisible = false;
                } else {
                    return false;
                }
            });
        },
        handleAdd(addList){
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
        },
        handleInfo(index, row) {
            this.$router.push({
                path:'/home/skill/detail',
                query:{
                    index:index,
                    d_title:row.classnames,
                    d_url:row.mobile_url,
                    d_mint:row.from
                }
            })
            console.log(row)
        }
    }
};
</script>

<style scoped>
</style>
