<template>
<el-container class="home-container">
    <!--头部区域-->
  <el-header>
      <div>
        <img src="@/assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
      <!--侧边栏-->
    <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu :collapse="isCollapse" :collapse-transition="false" background-color="#545c64" text-color="#fff" active-text-color="#409bff" unique-opened router :default-active="activePath">
            <!-- <el-menu :collapse="isCollapse" :collapse-transition="false" background-color="#545c64" text-color="#fff" active-text-color="#409bff" unique-opened router :default-active="this.$route.path"> -->
        <!--激活的文本色-->
        <!--一级菜单-->
        <!--给index绑定动态值 不然点一个其他都关闭了 只接受字符串 下面是未修改之前的-->
        <!-- <el-submenu index="1" v-for="item in menulist" :key="item.id"> -->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
            <!--图标显示-->

          <i :class="iconsObj[item.id]"></i>
          <!--一级菜单标题-->
          <span>{{item.authName}}</span>
        </template>
        <!--二级菜单-->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
            <template slot="title">
            <!--图标显示-->
                <i class="el-icon-menu"></i>
                <!--一级菜单标题-->
                <span>{{subItem.authName}}</span>
            </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!--主体区域-->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist:[],
            //将图标绑定到不同的菜单id上
            iconsObj:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            isCollapse:false,
            //被激活的来链接地址
            activePath:''
        };
    },
    //？
    created() {
        //生命函数，只要一加载就会显示
        this.getMenuList();
        this.activePath=window.sessionStorage.getItem('activePath');
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
        },
        //获取所有菜单
        //?
        async getMenuList(){
            const {data :res}=await this.$http.get('menus');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menulist =res.data;
            console.log(res);
        },
        //点击按钮，切换展开或折叠
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath;
        }
    }
};
</script>

<style lang="less" scoped>
.home-container{
    height:100%;
}
.el-header{
    background-color:#373d41;
    /* 两端对齐 */
    display:flex;
    justify-content:space-between;
    /* 将el-header贴边对齐 */
    padding-left:0px;
    //?
    align-items: center;
    color:#fff;
    font-size:20px;
    > div{
        //img span垂直居中
        display:flex;
        align-items:center;
        span{
            margin-left:15px;
        }
    }
}
.el-aside{
    background-color:#333744;
    .el-menu{
        border-right:none;
    }
}
.el-main{
    background-color:#eaedf1;
}
.iconfont{
    margin-left:10px;
}
.toggle-button{
    background-color:#4A5064;
    color:#fff;
    font-size:10px;
    text-align:center;
    line-height:24px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
