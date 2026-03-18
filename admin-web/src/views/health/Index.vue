<template>
  <div class="health">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>健康档案管理</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="血型">
          <el-select v-model="searchForm.bloodType" placeholder="请选择血型" clearable>
            <el-option label="A型" value="A" />
            <el-option label="B型" value="B" />
            <el-option label="AB型" value="AB" />
            <el-option label="O型" value="O" />
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
        <el-table-column prop="bloodType" label="血型" width="80" />
        <el-table-column prop="pastMedicalHistory" label="既往病史" show-overflow-tooltip />
        <el-table-column prop="allergicHistory" label="过敏史" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看详情</el-button>
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
        @size-change="fetchHealthRecords"
        @current-change="fetchHealthRecords"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  name: '',
  bloodType: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const fetchHealthRecords = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const res = await request.get('/health-record/list', { params })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('获取健康档案列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchHealthRecords()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.bloodType = ''
  pagination.page = 1
  fetchHealthRecords()
}

const handleView = (row) => {
  router.push(`/health/${row.id}`)
}

onMounted(() => {
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
}
</style>
