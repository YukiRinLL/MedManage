<template>
  <div class="education-container">
    <div class="page-header">
      <h2 class="page-title">科普宣教管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加科普内容
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option label="透析知识" value="透析知识" />
            <el-option label="饮食知识" value="饮食知识" />
            <el-option label="居家护理" value="居家护理" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="已发布" :value="true" />
            <el-option label="未发布" :value="false" />
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
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" />
        <el-table-column prop="isPublished" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isPublished ? 'success' : 'info'">
              {{ row.isPublished ? '已发布' : '未发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            <el-button size="small" type="primary" @click="editRow(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.isPublished ? 'warning' : 'success'" 
              @click="togglePublish(row)"
            >
              {{ row.isPublished ? '下架' : '发布' }}
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

    <el-dialog :title="dialogTitle" v-model="showAddDialog" width="800px">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="标题" required>
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option label="透析知识" value="透析知识" />
            <el-option label="饮食知识" value="饮食知识" />
            <el-option label="居家护理" value="居家护理" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="formData.tags" placeholder="多个标签用逗号分隔" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-input-number v-model="formData.priority" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="目标指标">
          <el-input v-model="formData.targetIndicators" placeholder="关联的异常指标" />
        </el-form-item>
        <el-form-item label="封面图片">
          <el-input v-model="formData.coverImage" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="formData.content" type="textarea" :rows="8" placeholder="请输入科普内容" />
        </el-form-item>
        <el-form-item label="发布状态">
          <el-switch v-model="formData.isPublished" />
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
import { get, post, put, del } from '@/utils/request'

const loading = ref(false)
const showAddDialog = ref(false)
const dialogTitle = ref('添加科普内容')

const searchForm = reactive({
  title: '',
  category: '',
  status: ''
})

const formData = reactive({
  id: '',
  title: '',
  content: '',
  category: '',
  tags: '',
  coverImage: '',
  isPublished: false,
  priority: 0,
  targetIndicators: ''
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
      page: pagination.page - 1,
      size: pagination.size,
      ...searchForm
    }
    const res = await get('/health-education/list', params)
    if (res.code === 200) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
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
  searchForm.title = ''
  searchForm.category = ''
  searchForm.status = ''
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
      await put(`/health-education/update/${formData.id}`, formData)
      ElMessage.success('更新成功')
    } else {
      await post('/health-education/create', formData)
      ElMessage.success('创建成功')
    }
    showAddDialog.value = false
    fetchData()
  } catch (err) {
    ElMessage.error('保存失败')
  }
}

const editRow = (row) => {
  dialogTitle.value = '编辑科普内容'
  Object.assign(formData, row)
  showAddDialog.value = true
}

const viewDetail = (row) => {
  dialogTitle.value = '科普内容详情'
  Object.assign(formData, row)
  showAddDialog.value = true
}

const togglePublish = async (row) => {
  try {
    if (row.isPublished) {
      await put(`/health-education/unpublish/${row.id}`)
      ElMessage.success('已下架')
    } else {
      await put(`/health-education/publish/${row.id}`)
      ElMessage.success('已发布')
    }
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
    await del(`/health-education/delete/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
  }
}

const getCategoryType = (category) => {
  const types = {
    '透析知识': 'success',
    '饮食知识': 'warning',
    '居家护理': 'info'
  }
  return types[category] || 'info'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

fetchData()
</script>

<style scoped>
.education-container {
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