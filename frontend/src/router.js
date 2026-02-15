import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Home from './views/Home.vue'
import HealthRecord from './views/HealthRecord.vue'
import VitalSign from './views/VitalSign.vue'
import Medication from './views/Medication.vue'
import Notification from './views/Notification.vue'
import Profile from './views/Profile.vue'

// 导入管理员页面
import AdminLogin from './views/AdminLogin.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import AdminUsers from './views/AdminUsers.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/health-record',
    name: 'HealthRecord',
    component: HealthRecord,
    meta: { requiresAuth: true }
  },
  {
    path: '/vital-sign',
    name: 'VitalSign',
    component: VitalSign,
    meta: { requiresAuth: true }
  },
  {
    path: '/medication',
    name: 'Medication',
    component: Medication,
    meta: { requiresAuth: true }
  },
  {
    path: '/notification',
    name: 'Notification',
    component: Notification,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  // 管理员路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const token = localStorage.getItem('token')
    if (token) {
      // 检查是否需要管理员权限
      if (to.meta.requiresAdmin) {
        const isAdmin = localStorage.getItem('isAdmin')
        if (isAdmin === 'true') {
          next()
        } else {
          // 无管理员权限，跳转到首页
          next({ path: '/home' })
        }
      } else {
        next()
      }
    } else {
      // 未登录，跳转到登录页
      if (to.meta.requiresAdmin) {
        next({ path: '/admin/login' })
      } else {
        next({ path: '/' })
      }
    }
  } else {
    next()
  }
})

export default router