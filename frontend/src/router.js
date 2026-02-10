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
      next()
    } else {
      // 未登录，跳转到登录页
      next({ path: '/' })
    }
  } else {
    next()
  }
})

export default router