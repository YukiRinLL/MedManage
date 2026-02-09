<template>
  <view class="register-container">
    <view class="form">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">密码</text>
        <input class="form-input" type="password" v-model="password" placeholder="请输入密码" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">确认密码</text>
        <input class="form-input" type="password" v-model="confirmPassword" placeholder="请确认密码" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" type="text" v-model="name" placeholder="请输入姓名" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-selector">
          <view class="gender-option" :class="{ active: gender === 0 }" @click="gender = 0">
            <text>女</text>
          </view>
          <view class="gender-option" :class="{ active: gender === 1 }" @click="gender = 1">
            <text>男</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">年龄</text>
        <input class="form-input" type="number" v-model="age" placeholder="请输入年龄" placeholder-class="placeholder-style" />
      </view>
      
      <view class="btn-primary" @click="register">注册</view>
      
      <view class="login-link">
        <text>已有账号？</text>
        <navigator url="/pages/login/login" class="link">立即登录</navigator>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      password: '',
      confirmPassword: '',
      name: '',
      gender: 0,
      age: ''
    };
  },
  methods: {
    register() {
      if (!this.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' });
        return;
      }
      if (!this.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' });
        return;
      }
      if (this.password !== this.confirmPassword) {
        uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
        return;
      }
      if (!this.name) {
        uni.showToast({ title: '请输入姓名', icon: 'none' });
        return;
      }
      if (!this.age) {
        uni.showToast({ title: '请输入年龄', icon: 'none' });
        return;
      }
      
      this.$axios.post('/user/register', {
        phone: this.phone,
        password: this.password,
        name: this.name,
        gender: this.gender,
        age: parseInt(this.age)
      }).then(res => {
        uni.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/login/login' });
        }, 1500);
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style scoped>
.register-container {
  padding: 20px;
  min-height: 100vh;
}

.form {
  width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
}

.placeholder-style {
  color: #999999;
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
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666666;
}

.link {
  color: #007AFF;
  margin-left: 5px;
}
</style>
