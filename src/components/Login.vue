<template>
    <div class="login-container">
        <!-- 结构 -->
        <div class="login-box">
            <!--绘制头像-->
            <div class="avatar_box">
                <img src="@/assets/logo.png" alt="">
            </div>
            <!--登录表单区域-->
            <!--ref 组件实例对象 相当于组件的id 在Vue组件中 可以使用 vm.$refs.refname进行调用-->
            <!-- rules el-form的表单校验属性，绑定的loginFormRules data中定义 在需要校验的表单元素中使用prop进行定义 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
                <!-- 用户名 -->
                <!-- 校验 -->
                <el-form-item prop="username">
                    <!-- 进行双向数据绑定 将登录名和登录密码 绑定到loginForm上 -->
                    <el-input v-model="loginForm.username" prefix-icon="incofont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mina"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    
                    <el-button type="primary" @click="login">登录</el-button>
                    <!--重置表单 获取到表单元素 使用 resetFields方法重置表单内容-->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
// 行为
export default {
    data() {
        return {
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //表单验证规则
            loginFormRules:{
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]

            }
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //重置表单
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        //登录验证请求
        login(){
            //验证用户名和密码
            this.$refs.loginFormRef.validate(async valid =>{
                //验证失败 直接退出
                if(!valid) return;
                //数据解构
                //axios返回的是promise对象，只能使用异步操作，不能return给调用者
                //async 异步函数 ，await后面是promise对象
                //解构 从数组和对象中取值，将获取到的值赋给指定变量 其中data必须是promise对象中的属性，然后将值返回到data上
                //axios支持promisesAPI 
                const {data:res}= await this.$http.post('login',this.loginForm);
                // console.log(res);
                //使用element-ui中的消息弹框 
                if(res.meta.status !== 200) return this.$message.error('登录失败！');
                //token进行登录验证，localStorage是持久的,sessionSotorage是会话期间
                this.$message.success('登陆成功');
                window.sessionStorage.setItem('token',res.data.token);
                //编程式路由导向 导向 http://localhost:8000/home页面
                //router.push() 提供了path,params会被忽略;可以手写name或者带参数的path
                this.$router.push('/home');
            })
        }
    }
};
</script>

<style lang="less" scoped>
/* 行为 */
.login-container{
    background-color:#2b4b6b;
    height:100%;
}
.login-box{
    //水平 垂直居中 宽高已定 
    //父元素设置relative 子元素absolute
    //top:50% left:50%  
    //transform:translate(-50%,-50%);
    width:450px;
    height:300px;
    background-color:#fff;
    border-radius:3px;
    position:absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        // 设置头像大小样式
        height:130px;
        width:130px;
        border:1px solid #eee;
        border-radius:50%;
        padding:10px;
        //box-shadow边框添加阴影 水平0 垂直0 阴影1宽度10px 颜色#ddd
        box-shadow: 0 0 10px #ddd;
        //logo需要水平居中在登录框上，再向上移动一半
        position:absolute;
        left:50%;
        transform: translate(-50%,-50%);
        
        background-color:#fff;
        img{
            width:100%;
            height:100%;
            //边框使用圆角
            border-radius:50%;
            background-color:#eee;
        }
    }
}
.login-form{
    position:absolute;
    width:100%;
    bottom:0px;
    padding:0 20px;
    //box-sizing 盒模型 content-box(W3C盒模型) border-box(IE盒模型)
    box-sizing:border-box;
}
.btns{
    //flex布局，内容居右对齐
    display: flex;
    justify-content: flex-end;
}
</style>
