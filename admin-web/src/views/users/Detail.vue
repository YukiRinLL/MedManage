<template>
  <div class="user-detail">
    <el-page-header @back="goBack" content="用户详情" />

    <el-card style="margin-top: 20px">
      <template #header>
        <span>基本信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ userInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ userInfo.gender === 0 ? '女' : '男' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ userInfo.age }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="getRoleType(userInfo.role)">
            {{ getRoleText(userInfo.role) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ userInfo.idCard || '-' }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ userInfo.emergencyContact || '-' }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系电话">{{ userInfo.emergencyPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ userInfo.createdAt }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>健康档案</span>
      </template>
      <el-descriptions v-if="healthRecord" :column="2" border>
        <el-descriptions-item label="血型">{{ healthRecord.bloodType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="既往病史">{{ healthRecord.pastMedicalHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="过敏史">{{ healthRecord.allergicHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="家族病史">{{ healthRecord.familyMedicalHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="其他信息" :span="2">{{ healthRecord.otherInfo || '-' }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="暂无健康档案" />
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>最近用药记录</span>
      </template>
      <el-table :data="medications" stripe v-loading="loading">
        <el-table-column prop="medicationName" label="药品名称" />
        <el-table-column prop="dosage" label="剂量" />
        <el-table-column prop="frequency" label="频率" />
        <el-table-column prop="taken" label="是否服用">
          <template #default="{ row }">
            <el-tag :type="row.taken ? 'success' : 'info'">
              {{ row.taken ? '已服用' : '未服用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="medicationTime" label="服药时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const userInfo = ref({})
const healthRecord = ref(null)
const medications = ref([])

const getRoleType = (role) => {
  const types = { 0: 'info', 1: 'warning', 2: 'danger' }
  return types[role] || 'info'
}

const getRoleText = (role) => {
  const texts = { 0: '普通用户', 1: '管理员', 2: '超级管理员' }
  return texts[role] || '未知'
}

const fetchUserInfo = async () => {
  try {
    const res = await request.get(`/admin/users/${route.params.id}`)
    userInfo.value = res.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const fetchHealthRecord = async () => {
  try {
    const res = await request.get(`/health-record/info?userId=${route.params.id}`)
    healthRecord.value = res.data
  } catch (error) {
    console.error('获取健康档案失败:', error)
  }
}

const fetchMedications = async () => {
  loading.value = true
  try {
    const res = await request.get(`/medication/list?userId=${route.params.id}&page=1&size=5`)
    medications.value = res.data?.list || []
  } catch (error) {
    console.error('获取用药记录失败:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchUserInfo()
  fetchHealthRecord()
  fetchMedications()
})
</script>

<style scoped>
.user-detail {
  padding: 20px;
}
</style>
