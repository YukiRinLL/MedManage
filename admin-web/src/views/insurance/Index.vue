<template>
  <div class="insurance-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>参保信息管理</span>
          <el-button type="primary" @click="handleAdd">新增参保信息</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="患者ID">
          <el-input v-model="searchForm.patientId" placeholder="请输入患者ID" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="透析号">
          <el-input v-model="searchForm.dialysisNumber" placeholder="请输入透析号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="参保地区">
          <el-input v-model="searchForm.insuredAreaName" placeholder="请输入参保地区" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="参保状态">
          <el-select v-model="searchForm.insuranceStatus" placeholder="" clearable style="width: 120px">
            <el-option label="正常参保" :value="1" />
            <el-option label="暂停/中断" :value="0" />
            <el-option label="终止" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="insuranceInfos"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
        <el-table-column prop="patientId" label="患者ID" width="120" />
        <el-table-column prop="dialysisNumber" label="透析号" width="120" />
        <el-table-column prop="insuredAreaName" label="参保地区" width="120" />
        <el-table-column prop="insuredDate" label="参保日期" width="180">
          <template #default="{ row }">
            {{ formatDate(row.insuredDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="psnTypeText" label="人员类型" width="150" />
        <el-table-column prop="insuranceStatus" label="参保状态" width="100">
          <template #default="{ row }">
            {{ getInsuranceStatusText(row.insuranceStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="insuranceTypeCode" label="险种类型" width="100" />
        <el-table-column prop="personalAccountBalance" label="个人账户余额" width="120" />
        <el-table-column prop="suspendDate" label="暂停参保日期" width="180">
          <template #default="{ row }">
            {{ formatDate(row.suspendDate) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button type="success" link @click="handleEdit(row)">编辑</el-button>
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
      title="参保信息详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions v-if="currentInsuranceInfo" :column="2" border>
        <!-- 基本信息 -->
        <el-descriptions-item label="参保信息ID">{{ currentInsuranceInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="患者ID">{{ currentInsuranceInfo.patientId }}</el-descriptions-item>
        <el-descriptions-item label="透析号">{{ currentInsuranceInfo.dialysisNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="参保地区代码">{{ currentInsuranceInfo.insuredAreaCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="参保地区名称">{{ currentInsuranceInfo.insuredAreaName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="参保日期">{{ formatDate(currentInsuranceInfo.insuredDate) }}</el-descriptions-item>
        
        <!-- 参保信息 -->
        <el-descriptions-item label="人员类别代码">{{ currentInsuranceInfo.psnTypeCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="人员类型名称">{{ currentInsuranceInfo.psnTypeText || '-' }}</el-descriptions-item>
        <el-descriptions-item label="公务员标识">{{ currentInsuranceInfo.civilServantFlag === 1 ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="参保单位">{{ currentInsuranceInfo.unitName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="参保状态">{{ getInsuranceStatusText(currentInsuranceInfo.insuranceStatus) }}</el-descriptions-item>
        <el-descriptions-item label="险种类型代码">{{ currentInsuranceInfo.insuranceTypeCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="个人账户余额">{{ currentInsuranceInfo.personalAccountBalance || 0 }} 元</el-descriptions-item>
        <el-descriptions-item label="暂停参保日期">{{ formatDate(currentInsuranceInfo.suspendDate) }}</el-descriptions-item>
        
        <!-- 其他信息 -->
        <el-descriptions-item label="创建时间" :span="2">{{ formatDate(currentInsuranceInfo.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ formatDate(currentInsuranceInfo.updatedAt) }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑参保信息' : '新增参保信息'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form v-if="editForm" :model="editForm" label-width="150px">
        <el-form-item label="患者ID">
          <el-input v-model="editForm.patientId" placeholder="请输入患者ID" />
        </el-form-item>
        <el-form-item label="透析号">
          <el-input v-model="editForm.dialysisNumber" placeholder="请输入透析号" />
        </el-form-item>
        <el-form-item label="参保地区代码">
          <el-input v-model="editForm.insuredAreaCode" placeholder="请输入6位行政区划代码" maxlength="6" />
        </el-form-item>
        <el-form-item label="参保地区名称">
          <el-input v-model="editForm.insuredAreaName" placeholder="请输入参保地区名称" />
        </el-form-item>
        <el-form-item label="参保日期">
          <el-date-picker
            v-model="editForm.insuredDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="人员类别代码">
          <el-input v-model="editForm.psnTypeCode" placeholder="请输入人员类别代码" />
        </el-form-item>
        <el-form-item label="人员类型名称">
          <el-input v-model="editForm.psnTypeText" placeholder="请输入人员类型名称" />
        </el-form-item>
        <el-form-item label="公务员标识">
          <el-select v-model="editForm.civilServantFlag">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="参保单位">
          <el-input v-model="editForm.unitName" placeholder="请输入参保单位" />
        </el-form-item>
        <el-form-item label="参保状态">
          <el-select v-model="editForm.insuranceStatus">
            <el-option label="正常参保" :value="1" />
            <el-option label="暂停/中断" :value="0" />
            <el-option label="终止" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="险种类型代码">
          <el-input v-model="editForm.insuranceTypeCode" placeholder="请输入险种类型代码" />
        </el-form-item>
        <el-form-item label="个人账户余额">
          <el-input v-model="editForm.personalAccountBalance" type="number" placeholder="请输入个人账户余额" />
        </el-form-item>
        <el-form-item label="暂停参保日期">
          <el-date-picker
            v-model="editForm.suspendDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const insuranceInfos = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentInsuranceInfo = ref(null)
const editDialogVisible = ref(false)
const editForm = ref(null)
const isEdit = ref(false)

const searchForm = reactive({
  patientId: '',
  dialysisNumber: '',
  insuredAreaName: '',
  insuranceStatus: null
})

const fetchInsuranceInfos = async () => {
  loading.value = true
  try {
    const response = await request.get('/insurance/list')
    if (response.code === 200) {
      insuranceInfos.value = response.data || []
      total.value = insuranceInfos.value.length
    }
  } catch (error) {
    ElMessage.error('获取参保信息列表失败')
    console.error('Error fetching insurance infos:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchInsuranceInfos()
}

const handleReset = () => {
  searchForm.patientId = ''
  searchForm.dialysisNumber = ''
  searchForm.insuredAreaName = ''
  searchForm.insuranceStatus = null
  currentPage.value = 1
  fetchInsuranceInfos()
}

const handleView = async (row) => {
  try {
    const response = await request.get(`/insurance/get/${row.id}`)
    if (response.code === 200) {
      currentInsuranceInfo.value = response.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取参保信息详情失败')
    console.error('Error fetching insurance info details:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除参保信息吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await request.delete(`/insurance/delete/${row.id}`)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      fetchInsuranceInfos()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('Error deleting insurance info:', error)
    }
  }
}

const handleAdd = () => {
  isEdit.value = false
  editForm.value = {
    patientId: '',
    dialysisNumber: '',
    insuredAreaCode: '',
    insuredAreaName: '',
    insuredDate: new Date(),
    psnTypeCode: '',
    psnTypeText: '',
    civilServantFlag: 0,
    unitName: '',
    insuranceStatus: 1,
    insuranceTypeCode: '',
    personalAccountBalance: 0,
    suspendDate: null
  }
  editDialogVisible.value = true
}

const handleEdit = async (row) => {
  try {
    const response = await request.get(`/insurance/get/${row.id}`)
    if (response.code === 200) {
      isEdit.value = true
      editForm.value = { ...response.data }
      // 转换日期格式
      if (editForm.value.insuredDate) {
        editForm.value.insuredDate = new Date(editForm.value.insuredDate)
      }
      if (editForm.value.suspendDate) {
        editForm.value.suspendDate = new Date(editForm.value.suspendDate)
      }
      editDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取参保信息详情失败')
    console.error('Error fetching insurance info details:', error)
  }
}

const handleSaveEdit = async () => {
  if (!editForm.value) return
  
  try {
    let response
    if (isEdit.value) {
      response = await request.put('/insurance/update', editForm.value)
    } else {
      response = await request.post('/insurance/create', editForm.value)
    }
    if (response.code === 200) {
      ElMessage.success(isEdit.value ? '保存成功' : '创建成功')
      editDialogVisible.value = false
      fetchInsuranceInfos()
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '保存失败' : '创建失败')
    console.error('Error saving insurance info:', error)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchInsuranceInfos()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchInsuranceInfos()
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

const getInsuranceStatusText = (status) => {
  switch (status) {
    case 0:
      return '暂停/中断'
    case 1:
      return '正常参保'
    case 2:
      return '终止'
    default:
      return '-'
  }
}

onMounted(() => {
  fetchInsuranceInfos()
})
</script>

<style scoped>
.insurance-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>