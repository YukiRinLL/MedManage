import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/Layout.vue'),
    redirect: '/patients',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/patients',
        name: 'Patients',
        component: () => import('@/views/patients/Index.vue'),
        meta: { title: '患者管理', icon: 'UserFilled', roles: [1, 2] }
      },
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统维护', icon: 'Setting', roles: [2] },
        children: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/Index.vue'),
            meta: { title: '仪表盘', icon: 'DataLine', roles: [2] }
          },
          {
            path: '/users',
            name: 'Users',
            component: () => import('@/views/users/Index.vue'),
            meta: { title: '用户管理', icon: 'User', roles: [2] }
          },
          {
            path: '/users/:id',
            name: 'UserDetail',
            component: () => import('@/views/users/Detail.vue'),
            meta: { title: '用户详情', hidden: true, roles: [2] }
          }
        ]
      },
      {
        path: '/health',
        name: 'Health',
        component: () => import('@/views/health/Index.vue'),
        meta: { title: '健康档案', icon: 'Document', roles: [1, 2] }
      },
      {
        path: '/health/:id',
        name: 'HealthDetail',
        component: () => import('@/views/health/Detail.vue'),
        meta: { title: '健康档案详情', hidden: true, roles: [1, 2] }
      },
      {
        path: '/medication',
        name: 'Medication',
        component: () => import('@/views/medication/Index.vue'),
        meta: { title: '用药记录', icon: 'Medicine', roles: [1, 2] }
      },
      {
        path: '/notification',
        name: 'Notification',
        component: () => import('@/views/notification/Index.vue'),
        meta: { title: '通知管理', icon: 'Bell', roles: [1, 2] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    const userRole = userStore.userInfo?.role
    const requiredRoles = to.meta?.roles
    
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      ElMessage.error('您没有权限访问此页面')
      next(from.path)
    } else {
      next()
    }
  }
})

export default router
