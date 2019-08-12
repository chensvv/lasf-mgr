<template>
    <div>
        <div class="box_404">
           <img src="../../static/images/404.gif" class="img_404">
            <span class="btn_404" @click="btn()" :to="{ path: '/home'}">返回首页</span> 
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        btn(){
            this.$router.push({
                path:'/'
            })
        }
    }
}
</script>

<style scoped>
.box_404{
    position: absolute;
    top: 30%;
    left: 50%;
    -webkit-transform: translate(-50%, -20%);
    transform: translate(-50%, -20%);
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    justify-content: space-between;
}
.img_404{
    width: 300px;
}
.btn_404{
    display: block;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    padding: 7px 10px;
    border-radius: 3px;
}
.el-header{
    display: none !important;
}
.el-aside{
    display: none !important;
}
</style>
