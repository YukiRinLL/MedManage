<template>
  <div class="health">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>健康档案管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增健康档案
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="患者">
          <el-select
            v-model="searchForm.userId"
            placeholder="请选择患者"
            clearable
            filterable
            style="width: 220px"
          >
            <el-option
              v-for="patient in patientOptions"
              :key="patient.id"
              :label="patient.name + ' (' + patient.phone + ')'"
              :value="patient.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="血型">
          <el-select v-model="searchForm.bloodType" placeholder="请选择血型" clearable style="width: 120px">
            <el-option label="A型" value="A" />
            <el-option label="B型" value="B" />
            <el-option label="AB型" value="AB" />
            <el-option label="O型" value="O" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" stripe v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
        <el-table-column label="患者姓名" width="120" fixed>
          <template #default="{ row }">
            {{ getPatientName(row.userId) }}
          </template>
        </el-table-column>
        <el-table-column prop="userPhone" label="手机号" width="130" />
        <el-table-column prop="bloodType" label="血型" width="80" />
        <el-table-column prop="pastMedicalHistory" label="既往病史" min-width="150" show-overflow-tooltip />
        <el-table-column prop="allergicHistory" label="过敏史" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看详情</el-button>
            <el-button link type="success" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pagination.page"
        @update:current-page="val => pagination.page = val"
        :page-size="pagination.size"
        @update:page-size="val => pagination.size = val"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchHealthRecords"
        @current-change="fetchHealthRecords"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="detailDialogVisible" title="健康档案详情" width="700px">
      <el-descriptions v-if="currentRow" :column="2" border>
        <el-descriptions-item label="患者姓名">{{ getPatientName(currentRow.userId) }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRow.userPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="血型">{{ currentRow.bloodType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(currentRow.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="既往病史" :span="2">{{ currentRow.pastMedicalHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="过敏史" :span="2">{{ currentRow.allergicHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="家族病史" :span="2">{{ currentRow.familyHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentRow.notes || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" :title="isEdit ? '编辑健康档案' : '新增健康档案'" width="700px">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="患者" required>
          <el-select
            v-model="editForm.userId"
            placeholder="请选择患者"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="patient in patientOptions"
              :key="patient.id"
              :label="patient.name + ' (' + patient.phone + ')'"
              :value="patient.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="血型">
          <el-select v-model="editForm.bloodType" placeholder="请选择血型" style="width: 100%">
            <el-option label="A型" value="A" />
            <el-option label="B型" value="B" />
            <el-option label="AB型" value="AB" />
            <el-option label="O型" value="O" />
          </el-select>
        </el-form-item>
        <el-form-item label="既往病史">
          <el-input v-model="editForm.pastMedicalHistory" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="过敏史">
          <el-input v-model="editForm.allergicHistory" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="家族病史">
          <el-input v-model="editForm.familyHistory" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.notes" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const patientOptions = ref([])
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const isEdit = ref(false)
const currentRow = ref(null)

const searchForm = reactive({
  userId: '',
  bloodType: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const editForm = reactive({
  id: '',
  userId: '',
  bloodType: '',
  pastMedicalHistory: '',
  allergicHistory: '',
  familyHistory: '',
  notes: ''
})

const fetchHealthRecords = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.page)
    params.append('size', pagination.size)
    if (searchForm.userId) params.append('userId', searchForm.userId)
    if (searchForm.bloodType) params.append('bloodType', searchForm.bloodType)

    const res = await request.get(`/health-record/list?${params.toString()}`)
    if (res.code === 200) {
      if (res.data && res.data.content) {
        tableData.value = res.data.content
        pagination.total = res.data.totalElements || 0
      } else if (Array.isArray(res.data)) {
        tableData.value = res.data
        pagination.total = res.data.length
      } else {
        tableData.value = res.data || []
        pagination.total = tableData.value.length
      }
    }
  } catch (error) {
    console.error('获取健康档案列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchHealthRecords()
}

const handleReset = () => {
  searchForm.userId = ''
  searchForm.bloodType = ''
  pagination.page = 1
  fetchHealthRecords()
}

const handleView = (row) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(editForm, {
    id: '',
    userId: '',
    bloodType: '',
    pastMedicalHistory: '',
    allergicHistory: '',
    familyHistory: '',
    notes: ''
  })
  editDialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(editForm, row)
  editDialogVisible.value = true
}

const handleSave = async () => {
  if (!editForm.userId) {
    ElMessage.warning('请选择患者')
    return
  }
  try {
    let response
    if (isEdit.value) {
      response = await request.put(`/health-record/update/${editForm.id}`, editForm)
      ElMessage.success('更新成功')
    } else {
      response = await request.post('/health-record/create', editForm)
      ElMessage.success('创建成功')
    }
    editDialogVisible.value = false
    fetchHealthRecords()
  } catch (error) {
    console.error('保存健康档案失败:', error)
    ElMessage.error('保存失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条健康档案吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/health-record/delete/${row.id}`)
    ElMessage.success('删除成功')
    fetchHealthRecords()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除健康档案失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const fetchPatientList = async () => {
  try {
    const res = await request.get('/user/list')
    if (res.code === 200) {
      if (res.data && res.data.content) {
        patientOptions.value = res.data.content
      } else if (Array.isArray(res.data)) {
        patientOptions.value = res.data
      } else {
        patientOptions.value = res.data || []
      }
    }
  } catch (err) {
    console.error('获取患者列表失败:', err)
  }
}

const getPatientName = (userId) => {
  if (!userId) return '-'
  const patient = patientOptions.value.find(p => p.id === userId)
  return patient ? patient.name : userId
}

onMounted(() => {
  fetchPatientList()
  fetchHealthRecords()
})
</script>

<style scoped>
.health {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
