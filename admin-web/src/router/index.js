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
      },
      {
        path: '/activities',
        name: 'Activities',
        component: () => import('@/views/activities/Index.vue'),
        meta: { title: '活动管理', icon: 'Calendar', roles: [1, 2] }
      },
      {
        path: '/news',
        name: 'News',
        component: () => import('@/views/news/Index.vue'),
        meta: { title: '新闻管理', icon: 'DocumentCopy', roles: [1, 2] }
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

  console.log('路由守卫 - 目标路由:', to.path, to.meta)
  console.log('路由守卫 - token:', token)
  console.log('路由守卫 - userInfo:', userStore.userInfo)
  console.log('路由守卫 - userRole:', userStore.userInfo?.role)

  if (to.meta.requiresAuth && !token) {
    console.log('路由守卫 - 需要认证但没有token，跳转到登录页')
    next('/login')
  } else if (to.path === '/login' && token) {
    console.log('路由守卫 - 已登录但访问登录页，跳转到首页')
    next('/')
  } else {
    const userRole = userStore.userInfo?.role
    const requiredRoles = to.meta?.roles
    
    console.log('路由守卫 - requiredRoles:', requiredRoles)
    console.log('路由守卫 - 检查权限:', requiredRoles, 'includes', userRole, '=', requiredRoles && requiredRoles.includes(userRole))
    
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      console.log('路由守卫 - 权限不足，停留在当前页')
      ElMessage.error('您没有权限访问此页面')
      next(from.path)
    } else {
      console.log('路由守卫 - 允许访问')
      next()
    }
  }
})

export default router
