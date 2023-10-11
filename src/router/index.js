import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      children:[
        {
          path:'',
          component: () => import('@/views/home/index.vue')
        },
        {
          path:'category/:id',
          component: () => import('@/views/category/index.vue')
        },
        {
          path:'category/sub/:id',
          component: () => import('@/views/subCategory/index.vue')
        },
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
  ],
  //路由滚动行为定制
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
