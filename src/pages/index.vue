<template>
    <div class="index">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="a_alert">
            <i class="el-icon-info"></i>
            <span class="alert_main">应用记录今天更新了<countTo :startVal='startVal' :endVal='endVal' :duration='3000'></countTo> 条</span>
        </div>
        <div>
            <img src="https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3" class="img">
        </div>
    </div>
</template>
<script>
import countTo from 'vue-count-to';
export default {
    components: { countTo },
    data(){
        return{
            startVal:0,
            endVal:1024
        }
    }
}
</script>
<style scoped>
.img{
    width: 45%;
    display: block;
    margin: 10px auto 0;
}
.el-main{
    background: #e3e3e3 !important;
}
</style>

