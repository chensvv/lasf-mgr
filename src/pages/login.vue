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
                <el-button type="primary" @click="onSubmit">登录</el-button>
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
            username:'zhang',
            password:'123',
        }
    },
    methods: {
        onSubmit(){

            var url = "http://api.baxiaobu.com/index.php/home/v1/login";

            var params = {
                username:this.username,
                pwd:this.password
            }

            params = qs.stringify(params);

            this.$http.post(url, params).then((res)=>{
                if(res.data.status == 200){
                    localStorage.setItem('user_id', res.data.data.user_id);
                    localStorage.setItem('username',this.username)
                    this.$router.push('/home')
                }
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
