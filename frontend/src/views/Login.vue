<template>
  <div class="login-container">
    <div class="logo">
      <div class="logo-icon">
        <span class="logo-text">医</span>
      </div>
      <h1 class="app-name">医院患者管理</h1>
    </div>
    
    <div class="form">
      <div class="form-item">
        <label class="form-label">手机号</label>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" />
      </div>
      
      <div class="form-item">
        <label class="form-label">密码</label>
        <input class="form-input" type="password" v-model="password" placeholder="请输入密码" />
      </div>
      
      <button class="btn-primary" @click="login">登录</button>
      
      <div class="register-link">
        <span>还没有账号？</span>
        <router-link to="/register" class="link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '../composables/useAxios'

const router = useRouter()
const { axios } = useAxios()

const phone = ref('')
const password = ref('')

const login = async () => {
  if (!phone.value) {
    alert('请输入手机号')
    return
  }
  if (!password.value) {
    alert('请输入密码')
    return
  }
  
  try {
    const res = await axios.post('/api/user/login', {
      phone: phone.value,
      password: password.value
    })
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    alert('登录成功')
    router.push('/home')
  } catch (err) {
    console.log(err)
    alert('登录失败，请检查网络连接')
  }
}
</script>

<style scoped>
.login-container {
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.logo-icon {
  width: 120px;
  height: 120px;
  background-color: #007AFF;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 60px;
  color: #FFFFFF;
  font-weight: bold;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}

.form {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
}

.btn-primary {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  border: none;
  cursor: pointer;
  width: 100%;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666666;
}

.link {
  color: #007AFF;
  margin-left: 5px;
  text-decoration: none;
}
</style>