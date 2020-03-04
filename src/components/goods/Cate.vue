<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <!--添加商品按钮-->
                <el-col :span="6">
                    <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
                </el-col>
            </el-row>
            <!--表格区域-->
            <tree-table class="treetable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false">
                <!--定义作用于插槽-->
                <!--是否有效-->
                <template v-slot:isok="scope">
                <!-- <template slot="isok" slot-scope="scope"> -->
                    <i class="el-icon-success" style="color:lightgreen"  v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color:red" v-else></i>
                </template>
                <!--排序模板-->
                <template v-slot:order="scope">
                    <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>
                    <el-tag v-else type="warning" size="mini">三级</el-tag>
                </template>
                <!--操作模板-->
                <template v-slot:opt="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCateDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!--分页区域-->
             <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
        </el-card>
        <!--添加分类的对话框-->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <!-- 添加分类表单 -->
            <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                    <el-cascader
                v-model="selectedKeys"
                :options="parentList"
                :props="cascaderProps"
                @change="parentCateChange" clearable change-on-select></el-cascader>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑对话框-->
        <el-dialog title="编辑分类信息" :visible.sync="editCateDialogVisible" width="50%">
        <el-form ref="editCateFormRef" :model="editCateForm" :rules="editCateRules" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //查询条件
            queryInfo:{
                type:3,
                //当前页码
                pagenum:1,
                //每页显示几条数据
                pagesize:5
            },
            //商品分类列表
            cateList:[],
            //默认的总数据条数
            total:0,
            columns:[
                {
                    //该列显示内容名称
                    label:'分类名称',
                    //绑定的数据名称
                    prop:'cat_name'
                },{
                    label:'是否有效',
                    //当前列使用自定义插槽
                    type:'template',
                    //模板名称 isok
                    template:'isok'
                },
                {
                    label:'排序',
                    //当前列使用自定义插槽
                    type:'template',
                    //模板名称 order
                    template:'order'
                },
                {
                    label:'操作',
                    //当前列使用自定义插槽
                    type:'template',
                    //模板名称 isok
                    template:'opt'
                }
            ],
            //控制添加分类对话框的显示与隐藏
            addCateDialogVisible:false,
            //添加分类对话框绑定数据
            addCateForm:{
                //添加分类名称
                cat_name:'',
                //父级分类id
                cat_pid:0,
                //分类等级,默认添加的是一级分类
                cat_level:0
            }, 
            //表单数据规则
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            //获取父级分类列表 只用2级数据就可以
            parentList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                //可以选中一级分类
                checkStrictly:true,
                //指定触发方式
                expandTrigger: 'hover',
                //指定具体选中的属性
                value:'cat_id',
                //指定看到的是那个属性
                label:'cat_name',
                //指定父子嵌套用的是那个属性
                children:'children'
            },
            //添加分类里的父级分类的id数组
            selectedKeys:[],
            //控制编辑对话框的显示与隐藏
            editCateDialogVisible:false,
            //编辑对话框绑定的表单数据
            editCateForm:{},
            //编辑表单的规则
            editCateRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.getCateList();
    },
    mounted() {

    },
    methods: {
        //获取商品分类数据
       async getCateList(){
           //get请求 获取商品列表
           const {data:res}=await this.$http.get('categories',{params:this.queryInfo});
           if(res.meta.status !== 200) return this.$message.error('获取商品数据失败');
           //给商品列表赋值
           this.cateList=res.data.result;
           //给默认送数据条数赋值
           this.total=res.data.total;
           console.log(res.data);
        },
        //监听pagesize改变 pagesize表示当前页显示几条数据
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getCateList();
        },
        //监听页码值的改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getCateList();
        },
        showAddCateDialog(){
            //先获取父级分类列表
            this.getParantCateList();
            //展示对话框
            this.addCateDialogVisible=true;
            
        },
        //获取父级分类
        async getParantCateList(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200) return this.$meassage.error('获取父级分类数据失败！');
            this.parentList=res.data;
            // console.log(res.data);
        },
        //选择项发生变化触发函数
        parentCateChange(){
            //打印出来的选中的
            // console.log(this.selectedKeys);
            //如果selectedKeys数组中的length大于0，选中了父级分类
            //反之，说明未选中任何父级分类
            if(this.selectedKeys.length>0) {
                //最后一项作为当前项的父级
               this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1];
               //当前添加的项的等级等于已选中的数组长度
               this.addCateForm.cat_level=this.selectedKeys.length;
               return;
            }else{
                //如果长度等于0，表示添加的时父级
                this.addCateForm.cat_pid=0;
                this.addCateForm.cat_level=0;
            }
        },
        //点击按钮
       addCate(){

            // console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('请输入合适的分类信息!');
                 const {data:res}=await this.$http.post('categories',{cat_id:this.addCateForm.cat_pid,cat_name:this.addCateForm.cat_name,cat_level:this.addCateForm.cat_level});
                if(res.meta.status !== 201) return this.$message.error('添加分类失败!');
                this.getCateList();
                this.$message.success('添加分类信息成功!');
                this.addCateDialogVisible=false;
            })
        },
        //监听对话框的关闭事件，重置表单事件
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            
            //将选中的父级内容清空
            this.selectedKeys=[];
            //将分类对话框的数据清空
            this.addCateForm.cat_level=0;
            this.addCateForm.cat_pid=0;
        },
        //编辑分类名称对话框
        async editCateDialog(cateInfo){
            this.editCateDialogVisible=true;
            const {data:res}=await this.$http.get(`categories/${cateInfo.cat_id}`);
            if(res.meta.status !==200) return this.$message.error('分类名称获取失败!');
            this.editCateForm=res.data;
        },
        //确认修改 提交修改信息
        editCate(){
            this.$refs.editCateFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('分类名称验证失败!');
                console.log(this.editCateForm);
                const {data:res}=await this.$http.put(`categories/${this.editCateForm.cat_id}`,{cat_name:this.editCateForm.cat_name});
                if(res.meta.status !== 200) return this.$message.error('修改分类名失败!');
                this.$message.success('修改分类名成功!');
                this.getCateList();
                this.editCateDialogVisible=false;
            })
        },
        // 重置表单
        editCateDialogClosed(){
            this.$refs.editCateFormRef.resetFields();
        },
        //删除表单弹出提示对话框
       async deleteCate(cateInfo){
            const confirmResult=await  this.$confirm('此操作将永久删除该商品分类, 是否继续?', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃删除'
            }).catch(err=>err);

            if(confirmResult!=='confirm') return this.$messsage.error('取消删除改商品分类!');
            const {data:res}=await this.$http.delete(`categories/${cateInfo.cat_id}`);
            if(res.meta.status !== 200) return this.$message.error('删除商品分类失败!');
            this.getCateList();
            this.$message.success('删除改商品信息成功')
        }
    }
};
</script>

<style lang="less" scoped>
.treetable{
    margin-top:15px;
}
.el-cascader{
    width:100%;
}
</style>
