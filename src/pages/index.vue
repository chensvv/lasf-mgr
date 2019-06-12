<template>
    <div class="index">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="a_alert">
            <i class="el-icon-info"></i>
            <span class="alert_main">应用记录今天更新了 <span class="num">{{num}}</span> 条</span>
        </div>
        <div>
            <img src="https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3" class="img">
        </div>
    </div>
</template>
<script>
import Count from '../utils/count'
export default {
    data(){
        return{
            num:1024
        }
    },
    mounted(){
        Count({
            end:this.num,
            limitTime:2000,  //指定时间
            // interval:1, //指定速度
            callback:(num) => {
                this.num = num
            }
        })
    }
}
</script>
<style scoped>
.img{
    width: 45%;
    display: block;
    margin: 10px auto 0;
}
</style>

