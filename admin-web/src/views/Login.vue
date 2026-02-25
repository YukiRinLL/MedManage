<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-container">
          <img src="/logo.png" alt="Logo" class="login-logo" @error="handleLogoError" />
        </div>
        <h1>重庆圣通尚诺医疗管理™</h1>
        <p>患者管理系统 - 管理后台</p>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            style="width: 100%"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <p>仅限管理员和超级管理员登录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  phone: '',
  password: ''
})

const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/admin/login', loginForm)
        userStore.setToken(res.token)
        userStore.setUserInfo(res.data)
        userStore.setIsAdmin(res.isAdmin)
        userStore.setIsSuperAdmin(res.isSuperAdmin)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleLogoError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #F5F7FA;
  position: relative;
}

.login-card {
  width: 420px;
  padding: 50px 40px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-container {
  margin-bottom: 20px;
}

.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: contain;
  padding: 10px;
  background-color: #F5F7FA;
}

.login-header h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-bottom: 25px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #DCDFE6;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #009D85;
}

.login-form :deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #009D85, 0 0 0 4px rgba(0, 157, 133, 0.1);
}

.login-form :deep(.el-button--primary) {
  background-color: #009D85;
  border-color: #009D85;
  border-radius: 8px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-form :deep(.el-button--primary:hover) {
  background-color: #26B99A;
  border-color: #26B99A;
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: #C0C4CC;
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
}
</style>
