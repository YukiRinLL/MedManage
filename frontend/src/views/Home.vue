<template>
  <div class="home-container">
    <h1 class="page-title">首页</h1>
    <p>欢迎使用医院患者管理系统！</p>
    
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
  </div>
</template>

<script setup>
// 首页组件
</script>

<style scoped>
.home-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333333;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.menu-item {
  background-color: #FFFFFF;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: #333333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.menu-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.menu-item span {
  display: block;
  font-size: 16px;
  font-weight: 500;
}
</style>