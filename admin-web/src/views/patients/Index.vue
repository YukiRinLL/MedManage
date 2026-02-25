<template>
  <div class="patients-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>患者列表</span>
          <el-button type="primary" @click="handleAdd">新增患者</el-button>
        </div>
      </template>

      <el-table
        :data="patients"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="address" label="地址" min-width="150" />
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="currentPage"
        @update:current-page="val => currentPage = val"
        :page-size="pageSize"
        @update:page-size="val => pageSize = val"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog
      v-model="detailDialogVisible"
      title="患者详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentPatient" :column="2" border>
        <el-descriptions-item label="患者ID">{{ currentPatient.id }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentPatient.phone }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentPatient.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentPatient.gender === 1 ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentPatient.age }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ currentPatient.address }}</el-descriptions-item>
        <el-descriptions-item label="注册时间" :span="2">{{ formatDate(currentPatient.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ formatDate(currentPatient.updatedAt) }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const patients = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentPatient = ref(null)

const fetchPatients = async () => {
  loading.value = true
  try {
    const response = await request.get('/user/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })
    if (response.code === 200) {
      patients.value = response.data.list || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    ElMessage.error('获取患者列表失败')
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const handleView = (row) => {
  currentPatient.value = row
  detailDialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除患者 ${row.name} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await request.delete(`/user/${row.id}`)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchPatients()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('Error deleting patient:', error)
    }
  }
}

const handleAdd = () => {
  ElMessage.info('新增患者功能待实现')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchPatients()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchPatients()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
.patients-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
