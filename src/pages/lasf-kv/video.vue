<template>
    <div class="table">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>LASF KV</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-form :inline="true" ref="searchItem" :model="searchItem" class="demo-form-inline search_box" size="mini">
            <el-form-item label="名称" prop="name">
                <el-input v-model="searchItem.name" clearable></el-input>
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
                <el-form-item label="名称" prop="programName">
                    <el-input type="text" v-model="currentItem.programName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="别名" prop="programAliasName">
                    <el-input type="text" v-model="currentItem.programAliasName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="节目类型" prop="programDisplayType">
                    <el-input type="text" v-model="currentItem.programDisplayType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映类型" prop="programRelaseType">
                    <el-input type="text" v-model="currentItem.programRelaseType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容类型" prop="programContentType">
                    <el-input type="text" v-model="currentItem.programContentType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映年代" prop="programReleaseAge">
                    <el-input type="text" v-model="currentItem.programReleaseAge" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="语音" prop="programContentLanguage">
                    <el-input type="text" v-model="currentItem.programContentLanguage" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="导演" prop="programDirector">
                    <el-input type="text" v-model="currentItem.programDirector" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="主演" prop="programMainStar">
                    <el-input type="text" v-model="currentItem.programMainStar" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="演员" prop="programActors">
                    <el-input type="text" v-model="currentItem.programActors" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="programIntroduce">
                    <el-input type="textarea" v-model="currentItem.programIntroduce" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="网站评分" prop="programScore">
                    <el-input type="text" v-model="currentItem.programScore" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="集数" prop="programChildNumber">
                    <el-input type="text" v-model="currentItem.programChildNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="programUrl">
                    <el-input type="text" v-model="currentItem.programUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="级别" prop="programLevel">
                    <el-input type="text" v-model="currentItem.programLevel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="来源网站" prop="programSource">
                    <el-select v-model="currentItem.programSource" placeholder="--" clearable>
                        <el-option v-for="(item,index) in sourceList" :key="index" :label="item.appName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="海报链接" prop="programPoster">
                    <el-input type="text" v-model="currentItem.programPoster" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editHandleClose">取 消</el-button>
                <el-button type="primary" @click="editHandleConfirm('currentItem')" :loading="editBtnLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增" :visible.sync="addVisible" width="300" :before-close="addHandleClose" @open="openFun('addList')">
            <el-form :label-position="'left'" label-width="120px" :rules="addRules" :model="addList" ref="addList">
                <el-form-item label="名称" prop="programName">
                    <el-input type="text" v-model="addList.programName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="别名" prop="programAliasName">
                    <el-input type="text" v-model="addList.programAliasName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="节目类型" prop="programDisplayType">
                    <el-input type="text" v-model="addList.programDisplayType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映类型" prop="programRelaseType">
                    <el-input type="text" v-model="addList.programRelaseType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容类型" prop="programContentType">
                    <el-input type="text" v-model="addList.programContentType" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上映年代" prop="programReleaseAge">
                    <el-input type="text" v-model="addList.programReleaseAge" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="语言" prop="programContentLanguage">
                    <el-input type="text" v-model="addList.programContentLanguage" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="导演" prop="programDirector">
                    <el-input type="text" v-model="addList.programDirector" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="主演" prop="programMainStar">
                    <el-input type="text" v-model="addList.programMainStar" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="演员" prop="programActors">
                    <el-input type="text" v-model="addList.programActors" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="programIntroduce">
                    <el-input type="textarea" v-model="addList.programIntroduce" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="网站评分" prop="programScore">
                    <el-input type="text" v-model="addList.programScore" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="集数" prop="programChildNumber">
                    <el-input type="text" v-model="addList.programChildNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="programUrl">
                    <el-input type="text" v-model="addList.programUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="级别" prop="programLevel">
                    <el-input type="text" v-model="addList.programLevel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="来源网站" prop="programSource">
                    <el-select v-model="addList.programSource" placeholder="--" clearable>
                        <el-option v-for="(item,index) in sourceList" :key="index" :label="item.appName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="海报链接" prop="programPoster">
                    <el-input type="text" v-model="addList.programPoster" auto-complete="off"></el-input>
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
import {videoList, videoDel, videoUpd, videoAdd, videoSelect} from '@/config/api'
export default {
    name: "applicationlist",
    components: { iTable },
    data() {
        return {
            list: [],
            currentItem: {//修改数据组
                id:"",
                programName: "",
                programAliasName: "",
                programDisplayType: "",
                programRelaseType:"",
                programContentType:"",
                programReleaseAge:"",
                programContentLanguage:"",
                programDirector:"",
                programMainStar:"",
                programActors:"",
                programIntroduce:"",
                programScore:"",
                programChildNumber:"",
                programUrl:"",
                programLevel:"",
                programSource:"",
                programPoster:""
            },
            sourceList:[],
            addList: {//添加数据组
                programName: "",
                programAliasName: "",
                programDisplayType: "",
                programRelaseType:"",
                programContentType:"",
                programReleaseAge:"",
                programContentLanguage:"",
                programDirector:"",
                programMainStar:"",
                programActors:"",
                programIntroduce:"",
                programScore:"",
                programChildNumber:"",
                programUrl:"",
                programLevel:"",
                programSource:"",
                programPoster:""
            },
            searchItem:{//搜索数据组
                name:"",
            },
            columns: [
                {
                    prop: "programName",
                    label: "名称",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "programDisplayType",
                    label: "类型",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "programDirector",
                    label: "导演",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "programChildNumber",
                    label: "集数",
                    align: "center",
                    hasSort:true
                },
                {
                    prop: "programUrl",
                    label: "链接",
                    align:'center',
                    hasSort:true
                },
                {
                    prop: "programDisplaySource",
                    label: "来源",
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
                programName: [{ required: true, message: '请输入电影名称', trigger: 'change' }],
                programAliasName: [{ required: true, message: '请输入电影别名（如无别名，请输入电影名称）', trigger: 'change' }],
                programDisplayType: [{ required: true, message: '请输入节目类型', trigger: 'change' }],
                programRelaseType:[{ required: true, message: '请输入上映类型', trigger: 'change' }],
                programContentType:[{ required: true, message: '请输入内容类型', trigger: 'change' }],
                programReleaseAge:[{ required: true, message: '请输入上映年代', trigger: 'change' }],
                programContentLanguage:[{ required: true, message: '请输入语言', trigger: 'change' }],
                programDirector:[{ required: true, message: '请输入导演', trigger: 'change' }],
                programMainStar:[{ required: true, message: '请输入主演', trigger: 'change' }],
                programActors:[{ required: true, message: '请输入演员', trigger: 'change' }],
                programIntroduce:[{ required: true, message: '请输入简介', trigger: 'change' }],
                programScore:[{ required: true, message: '请输入电影评分', trigger: 'change' }],
                programChildNumber:[{ required: true, message: '请输入电影集数', trigger: 'change' }],
                programUrl:[{ required: true, message: '请输入链接', trigger: 'change' }],
                programLevel:[{ required: true, message: '请输入级别', trigger: 'change' }],
                programSource:[{ required: true, message: '请选择来源', trigger: 'change' }],
                programPoster:[{ required: true, message: '请输入海报链接', trigger: 'change' }]
            },
            editRules:{
                programName: [{ required: true, message: '请输入电影名称', trigger: 'change' }],
                programAliasName: [{ required: true, message: '请输入电影别名（如无别名，请输入电影名称）', trigger: 'change' }],
                programDisplayType: [{ required: true, message: '请输入节目类型', trigger: 'change' }],
                programRelaseType:[{ required: true, message: '请输入上映类型', trigger: 'change' }],
                programContentType:[{ required: true, message: '请输入内容类型', trigger: 'change' }],
                programReleaseAge:[{ required: true, message: '请输入上映年代', trigger: 'change' }],
                programContentLanguage:[{ required: true, message: '请输入语言', trigger: 'change' }],
                programDirector:[{ required: true, message: '请输入导演', trigger: 'change' }],
                programMainStar:[{ required: true, message: '请输入主演', trigger: 'change' }],
                programActors:[{ required: true, message: '请输入演员', trigger: 'change' }],
                programIntroduce:[{ required: true, message: '请输入简介', trigger: 'change' }],
                programScore:[{ required: true, message: '请输入电影评分', trigger: 'change' }],
                programChildNumber:[{ required: true, message: '请输入电影集数', trigger: 'change' }],
                programUrl:[{ required: true, message: '请输入链接', trigger: 'change' }],
                programLevel:[{ required: true, message: '请输入级别', trigger: 'change' }],
                programSource:[{ required: true, message: '请选择来源', trigger: 'change' }],
                programPoster:[{ required: true, message: '请输入海报链接', trigger: 'change' }]
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
            console.log(row);
            this.editVisible = true;
            videoSelect().then(res=>{
                this.sourceList = res.data
            })
            this.currentItem = {
                id:row.id,
                programName: row.programName,
                programAliasName: row.programAliasName,
                programDisplayType: row.programDisplayType,
                programRelaseType:row.programReleaseType,
                programContentType:row.programContentType,
                programReleaseAge:row.programReleaseAge,
                programContentLanguage:row.programContentLanguage,
                programDirector:row.programDirector,
                programMainStar:row.programMainStar,
                programActors:row.programActors,
                programIntroduce:row.programIntroduce,
                programScore:row.programScore,
                programChildNumber:row.programChildNumber,
                programUrl:row.programUrl,
                programLevel:row.programLevel,
                programSource:row.programSource,
                programPoster:row.programPoster
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
                videoDel(delParams).then(res=>{
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
                programName:this.currentItem.programName,
                programAliasName:this.currentItem.programAliasName,
                programType:this.currentItem.programType,
                programRelaseType:this.currentItem.programRelaseType,
                programContenType:this.currentItem.programContenType,
                programReleaseAge:this.currentItem.programReleaseAge,
                programContentLanguage:this.currentItem.programContentLanguage,
                programDirector:this.currentItem.programDirector,
                programNameMainStar:this.currentItem.programNameMainStar,
                programActors:this.programActors,
                programScore:this.currentItem.programScore,
                programChildNumber:this.currentItem.programChildNumber,
                programUrl:this.currentItem.programUrl,
                programLevel:this.currentItem.programLevel,
                programSource:this.programSource,
                programPoster:this.currentItem.programPoster,
                id:this.currentItem.id
            }
            this.$refs[currentItem].validate((valid) => {
                if (valid) {
                    this.editBtnLoading = true
                    videoUpd(updParams).then(res=>{
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
            videoSelect().then(res=>{
                this.sourceList = res.data
            })
        },
        addHandleConfirm(addList) {
            let addParams={
                programName: this.addList.programName,
                programAliasName: this.addList.programAliasName,
                programDisplayType: this.addList.programDisplayType,
                programRelaseType:this.addList.programRelaseType,
                programContentType:this.addList.programContentType,
                programReleaseAge:this.addList.programReleaseAge,
                programContentLanguage:this.addList.programContentLanguage,
                programDirector:this.addList.programDirector,
                programMainStar:this.addList.programMainStar,
                programActors:this.addList.programActors,
                programIntroduce:this.addList.programIntroduce,
                programScore:this.addList.programScore,
                programChildNumber:this.addList.programChildNumber,
                programUrl:this.addList.programUrl,
                programLevel:this.addList.programLevel,
                programSource:this.addList.programSource,
                programPoster:this.addList.programPoster
            }
            this.$refs[addList].validate((valid) => {
                if (valid) {
                    this.addBtnLoading = true
                    videoAdd(addParams).then(res=>{
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
                name:this.searchItem.name,
                pgstr:this.currentPage,
                pcstr:this.pageSize
            }
            videoList(params).then(res => {
                this.list = res.data.data;
                this.totalCount = res.data.count
            });
        }
    },
};
</script>

<style scoped>
</style>
