<template>
  <div class="medication">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用药记录管理</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="药品名称">
          <el-input v-model="searchForm.medicationName" placeholder="请输入药品名称" clearable />
        </el-form-item>
        <el-form-item label="服用状态">
          <el-select v-model="searchForm.taken" placeholder="请选择状态" clearable>
            <el-option label="已服用" :value="true" />
            <el-option label="未服用" :value="false" />
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
        <el-table-column prop="medicationName" label="药品名称" />
        <el-table-column prop="dosage" label="剂量" width="100" />
        <el-table-column prop="frequency" label="频率" width="100" />
        <el-table-column prop="taken" label="服用状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.taken ? 'success' : 'info'">
              {{ row.taken ? '已服用' : '未服用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="medicationTime" label="服药时间" width="180" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="warning" @click="handleUpdateTaken(row)">
              {{ row.taken ? '标记未服' : '标记已服' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchMedications"
        @current-change="fetchMedications"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  name: '',
  medicationName: '',
  taken: null
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const fetchMedications = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const res = await request.get('/medication/list', { params })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('获取用药记录列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchMedications()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.medicationName = ''
  searchForm.taken = null
  pagination.page = 1
  fetchMedications()
}

const handleView = (row) => {
  ElMessage.info('查看详情功能开发中')
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
  }
}

onMounted(() => {
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
}
</style>
