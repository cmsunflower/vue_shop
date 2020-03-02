<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
          <el-row>
              <el-col>
                  <!--角色列表区域-->
                  <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
              </el-col>
          </el-row>
            <el-table :data="rolelist" border stripe>
                <!-- <el-table-column></el-table-column> -->
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!--class绑定?-->
                        <el-row  class="vcenter" v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1===0?'bdtop':'']">
                            <!--一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--二级权限+三级权限-->
                            <el-col :span="19">
                                <!--通过for循环渲染二级权限-->
                                <!--给顶部添加边框-->
                                <!--下面两种绑定类的方式都正确-->
                                <el-row :class="[i2==0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <!-- <el-row :class="{bdtop:i2!==0}" v-for="(item2,i2) in item1.children" :key="item2.id"> -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag @close="removeRightById(scope.row,item3.id)" type="warning" closable v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>{{scope.row}}</pre> -->
                    </template>
                </el-table-column>
                <!--索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
<el-dialog title="分配权限" 
  :visible.sync="setRightDialogVisible"
  width="50%" @closed="setRightDialogClosed">
 <!--分配权限主体区域-->
 <!--树形权限-->
 <el-tree :data="rightslist" ref="treeRef" node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" show-checkbox :props="treeProps"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
        </el-card>
        <!--添加角色对话框-->
        <el-dialog
  title="添加用户"
  :visible.sync="addRolesDialogVisible"
  width="30%" @close="setRolesDialogClosed">
  <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="addRoleFormRules"  label-width="100px">
                <el-form-item label="用户名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
<!--编辑提交角色对话框-->
<el-dialog
  title="修改用户角色"
  :visible.sync="editRolesDialogVisible"
  width="30%">
  <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="editRoleFormRules"  label-width="100px">
                <el-form-item label="用户名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //所有角色列表
            rolelist:[],
            //权限列表
            rightslist:[],
            setRightDialogVisible:false,
            //添加角色对话框的显示与隐藏
            addRolesDialogVisible:false,
            //权限分配显示
            treeProps:{
                //
                children:'children',
                //指定看到的是那个属性
                label:'authName'
            },
            //默认选中节点的id值
            defKeys:[],
            //当前即将分配权限的id
            roleid:'',
            //添加用户表单信息
            addRoleForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
            },
            addRoleFormRules:{
                 roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '用户名长度在2~15个字符之间', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: false, message: '请输入角色描述', trigger: 'blur' },
                    { min: 2, max: 15, message: '用户名长度在2~15个字符之间', trigger: 'blur' }
                ],
            },
            //修改角色信息
            editRoleForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
            },
            //修改用户表单规则
            editRoleFormRules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '用户名长度在2~15个字符之间', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: false, message: '请输入角色描述', trigger: 'blur' },
                    { min: 2, max: 15, message: '用户名长度在2~15个字符之间', trigger: 'blur' }
                ],
            },
            editRolesDialogVisible:false,
        };
    },
    created() {
        this.getRolesList();
    },
    mounted() {

    },
    methods: {
       async getRolesList(){
            const {data:res}=await this.$http.get('roles');
            if(res.meta.status !== 200) return this.$message.error('获取角色列表失败!');
            this.rolelist=res.data;
            console.log(res.data);
        },
        //根据id删除对应的权限
        async removeRightById(role,rightId){
            //弹框提示用户是否删除
            const confirmResult=await this.$confirm('此操作将永久删除用户权限, 是否继续?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err);
            if(confirmResult !== 'confirm') return this.$message.info('取消删除用户权限!');
            // console.log('确认删除!');
            //发起删除请求
            const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
            //删除失败
            if(res.meta.status !== 200) this.$message.error('删除角色权限失败!');
            // this.getRolesList();
            //调用getRoleList会重新渲染数据,将插槽中的数据重新赋值
            //返回的数据是当前的最新权限
            //method中每次调用会渲染界面
            role.children=res.data;
            this.$message.success('删除角色权限成功');
        },
        //展示分配权限的对话框显示
       async showSetRightDialog(role){
           this.roleid=role.id;
            //获取所有权限列表
            const {data:res}=await this.$http.get('rights/tree');
            if(res.meta.status !== 200) return this.$message.error('权限获取失败!');
            //获取到的权限数据保存到data中
            this.rightslist=res.data;
            console.log(res.data);
            //获取三级节点的id
            this.getLeafKeys(role,this.defKeys);
            //显示对话框
            
            this.setRightDialogVisible=true;
        },
        //通过递归的形式，获取角色下的所有三级权限的id，并保存到defKeys中
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id);
            }
            node.children.forEach(item=>{
                this.getLeafKeys(item,arr);
            })
        },
        //监听分配对话框的关闭事件
        setRightDialogClosed(){
            //每次点开都会向defKeys数组中添加内容，角色权限会叠加，需要每次关闭，清空defKeys
            this.defKeys=[];
        },
        //点击确定分配权限
        async allotRights(){
            const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
            const idStr=keys.join(',');
            //其中的roleid在showSetRightDialog方法中定义使用到了插槽来传递过来的
            const {data:res}=await this.$http.post(`roles/${this.roleid}/rights`,{rids:idStr});
            // console.log(keys)
            if(res.meta.status !== 200) return this.$message.error('分配权限失败');
            this.$message.success('分配权限成功！');
            //刷新权限列表
            this.getRolesList();
            this.setRightDialogVisible=false;
            
        },
        async deleteRole(roleInfo){
             const confirmResult=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err);
            if(confirmResult!=='confirm'){
                return this.$message.info('取消删除!');
            }
            const {data:res}=await this.$http.delete(`roles/${roleInfo.id}`);
            if(res.meta.status !== 200) return this.$message.error('删除角色失败!');
            this.getRolesList();
            this.$message.success('删除角色成功!');
        },
        //确定添加用户信息
        async addRole(){
            //验证角色信息
            this.$refs.addRoleFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('角色格式输入有误!');
                const {data:res}=await this.$http.post('roles',{roleName:this.addRoleForm.roleName});
                if(res.meta.status !== 201) return this.$message.error('添加角色失败!');
                this.$message.success('添加角色成功!');
                this.getRolesList();
                this.addRolesDialogVisible=false;
            })
        },
        //点击添加角色的关闭按钮的时候，重置表单
        setRolesDialogClosed(){
            this.$refs.addRoleFormRef.resetFields();
        },
        //编辑用户角色
        async editRole(userRole){
           const {data:res}=await this.$http.get(`roles/${userRole.id}`);
           if(res.meta.status !==200 ) return this.$message.error('获取角色信息失败!');
           this.editRoleForm=res.data;
            this.editRolesDialogVisible=true;
        },
        //点击确定按钮之后更新页面信息
        async editRoleInfo(){
            this.$refs.editRoleFormRef.validate(async valid=>{
                if(!valid) return this.$message.info('验证角色信息失败!');
                const {data:res}=await this.$http.put(`roles/${this.editRoleForm.roleId}`,{roleName:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc});
                if(res.meta.status !== 200 ) return this.$message.error('编辑角色信息失败!');
                //提交了信息之后，页面不刷新
                this.editRolesDialogVisible=false;
                this.getRolesList();
                this.$message.success('编辑用户信息成功！');
                
            })
        }
    }
};
</script>

<style lang="less" scoped>
 .el-tag{
     margin:7px;
 }
 .bdtop{
     border-top:1px solid #eee;
 }
 .bdbottom{
     border-bottom:1px solid #eee;
 }
//  纵向对齐
 .vcenter{
     display:flex;
     align-items: center;
 }
</style>
