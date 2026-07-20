<template>
  <div class="blood-test-container">
    <div class="page-header">
      <h2 class="page-title">核心指标管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加检查记录
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="患者ID">
          <el-input v-model="searchForm.userId" placeholder="请输入患者ID" clearable />
        </el-form-item>
        <el-form-item label="检查日期">
          <el-date-picker v-model="searchForm.testDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="userId" label="患者ID" width="150" />
        <el-table-column prop="testDate" label="检查日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.testDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="testType" label="检查类型" width="120" />
        <el-table-column prop="hemoglobin" label="血红蛋白(g/L)" width="140" />
        <el-table-column prop="serumCreatinine" label="血清肌酐(μmol/L)" width="160" />
        <el-table-column prop="ureaNitrogen" label="尿素氮(mmol/L)" width="140" />
        <el-table-column prop="potassium" label="钾(mmol/L)" width="100" />
        <el-table-column prop="calcium" label="钙(mmol/L)" width="100" />
        <el-table-column prop="phosphorus" label="磷(mmol/L)" width="100" />
        <el-table-column prop="albumin" label="白蛋白(g/L)" width="120" />
        <el-table-column prop="parathyroidHormone" label="甲状旁腺激素(pg/mL)" width="180" />
        <el-table-column prop="notes" label="备注" min-width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editRow(row)">编辑</el-button>
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
      <el-form :model="formData" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="患者ID" required>
              <el-input v-model="formData.userId" placeholder="请输入患者ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查日期" required>
              <el-date-picker v-model="formData.testDate" type="date" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="检查类型">
              <el-input v-model="formData.testType" placeholder="如：生化检查" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血红蛋白(g/L)">
              <el-input-number v-model="formData.hemoglobin" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="血清肌酐(μmol/L)">
              <el-input-number v-model="formData.serumCreatinine" :precision="2" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尿素氮(mmol/L)">
              <el-input-number v-model="formData.ureaNitrogen" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="尿酸(μmol/L)">
              <el-input-number v-model="formData.uricAcid" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="钾(mmol/L)">
              <el-input-number v-model="formData.potassium" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="钠(mmol/L)">
              <el-input-number v-model="formData.sodium" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="氯(mmol/L)">
              <el-input-number v-model="formData.chloride" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="钙(mmol/L)">
              <el-input-number v-model="formData.calcium" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="磷(mmol/L)">
              <el-input-number v-model="formData.phosphorus" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="白蛋白(g/L)">
              <el-input-number v-model="formData.albumin" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="甲状旁腺激素(pg/mL)">
              <el-input-number v-model="formData.parathyroidHormone" :precision="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.notes" type="textarea" :rows="3" />
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
const dialogTitle = ref('添加检查记录')

const searchForm = reactive({
  userId: '',
  testDate: ''
})

const formData = reactive({
  id: '',
  userId: '',
  testDate: '',
  testType: '',
  hemoglobin: '',
  serumCreatinine: '',
  ureaNitrogen: '',
  uricAcid: '',
  potassium: '',
  sodium: '',
  chloride: '',
  calcium: '',
  phosphorus: '',
  albumin: '',
  totalCholesterol: '',
  triglycerides: '',
  hdlCholesterol: '',
  ldlCholesterol: '',
  parathyroidHormone: '',
  notes: ''
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
    const res = await request.get(`/blood-test/list/${searchForm.userId || 'all'}`)
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
  searchForm.userId = ''
  searchForm.testDate = ''
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
      await request.put(`/blood-test/update/${formData.id}`, formData)
      ElMessage.success('更新成功')
    } else {
      await request.post('/blood-test/create', formData)
      ElMessage.success('创建成功')
    }
    showAddDialog.value = false
    fetchData()
  } catch (err) {
    ElMessage.error('保存失败')
  }
}

const editRow = (row) => {
  dialogTitle.value = '编辑检查记录'
  Object.assign(formData, row)
  showAddDialog.value = true
}

const deleteRow = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await request.delete(`/blood-test/delete/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

fetchData()
</script>

<style scoped>
.blood-test-container {
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