<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <img src="/logo.png" alt="Logo" class="sidebar-logo" @error="handleLogoError" v-if="!isCollapse" />
        <img src="/logo.png" alt="Logo" class="sidebar-logo-small" @error="handleLogoError" v-else />
        <div v-if="!isCollapse" class="logo-copy">
          <span class="logo-text">圣通尚诺医疗™</span>
        </div>
        <span v-else class="logo-text-small">尚诺</span>
      </div>
      <div class="menu-scroll">
        <el-menu
          :collapse="isCollapse"
          :default-active="activeMenu"
          :default-openeds="defaultOpeneds"
          background-color="#FFFFFF"
          text-color="#606266"
          active-text-color="#009D85"
        >
          <el-sub-menu v-for="section in menuSections" :key="section.key" :index="section.key">
            <template #title>
              <el-icon><component :is="section.icon" /></el-icon>
              <span>{{ section.title }}</span>
            </template>
            <template v-for="item in section.items" :key="item.path">
              <el-sub-menu v-if="item.children?.length" :index="item.path">
                <template #title>
                  <el-icon><component :is="item.meta.icon" /></el-icon>
                  <span>{{ item.meta.title }}</span>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :key="child.path"
                  :index="child.path"
                  @click="handleMenuSelect(child.path)"
                >
                  <el-icon><component :is="child.meta.icon" /></el-icon>
                  <template #title>{{ child.meta.title }}</template>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.path" @click="handleMenuSelect(item.path)">
                <el-icon><component :is="item.meta.icon" /></el-icon>
                <template #title>{{ item.meta.title }}</template>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="navigate('/patients')">首页</el-breadcrumb-item>
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
const defaultOpeneds = computed(() => menuSections.value.flatMap(section => [
  section.key,
  ...section.items.filter(item => item.children?.length).map(item => item.path)
]))
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
  const visiblePaths = new Set([
    '/patients', '/health', '/medication', '/notification', '/activities', '/news',
    '/diagnosis', '/insurance', '/schedule', '/education', '/blood-test',
    '/medical-staff', '/vital-sign', '/improvement-plan', '/feedback', '/system'
  ])
  return allRoutes.filter(item => visiblePaths.has(item.path))
})

const menuSections = computed(() => {
  const sections = [
    { key: 'patient-work', title: '患者工作', icon: 'UserFilled', paths: ['/patients', '/health', '/vital-sign', '/blood-test', '/improvement-plan', '/medication', '/diagnosis', '/insurance', '/schedule'] },
    { key: 'content-operation', title: '内容运营', icon: 'Collection', paths: ['/notification', '/activities', '/news', '/education', '/feedback'] },
    { key: 'organization', title: '组织管理', icon: 'Avatar', paths: ['/medical-staff'] },
    { key: 'system-maintenance', title: '系统维护', icon: 'Setting', paths: ['/system'] }
  ]
  return sections
    .map(section => ({
      ...section,
      items: menuRoutes.value
        .filter(item => section.paths.includes(item.path))
        .flatMap(item => item.path === '/system' ? item.children || [] : [item])
    }))
    .filter(section => section.items.length)
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const navigate = (path) => {
  if (path && path !== route.path) window.location.assign(path)
}

const handleMenuSelect = (path) => {
  if (path && path !== route.path) {
    navigate(path)
  }
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
      window.location.assign('/login')
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
  display: flex;
  flex-direction: column;
}

.logo {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #EBEEF5;
  gap: 7px;
  padding: 0 6px;
  background-color: #FFFFFF;
}

.sidebar-logo {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  object-fit: contain;
}

.sidebar-logo-small {
  width: 34px;
  height: 34px;
  border-radius: 4px;
  object-fit: contain;
}

.logo-text {
  white-space: nowrap;
  font-size: 14px;
}

.logo-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.logo-text-small {
  white-space: nowrap;
}

.el-menu {
  border-right: none;
}

.menu-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #d0d5dd transparent;
}

.menu-scroll::-webkit-scrollbar {
  width: 5px;
}

.menu-scroll::-webkit-scrollbar-thumb {
  background: #d0d5dd;
  border-radius: 10px;
}

.menu-scroll :deep(.el-menu) {
  border-right: none;
}

.menu-scroll :deep(.el-sub-menu__title),
.menu-scroll :deep(.el-menu-item) {
  height: 38px;
  line-height: 38px;
  font-size: 13px;
}

.menu-scroll :deep(.el-sub-menu .el-menu-item) {
  min-width: 0;
  padding-left: 30px !important;
}

.menu-scroll :deep(.el-sub-menu .el-sub-menu__title) {
  padding-left: 20px !important;
}

.menu-scroll :deep(> .el-menu > .el-sub-menu > .el-sub-menu__title) {
  height: 34px;
  line-height: 34px;
  color: #98a2b3;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.menu-scroll :deep(.el-menu:not(.el-menu--collapse) > .el-sub-menu > .el-sub-menu__title .el-icon) {
  display: none;
}

.menu-scroll :deep(.el-menu:not(.el-menu--collapse) > .el-sub-menu > .el-sub-menu__title) {
  padding-left: 20px !important;
}

.menu-scroll :deep(.el-sub-menu__icon-arrow) {
  color: #98a2b3;
  font-size: 13px;
  transition: transform 0.2s ease;
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
  padding: 0;
  overflow-y: auto;
}

.main :deep(.page-header .page-title),
.main :deep(.page-header h2),
.main :deep(.page-header > h2) {
  display: none;
}

.main :deep(.page-header) {
  margin-bottom: 12px;
}
</style>
