<template>
    <div class="login">
        <div class="login-box">
        <el-form :label-position="'left'" label-width="60px">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密  码" prop="pass">
                <el-input type="password" v-model="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">注册</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>

import qs from 'qs'

export default {
    data(){
        return {
            username:'',
            password:'',
        }
    },
    methods: {
        onSubmit(){

            var url = "http://api.baxiaobu.com/index.php/home/v1/register";

            var params = {
                username:this.username,
                pwd:this.password
            }

            params = qs.stringify(params);

            console.log(params);

            this.$axios.post(url, params).then((res)=>{
                console.log(res);
                this.$router.push('/login')
            })

        }
    }  
}
</script>

<style>

.login-box {
    width: 300px;
    margin: 200px auto;
}

.login-box .el-button {
    width: 100%;
}

</style>
