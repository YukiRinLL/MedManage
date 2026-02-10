<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <h1 class="nav-title">首页</h1>
      <button class="nav-btn" @click="showUserMenu = !showUserMenu">
        <span class="nav-icon">👤</span>
      </button>
    </div>
    
    <!-- 用户菜单 -->
    <div class="user-menu" v-if="showUserMenu">
      <router-link to="/profile" class="menu-option">个人信息</router-link>
      <div class="menu-option" @click="logout">退出登录</div>
    </div>
    
    <!-- 欢迎信息 -->
    <div class="welcome-section">
      <h2 class="welcome-title">欢迎使用医院患者管理系统！</h2>
      <p class="welcome-subtitle">您的健康管理助手</p>
    </div>
    
    <!-- 功能菜单 -->
    <div class="menu-grid">
      <router-link to="/health-record" class="menu-item">
        <div class="menu-icon">📋</div>
        <span>健康档案</span>
      </router-link>
      
      <router-link to="/vital-sign" class="menu-item">
        <div class="menu-icon">❤️</div>
        <span>生命体征</span>
      </router-link>
      
      <router-link to="/medication" class="menu-item">
        <div class="menu-icon">💊</div>
        <span>用药记录</span>
      </router-link>
      
      <router-link to="/notification" class="menu-item">
        <div class="menu-icon">🔔</div>
        <span>通知中心</span>
      </router-link>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/health-record" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">健康</span>
      </router-link>
      <router-link to="/medication" class="nav-item">
        <span class="nav-icon">💊</span>
        <span class="nav-text">用药</span>
      </router-link>
      <router-link to="/notification" class="nav-item">
        <span class="nav-icon">🔔</span>
        <span class="nav-text">通知</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserMenu = ref(false)

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.home-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 60px;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #007AFF;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-icon {
  font-size: 20px;
}

/* 用户菜单 */
.user-menu {
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 101;
  min-width: 150px;
  overflow: hidden;
}

.menu-option {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
}

.menu-option:last-child {
  border-bottom: none;
}

.menu-option:active {
  background-color: #f5f5f5;
}

/* 欢迎信息 */
.welcome-section {
  padding: 30px 20px;
  text-align: center;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 0 0 20px 20px;
}

.welcome-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.welcome-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 功能菜单 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.menu-item {
  background-color: #FFFFFF;
  padding: 24px 16px;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: #333333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.menu-item:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.menu-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.menu-item span {
  display: block;
  font-size: 14px;
  font-weight: 500;
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
  height: 60px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  padding: 4px 0;
  flex: 1;
}

.nav-item.active {
  color: #007AFF;
}

.nav-item .nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-item .nav-text {
  font-size: 10px;
}
</style>