<template>
  <div class="diagnosis-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>诊断信息管理</span>
          <el-button v-if="!searchVisible" type="primary" link @click="searchVisible = true">重新搜索患者</el-button>
        </div>
      </template>

      <div v-if="searchVisible">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable style="width: 150px" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="searchForm.gender" placeholder="" clearable style="width: 100px">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          v-if="patients.length > 0"
          :data="patients"
          v-loading="loading"
          border
          style="width: 100%; margin-bottom: 20px"
        >
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="手机号" width="120" />
          <el-table-column prop="txNumber" label="透析号" width="120" />
          <el-table-column prop="idCard" label="身份证号" min-width="150" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" link @click="selectPatient(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-else-if="!loading" class="empty-state">
          <el-empty description="未找到患者，请调整搜索条件" />
        </div>
      </div>

      <div v-if="selectedPatientId" class="patient-info">
        <h3>当前患者：{{ selectedPatient.name }} | 身份证号：{{ selectedPatient.idCard }} | 手机号：{{ selectedPatient.phone }}</h3>
      </div>

      <el-table
        v-if="selectedPatientId"
        :data="diagnoses"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="diseCode" label="疾病编码（ICD 编码）" width="180" />
        <el-table-column prop="diseName" label="疾病名称" min-width="300" />
        <el-table-column prop="sort" label="排序号" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="empty-state">
        <el-empty description="请选择患者查看诊断信息" />
      </div>

      <div v-if="selectedPatientId" style="margin-top: 20px">
        <el-button type="primary" @click="handleAdd">添加诊断信息</el-button>
      </div>
    </el-card>

    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑诊断信息' : '添加诊断信息'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form v-if="editForm" :model="editForm" label-width="120px">
        <el-form-item label="疾病编码">
          <el-input v-model="editForm.diseCode" placeholder="请输入疾病编码" />
        </el-form-item>
        <el-form-item label="疾病名称">
          <el-input v-model="editForm.diseName" placeholder="请输入疾病名称" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="editForm.sort" :min="1" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const patients = ref([])
const selectedPatientId = ref(null)
const selectedPatient = ref(null)
const diagnoses = ref([])
const loading = ref(false)
const editDialogVisible = ref(false)
const isEdit = ref(false)
const editForm = ref(null)
const searchVisible = ref(true)

const searchForm = reactive({
  name: '',
  phone: '',
  idCard: '',
  gender: null
})

const fetchPatients = async () => {
  loading.value = true
  try {
    const params = {
      page: 1,
      size: 100,
      name: searchForm.name,
      phone: searchForm.phone,
      idCard: searchForm.idCard,
      gender: searchForm.gender
    }
    
    // 移除null值
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || (typeof params[key] === 'string' && params[key] === '')) {
        delete params[key]
      }
    })
    
    const response = await request.get('/user/list', { params })
    if (response.code === 200) {
      patients.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('获取患者列表失败')
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchPatients()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.idCard = ''
  searchForm.gender = null
  fetchPatients()
}

const selectPatient = (row) => {
  selectedPatientId.value = row.id
  selectedPatient.value = row
  searchVisible.value = false
  fetchDiagnoses()
}

const fetchDiagnoses = async () => {
  if (!selectedPatientId.value) return
  
  loading.value = true
  try {
    const response = await request.get(`/diagnosis/user/${selectedPatientId.value}`)
    if (response.code === 200) {
      diagnoses.value = response.data || []
    }
  } catch (error) {
    ElMessage.error('获取诊断信息失败')
    console.error('Error fetching diagnoses:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  editForm.value = {
    userId: selectedPatientId.value,
    diseCode: '',
    diseName: '',
    sort: 1
  }
  editDialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editForm.value = { ...row }
  editDialogVisible.value = true
}

const handleSave = async () => {
  if (!editForm.value) return
  
  try {
    let response
    if (isEdit.value) {
      response = await request.put(`/diagnosis/${editForm.value.id}`, editForm.value)
    } else {
      response = await request.post('/diagnosis', editForm.value)
    }
    
    if (response.code === 200) {
      ElMessage.success('保存成功')
      editDialogVisible.value = false
      fetchDiagnoses()
    }
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('Error saving diagnosis:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除诊断信息 ${row.diseName} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await request.delete(`/diagnosis/${row.id}`)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchDiagnoses()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('Error deleting diagnosis:', error)
    }
  }
}

// 监听患者选择变化
selectedPatientId.value = null
const selectedPatientIdWatch = () => {
  fetchDiagnoses()
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
.diagnosis-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.patient-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #009D85;
}

.patient-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-form {
  margin-bottom: 20px;
}
</style>
