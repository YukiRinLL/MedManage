<template>
  <view class="login-container">
    <view class="logo">
      <image src="/static/logo.png" mode="aspectFit"></image>
      <text class="app-name">医院患者管理</text>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">密码</text>
        <input class="form-input" type="password" v-model="password" placeholder="请输入密码" placeholder-class="placeholder-style" />
      </view>
      
      <view class="btn-primary" @click="login">登录</view>
      
      <view class="register-link">
        <text>还没有账号？</text>
        <navigator url="/pages/register/register" class="link">立即注册</navigator>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      password: ''
    };
  },
  methods: {
    login() {
      if (!this.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' });
        return;
      }
      if (!this.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' });
        return;
      }
      
      this.$axios.post('/user/login', {
        phone: this.phone,
        password: this.password
      }).then(res => {
        uni.setStorageSync('token', res.token);
        uni.setStorageSync('user', res.user);
        uni.showToast({ title: '登录成功', icon: 'success' });
        uni.switchTab({ url: '/pages/index/index' });
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  padding: 40px 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.logo image {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}

.form {
  flex: 1;
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

.placeholder-style {
  color: #999999;
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

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666666;
}

.link {
  color: #007AFF;
  margin-left: 5px;
}
</style>
