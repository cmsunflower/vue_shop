<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡篇视图区域-->
        <el-card>
                <!--警告区域-->
              <el-alert show-icon title="注意：只允许为第三级分类设置相关参数!" type="warning" :closable="false">
             </el-alert>
             <!--选择商品分类区域-->
             <el-row class="cat_opt">
                 <el-col><span>选择商品分类：</span>
                 <el-cascader  v-model="selectedCateKeys" :options="catelist" :props="cateProps"  @change="handleChange"></el-cascader></el-col>
             </el-row>
             <!--tabs页签-->
             <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many">
        <!--添加参数按钮-->
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
        <!--动态参数表格-->
        <el-table :data="manyTabData"  border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                   <!--输入文本框-->
                    <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!--添加按钮-->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
        <!--添加参数按钮-->
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
        <el-table :data="onlyTabData"  border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                 <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                 <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!--添加按钮-->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-tab-pane>
  </el-tabs>
        </el-card>
        <!--添加动态参数和静态属性共用一个对话框-->
        <el-dialog  :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form ref="addDialogFormRef" :model="addForm" label-width="100px" :rules="addDialogFormRules">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    <!--修改动态/静态参数-->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form ref="editDialogFormRef" :model="editForm" label-width="100px" :rules="editDialogFormRules">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editFormDialog">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //商品分类列表
            catelist:[],
            //级联选择框的配置
            cateProps:{
                //展开方式 浮动到上面 就可以展开
                expandTrigger: 'hover' ,
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择框 选中内容的id
            selectedCateKeys:[],
            activeName:'many',
            //动态面板数据
            manyTabData:[],
            //静态配置面板数据
            onlyTabData:[],
            //动态参数和静态属性公用对话框显示
            addDialogVisible:false,
            addForm:{},
            addDialogFormRules:{
                attr_name:[
                    {required:true,message:'请输入合适的参数',trigger:'blur'}
                ]
            },
            //控制修改对话框的显示与隐藏
            editDialogVisible:false,
            //修改表单对象
            editForm:{},
            //修改表单验证规则
            editDialogFormRules:{
                attr_name:[{
                    required:true,message:'请输入合适的参数',trigger:'blur'
                }]
            },
            //默认显示按钮 隐藏按钮+New Tag
            inputVisible:false,
            //默认文本框输入的内容
            inputValue:''
        };
    },
    created() {
        this.getCateList();
    },
    mounted() {

    },
    computed:{
        //如果按钮被经用，则返回true;否则返回false
        // 将属性绑定到disabled上
        isBtnDisabled(){
            if(this.selectedCateKeys.length!==3){
                 return true;
            }else{
                return false;
            }
        },
        //当前选中的三级分类id
        cateId(){
            if(this.selectedCateKeys.length===3){
                return this.selectedCateKeys[2];
            }
                return null;
        },
        //添加动态/静态动态计算标题的文本
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    },
    methods: {
        //获取所有商品的分类数据列表
        async getCateList(){
            const {data:res}=await this.$http.get('categories');
            if(res.meta.status !== 200 ) return this.$message.error('获取商品信息失败!');
            this.catelist=res.data;
            // console.log(res.data);
            // this.$message.success('获取商品分类列表成功!');
        },
        //级联选择框选中会触发这个函数
        handleChange(){
            this.getParamsData();
        },
        //获取参数的列表数据
        async getParamsData(){
            if(this.selectedCateKeys.length !==3){
                this.selectedCateKeys=[];
                //当选中项没有第三项的时候，就直接清空，参数内容
                this.manyTabData=[];
                this.onlyTabData=[];
                return;
            }
            console.log(this.selectedCateKeys);
            //根据所选分类的id和当前所处的面板name，获取参数列表数据
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
            if(res.meta.status !== 200) return this.$message.error('获取分类列表信息失败!')
            // console.log(res.data);
            //将返回的值做一次循环
            res.data.forEach(item=>{
                //将数据在展开行进行渲染
                item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[];
                //添加布尔值 控制文本框的显示与隐藏
                item.inputVisible=false;
                //默认文本框输入的值
                item.inputValue='';
            });
            if(this.activeName == 'many'){
                //动态参数面板数据
                this.manyTabData=res.data;
                // console.log(this.manyTabData);
            }else{
                //静态配置面板数据
                this.onlyTabData=res.data;
                // console.log(this.onlyTabData);
            }
        },
        //tab-click绑定 tab切换事件 v-model值的变化
        handleTabClick(tab,event){
            this.getParamsData();
             console.log(this.activeName);
        },
        //监听对话框的关闭事件
        addDialogClosed(){
            this.$refs.addDialogFormRef.resetFields();
        },
        addParams(){
            this.$refs.addDialogFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('验证信息失败!');
                //发起请求 将动态或静态数据添加提交
                const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName});
                if(res.meta.status !== 201) return this.$message.error('添加属性失败');
                this.getCateList();
                this.addDialogVisible = false;
            })
        },
        async showEditDialog(attr_id){
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
            if(res.meta.status !== 200) return this.$message.error('获取表单数据失败');
            this.editForm=res.data;
            this.editDialogVisible=true;
        },
        editFormDialog(){
            this.$refs.editDialogFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName,});
                if(res.meta.status !==200) return this.$message.error('修改信息失败');
                this.getCateList();
                this.editDialogVisible=false;
                this.$message.success('修改信息成功!');
            })
        },
        editDialogClosed(){
            this.$refs.editDialogFormRef.resetFields();
        },
        async removeParams(attr_id){
           const confirmResult=await this.$confirm('此操作将永久删除该参数, 是否继续?', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃删除'
            }).catch(err=>err);
            if(confirmResult !== 'confirm') return this.$message.info('取消删除该参数！');
            const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
            if(res.meta.status !== 200) return thhis.$message.error('删除信息失败！');
            this.$message.success('删除信息成功！');
            this.getParamsData();
        },
        showInput(row){
            row.inputVisible=true;
            //让文本框获取焦点
            this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
            
        },
        //文本框失去焦点 或按下enter键都会触发
        async handleInputConfirm(row){
            //判断输入的值是否合法
            if(row.inputValue.trim().length ===0 ){
                row.inputValue='';
                row.inputVisible=false;
                return;
            }
            //如果用户有输入内容，进行后续处理
            row.attr_vals.push(row.inputValue.trim());
            row.inputValue='';
            row.inputVisible=false;
            // row.inputVisible = false;
            //发起请求 保存参数
            //由于原来的attr_vals时字符串 用空格分开 因此请求的时候 利用join(" ")将数组转换成字符串
           this.saveAttrValues(row);
        },
        async handleClose(i,row){
            row.attr_vals.splice(i,1);
            this.saveAttrValues(row);
        },
        //将对attr_vals的操作保存到数据库
        async saveAttrValues(row){
             const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')});
           if(res.meta.status !==200){return this.$message.error('修改参数失败')};
           this.$message.success('修改参数成功!');
        }
    }
};
</script>

<style lang="less" scoped>
.cat_opt{
    margin:15px;
}
.el-tag{
    margin:5px;
}
.input-new-tag{
    width:120px;
}
</style>
