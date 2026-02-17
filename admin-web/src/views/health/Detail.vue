<template>
  <div class="health-detail">
    <el-page-header @back="goBack" content="健康档案详情" />

    <el-card style="margin-top: 20px">
      <template #header>
        <span>用户信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ healthRecord.userId }}</el-descriptions-item>
        <el-descriptions-item label="用户姓名">{{ healthRecord.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ healthRecord.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ healthRecord.userGender === 1 ? '男' : '女' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ healthRecord.userAge }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ healthRecord.updatedAt }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>健康信息</span>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="血型">{{ healthRecord.bloodType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="既往病史">{{ healthRecord.pastMedicalHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="过敏史">{{ healthRecord.allergicHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="家族病史">{{ healthRecord.familyMedicalHistory || '-' }}</el-descriptions-item>
        <el-descriptions-item label="其他信息">{{ healthRecord.otherInfo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ healthRecord.createdAt }}</el-descriptions-item>
      </el-descriptions>
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

const healthRecord = ref({})

const fetchHealthRecord = async () => {
  try {
    const res = await request.get(`/health-record/${route.params.id}`)
    healthRecord.value = res.data
  } catch (error) {
    console.error('获取健康档案详情失败:', error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchHealthRecord()
})
</script>

<style scoped>
.health-detail {
  padding: 20px;
}
</style>
