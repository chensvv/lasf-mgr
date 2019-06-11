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
                <span class="d_title">{{d_title}}  
                    </span><span>{{d_url}} {{d_mint}}</span>
            </div>
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
                <el-form-item label="技能描述" prop="ruleDes">
                <el-input type="text" v-model="currentItem.ruleDes" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="技能描述" prop="jnms">
                <el-input type="text" v-model="addList.jnms" auto-complete="off"></el-input>
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
            index:"",
            d_title: "",
            d_url:"",
            d_mint:"",
            list: [],
            currentItem: {//修改数据组
                ruleDes:""
            },
            addList: {//添加数据组
                jnms:""
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
                    prop: "ruleDes",
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
                jnms:[{ required: true, message: '请输入技能描述', trigger: 'blur' }]
            },
            editRules:{
                ruleDes:[{ required: true, message: '请输入技能描述', trigger: 'blur' }]
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
        this.d_title = this.$route.query.d_title
        this.d_url = this.$route.query.d_url
        this.d_mint = this.$route.query.d_mint
        this.index = this.$route.query.index
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
            this.addList = {}
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
        },
        handleInfo(index, row) {
            console.log()
            this.$router.push({
                path:'/home/skill/detail/speak',
                query:{
                    index:this.index,
                    d_info:row.ruleDes,
                    d_title:this.d_title,
                    d_url:this.d_url,
                    d_mint:this.d_mint
                }
            })
            console.log(this.d_url,this.d_mint)
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
