<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="歌手名称" prop="name">
                <el-input v-model="searchItem.name" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="seaBtnLoading">查询</el-button>
                <el-button @click="resetForm('searchItem')">重置</el-button>
            </el-form-item>
            <el-button class="success" size="mini" @click="handleAdd()">添加</el-button>
            <el-button class="success" size="mini" @click="handleAlbum()">专辑列表</el-button>
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
                <el-form-item label="歌曲名称" prop="songName">
                    <el-input type="text" v-model="currentItem.songName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="QQ音乐MID" prop="songMid">
                    <el-input type="text" v-model="currentItem.songMid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="QQ音乐ID" prop="songId">
                    <el-input type="text" v-model="currentItem.songId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应专辑ID" prop="songAlbumId">
                    <el-input type="text" v-model="currentItem.songAlbumId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应歌手简介" prop="songSingerId">
                    <el-input type="text" v-model="currentItem.songSingerId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="歌曲来源" prop="songSource">
                    <el-select v-model="currentItem.songSource" placeholder="--" clearable>
                        <el-option v-for="(item,index) in sourceList" :key="index" :label="item.appName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="120px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="歌曲名称" prop="songName">
                    <el-input type="text" v-model="addList.songName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="QQ音乐MID" prop="songMid">
                    <el-input type="text" v-model="addList.songMid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="QQ音乐ID" prop="songId">
                    <el-input type="text" v-model="addList.songId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应专辑ID" prop="songAlbumId">
                    <el-input type="text" v-model="addList.songAlbumId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应歌手ID" prop="songSingerId">
                    <el-input type="text" v-model="addList.songSingerId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="歌曲来源" prop="songSource">
                    <el-select v-model="addList.songSource" placeholder="--" clearable>
                        <el-option v-for="(item,index) in sourceList" :key="index" :label="item.appName" :value="item.id"></el-option>
                    </el-select>
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
import {songList, songDel, songUpd, songAdd, songSelect} from '@/config/api'
export default {
    name: "applicationlist",
    components: { iTable },
    data() {
        return {
            list: [],
            currentItem: {//修改数据组
                id:"",
                songName: "",
                songMid: "",
                songId: "",
                songAlbumId:"",
                songSingerId:"",
                songSource:""
            },
            sourceList:[],
            addList: {//添加数据组
                songName: "",
                songMid: "",
                songId: "",
                songAlbumId:"",
                songSingerId:"",
                songSource:""
            },
            searchItem:{//搜索数据组
                name:"",
            },
            columns: [
                {
                    prop: "songName",
                    label: "歌曲名称",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "songId",
                    label: "歌曲ID",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "id",
                    label: "专辑ID",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "songMid",
                    label: "QQ音乐MID",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "displayUpdateTime",
                    label: "更新时间",
                    align:'center',
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
                songName: [{ required: true, message: '请输入歌手名称', trigger: 'change' }],
                songMid: [{ required: true, message: '请输入QQ音乐MID', trigger: 'change' }],
                songId: [{ required: true, message: '请输入QQ音乐ID', trigger: 'change' }],
                songAlbumId:[{ required: true, message: '请输入对应专辑ID', trigger: 'change' }],
                songSingerId:[{ required: true, message: '对应歌手ID', trigger: 'change' }],
                songSource:[{ required: true, message: '请选择歌曲来源', trigger: 'change' }]
            },
            editRules:{
                songName: [{ required: true, message: '请输入歌手名称', trigger: 'change' }],
                songMid: [{ required: true, message: '请输入QQ音乐MID', trigger: 'change' }],
                songId: [{ required: true, message: '请输入QQ音乐ID', trigger: 'change' }],
                songAlbumId:[{ required: true, message: '请输入对应专辑ID', trigger: 'change' }],
                songSingerId:[{ required: true, message: '对应歌手ID', trigger: 'change' }],
                songSource:[{ required: true, message: '请选择歌曲来源', trigger: 'change' }]
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList();
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
            songSelect().then(res=>{
                this.sourceList = res.data
            })
            this.currentItem = {
                id:row.id,
                songName: row.songName,
                songMid: row.songMid,
                songId: row.songId,
                songAlbumId:row.songAlbumId,
                songSingerId:row.songSingerId,
                songSource:row.songSource
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
                songDel(delParams).then(res=>{
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
            this.addVisible = false
        },
        editHandleConfirm(currentItem) {
            let updParams = {
                id:this.currentItem.id,
                songName: this.currentItem.songName,
                songMid: this.currentItem.songMid,
                songId: this.currentItem.songId,
                songAlbumId:this.currentItem.songAlbumId,
                songSingerId:this.currentItem.songSingerId,
                songSource:this.currentItem.songSource
            }
            this.$refs[currentItem].validate((valid) => {
                if (valid) {
                    this.editBtnLoading = true
                    songUpd(updParams).then(res=>{
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
            songSelect().then(res=>{
                this.sourceList = res.data
                console.log(res.data)
            })
        },
        addHandleConfirm(addList) {
            let addParams={
                songName: this.addList.songName,
                songMid: this.addList.songMid,
                songId: this.addList.songId,
                songAlbumId:this.addList.songAlbumId,
                songSingerId:this.addList.songSingerId,
                songSource:this.addList.songSource
            }
            this.$refs[addList].validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true
                    songAdd(addParams).then(res=>{
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
        handlePub(){
            songPub().then(res=>{
                if(res.data.again == 1){
                    this.$message({
                        message:'发布成功',
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
        },
        getList() {
            let params = {
                name:this.searchItem.name,
                pgstr:this.currentPage,
                pcstr:this.pageSize
            }
            songList(params).then(res => {
                this.list = res.data.data;
                this.totalCount = res.data.count
            });
            
        },
        handleAlbum(){
            this.$router.push({
                path:'/home/album'
            })
        },
    },
};
</script>

<style scoped>
</style>
