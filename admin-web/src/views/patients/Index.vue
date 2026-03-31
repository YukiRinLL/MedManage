<template>
  <div class="patients-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>患者列表</span>
          <el-button type="primary" @click="handleAdd">新增患者</el-button>
        </div>
      </template>

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
        <el-form-item label="年龄范围">
          <el-input-number v-model="searchForm.minAge" placeholder="" :min="0" style="width: 100px" />
          <span style="margin: 0 10px">-</span>
          <el-input-number v-model="searchForm.maxAge" placeholder="" :min="0" style="width: 100px" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="searchForm.tagName" placeholder="请输入标签" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="patients"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 0 ? '女' : '男' }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column label="标签" min-width="150">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 5px">{{ tag }}</el-tag>
            <span v-if="!row.tags || row.tags.length === 0">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="150" />
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button type="success" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link @click="handleEditTags(row)">编辑标签</el-button>
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
        <!-- 基本信息 -->
        <el-descriptions-item label="患者ID">{{ currentPatient.id }}</el-descriptions-item>
        <el-descriptions-item label="透析号">{{ currentPatient.txNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentPatient.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentPatient.gender === 0 ? '女' : '男' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ currentPatient.age }}</el-descriptions-item>
        <el-descriptions-item label="民族">{{ currentPatient.nation || '-' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ formatDate(currentPatient.birthDate) }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ currentPatient.idCard || '-' }}</el-descriptions-item>
        
        <!-- 联系信息 -->
        <el-descriptions-item label="手机号">{{ currentPatient.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentPatient.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ currentPatient.address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮政编码">{{ currentPatient.postalCode || '-' }}</el-descriptions-item>
        
        <!-- 医疗信息 -->
        <el-descriptions-item label="保险类型">{{ currentPatient.insuranceType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="就医凭证类型">{{ currentPatient.medicalCertType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="电子医保号">{{ currentPatient.electronicMedicalId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="诊断信息" :span="2">{{ currentPatient.diagnosis || '-' }}</el-descriptions-item>
        
        <!-- 住院信息 -->
        <el-descriptions-item label="住院状态">{{ currentPatient.hospitalizationStatus === 1 ? '住院' : '非住院' }}</el-descriptions-item>
        <el-descriptions-item label="患者类型">{{ currentPatient.patientType === 0 ? '普通患者' : '其他' }}</el-descriptions-item>
        <el-descriptions-item label="入院日期">{{ formatDate(currentPatient.admissionDate) }}</el-descriptions-item>
        <el-descriptions-item label="出院日期">{{ formatDate(currentPatient.dischargeDate) }}</el-descriptions-item>
        
        <!-- 其他信息 -->
        <el-descriptions-item label="标签" :span="2">
          <el-tag v-for="tag in currentPatient.tags" :key="tag" size="small" style="margin-right: 5px">{{ tag }}</el-tag>
          <span v-if="!currentPatient.tags || currentPatient.tags.length === 0">无</span>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" :span="2">{{ formatDate(currentPatient.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ formatDate(currentPatient.updatedAt) }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editTagsDialogVisible"
      title="编辑患者标签"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="currentEditPatient">
        <h4>{{ currentEditPatient.name }} ({{ currentEditPatient.phone }})</h4>
        <div style="margin-top: 20px">
          <el-form label-width="80px" @submit.prevent>
            <el-form-item label="标签">
              <el-input
                v-model="tagInput"
                placeholder="请输入标签，多个标签用逗号分隔"
                @keyup.enter.prevent="handleAddTag"
              />
            </el-form-item>
          </el-form>
          <div style="margin-top: 10px">
            <el-tag
              v-for="(tag, index) in currentTags"
              :key="tag"
              closable
              @close="handleRemoveTag(index)"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="editTagsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleButtonClick">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editDialogVisible"
      title="编辑患者信息"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form v-if="editForm" :model="editForm" label-width="120px">
        <el-form-item label="患者ID">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="透析号">
          <el-input v-model="editForm.txNumber" disabled />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="民族">
          <el-input v-model="editForm.nation" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="editForm.idCard" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="editForm.birthDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" />
        </el-form-item>
        <el-form-item label="邮政编码">
          <el-input v-model="editForm.postalCode" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="保险类型">
          <el-input v-model="editForm.insuranceType" />
        </el-form-item>
        <el-form-item label="就医凭证类型">
          <el-input v-model="editForm.medicalCertType" />
        </el-form-item>
        <el-form-item label="电子医保号">
          <el-input v-model="editForm.electronicMedicalId" />
        </el-form-item>
        <el-form-item label="诊断信息">
          <el-input v-model="editForm.diagnosis" type="textarea" />
        </el-form-item>
        <el-form-item label="住院状态">
          <el-select v-model="editForm.hospitalizationStatus">
            <el-option label="非住院" :value="0" />
            <el-option label="住院" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="患者类型">
          <el-select v-model="editForm.patientType">
            <el-option label="普通患者" :value="0" />
            <el-option label="其他" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="入院日期">
          <el-date-picker
            v-model="editForm.admissionDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="出院日期">
          <el-date-picker
            v-model="editForm.dischargeDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.address" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const patients = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentPatient = ref(null)
const editTagsDialogVisible = ref(false)
const currentEditPatient = ref(null)
const tagInput = ref('')
const currentTags = ref([])
const editDialogVisible = ref(false)
const editForm = ref(null)

const hasTags = computed(() => {
  return currentTags.value.length > 0
})

const searchForm = reactive({
  name: '',
  phone: '',
  idCard: '',
  gender: null,
  minAge: null,
  maxAge: null,
  tagName: ''
})

const fetchPatients = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      name: searchForm.name,
      phone: searchForm.phone,
      idCard: searchForm.idCard,
      gender: searchForm.gender,
      minAge: searchForm.minAge,
      maxAge: searchForm.maxAge,
      tagName: searchForm.tagName
    }
    
    // 移除null值
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || (typeof params[key] === 'string' && params[key] === '')) {
        delete params[key]
      }
    })
    
    const response = await request.get('/user/list', { params })
    if (response.code === 200) {
      const patientList = response.data.list || []
      // 为每个患者获取标签
      for (const patient of patientList) {
        try {
          const tagsResponse = await request.get(`/user/${patient.id}/tags`)
          if (tagsResponse.code === 200) {
            patient.tags = tagsResponse.data || []
          } else {
            patient.tags = []
          }
        } catch (error) {
          patient.tags = []
        }
      }
      patients.value = patientList
      total.value = response.data.total || 0
    }
  } catch (error) {
    ElMessage.error('获取患者列表失败')
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchPatients()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.idCard = ''
  searchForm.gender = null
  searchForm.minAge = null
  searchForm.maxAge = null
  searchForm.tagName = ''
  currentPage.value = 1
  fetchPatients()
}

const handleView = async (row) => {
  try {
    const response = await request.get(`/user/${row.id}`)
    if (response.code === 200) {
      currentPatient.value = response.data
      currentPatient.value.tags = response.tags || []
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取患者详情失败')
    console.error('Error fetching patient details:', error)
  }
}

const handleEditTags = async (row) => {
  try {
    const response = await request.get(`/user/${row.id}/tags`)
    if (response.code === 200) {
      currentEditPatient.value = row
      currentTags.value = response.data || []
      tagInput.value = ''
      editTagsDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取患者标签失败')
    console.error('Error fetching patient tags:', error)
  }
}

const handleAddTag = () => {
  if (!tagInput.value || tagInput.value.trim() === '') {
    return
  }
  
  const newTags = tagInput.value.split(/[,，,]/).map(tag => tag.trim()).filter(tag => tag !== '')
  
  for (const tag of newTags) {
    if (!currentTags.value.includes(tag)) {
      currentTags.value.push(tag)
    }
  }
  
  tagInput.value = ''
}

const handleRemoveTag = (index) => {
  currentTags.value.splice(index, 1)
}

const handleButtonClick = () => {
  if (tagInput.value && tagInput.value.trim() !== '') {
    handleAddTag()
  } else {
    handleSaveTags()
  }
}

const handleSaveTags = async () => {
  if (!currentEditPatient.value) return
  
  try {
    const response = await request.post(`/user/${currentEditPatient.value.id}/tags`, {
      tagNames: currentTags.value
    })
    if (response.code === 200) {
      ElMessage.success('标签设置成功')
      editTagsDialogVisible.value = false
      fetchPatients()
    }
  } catch (error) {
    ElMessage.error('标签设置失败')
    console.error('Error saving tags:', error)
  }
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

const handleEdit = async (row) => {
  try {
    const response = await request.get(`/user/${row.id}`)
    if (response.code === 200) {
      editForm.value = { ...response.data }
      // 转换日期格式
      if (editForm.value.birthDate) {
        editForm.value.birthDate = new Date(editForm.value.birthDate)
      }
      if (editForm.value.admissionDate) {
        editForm.value.admissionDate = new Date(editForm.value.admissionDate)
      }
      if (editForm.value.dischargeDate) {
        editForm.value.dischargeDate = new Date(editForm.value.dischargeDate)
      }
      editDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取患者详情失败')
    console.error('Error fetching patient details:', error)
  }
}

const handleSaveEdit = async () => {
  if (!editForm.value) return
  
  try {
    const response = await request.put(`/user/${editForm.value.id}`, editForm.value)
    if (response.code === 200) {
      ElMessage.success('保存成功')
      editDialogVisible.value = false
      fetchPatients()
    }
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('Error saving patient details:', error)
  }
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
