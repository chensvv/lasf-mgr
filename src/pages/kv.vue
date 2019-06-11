<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    
    <el-form :inline="true" class="demo-form-inline search_box" size="mini">
        <el-form-item>
            <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
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
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="100px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="修改密码" prop="lasfpsd">
                    <el-input type="text" v-model="addList.lasfpsd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="LASF KEY" prop="lasfkey">
                    <el-input type="text" v-model="addList.lasfkey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="LASF VAL" prop="lasfval">
                    <el-input type="textarea" v-model="addList.lasfval" auto-complete="off"></el-input>
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
            addList: {//添加数据组
                lasfpsd:"",
                lasfkey:"",
                lasfval:""
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
                label: "KEY",
                align: "center",
                hasSort:true
                },
                {
                prop: "ruleDes",
                label: "VAL",
                align: "center",
                hasSort:true
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
                list: []
            }, // 列操作按钮
            addRules:{
                lasfpsd:[{ required: true, message: '请输入修改密码', trigger: 'blur' }],
                lasfkey:[{ required: true, message: '请输入LASF KEY', trigger: 'blur' }],
                lasfval:[{ required: true, message: '请输入LASF VAL', trigger: 'blur' }],
            },
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
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1
            this.getList();
        },
        handleCurrentChange(val) {
            this.currentPage = val
            console.log(`当前页: ${val}`);
        },
        addHandleClose(){
            this.addVisible = false
        },
        handleAdd(){
            this.addVisible = true
        },
        openFun(addList){
            this.$nextTick(() => {
                if(this.$refs[addList]){
                    this.$refs[addList].resetFields();
                }
            })
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
