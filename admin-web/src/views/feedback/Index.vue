<template>
  <div class="feedback">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>反馈管理</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.userName" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="反馈类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="问题反馈" value="problem" />
            <el-option label="功能建议" value="suggestion" />
            <el-option label="投诉" value="complaint" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="已回复" value="responded" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
        <el-table-column prop="userName" label="用户姓名" width="120" />
        <el-table-column prop="userPhone" label="手机号" width="130" />
        <el-table-column prop="type" label="反馈类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeType(row.type)">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" show-overflow-tooltip />
        <el-table-column prop="satisfactionScore" label="满意度" width="80">
          <template #default="{ row }">
            <el-rate :value="row.satisfactionScore" disabled :show-text="false" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'responded' ? 'success' : 'warning'">
              {{ row.status === 'responded' ? '已回复' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="180" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看详情</el-button>
            <el-button link type="success" v-if="row.status === 'pending'" @click="handleRespond(row)">回复</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="pagination.page"
        :page-size.sync="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchFeedbacks"
        @current-change="fetchFeedbacks"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="viewDialogVisible" title="反馈详情" width="600px">
      <el-form :model="viewForm" label-width="100px" disabled>
        <el-form-item label="用户姓名">
          <el-input v-model="viewForm.userName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="viewForm.userPhone" />
        </el-form-item>
        <el-form-item label="反馈类型">
          <el-tag :type="getTypeType(viewForm.type)">
            {{ getTypeText(viewForm.type) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="满意度">
          <el-rate :value="viewForm.satisfactionScore" disabled />
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input v-model="viewForm.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-input v-model="viewForm.createdAt" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-tag :type="viewForm.status === 'responded' ? 'success' : 'warning'">
            {{ viewForm.status === 'responded' ? '已回复' : '待处理' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input v-model="viewForm.response" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="respondDialogVisible" title="回复反馈" width="600px">
      <el-form :model="respondForm" :rules="respondRules" ref="respondFormRef" label-width="100px">
        <el-form-item label="回复内容" prop="response">
          <el-input v-model="respondForm.response" type="textarea" :rows="4" placeholder="请输入回复内容..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="respondDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRespond">提交回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search, Close } from '@element-plus/icons-vue'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const searchForm = reactive({
  userName: '',
  type: '',
  status: ''
})

const viewDialogVisible = ref(false)
const viewForm = reactive({
  id: '',
  userName: '',
  userPhone: '',
  type: '',
  content: '',
  satisfactionScore: 0,
  status: '',
  createdAt: '',
  response: ''
})

const respondDialogVisible = ref(false)
const respondForm = reactive({
  response: ''
})
const respondFormRef = ref(null)
const respondRules = {
  response: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
}

const currentFeedbackId = ref('')

const fetchFeedbacks = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.page)
    params.append('size', pagination.size)
    if (searchForm.userName) params.append('userName', searchForm.userName)
    if (searchForm.type) params.append('type', searchForm.type)
    if (searchForm.status) params.append('status', searchForm.status)
    
    const res = await request.get(`/feedback/list?${params.toString()}`)
    if (res.code === 200) {
      tableData.value = res.data.content
      pagination.total = res.data.totalElements
    }
  } catch (err) {
    ElMessage.error('获取反馈列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchFeedbacks()
}

const handleReset = () => {
  searchForm.userName = ''
  searchForm.type = ''
  searchForm.status = ''
  pagination.page = 1
  fetchFeedbacks()
}

const handleView = async (row) => {
  try {
    const res = await request.get(`/feedback/${row.id}`)
    if (res.code === 200) {
      viewForm.id = res.data.id
      viewForm.userName = res.data.userName || ''
      viewForm.userPhone = res.data.userPhone || ''
      viewForm.type = res.data.type || ''
      viewForm.content = res.data.content || ''
      viewForm.satisfactionScore = res.data.satisfactionScore || 0
      viewForm.status = res.data.status || ''
      viewForm.createdAt = res.data.createdAt || ''
      viewForm.response = res.data.response || ''
      viewDialogVisible.value = true
    }
  } catch (err) {
    ElMessage.error('获取反馈详情失败')
  }
}

const handleRespond = (row) => {
  currentFeedbackId.value = row.id
  respondForm.response = ''
  respondDialogVisible.value = true
}

const submitRespond = async () => {
  if (!respondFormRef.value) return
  await respondFormRef.value.validate()
  
  try {
    const res = await request.put(`/feedback/${currentFeedbackId.value}/respond`, {
      response: respondForm.response
    })
    if (res.code === 200) {
      ElMessage.success('回复成功')
      respondDialogVisible.value = false
      fetchFeedbacks()
    } else {
      ElMessage.error(res.message || '回复失败')
    }
  } catch (err) {
    ElMessage.error('回复失败')
  }
}

const handleDelete = (row) => {
  ElMessage.confirm('确定删除该反馈？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      const res = await request.delete(`/feedback/${row.id}`)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchFeedbacks()
      }
    } catch (err) {
      ElMessage.error('删除失败')
    }
  })
}

const getTypeText = (type) => {
  const map = {
    'problem': '问题反馈',
    'suggestion': '功能建议',
    'complaint': '投诉'
  }
  return map[type] || type
}

const getTypeType = (type) => {
  const map = {
    'problem': 'warning',
    'suggestion': 'info',
    'complaint': 'danger'
  }
  return map[type] || 'info'
}

fetchFeedbacks()
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>