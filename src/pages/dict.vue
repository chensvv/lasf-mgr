<template>
  <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="热词" prop="platform">
                <el-input v-model="searchItem.platform"></el-input>
            </el-form-item>
        <el-form-item label="VDM" prop="vdm">
            <el-select v-model="searchItem.vdm" placeholder="--">
            <el-option label="ALL" value="ALL"></el-option>
            <el-option label="LES" value="LES"></el-option>
            <el-option label="APP" value="APP"></el-option>
            <el-option label="VOD" value="VOD"></el-option>
            </el-select>
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

    <el-dialog title="编辑" :visible.sync="editVisible" width="300" :before-close="editHandleClose">
        <el-form :label-position="'left'" label-width="100px">
            <el-form-item label="热词">
                <el-input type="text" v-model="currentItem.platform" auto-complete="off"></el-input>
                <el-button size="mini">获取推荐读音</el-button>
            </el-form-item>
            <el-form-item label="词语发音">
                <el-input type="text" v-model="currentItem.fay" auto-complete="off"></el-input>
                <span style="font-size:12px">(如热词为‘A180’，此处可填写‘诶裔巴绫’)</span>
            </el-form-item>
            <el-form-item label="VDM" prop="vdm">
                <el-select v-model="searchItem.vdm" placeholder="--">
                <el-option :label="ALL" value="ALL"></el-option>
                <el-option :label="LES" value="LES"></el-option>
                <el-option :label="APP" value="APP"></el-option>
                <el-option :label="VOD" value="VOD"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="editHandleConfirm">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose">
        <el-form :label-position="'left'" label-width="100px">
            <el-form-item label="热词">
            <el-input type="text" v-model="addList.platform" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="词语发音">
            <el-input type="text" v-model="addList.fay" auto-complete="off"></el-input>
            <span style="font-size:12px">(如热词为‘A180’，此处可填写‘诶裔巴绫’)</span>
            </el-form-item>
            <el-form-item label="VDM" prop="vdm">
            <el-select v-model="addList.vdm" placeholder="--">
            <el-option label="ALL" value="ALL"></el-option>
            <el-option label="LES" value="LES"></el-option>
            <el-option label="APP" value="APP"></el-option>
            <el-option label="VOD" value="VOD"></el-option>
            </el-select>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addHandleClose">取 消</el-button>
            <el-button type="primary" @click="addHandleConfirm">确 定</el-button>
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
                platform: "",
                fay: "",
                vdm: "",
            },
            addList: {//添加数据组
            },
            searchItem:{//搜索数据组
                platform:"",
                vdm:"",
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
                    prop: "vdm",
                    label: "VDM",
                    align: "left",
                    hasSort:true
                },
                {
                    prop: "platform",
                    label: "热词",
                    align: "left",
                    hasSort:true
                },
                {
                    prop: "applicationName",
                    label: "发音",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "putTime",
                    label: "更新时间",
                    align: "center",
                    hasSort:true,
                    render: (h, params)=>{
                        var timer = parseInt(params.row.putTime)
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
                width: 150,
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
                classnames: row.platform,
                fay: row.fay,
                vdm: row.vdm
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
        addHandleClose(){
            this.addList = {}
            this.addVisible = false
        },
        editHandleConfirm() {
            console.log(this.currentItem)
            this.editVisible = false;
        },
        handleAdd(){
            this.addVisible = true
        },
        addHandleConfirm() {
            console.log(this.addList)
            this.list.push(this.addList)
            this.getList();
            this.addList = {}
            this.addVisible = false;
        },
        getList() {
            this.$http.get("/api/data").then(res => {
                this.list = res.data;
                console.log(this.pageSize)
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
