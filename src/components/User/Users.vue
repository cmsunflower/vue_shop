<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
           
        <!--搜索区域-->
        <el-row :gutter="20">
             <!--搜索区域-->
            <el-col :span="7">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserSearch()"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>
        <!--用户列表区域-->
        <el-table :data="userlist" border stripe>
            <!-- <el-table-column></el-table-column> -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state" >
                <template slot-scope="scope">
                    <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state">
                    </el-switch>
                </template>scope
            </el-table-column>
            <el-table-column label="操作" width="250px">
                <template slot-scope="scope">
                    <!--修改按钮-->
                    <el-button  type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    <!--删除按钮-->
                        <el-button  type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                    <!--分配角色按钮-->
                    <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button  type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!--添加用户的对话框-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
           <!-- 内容主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules"  label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户信息区域-->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form ref="editForm" :model="editForm" label-width="100px" :rules="editFormRules">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
             </span>
        </el-dialog>
        <!--分页区域-->
        <el-pagination  @size-change="handleSizeChange"  @current-change="handleCurrentChange"  :current-page="queryInfo.pagenum"  :page-sizes="[1, 2, 5, 10]"  :page-size="queryInfo.pagesize"  layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        //校验邮箱的规则
        var checkEmial=(rule,value,callback)=>{
            //使用正则验证邮箱
            const regEmail=/^\w+@\w+(\.\w+)+$/;
            if(regEmail.test(value)){
                return callback();
            }
            callback(new Error('请输入合法邮箱'));
        };
        // 校验手机号的规则
        var checkMobil=(rule,value,callback)=>{
            const regMobile=/^1[34578]\d{9}$/;
            if(regMobile.test(value)){
                return callback();
            }
            callback(new Error('请输入合法手机号'));
        }

        return {
            //获取用户列表信息
            queryInfo:{
                //搜索的数据信息
                query:'',
                //当前的页数
                pagenum:1,
                //当前页显示多少条数据
                pagesize:2
            },
            userlist:[],
            total:0,
            //控制添加用户对话框的显示与隐藏
            addDialogVisible:false,
            //修改用户对话框的显示隐藏
            editDialogVisible:false,
            //添加用户表单数据
            addForm:{
                username:'',
                pawwsord:'',
                email:'',
                mobile:'',
            },
            //查询到的用户信息
            editForm:{},
            //添加用户表单数据验证规则对象
            addFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度在3~10个之间', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '用户名长度在6~15个字符之间', trigger: 'blur' }
                ],
                email:[
                      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                      {validator:checkEmial,tigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator:checkMobil,trigger:'blur'}     
                    ]
            },
            editFormRules:{
                email:[
                      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                      {validator:checkEmial,tigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator:checkMobil,trigger:'blur'}     
                    ]
            }
        };
    },
    created() {
        //页面一创建就渲染用户列表数据
        this.getUserList();
    },
    mounted() {

    },
    methods: {
        //获取用户列表数据
        async getUserList(){
            // 使用await会获得对象
            const {data:res}=await this.$http.get('/users',{params:this.queryInfo});
            if(res.meta.status !== 200) return this.$message.error('数据获取失败!');
            this.userlist=res.data.users;
            this.total=res.data.total;
            console.log(res)
        },
        //监听pagesize事件 pagesize每页显示几条内容
        handleSizeChange(newSize){
            // console.log(newSize);
            this.queryInfo.pagesize=newSize;
            this.getUserList();
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage){
            // console.log(newPage)
            this.queryInfo.pagenum=newPage;
            this.getUserList();
        },
        //监听开关状态的改变
        async userStateChanged(userinfo){
            // console.log(userinfo);
            //使用目模板字符串
            const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
            if(res.meta.status !== 200){
                //修改失败 将页面上的状态重置回去
                userinfo.mg_state=! userinfo.mg_state
                return this.$message.error('用户状态修改失败!');
            } 
            this.$message.success('更新状态成功!');
            // res.data.mg_state=usrinfo.
        },
        getUserSearch(){
            this.queryInfo.pagenum=1;
            this.getUserList();
        },
        //监听添加用户对话框的关闭事件,点击关闭重置表单
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        //点击按钮添加用户
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid ) return;
                //可以发起添加用户的网络请求
                const {data:res}=await this.$http.post('users',this.addForm)
                if(res.meta.status !== 201) return this.$message.error('添加用户失败!');
                this.$message.success('添加用户成功');
                this.addDialogVisible=false;
                //刷新列表
                this.getUserList();
                // console.log(res);
            })
        },
        //展示编辑用户的对话框
       async showEditDialog(id){
            const {data: res}=await this.$http.get(`users/${id}`);
            // console.log(id);
            if(res.meta.status !==200) return this.$message.error('查询用户数据失败!');
            this.editForm=res.data;
            this.editDialogVisible=true;
        },
        //编辑表单重置
        editDialogClosed(){
            this.$refs.editForm.resetFields();
        },
        //点击确认按钮,提交数据
        editUserInfo(){
            this.$refs.editForm.validate(async valid=>{
                if(!valid) return this.$message.error('修改验证失败');
                //验证通过发起修改请求
                const {data:res}=await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,mobile:this.editForm.mobile});
                if(res.meta.status!==200) return this.$message.error('更新用户信息失败!');
                //关闭对话框
                this.editDialogVisible=false;
                //重新获取用户数据
                this.getUserList();
                //提示修改成功
                this.$message.success('用户信息修改成功!');
            } )
        },
        //根据id删除对应用户的内容
       async  removeUserById(id){
            //messageBox 弹框提示 是否删除数据 全局状态下 直接使用 
            //返回的是promise
            const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err);
                //使用catch 捕获了 取消删除
                //如果用户确认删除返回的是 字符串 confirm
                //用户取消删除返回的是 字符串 cancel
            if(confirmResult !== 'confirm'){
                return this.$message.info('用户取消删除!');
            }
            const {data:res}=await this.$http.delete('users/'+id);
            if(res.meta.status !==200) return this.$message.error('删除用户失败!');
            this.$message.success('删除用户成功!');
            //刷新列表
            this.getUserList();
            // console.log('确认删除');
        }
    }
};
</script>

<style lang="less" scoped>

</style>
