import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

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
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '仪表盘', icon: 'DataLine' }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/users/Index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: '/users/:id',
        name: 'UserDetail',
        component: () => import('@/views/users/Detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: '/health',
        name: 'Health',
        component: () => import('@/views/health/Index.vue'),
        meta: { title: '健康档案', icon: 'Document' }
      },
      {
        path: '/health/:id',
        name: 'HealthDetail',
        component: () => import('@/views/health/Detail.vue'),
        meta: { title: '健康档案详情', hidden: true }
      },
      {
        path: '/medication',
        name: 'Medication',
        component: () => import('@/views/medication/Index.vue'),
        meta: { title: '用药记录', icon: 'Medicine' }
      },
      {
        path: '/notification',
        name: 'Notification',
        component: () => import('@/views/notification/Index.vue'),
        meta: { title: '通知管理', icon: 'Bell' }
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
    next()
  }
})

export default router
