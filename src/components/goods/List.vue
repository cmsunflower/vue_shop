<template>
    <div>
        <!--面包屑导航区域-->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!-- gutter 两个列之间的距离 -->
            <el-row :gutter="4">
                <el-col :span="8">
                    <!--搜索区域-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                    
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!--table表格区域-->
            <el-table
      :data="goodslist" border stripe>
      <el-table-column
        type="index" label="#">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称" width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)" width="95">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量" width="75">
      </el-table-column>
      <el-table-column
        label="创建时间" width="150">
        <template slot-scope="scope">
            <span>{{scope.row.add_time|dateFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
            </el-table>
        </el-card>
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //商品列表信息
            goodslist:[],
            //查询信息
            queryInfo:{
                query:'',
                //当前的页码
                pagenum:1,
                //当前页显示的条数
                pagesize:10
            },
            //总数据条数
            total:0,
        };
    },
    created() {
        this.getGoodsList();
    },
    mounted() {

    },
    methods: {
        //根据分页信息获取商品信息
        async getGoodsList(){
            const {data:res}=await this.$http.get('goods',{params:this.queryInfo});
            if(res.meta.status !==200) return this.$message.error('获取商品信息失败!');
            this.goodslist=res.data.goods;
            this.total=res.data.total;
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getGoodsList();
        },
        //监听pagenum的变化
        handleCurrentChange(newPage){
             this.queryInfo.pagenum=newPage;
            this.getGoodsList();
        },
        //监听删除按钮
        async removeById(goodsId){
            const confirmResult=await  this.$confirm('此操作将永久删除该商品, 是否继续?', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃删除'
            }).catch(err=>err);

            if(confirmResult!=='confirm') return this.$message.info('取消删除!');
            const {data:res}=await this.$http.delete(`goods/${goodsId}`);
            if(res.meta.status !== 200) return this.$message.error('删除商品失败');
            this.$message.success('删除商品成功!');
            this.getGoodsList();
        },
        //点击添加商品按钮，跳转到指定的页面
        goAddpage(){
            //路由导航对象
            this.$router.push('/goods/add');
        }
    }
};
</script>

<style lang="less" scoped>

</style>
