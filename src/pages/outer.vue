<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="用户ID" prop="mobile_num" class="res_wid">
                <el-input v-model="searchItem.mobile_num"></el-input>
            </el-form-item>
            <el-form-item label="用户指令" prop="zhil" class="res_wid">
                <el-input v-model="searchItem.zhil"></el-input>
            </el-form-item>
            <el-form-item label="解析领域" prop="lingy" class="res_wid">
                <el-input v-model="searchItem.lingy"></el-input>
            </el-form-item>
            <el-form-item label="响应状态" prop="state" class="res_wid">
                <el-input v-model="searchItem.state"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="refreshTime" class="res_wid1">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.refreshTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="putTime" class="res_wid1">
                <el-date-picker type="date" placeholder="选择日期" v-model="searchItem.putTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item  class="res_wid2">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
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
        <el-dialog title="详情" :visible.sync="infoVisible" width="300" :before-close="infoHandleClose">
            <el-form :label-position="'left'" label-width="100px">
                <el-form-item label="用户ID">
                <el-input type="text" v-model="infoItem.yhID" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="设备类型">
                <el-input type="text" v-model="infoItem.sblx" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="会话ID">
                <el-input type="text" v-model="infoItem.hhID" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="来源类型">
                <el-input type="text" v-model="infoItem.lylx" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="请求内容">
                <el-input type="textarea" v-model="infoItem.qqnr" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="响应头部信息">
                <el-input type="textarea" v-model="infoItem.xytbxx" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="响应内容">
                <el-input type="textarea" v-model="infoItem.xynr" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="请求消耗时间">
                <el-input type="text" v-model="infoItem.qqxhsj" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="接口名称">
                <el-input type="text" v-model="infoItem.jkmc" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="接口路径">
                <el-input type="text" v-model="infoItem.jklj" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="响应状态">
                <el-input type="text" v-model="infoItem.xyzt" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="错误信息">
                <el-input type="text" v-model="infoItem.cwxx" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="三方名称">
                <el-input type="text" v-model="infoItem.sfmc" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="入库时间">
                <el-input type="text" v-model="infoItem.rksj" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="解析领域">
                <el-input type="text" v-model="infoItem.jxly" auto-complete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="用户指令">
                <el-input type="text" v-model="infoItem.yhzl" auto-complete="off" readonly></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="infoHandleConfirm">确 定</el-button>
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
            searchItem:{},
            infoItem: {//修改数据组
            },
            columns: [
                {
                    prop:"index",
                    label: "序号",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "mobile_num",
                    label: "用户ID",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "biem",
                    label: "用户指令",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "biem",
                    label: "解析领域",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "biem",
                    label: "响应状态",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "was_from",
                    label: "三方名称",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "biem",
                    label: "接口名称",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "refreshTime",
                    label: "时间",
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
                        label: "详情",
                        show: true,
                        plain: true,
                        disabled: false,
                        method: (index, row) => {
                            this.handleInfo(index, row);
                        }
                    }
                ]
            }, // 列操作按钮
            infoVisible: false,
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
        handleInfo(index, row) {
            console.log(index, row);
            this.infoVisible = true;
            this.infoItem = {
                yhID:row.mobile_num,
                sblx:row.biem,
                hhID:row.biem,
                lylx:row.biem,
                qqnr:row.cost,
                xytbxx:row.platform,
                xynr:row.biem,
                qqxhsj:row.biem,
                jkmc:row.biem,
                jklj:row.biem,
                xyzt:row.biem,
                cwxx:row.biem,
                sfmc:row.was_from,
                rksj:row.refreshTime,
                jxly:row.biem,
                yhzl:row.biem
            };
        },
        infoHandleConfirm() {
            this.infoVisible = false;
        },
        infoHandleClose(){
            this.infoVisible = false;
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
