import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },

    // Medications Module
    {
      path: '/medications',
      name: 'medications',
      component: () => import('../views/Medications/index.vue')
    },
    {
      path: '/medications/create',
      name: 'create-medication',
      component: () => import('../views/Medications/Create.vue')
    },
    {
      path: '/medications/edit/:id',
      name: 'edit-medication',
      component: () => import('../views/Medications/Edit.vue')
    },

    // Sales Module
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/Sales/Index.vue')
    },
    {
      path: '/sales/create',
      name: 'create-sale',
      component: () => import('../views/Sales/Create.vue')
    },
    {
      path: '/sales/edit/:id',
      name: 'edit-sale',
      component: () => import('../views/Sales/Edit.vue')
    },

    // Clients Module
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../views/Clients/Index.vue')
    },
    {
      path: '/clients/create',
      name: 'create-client',
      component: () => import('../views/Clients/Create.vue')
    },
    {
      path: '/clients/edit/:id',
      name: 'edit-client',
      component: () => import('../views/Clients/Edit.vue')
    },

    // Employees Module
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/Employees/Index.vue')
    },
    {
      path: '/employees/create',
      name: 'create-employee',
      component: () => import('../views/Employees/Create.vue')
    },
    {
      path: '/employees/edit/:id',
      name: 'edit-employee',
      component: () => import('../views/Employees/Edit.vue')
    },

    // Laboratories Module
    {
      path: '/laboratories',
      name: 'laboratories',
      component: () => import('../views/Laboratories/Index.vue')
    },
    {
      path: '/laboratories/create',
      name: 'create-laboratory',
      component: () => import('../views/Laboratories/Create.vue')
    },
    {
      path: '/laboratories/edit/:id',
      name: 'edit-laboratory',
      component: () => import('../views/Laboratories/Edit.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
