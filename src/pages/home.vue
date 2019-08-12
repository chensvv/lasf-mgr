<template>
    <div class="home" :class="{is404:is404}">
    <!-- <el-container> -->
        <el-header>
            语音服务管理系统

            <el-dropdown class="fr" @command="handleDropdown" trigger="click">
                <span class="el-dropdown-link">
                    {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item command="change">切换账号</el-dropdown-item> -->
                    <el-dropdown-item @click="userInfo()">详细信息</el-dropdown-item>
                    <el-dropdown-item divided command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
    
        <el-container>
            <el-aside width="200px">
                <Aside></Aside>
            </el-aside>
            <el-main>
                <router-view>
                </router-view>
            </el-main>
        </el-container>
    <!-- </el-container> -->
    </div>
</template>

<script>

import Aside from '@/components/Aside'

export default {
    data(){
        return {
            username:"",
            is404:false
        }
    },
    created(){
        
        this.username = window.localStorage.getItem('username')
    },
    components: {
        Aside
    },
    watch:{
        $route(to, from) {
        if(this.$route.path == '/404'){
            this.is404 = true
        }else{
            this.is404 = false
        }
    }
    },
    methods:{
        handleDropdown(v){
            if(v == "logout"){
                localStorage.removeItem('user_id');
                
                this.$router.push('/login')
            }else{
                this.$router.push('/home/userinfo')
            }
        }
    }
}
</script>

<style>
.home {
    height: 100%;
    min-width: 1200px;
}

.home .el-container{
    height: 100%;
    padding-top: 60px;
}
.is404 .el-header{
    display: none;
}
.is404 .el-aside{
    display: none;
}
.home .el-header {
    background-color: #2b2b2b;
    color:#ffffff;
    line-height: 60px;
    text-align: left;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.home .el-menu {
    height: 100%;
    border-right: none;
}

.home .el-footer {
    background-color: #2b2b2b;
    color:#ffffff;
    line-height: 60px;
    text-align: center;
}

.fr {
    float: right;
}


.home .el-icon--right{
    vertical-align: middle;
}
.home .el-dropdown-link{
    cursor: pointer;
}
</style>