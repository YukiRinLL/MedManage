<template>
  <div class="notification">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>通知管理</span>
          <el-button type="primary" @click="showCreateDialog">
            <el-icon><Plus /></el-icon>
            创建通知
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="通知类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="就诊提醒" :value="1" />
            <el-option label="用药提醒" :value="2" />
            <el-option label="检查通知" :value="3" />
            <el-option label="随访提醒" :value="4" />
            <el-option label="复诊提醒" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="阅读状态">
          <el-select v-model="searchForm.read" placeholder="请选择状态" clearable>
            <el-option label="已读" :value="true" />
            <el-option label="未读" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userName" label="用户姓名" width="120" />
        <el-table-column prop="userPhone" label="手机号" width="130" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeType(row.type)">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="read" label="阅读状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.read ? 'success' : 'info'">
              {{ row.read ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="notifyTime" label="通知时间" width="180" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchNotifications"
        @current-change="fetchNotifications"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="createDialogVisible" title="创建通知" width="600px">
      <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="100px">
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="createForm.phone" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="createForm.type" placeholder="请选择通知类型">
            <el-option label="就诊提醒" :value="1" />
            <el-option label="用药提醒" :value="2" />
            <el-option label="检查通知" :value="3" />
            <el-option label="随访提醒" :value="4" />
            <el-option label="复诊提醒" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入通知标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="createForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入通知内容"
          />
        </el-form-item>
        <el-form-item label="通知时间" prop="notifyTime">
          <el-date-picker
            v-model="createForm.notifyTime"
            type="datetime"
            placeholder="选择通知时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="viewDialogVisible" title="通知详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户姓名">{{ viewData.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ viewData.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="通知类型">
          <el-tag :type="getTypeType(viewData.type)">
            {{ getTypeText(viewData.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="标题">{{ viewData.title }}</el-descriptions-item>
        <el-descriptions-item label="内容">{{ viewData.content }}</el-descriptions-item>
        <el-descriptions-item label="阅读状态">
          <el-tag :type="viewData.read ? 'success' : 'info'">
            {{ viewData.read ? '已读' : '未读' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="通知时间">{{ viewData.notifyTime }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createdAt }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const createDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const createFormRef = ref(null)

const searchForm = reactive({
  name: '',
  type: null,
  read: null
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const createForm = reactive({
  phone: '',
  type: null,
  title: '',
  content: '',
  notifyTime: ''
})

const viewData = ref({})

const createRules = {
  phone: [
    { required: true, message: '请输入用户手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择通知类型', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入通知内容', trigger: 'blur' }
  ],
  notifyTime: [
    { required: true, message: '请选择通知时间', trigger: 'change' }
  ]
}

const getTypeType = (type) => {
  const types = { 1: 'primary', 2: 'success', 3: 'warning', 4: 'info', 5: 'danger' }
  return types[type] || 'info'
}

const getTypeText = (type) => {
  const texts = { 1: '就诊提醒', 2: '用药提醒', 3: '检查通知', 4: '随访提醒', 5: '复诊提醒' }
  return texts[type] || '未知'
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const res = await request.get('/notification/list', { params })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('获取通知列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchNotifications()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.type = null
  searchForm.read = null
  pagination.page = 1
  fetchNotifications()
}

const showCreateDialog = () => {
  createForm.phone = ''
  createForm.type = null
  createForm.title = ''
  createForm.content = ''
  createForm.notifyTime = ''
  createDialogVisible.value = true
}

const handleCreate = async () => {
  if (!createFormRef.value) return

  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          phone: createForm.phone,
          type: createForm.type,
          title: createForm.title,
          content: createForm.content,
          notifyTime: createForm.notifyTime ? new Date(createForm.notifyTime).toISOString() : null
        }
        await request.post('/notification/create', data)
        ElMessage.success('创建成功')
        createDialogVisible.value = false
        fetchNotifications()
      } catch (error) {
        console.error('创建通知失败:', error)
      }
    }
  })
}

const handleView = (row) => {
  viewData.value = { ...row }
  viewDialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除这条通知吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/notification/${row.id}`)
    ElMessage.success('删除成功')
    fetchNotifications()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除通知失败:', error)
    }
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.notification {
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
