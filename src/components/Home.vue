<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
        Home组件
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //点击退出按钮的时候，清空token 编程路由导航到指定页面
        logout(){
            //清空token
            window.sessionStorage.clear();
            //编程式导航到login页面
            this.$router.push('/login');
        }
    }
};
</script>

<style type="less" scoped>

</style>
