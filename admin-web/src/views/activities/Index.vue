<template>
  <div class="activities-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>活动管理</span>
          <el-button type="primary" @click="showCreateDialog">
            <el-icon><Plus /></el-icon>
            新建活动
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="活动标题">
          <el-input v-model="searchForm.title" placeholder="请输入活动标题" clearable />
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="未开始" :value="2" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="活动标题" min-width="200" />
        <el-table-column prop="activityType" label="活动类型" width="120" />
        <el-table-column prop="location" label="活动地点" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="maxParticipants" label="最大人数" width="100" />
        <el-table-column prop="currentParticipants" label="已报名" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewParticipants(row)">查看参与</el-button>
            <el-button link type="warning" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pagination.page"
        @update:current-page="val => pagination.page = val"
        :page-size="pagination.size"
        @update:page-size="val => pagination.size = val"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchActivities"
        @current-change="fetchActivities"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="createDialogVisible" :title="isEdit ? '编辑活动' : '新建活动'" width="700px">
      <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="120px">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <el-input v-model="createForm.activityType" placeholder="请输入活动类型" />
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="createForm.location" placeholder="请输入活动地点" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="createForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="createForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="最大参与人数" prop="maxParticipants">
          <el-input-number v-model="createForm.maxParticipants" :min="1" />
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入活动描述"
          />
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <el-input v-model="createForm.coverImage" placeholder="请输入封面图片URL" />
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-select v-model="createForm.status" placeholder="请选择状态">
            <el-option label="未开始" :value="2" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="participantsDialogVisible" title="参与人员" width="800px">
      <el-table :data="participants" stripe v-loading="participantsLoading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="userName" label="用户姓名" width="120" />
        <el-table-column prop="userPhone" label="手机号" width="130" />
        <el-table-column prop="participateTime" label="参与时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已报名' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="participantsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const createDialogVisible = ref(false)
const participantsDialogVisible = ref(false)
const participantsLoading = ref(false)
const participants = ref([])
const createFormRef = ref(null)
const isEdit = ref(false)
const currentActivityId = ref(null)

const searchForm = reactive({
  title: '',
  status: null
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const createForm = reactive({
  title: '',
  description: '',
  activityType: '',
  location: '',
  startTime: '',
  endTime: '',
  maxParticipants: 100,
  status: 2,
  coverImage: ''
})

const createRules = {
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ],
  maxParticipants: [
    { required: true, message: '请输入最大参与人数', trigger: 'blur' }
  ]
}

const getStatusType = (status) => {
  const types = { 0: 'info', 1: 'success', 2: 'warning' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { 0: '已结束', 1: '进行中', 2: '未开始' }
  return texts[status] || '未知'
}

const fetchActivities = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const res = await request.get('/activity/list', { params })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('获取活动列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchActivities()
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.status = null
  pagination.page = 1
  fetchActivities()
}

const showCreateDialog = () => {
  isEdit.value = false
  currentActivityId.value = null
  createForm.title = ''
  createForm.description = ''
  createForm.activityType = ''
  createForm.location = ''
  createForm.startTime = ''
  createForm.endTime = ''
  createForm.maxParticipants = 100
  createForm.status = 2
  createForm.coverImage = ''
  createDialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentActivityId.value = row.id
  createForm.title = row.title
  createForm.description = row.description
  createForm.activityType = row.activityType
  createForm.location = row.location
  createForm.startTime = row.startTime
  createForm.endTime = row.endTime
  createForm.maxParticipants = row.maxParticipants
  createForm.status = row.status
  createForm.coverImage = row.coverImage
  createDialogVisible.value = true
}

const handleCreateOrUpdate = async () => {
  if (!createFormRef.value) return

  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          title: createForm.title,
          description: createForm.description,
          activityType: createForm.activityType,
          location: createForm.location,
          startTime: createForm.startTime ? new Date(createForm.startTime).toISOString() : null,
          endTime: createForm.endTime ? new Date(createForm.endTime).toISOString() : null,
          maxParticipants: createForm.maxParticipants,
          status: createForm.status,
          coverImage: createForm.coverImage
        }
        
        console.log('发送的数据:', JSON.stringify(data, null, 2))
        
        if (isEdit.value) {
          await request.put(`/activity/update/${currentActivityId.value}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/activity/create', data)
          ElMessage.success('创建成功')
        }
        
        createDialogVisible.value = false
        fetchActivities()
      } catch (error) {
        console.error('操作失败:', error)
        console.error('错误详情:', error.response?.data || error.message)
      }
    }
  })
}

const handleViewParticipants = async (row) => {
  currentActivityId.value = row.id
  participantsLoading.value = true
  try {
    const res = await request.get(`/activity-participant/list/${row.id}`)
    participants.value = res.data || []
    participantsDialogVisible.value = true
  } catch (error) {
    console.error('获取参与人员失败:', error)
  } finally {
    participantsLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除活动 "${row.title}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/activity/${row.id}`)
    ElMessage.success('删除成功')
    fetchActivities()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.activities-container {
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
