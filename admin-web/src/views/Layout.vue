<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <img src="/logo.png" alt="Logo" class="sidebar-logo" @error="handleLogoError" v-if="!isCollapse" />
        <img src="/logo.png" alt="Logo" class="sidebar-logo-small" @error="handleLogoError" v-else />
        <span v-if="!isCollapse" class="logo-text">圣通尚诺医疗™</span>
        <span v-else class="logo-text-small">尚诺</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        router
        background-color="#FFFFFF"
        text-color="#606266"
        active-text-color="#009D85"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
            <template #title>
              <el-icon><component :is="route.meta.icon" /></el-icon>
              <span>{{ route.meta.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.meta.icon" /></el-icon>
              <template #title>{{ child.meta.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="route.path">
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <template #title>{{ route.meta.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="username">{{ userName }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route.meta?.title || '')
const userName = computed(() => userStore.userInfo?.name || '管理员')
const userAvatar = computed(() => {
  const role = userStore.userInfo?.role
  if (role === 2) return 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  if (role === 1) return 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
  return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

const menuRoutes = computed(() => {
  const routes = router.getRoutes()
  const userRole = userStore.userInfo?.role
  
  console.log('Layout - 用户角色:', userRole)
  console.log('Layout - 所有路由:', routes.map(r => ({ path: r.path, meta: r.meta })))
  
  const buildMenu = (routeList) => {
    const menu = []
    routeList.forEach(route => {
      if (!route.meta?.title || route.meta?.hidden) return
      
      if (route.meta?.roles && !route.meta.roles.includes(userRole)) return
      
      if (route.children && route.children.length > 0) {
        const children = buildMenu(route.children)
        if (children.length > 0) {
          menu.push({
            path: route.path,
            meta: route.meta,
            children: children
          })
        }
      } else {
        menu.push({
          path: route.path,
          meta: route.meta
        })
      }
    })
    return menu
  }
  
  const allRoutes = buildMenu(routes)
  console.log('Layout - 构建后的菜单:', allRoutes)
  
  const filteredRoutes = allRoutes.filter(route => {
    if (route.path === '/patients' || route.path === '/health' || 
        route.path === '/medication' || route.path === '/notification' || 
        route.path === '/activities' || route.path === '/news' || 
        route.path === '/diagnosis' || route.path === '/insurance' || 
        route.path === '/system') {
      return true
    }
    return false
  })
  
  // 排序菜单，将/system路由移到最后面
  const sortedRoutes = filteredRoutes.sort((a, b) => {
    if (a.path === '/system') return 1
    if (b.path === '/system') return -1
    return 0
  })
  
  console.log('Layout - 排序后的菜单:', sortedRoutes)
  return sortedRoutes
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      userStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    } catch {
    }
  } else if (command === 'profile') {
    ElMessage.info('个人信息功能开发中')
  }
}

const handleLogoError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
}

.aside {
  background-color: #FFFFFF;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-right: 1px solid #EBEEF5;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #EBEEF5;
  gap: 8px;
  padding: 0 10px;
  background-color: #FFFFFF;
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: contain;
}

.sidebar-logo-small {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  object-fit: contain;
}

.logo-text {
  white-space: nowrap;
}

.logo-text-small {
  font-size: 12px;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #909399;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.collapse-icon:hover {
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #333;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
