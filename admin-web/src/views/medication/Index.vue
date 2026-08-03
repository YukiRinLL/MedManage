<template>
  <div class="medication">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用药记录管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用药记录
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
        <el-form-item label="药品名称">
          <el-input
            v-model="searchForm.medicationName"
            placeholder="请输入药品名称"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="服用状态">
          <el-select v-model="searchForm.taken" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="已服用" :value="true" />
            <el-option label="未服用" :value="false" />
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
        <el-table-column prop="medicationName" label="药品名称" min-width="150" />
        <el-table-column prop="dosage" label="剂量" width="100" />
        <el-table-column prop="frequency" label="频率" width="100" />
        <el-table-column prop="taken" label="服用状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.taken ? 'success' : 'info'">
              {{ row.taken ? '已服用' : '未服用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="medicationTime" label="服药时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.medicationTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="warning" @click="handleUpdateTaken(row)">
              {{ row.taken ? '标记未服' : '标记已服' }}
            </el-button>
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
        @size-change="fetchMedications"
        @current-change="fetchMedications"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="viewDialogVisible" title="用药详情" width="600px">
      <el-descriptions v-if="currentRow" :column="2" border>
        <el-descriptions-item label="患者姓名">{{ getPatientName(currentRow.userId) }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRow.userPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="药品名称">{{ currentRow.medicationName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="剂量">{{ currentRow.dosage || '-' }}</el-descriptions-item>
        <el-descriptions-item label="频率">{{ currentRow.frequency || '-' }}</el-descriptions-item>
        <el-descriptions-item label="服用状态">{{ currentRow.taken ? '已服用' : '未服用' }}</el-descriptions-item>
        <el-descriptions-item label="服药时间" :span="2">{{ formatDate(currentRow.medicationTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentRow.notes || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="addDialogVisible" title="新增用药记录" width="600px">
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="患者" required>
          <el-select
            v-model="addForm.userId"
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
        <el-form-item label="药品名称" required>
          <el-input v-model="addForm.medicationName" placeholder="请输入药品名称" />
        </el-form-item>
        <el-form-item label="剂量">
          <el-input v-model="addForm.dosage" placeholder="如：5mg" />
        </el-form-item>
        <el-form-item label="频率">
          <el-input v-model="addForm.frequency" placeholder="如：每日三次" />
        </el-form-item>
        <el-form-item label="服药时间">
          <el-date-picker
            v-model="addForm.medicationTime"
            type="datetime"
            placeholder="选择服药时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="服用状态">
          <el-select v-model="addForm.taken" style="width: 100%">
            <el-option label="未服用" :value="false" />
            <el-option label="已服用" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.notes" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
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
const viewDialogVisible = ref(false)
const addDialogVisible = ref(false)
const currentRow = ref(null)

const searchForm = reactive({
  userId: '',
  medicationName: '',
  taken: null
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const addForm = reactive({
  userId: '',
  medicationName: '',
  dosage: '',
  frequency: '',
  medicationTime: '',
  taken: false,
  notes: ''
})

const fetchMedications = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.page)
    params.append('size', pagination.size)
    if (searchForm.userId) params.append('userId', searchForm.userId)
    if (searchForm.medicationName) params.append('medicationName', searchForm.medicationName)
    if (searchForm.taken !== null && searchForm.taken !== '') {
      params.append('taken', searchForm.taken)
    }

    const res = await request.get(`/medication/list?${params.toString()}`)
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
    console.error('获取用药记录列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchMedications()
}

const handleReset = () => {
  searchForm.userId = ''
  searchForm.medicationName = ''
  searchForm.taken = null
  pagination.page = 1
  fetchMedications()
}

const handleView = (row) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

const handleUpdateTaken = async (row) => {
  try {
    await request.put(`/medication/update-taken/${row.id}`, {
      taken: !row.taken
    })
    ElMessage.success('更新成功')
    fetchMedications()
  } catch (error) {
    console.error('更新服用状态失败:', error)
    ElMessage.error('更新失败')
  }
}

const handleAdd = () => {
  Object.assign(addForm, {
    userId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    medicationTime: '',
    taken: false,
    notes: ''
  })
  addDialogVisible.value = true
}

const handleSubmit = async () => {
  if (!addForm.userId) {
    ElMessage.warning('请选择患者')
    return
  }
  if (!addForm.medicationName) {
    ElMessage.warning('请输入药品名称')
    return
  }
  try {
    await request.post('/medication/create', addForm)
    ElMessage.success('创建成功')
    addDialogVisible.value = false
    fetchMedications()
  } catch (error) {
    console.error('创建用药记录失败:', error)
    ElMessage.error('创建失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用药记录 ${row.medicationName} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/medication/delete/${row.id}`)
    ElMessage.success('删除成功')
    fetchMedications()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用药记录失败:', error)
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
  fetchMedications()
})
</script>

<style scoped>
.medication {
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
