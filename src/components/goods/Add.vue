<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--添加商品卡片区域-->
        <el-card>
            <!--提示区域-->
            <el-alert
    title="添加商品信息"
    type="info"
    show-icon center :closable="false"></el-alert>
    <!--进度条-->
    <el-steps :space="500" :active="activeIndex-0" :align-center="true" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
    </el-steps>
    <!--Tabs标签信息-->
    <el-form label-position="top" ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
      <el-tabs @tab-click="tabClicked" :before-leave="beforeTabLeave" :tab-position="'left'" v-model="activeIndex" >
         <el-tab-pane label="基本信息" name="0">
         <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="addForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="addForm.goods_price" type="number"></el-input>
  </el-form-item>
  <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="addForm.goods_weight" type="number"></el-input>
  </el-form-item>
  <el-form-item label="商品数量" prop="goods_number">
    <el-input v-model="addForm.goods_number" type="number"></el-input>
  </el-form-item>
  <el-form-item label="商品分类" prop="goods_cat">
       <el-cascader
    v-model="addForm.goods_cat"
    :options="catelist"
    :props="cascaderProps"
    @change="handleChange"></el-cascader>
  </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
        <!--渲染动态参数表单的item项-->
        <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
            <!-- 复选框组 -->
             <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
  </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>
    <!--静态属性列表参数-->
    <el-tab-pane label="商品属性" name="2">
        <el-form-item v-for="item in onlyTabData" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <el-upload
  :action="uploadURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture" :headers="headerObj" :on-success="handleSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <!--富文本编辑器组件引入-->
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>    
        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
    </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%">
  <img :src="previewPath" alt="" class="previewImg">
</el-dialog>
<!-- 添加商品按钮 -->
    </div>
</template>

<script>
import  _  from 'lodash'
export default {
    data() {
        return {
            activeIndex:0,
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                //后面需要转成逗号分割的字符串
                goods_cat:[],
                goods_number:0,
                //图片的地址数组
                pics:[],
                //商品内容绑定
                goods_introduce:'',
                attrs:[],
            },
            addFormRules:{
                goods_name:[
                    {required:true,message:'请输入商品名称',trigger:'blur'}
                ],
                goods_number:[
                     {required:true,message:'请输入商品数量',trigger:'blur'}
                ],
                goods_price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ],
                goods_weight:[
                    {required:true,message:'请输入商品重量',trigger:'blur'}
                ],
                goods_cat:[
                    {required:true,message:'请输入商品分类',trigger:'blur'}
                ],
            },
            //商品分类的数据列表
            catelist:[],
            //商品分类级联选择框的配置参数
            cascaderProps:{
                //选择到
                checkStrictly:true,
                //触发方式 hover
                expandTrigger: 'hover' ,
                //绑定catelist的cat_id
                value:'cat_id',
                //显示catelist的cat_name
                label:'cat_name',
                //通过catelist的children做级联嵌套
                children:'children'
            },
            //动态参数列表数据
            manyTabData:[],
            //静态属性数据
            onlyTabData:[],
            //上传图片的地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            //图片上传组件的headers请求头对象
            headerObj:{
                //手动获取请求头 请求头里包含token 通信证
                Authorization:window.sessionStorage.getItem('token'),
            },
            //图片预览地址
            previewPath:'',
            previewVisible:false,
        };
    },
    created() {
        this.getCateList();
    },
    mounted() {

    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3)
            return this.addForm.goods_cat[2];
        }
    },
    methods: {
        //获取商品分类数据
        async getCateList(){
            const {data:res}=await this.$http.get('categories');
            if(res.meta.status !== 200) return this.$message.error('获取商品数据失败!');
            this.catelist=res.data;
            this.$message.success("获取商品列表成功");
        },
        //级联选择器变化 会触发改函数
        handleChange(){
            if(this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat=[];
            }
            console.log(this.addForm.goods_cat);
        },
        //监听切换 activeName 即将进入的标签页名 oldActiveName 即将离开的标签页名
        beforeTabLeave(activeName,oldActiveName){
            console.log("即将进入的标签页名："+activeName);
            console.log("即将离开的标签页名："+oldActiveName);
            //阻止标签页的切换 返回 false /使用promise 返回 rejected
            // return false;
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                this.$message.error('请先选择商分类!');
                return false;
            }
        },
        //切换tab绑定事件
        async tabClicked(){
            //访问动态参数面板
            if(this.activeIndex==='1'){
                //发起请求，获取商品动态参数信息
                const {data:res}=await this.$http.get(`categories/${this.cateId}}/attributes`,{params:{sel:'many'}});
                if(res.meta.status !== 200) return this.$message.error('获取动态参数失败');
                // console.log(res.data)
                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ');;
                })
                this.manyTabData=res.data;
            }else if(this.activeIndex==='2'){
                const {data:res}=await this.$http.get(`categories/${this.cateId}}/attributes`,{params:{sel:'only'}});
                if(res.meta.status !== 200) return this.$message.error('获取属性失败');
                this.onlyTabData=res.data;
            }
            console.log(this.activeIndex);
        },
        //处理图片预览事件
        handlePreview(file){
            console.log(file);
            this.previewPath=file.response.data.url;
            this.previewVisible=true;
        },
        //处理移除图片的操作
        handleRemove(file){
            //获取将要移除的图片临时路径
            const filepath=file.response.data.tmp_path;
            //从pics数组中找到改图片
            const i=this.addForm.pics.findIndex(x=>x.pic === filepath );
            //调用数组splice删除
            this.addForm.pics.splice(i,1);
            // console.log(this.addForm.pics);
        },
        //上传土拍你成功之后获取 图片的存储地址
        handleSuccess(response){
            //拼接得到一个图片信息对象
            const picInfo={pic:response.data.tmp_path};
            //将图片信息对象，push到pics数组中
            this.addForm.pics.push(picInfo);
            console.log(response);
        },
        //添加商品信息
        add(){
            //进行表单验证
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return this.$message.error('请填写必要的表单项!');
                //将goods_cat转成字符串
                //因为级联选择器双向绑定到goods_cat 下面的操作会显示错误
                //深拷贝
                const form=_.cloneDeep(this.addForm);
                form.goods_cat=form.goods_cat.join(',');
                //处理动态参数和静态属性
                // attr
                console.log(this.manyTabData);
                this.manyTabData.forEach(item=>{
                    const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')};
                    this.addForm.attrs.push(newInfo);
                })
                this.onlyTabData.forEach(item=>{
                    const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals};
                    this.addForm.attrs.push(newInfo);
                })
                form.attrs=this.addForm.attrs;
                // console.log(form);
                const {data:res}=await this.$http.post('goods',form);
                if(res.meta.status !==201) return this.$message.error('添加商品失败!');
                // this.$message.success('添加商品成功!');
                //编程式导航跳转到goods下面
                this.$router.push('/goods');
                
            })
        }
    }
};
</script>

<style lang="less" scoped>
.previewImg{
    width:100%;
}
.btnAdd{
    margin-top:15px;
}
</style>
