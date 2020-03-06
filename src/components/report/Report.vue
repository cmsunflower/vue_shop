<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--2.echart图标区域 -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
//1.导入ecarts
import echarts from 'echarts'

//导入lodash合并数据
import _ from 'lodash'
export default {
    data() {
        return {
            //需要合并的数据
            options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        };
    },
    created() {

    },
    //dom元素已经被渲染完毕
    async mounted() {
        //3.获取Dom 初始化echarts示例
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res}=await this.$http.get('reports/type/1');
        if(res.meta.status !== 200) return this.$message.error('获取数据失败！');

        //4.准备数据和配置项
        //  var option = {
        //     title: {
        //         text: 'ECharts 入门示例'
        //     },
        //     tooltip: {},
        //     legend: {
        //         data:['销量']
        //     },
        //     xAxis: {
        //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        //     },
        //     yAxis: {},
        //     series: [{
        //         name: '销量',
        //         type: 'bar',
        //         data: [5, 20, 36, 10, 10, 20]
        //     }]
        // };
       const result= _.merge(res.data,this.options);
        // 5.使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },
    methods: {

    }
};
</script>

<style>

</style>
