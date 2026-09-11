<template>
  <div class="dashboard">
    <section class="welcome-panel">
      <div>
        <span class="eyebrow">今日工作台</span>
        <h1>管理概览</h1>
        <p>从患者资料开始，快速查看健康记录与运营状态。</p>
      </div>
      <el-button type="primary" size="large" @click="navigate('/patients')">
        <el-icon><UserFilled /></el-icon>
        管理患者
      </el-button>
    </section>

    <section class="quick-actions">
      <div class="section-heading">
        <div>
          <span class="eyebrow">快捷入口</span>
          <h2>常用工作</h2>
        </div>
        <span class="section-note">减少重复查找，直接进入高频模块</span>
      </div>
      <div class="action-grid">
        <button class="action-card" type="button" @click="navigate('/health')">
          <el-icon><Document /></el-icon><span><strong>健康档案</strong><small>查看患者健康记录</small></span>
        </button>
        <button class="action-card" type="button" @click="navigate('/vital-sign')">
          <el-icon><TrendCharts /></el-icon><span><strong>生命体征</strong><small>追踪近期指标变化</small></span>
        </button>
        <button class="action-card" type="button" @click="navigate('/medication')">
          <el-icon><FirstAidKit /></el-icon><span><strong>用药记录</strong><small>核对患者用药情况</small></span>
        </button>
        <button class="action-card" type="button" @click="navigate('/schedule')">
          <el-icon><Calendar /></el-icon><span><strong>透析排班</strong><small>安排与查看治疗计划</small></span>
        </button>
      </div>
    </section>

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
              <el-icon :size="40"><FirstAidKit /></el-icon>
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

const navigate = (path) => {
  if (path) window.location.assign(path)
}

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
    const res = await request.get('/user/list', { params: { page: 1, size: 5 } })
    recentUsers.value = res.data?.list || res.data?.content || []
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

.welcome-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  margin-bottom: 24px;
  border: 1px solid #dcefe9;
  border-radius: 16px;
  background: linear-gradient(115deg, #f2fbf8 0%, #ffffff 70%);
}

.eyebrow {
  display: block;
  color: #009d85;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.welcome-panel h1,
.section-heading h2 {
  margin: 6px 0;
  color: #1d2939;
  font-weight: 650;
}

.welcome-panel h1 { font-size: 28px; }
.welcome-panel p { color: #667085; font-size: 14px; }

.quick-actions {
  margin-bottom: 24px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-heading h2 { font-size: 19px; }
.section-note { color: #98a2b3; font-size: 13px; }

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 16px;
  border: 1px solid #eaecf0;
  border-radius: 12px;
  background: #fff;
  color: #009d85;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.action-card:hover {
  border-color: #8ad7c8;
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.08);
  transform: translateY(-2px);
}

.action-card > .el-icon { flex: 0 0 auto; font-size: 22px; }
.action-card span { display: flex; flex-direction: column; gap: 4px; }
.action-card strong { color: #344054; font-size: 14px; }
.action-card small { color: #98a2b3; font-size: 12px; }

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

@media (max-width: 900px) {
  .action-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .dashboard { padding: 12px; }
  .welcome-panel { align-items: flex-start; flex-direction: column; padding: 22px; }
  .section-heading { align-items: flex-start; flex-direction: column; gap: 4px; }
  .action-grid { grid-template-columns: 1fr; }
}
</style>
