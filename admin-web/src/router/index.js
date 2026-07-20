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
        meta: { title: '用药记录', icon: 'Pill', roles: [1, 2] }
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
      },
      {
        path: '/diagnosis',
        name: 'Diagnosis',
        component: () => import('@/views/diagnosis/Index.vue'),
        meta: { title: '诊断信息管理', icon: 'Notebook', roles: [1, 2] }
      },
      {
        path: '/insurance',
        name: 'Insurance',
        component: () => import('@/views/insurance/Index.vue'),
        meta: { title: '参保信息管理', icon: 'Wallet', roles: [1, 2] }
      },
      {
        path: '/schedule',
        name: 'Schedule',
        component: () => import('@/views/schedule/Index.vue'),
        meta: { title: '透析排班管理', icon: 'Calendar', roles: [1, 2] }
      },
      {
        path: '/education',
        name: 'Education',
        component: () => import('@/views/education/Index.vue'),
        meta: { title: '科普宣教管理', icon: 'Notebook', roles: [1, 2] }
      },
      {
        path: '/blood-test',
        name: 'BloodTest',
        component: () => import('@/views/blood-test/Index.vue'),
        meta: { title: '核心指标管理', icon: 'DataLine', roles: [1, 2] }
      },
      {
        path: '/medical-staff',
        name: 'MedicalStaff',
        component: () => import('@/views/medical-staff/Index.vue'),
        meta: { title: '医护人员管理', icon: 'UserFilled', roles: [1, 2] }
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
      next(false)
    } else {
      next()
    }
  }
})

export default router
