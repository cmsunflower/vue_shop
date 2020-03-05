<template>
    <div>
        <!--面包屑导航区域-->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <!--搜索文本框-->
                   <el-input placeholder="请输入内容">
                       <!-- slot：append输入框后置内容 -->
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
                </el-col>
            </el-row>
            <!--订单列表-->
            <el-table :data="orderlist" border stripe>
                <!--索引列-->
                <el-table-column type="index" label="#"> </el-table-column>
                <el-table-column  label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"> </el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"> </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dateFormat}}
                    </template>    
                 </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                                        <!--物流进度按钮-->
                                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
                                    </template>
                                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分页区域 -->
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--修改对话框-->
    <el-dialog @close="addressDialogClosed"
  title="修改订单地址"
  :visible.sync="addressVisible"
  width="50%">
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address1">
   <el-cascader :options="cityData"  v-model="addressForm.address1">

   </el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!--物流进度对话框-->
<el-dialog
  title="物流进度"
  :visible.sync="progressDialogVisible"
  width="50%">
  <!--timeline物流时间线-->
   <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
    </div>
</template>

<script>
//导入城市信息
import cityData from './citydata'
export default {
    data() {
        return {
            //获取订单列表参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            //订单列表
            orderlist:[],
            total:0,
            //控制修改地址对话框的显示和隐藏
            addressVisible:false,
            //修改地址选择框的数据
            addressForm:{
                address1:[],
                address2:'',
            },
            addressFormRules:{
                address1:[{
                    required:true,message:'请选择省市区县',trigger:'blur'
                }],
                address2:[
                    {required:true,message:'请输入详细地址',trigger:'blur'}
                ]
            },
            //城市信息，可以做简写 cityData
            cityData:cityData,
            //控制物流进度对话框的显示与隐藏
            progressDialogVisible:false,
            //物流信息数组
            progressInfo:[],
        };
    },
    created() {
        this.getOrderList();
    },
    mounted() {

    },
    methods: {
        async getOrderList(){
            const {data:res}=await this.$http.get('orders',{params:this.queryInfo});
            if(res.meta.status !== 200) return this.$message.error('获取订单列表失败');
            this.orderlist=res.data.goods;
            this.total=res.data.total;
            // console.log(this.orderlist);
            // this.$message.success('获取订单列表成功!');
        },
        //监听当前一页显示的条数
        handleSizeChange(pageSize){
            this.queryInfo.pagesize=pageSize;
            this.getOrderList();
        },
        //监听当前处于第几个分页
        handleCurrentChange(pageNum){
            this.queryInfo.pagenum=pageNum;
            this.getOrderList();
        },
        //修改地址
        showBox(){
            this.addressVisible=true;
        },
        //监听修改地址事件
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields();
        },
        //展示物流精度对话框
        async showProgress(){
            const {data:res}=await this.$http.get(`/kuaidi/804909574412544580`);
            if(res.data.status !== 200) return this.$message.error('物流进度获取失败!');
            this.progressInfo=res.data;
            // console.log(this.progressInfo);
            this.progressDialogVisible=true;
            console.log(this.progressInfo);
        }
    }
};
</script>

<style lang="less" scope>
    .el-cascader{
        width:100%;
    }
</style>
