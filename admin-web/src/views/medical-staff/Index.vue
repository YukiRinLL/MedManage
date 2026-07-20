<template>
  <div class="medical-staff-container">
    <div class="page-header">
      <h2 class="page-title">医护人员管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加医护人员
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="人员类型">
          <el-select v-model="searchForm.staffType" placeholder="请选择类型" clearable>
            <el-option label="医生" value="doctor" />
            <el-option label="护士" value="nurse" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="staffType" label="人员类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.staffType === 'doctor' ? 'success' : 'primary'">
              {{ row.staffType === 'doctor' ? '医生' : '护士' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="isActive" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">
              {{ row.isActive ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editRow(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.isActive ? 'warning' : 'success'" 
              @click="toggleActive(row)"
            >
              {{ row.isActive ? '离职' : '在职' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog :title="dialogTitle" v-model="showAddDialog" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="formData.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="formData.department" placeholder="请输入科室" />
        </el-form-item>
        <el-form-item label="人员类型" required>
          <el-select v-model="formData.staffType" placeholder="请选择类型">
            <el-option label="医生" value="doctor" />
            <el-option label="护士" value="nurse" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="在职状态">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const showAddDialog = ref(false)
const dialogTitle = ref('添加医护人员')

const searchForm = reactive({
  name: '',
  staffType: ''
})

const formData = reactive({
  id: '',
  name: '',
  position: '',
  department: '',
  phone: '',
  email: '',
  staffType: '',
  isActive: true
})

const tableData = ref([])

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm
    }
    const res = await request.get('/medical-staff/list', { params })
    if (res.code === 200) {
      tableData.value = res.data || []
      pagination.total = tableData.value.length
    }
  } catch (err) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.staffType = ''
  pagination.page = 1
  fetchData()
}

const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}

const handleSave = async () => {
  try {
    if (formData.id) {
      await request.put(`/medical-staff/update/${formData.id}`, formData)
      ElMessage.success('更新成功')
    } else {
      await request.post('/medical-staff/create', formData)
      ElMessage.success('创建成功')
    }
    showAddDialog.value = false
    fetchData()
  } catch (err) {
    ElMessage.error('保存失败')
  }
}

const editRow = (row) => {
  dialogTitle.value = '编辑医护人员'
  Object.assign(formData, row)
  showAddDialog.value = true
}

const toggleActive = async (row) => {
  try {
    row.isActive = !row.isActive
    await request.put(`/medical-staff/update/${row.id}`, row)
    ElMessage.success(row.isActive ? '已设为在职' : '已设为离职')
    fetchData()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

const deleteRow = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/medical-staff/delete/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

fetchData()
</script>

<style scoped>
.medical-staff-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
}

.table-card {
  min-height: 400px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>