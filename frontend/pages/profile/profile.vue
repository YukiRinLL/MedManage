<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="card">
      <text class="section-title">个人信息</text>
      
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" type="text" v-model="user.name" placeholder="请输入姓名" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" type="number" v-model="user.phone" placeholder="请输入手机号" placeholder-class="placeholder-style" disabled />
      </view>
      
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-selector">
          <view class="gender-option" :class="{ active: user.gender === 0 }" @click="user.gender = 0">
            <text>女</text>
          </view>
          <view class="gender-option" :class="{ active: user.gender === 1 }" @click="user.gender = 1">
            <text>男</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">年龄</text>
        <input class="form-input" type="number" v-model="user.age" placeholder="请输入年龄" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">身份证号</text>
        <input class="form-input" type="text" v-model="user.idCard" placeholder="请输入身份证号" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">紧急联系人</text>
        <input class="form-input" type="text" v-model="user.emergencyContact" placeholder="请输入紧急联系人" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">紧急联系电话</text>
        <input class="form-input" type="number" v-model="user.emergencyPhone" placeholder="请输入紧急联系电话" placeholder-class="placeholder-style" />
      </view>
      
      <view class="btn-primary" @click="updateUser">保存</view>
    </view>
    
    <!-- 其他操作 -->
    <view class="card" style="margin-top: 20px;">
      <text class="section-title">其他操作</text>
      
      <view class="action-item" @click="changePassword">
        <text class="action-text">修改密码</text>
        <text class="action-arrow">></text>
      </view>
      
      <view class="action-item" @click="about">
        <text class="action-text">关于我们</text>
        <text class="action-arrow">></text>
      </view>
      
      <view class="action-item" @click="logout" style="color: #FF3B30;">
        <text class="action-text">退出登录</text>
        <text class="action-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        phone: '',
        gender: 0,
        age: '',
        idCard: '',
        emergencyContact: '',
        emergencyPhone: ''
      }
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const userInfo = uni.getStorageSync('user');
      if (userInfo) {
        this.user = userInfo;
      }
      // 从服务器获取最新用户信息
      this.$axios.get('/user/info').then(res => {
        if (res.data) {
          this.user = res.data;
          uni.setStorageSync('user', res.data);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    updateUser() {
      this.$axios.put('/user/update', this.user).then(res => {
        uni.showToast({ title: '更新成功', icon: 'success' });
        // 更新本地存储
        uni.setStorageSync('user', this.user);
      }).catch(err => {
        console.log(err);
      });
    },
    changePassword() {
      uni.showModal({
        title: '修改密码',
        content: '此功能暂未开放',
        showCancel: false
      });
    },
    about() {
      uni.showModal({
        title: '关于我们',
        content: '医院患者管理APP v1.0.0\n\n致力于为患者提供便捷的健康管理服务',
        showCancel: false
      });
    },
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储
            uni.removeStorageSync('token');
            uni.removeStorageSync('user');
            // 调用后端登出接口
            this.$axios.post('/user/logout').catch(err => {
              console.log(err);
            });
            // 跳转到登录页面
            uni.redirectTo({ url: '/pages/login/login' });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: block;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
}

.form-input:disabled {
  background-color: #F5F5F5;
  color: #999999;
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
  margin-top: 20px;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F0F0F0;
  font-size: 16px;
  color: #333333;
}

.action-item:last-child {
  border-bottom: none;
  margin-top: 8px;
}

.action-arrow {
  font-size: 18px;
  color: #999999;
}
</style>
