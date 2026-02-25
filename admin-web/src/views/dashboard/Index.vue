<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users">
              <el-icon :size="40"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalUsers || 0 }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon admins">
              <el-icon :size="40"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalAdmins || 0 }}</div>
              <div class="stat-label">管理员数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon records">
              <el-icon :size="40"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalRecords || 0 }}</div>
              <div class="stat-label">健康档案</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon medications">
              <el-icon :size="40"><Medicine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalMedications || 0 }}</div>
              <div class="stat-label">用药记录</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="isSuperAdmin" :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon super-admin">
              <el-icon :size="40"><Crown /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalSuperAdmins || 0 }}</div>
              <div class="stat-label">超级管理员</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon normal-users">
              <el-icon :size="40"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalNormalUsers || 0 }}</div>
              <div class="stat-label">普通用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon notifications">
              <el-icon :size="40"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.totalNotifications || 0 }}</div>
              <div class="stat-label">通知数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近注册用户</span>
            </div>
          </template>
          <el-table :data="recentUsers" stripe>
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="role" label="角色">
              <template #default="{ row }">
                <el-tag :type="getRoleType(row.role)">
                  {{ getRoleText(row.role) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统活动</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.time"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const isSuperAdmin = computed(() => userStore.isSuperAdmin)

const dashboardData = ref({})
const recentUsers = ref([])
const activities = ref([])

const getRoleType = (role) => {
  const types = { 0: 'info', 1: 'warning', 2: 'danger' }
  return types[role] || 'info'
}

const getRoleText = (role) => {
  const texts = { 0: '普通用户', 1: '管理员', 2: '超级管理员' }
  return texts[role] || '未知'
}

const fetchDashboardData = async () => {
  try {
    const res = await request.get('/admin/dashboard')
    dashboardData.value = res.data
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

const fetchRecentUsers = async () => {
  try {
    const res = await request.get('/admin/admins')
    recentUsers.value = res.data?.slice(0, 5) || []
  } catch (error) {
    console.error('获取最近用户失败:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
  fetchRecentUsers()

  const now = new Date()
  activities.value = [
    {
      content: '系统启动成功',
      time: now.toLocaleTimeString('zh-CN'),
      type: 'success'
    },
    {
      content: '管理员登录',
      time: new Date(now - 1000 * 60 * 5).toLocaleTimeString('zh-CN'),
      type: 'primary'
    },
    {
      content: '用户注册',
      time: new Date(now - 1000 * 60 * 10).toLocaleTimeString('zh-CN'),
      type: 'info'
    }
  ]
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
}

.stat-icon.users {
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
}

.stat-icon.admins {
  color: #ABCD07;
  background-color: rgba(171, 205, 7, 0.1);
}

.stat-icon.records {
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
}

.stat-icon.medications {
  color: #ABCD07;
  background-color: rgba(171, 205, 7, 0.1);
}

.stat-icon.super-admin {
  color: #F56C6C;
  background-color: rgba(245, 108, 108, 0.1);
}

.stat-icon.normal-users {
  color: #67C23A;
  background-color: rgba(103, 194, 58, 0.1);
}

.stat-icon.notifications {
  color: #909399;
  background-color: rgba(144, 147, 153, 0.1);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
