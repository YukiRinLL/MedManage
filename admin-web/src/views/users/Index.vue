<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button v-if="isSuperAdmin" type="primary" @click="showCreateDialog">
            <el-icon><Plus /></el-icon>
            创建用户
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
            <el-option label="全部" :value="-1" />
            <el-option label="普通用户" :value="0" />
            <el-option label="管理员" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button v-if="isSuperAdmin" link type="warning" @click="handleEditRole(row)">修改角色</el-button>
            <el-button v-if="isSuperAdmin" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="pagination.page"
        :page-size.sync="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchUsers"
        @current-change="fetchUsers"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="roleDialogVisible" title="修改用户角色" width="400px">
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="用户姓名">
          <el-input v-model="roleForm.userName" disabled />
        </el-form-item>
        <el-form-item label="当前角色">
          <el-tag :type="getRoleType(roleForm.currentRole)">
            {{ getRoleText(roleForm.currentRole) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新角色">
          <el-select v-model="roleForm.newRole" placeholder="请选择角色">
            <el-option label="普通用户" :value="0" />
            <el-option label="管理员" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateRole">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="createDialogVisible" title="创建用户" width="500px">
      <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="100px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="createForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="createForm.gender">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="createForm.age" type="number" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="createForm.role" placeholder="请选择角色">
            <el-option label="普通用户" :value="0" />
            <el-option label="管理员" :value="1" />
            <el-option label="超级管理员" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const isSuperAdmin = computed(() => userStore.isSuperAdmin)

const loading = ref(false)
const tableData = ref([])
const roleDialogVisible = ref(false)
const createDialogVisible = ref(false)
const createFormRef = ref(null)

const searchForm = reactive({
  phone: '',
  name: '',
  role: -1
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const roleForm = reactive({
  userId: null,
  userName: '',
  currentRole: 0,
  newRole: 0
})

const createForm = reactive({
  phone: '',
  password: '',
  name: '',
  gender: 0,
  age: '',
  role: 0
})

const createRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const getRoleType = (role) => {
  const types = { 0: 'info', 1: 'warning', 2: 'danger' }
  return types[role] || 'info'
}

const getRoleText = (role) => {
  const texts = { 0: '普通用户', 1: '管理员', 2: '超级管理员' }
  return texts[role] || '未知'
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    if (searchForm.role === -1) {
      delete params.role
    }
    const res = await request.get('/admin/list', { params })
    tableData.value = res.data || []
    pagination.total = res.data?.length || 0
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchUsers()
}

const handleReset = () => {
  searchForm.phone = ''
  searchForm.name = ''
  searchForm.role = -1
  pagination.page = 1
  fetchUsers()
}

const handleView = (row) => {
  router.push(`/users/${row.id}`)
}

const handleEditRole = (row) => {
  roleForm.userId = row.id
  roleForm.userName = row.name
  roleForm.currentRole = row.role
  roleForm.newRole = row.role
  roleDialogVisible.value = true
}

const handleUpdateRole = async () => {
  try {
    await request.put(`/admin/update-role/${roleForm.userId}`, {
      isAdmin: roleForm.newRole >= 1,
      isSuperAdmin: roleForm.newRole === 2
    })
    ElMessage.success('角色修改成功')
    roleDialogVisible.value = false
    fetchUsers()
  } catch (error) {
    console.error('修改角色失败:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/admin/users/${row.id}`)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
    }
  }
}

const showCreateDialog = () => {
  createForm.phone = ''
  createForm.password = ''
  createForm.name = ''
  createForm.gender = 0
  createForm.age = ''
  createForm.role = 0
  createDialogVisible.value = true
}

const handleCreateUser = async () => {
  if (!createFormRef.value) return

  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          phone: createForm.phone,
          password: createForm.password,
          name: createForm.name,
          gender: createForm.gender,
          age: parseInt(createForm.age),
          role: createForm.role
        }
        await request.post('/admin/create-user', data)
        ElMessage.success('创建成功')
        createDialogVisible.value = false
        fetchUsers()
      } catch (error) {
        console.error('创建用户失败:', error)
      }
    }
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>
