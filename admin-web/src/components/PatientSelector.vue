<template>
  <el-card class="patient-selector">
    <template #header>
      <div class="selector-header">
        <span>{{ selectedPatient ? '当前患者' : '先选择患者' }}</span>
        <el-button v-if="selectedPatient" type="primary" link @click="resetSelection">重新搜索患者</el-button>
      </div>
    </template>

    <div v-if="selectedPatient" class="selected-patient">
      <el-tag type="success">已选择</el-tag>
      <strong>{{ selectedPatient.name }}</strong>
      <span>手机号：{{ selectedPatient.phone || '-' }}</span>
      <span>透析号：{{ selectedPatient.txNumber || '-' }}</span>
      <span>身份证号：{{ selectedPatient.idCard || '-' }}</span>
    </div>

    <template v-else>
      <el-form :inline="true" :model="searchForm" @submit.prevent>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="searchPatients">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-if="patients.length" :data="patients" v-loading="loading" border stripe>
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="txNumber" label="透析号" width="150" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }"><el-button type="primary" link @click="selectPatient(row)">选择</el-button></template>
        </el-table-column>
      </el-table>
      <el-empty v-else-if="searched && !loading" description="未找到患者，请调整搜索条件" />
      <div v-else class="selector-hint">请输入患者信息搜索后选择</div>
    </template>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'selected'])
const searchForm = reactive({ name: '', phone: '', idCard: '' })
const patients = ref([])
const loading = ref(false)
const searched = ref(false)
const selectedPatient = ref(props.modelValue)

const searchPatients = async () => {
  const params = { page: 1, size: 100, ...searchForm }
  Object.keys(params).forEach(key => { if (!params[key]) delete params[key] })
  if (Object.keys(params).length === 2) return ElMessage.warning('请输入姓名、手机号或身份证号')
  loading.value = true
  searched.value = true
  try {
    const res = await request.get('/user/list', { params })
    patients.value = res.data?.list || []
  } catch {
    ElMessage.error('搜索患者失败')
  } finally {
    loading.value = false
  }
}

const selectPatient = (patient) => {
  selectedPatient.value = patient
  emit('update:modelValue', patient)
  emit('selected', patient)
}

const resetSelection = () => {
  selectedPatient.value = null
  patients.value = []
  searched.value = false
  emit('update:modelValue', null)
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.idCard = ''
  patients.value = []
  searched.value = false
}
</script>

<style scoped>
.patient-selector { margin-bottom: 16px; }
.selector-header { display: flex; justify-content: space-between; align-items: center; }
.selected-patient { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; color: #606266; }
.selected-patient strong { color: #303133; font-size: 16px; }
.selector-hint { color: #909399; padding: 8px 0; }
</style>
