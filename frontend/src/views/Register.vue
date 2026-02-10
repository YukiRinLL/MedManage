<template>
  <div class="register-container">
    <h1 class="page-title">注册账号</h1>
    
    <div class="form">
      <div class="form-item">
        <label class="form-label">手机号</label>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" />
      </div>
      
      <div class="form-item">
        <label class="form-label">密码</label>
        <input class="form-input" type="password" v-model="password" placeholder="请输入密码" />
      </div>
      
      <div class="form-item">
        <label class="form-label">确认密码</label>
        <input class="form-input" type="password" v-model="confirmPassword" placeholder="请确认密码" />
      </div>
      
      <div class="form-item">
        <label class="form-label">姓名</label>
        <input class="form-input" type="text" v-model="name" placeholder="请输入姓名" />
      </div>
      
      <div class="form-item">
        <label class="form-label">性别</label>
        <div class="gender-selector">
          <label class="gender-option" :class="{ active: gender === 0 }">
            <input type="radio" v-model="gender" :value="0" style="display: none;" />
            <span>女</span>
          </label>
          <label class="gender-option" :class="{ active: gender === 1 }">
            <input type="radio" v-model="gender" :value="1" style="display: none;" />
            <span>男</span>
          </label>
        </div>
      </div>
      
      <div class="form-item">
        <label class="form-label">年龄</label>
        <input class="form-input" type="number" v-model="age" placeholder="请输入年龄" />
      </div>
      
      <button class="btn-primary" @click="register">注册</button>
      
      <div class="login-link">
        <span>已有账号？</span>
        <router-link to="/" class="link">立即登录</router-link>
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
const confirmPassword = ref('')
const name = ref('')
const gender = ref(0)
const age = ref('')

const register = async () => {
  if (!phone.value) {
    alert('请输入手机号')
    return
  }
  if (!password.value) {
    alert('请输入密码')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  if (!name.value) {
    alert('请输入姓名')
    return
  }
  if (!age.value) {
    alert('请输入年龄')
    return
  }
  
  try {
    const res = await axios.post('/api/user/register', {
      phone: phone.value,
      password: password.value,
      name: name.value,
      gender: gender.value,
      age: parseInt(age.value)
    })
    alert('注册成功')
    router.push('/')
  } catch (err) {
    console.log(err)
    alert('注册失败，请检查网络连接')
  }
}
</script>

<style scoped>
.register-container {
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  color: #333333;
}

.form {
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

.gender-selector {
  display: flex;
  gap: 20px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.gender-option.active {
  background-color: #007AFF;
  color: #FFFFFF;
  border-color: #007AFF;
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

.login-link {
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