<template>
    <div class="rule">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>应用搜索</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="规则" prop="reg">
                <el-input v-model="searchItem.reg" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="btnLoading">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
            </el-form-item>
        </el-form>
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
</template>

<script>
import iTable from "@/components/table";
import {regList} from '@/config/api'
export default {
    components:{iTable},
    data(){
        return{
        searchItem:{
            reg:""
        },
        list:[],
        columns:[
            {
                prop:"reg",
                label: "匹配规则",
                align: "center",
                hasSort:true
            },{
                prop:"result",
                label: "输出形式",
                align: "center",
                hasSort:true
            },{
                prop:"dsc",
                label: "规则描述",
                align: "center",
                hasSort:true
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
            width: 120,
            show: false,
            list: [
            ]
        }, // 列操作按钮
        editVisible: false,
        addVisible: false,
        // 分页
        currentPage: 1, //默认显示第几页
        pageSize: 30,   //默认每页条数
        pageSizes:[10, 20, 30],
        totalCount:1,     // 总条数
        btnLoading:false
        }
    },
    created(){
        this.getList();
    },
    methods:{
        getList() {
            let params={
                reg:this.searchItem.reg,
                pgstr:this.currentPage,
                pcstr:this.pageSize
            }
            regList(params).then(res => {
                this.list = res.data.data;
                // this.list.forEach(item => {
                //     item.index = item.id % this.pageSize;
                //     if(item.index == 0){
                //         item.index = this.pageSize
                //     }
                // });
                this.totalCount = res.data.count
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList()
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
    }
}
</script>

<style>

</style>
