import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '仪表盘', icon: 'Odometer' }
        },
        {
          path: '/employee',
          name: 'Employee',
          component: () => import('@/views/employee/index.vue'),
          meta: { title: '员工管理', icon: 'User' }
        },
        {
          path: '/department',
          name: 'Department',
          component: () => import('@/views/department/index.vue'),
          meta: { title: '部门管理', icon: 'OfficeBuilding' }
        },
        {
          path: '/attendance',
          name: 'Attendance',
          component: () => import('@/views/attendance/index.vue'),
          meta: { title: '考勤管理', icon: 'Calendar' }
        },
        {
          path: '/salary',
          name: 'Salary',
          component: () => import('@/views/salary/index.vue'),
          meta: { title: '薪资管理', icon: 'Money' }
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/views/profile/index.vue'),
          meta: { title: '个人中心', icon: 'UserFilled', hidden: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/404.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.public) {
    // 公开页面，直接访问
    next()
  } else if (!userStore.isLoggedIn) {
    // 未登录，跳转到登录页
    ElMessage.warning('请先登录')
    next('/login')
  } else {
    // 已登录，正常访问
    next()
  }
})

export default router
