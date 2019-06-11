<template>
    <el-menu mode="vertical" :default-active="$route.path" :router="isRouter">
        
        <el-menu-item index="/home/index">
            <i class="el-icon-location"></i>
			<span>首页</span>
        </el-menu-item>
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-date"></i>
                <span>数据管理</span>
            </template>

            <el-menu-item index="/home/appList">
                <i class="el-icon-goods"></i>
                <span>应用列表</span>
            </el-menu-item>
            <el-menu-item index="/home/keyWord">
                <i class="el-icon-goods"></i>
                <span>应用关键词</span>
            </el-menu-item>
            <el-menu-item index="/home/aliReg">
                <i class="el-icon-goods"></i>
                <span>应用别名规则</span>
            </el-menu-item>
            <el-menu-item index="/home/cache">
                <i class="el-icon-goods"></i>
                <span>应用缓存</span>
            </el-menu-item>
            <el-menu-item index="/home/was">
                <i class="el-icon-tickets"></i>
                <span>网站导航数据</span>
            </el-menu-item>
            <el-menu-item index="/home/dict">
                <i class="el-icon-tickets"></i>
                <span>热词表</span>
            </el-menu-item>
            <el-menu-item index="/home/csc">
                <i class="el-icon-service"></i>
                <span>常用服务电话</span>
            </el-menu-item>
            <el-menu-item index="/home/qa">
                <i class="el-icon-tickets"></i>
                <span>定制问答</span>
            </el-menu-item>
            <el-menu-item index="/home/rule">
                <i class="el-icon-tickets"></i>
                <span>小不点规则设置</span>
            </el-menu-item>
            <el-menu-item index="/home/grey">
                <i class="el-icon-tickets"></i>
                <span>灰度发布</span>
            </el-menu-item>
            <el-menu-item index="/home/chat">
                <i class="el-icon-tickets"></i>
                <span>闲聊上报数据</span>
            </el-menu-item>
            <el-menu-item index="/home/joke">
                <i class="el-icon-tickets"></i>
                <span>笑话</span>
            </el-menu-item>
            <el-menu-item index="/home/sen">
                <i class="el-icon-tickets"></i>
                <span>敏感词</span>
            </el-menu-item>
            <el-menu-item index="/home/trigger">
                <i class="el-icon-tickets"></i>
                <span>唤醒词</span>
            </el-menu-item>
        </el-submenu>

        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-date"></i>
                <span>LASF KV</span>
            </template>

            <el-menu-item index="/home/kv">
                <i class="el-icon-document"></i>
                <span>KV列表</span>
            </el-menu-item>
            <el-menu-item index="/home/engine">
                <i class="el-icon-document"></i>
                <span>引擎规则</span>
            </el-menu-item>
            <el-menu-item index="/home/outer">
                <i class="el-icon-document"></i>
                <span>三方错误信息</span>
            </el-menu-item>
            <el-menu-item index="/home/skill">
                <i class="el-icon-document"></i>
                <span>技能配置信息</span>
            </el-menu-item>
        </el-submenu>

        <el-menu-item index="/home/setting">
            <i class="el-icon-setting"></i>
			<span>设置</span>
        </el-menu-item>
    </el-menu>    
</template>

<script>
export default {
    data(){
        return {
            isRouter:true,
            key:'/home/index'
        }
    }
}
</script>

<style>

</style>
