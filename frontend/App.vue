<template>
  <div id="app">
    <router-view v-if="isLogin" />
    <router-view v-else :name="'login'" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false
    };
  },
  onLaunch() {
    // 检查登录状态
    const token = uni.getStorageSync('token');
    if (token) {
      this.isLogin = true;
    }
  },
  methods: {
    setLoginStatus(status) {
      this.isLogin = status;
    }
  }
};
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #333333;
  background-color: #f5f5f5;
}

/* 通用按钮样式 */
.btn-primary {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.btn-secondary {
  background-color: #F5F5F5;
  color: #333333;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
  border: 1px solid #E5E5E5;
}

/* 通用表单样式 */
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

/* 通用卡片样式 */
.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 通用标题样式 */
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333333;
}

/* 通用列表项样式 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
}

.list-item:last-child {
  border-bottom: none;
}

/* 通用空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999999;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state-text {
  font-size: 16px;
}
</style>
