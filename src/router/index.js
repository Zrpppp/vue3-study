import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const routes =  [
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
      {
        path: 'detail/:id',
        component: () => import('@/views/detail/index.vue')
      },
      {
        path: 'cartList',
        component: () => import('@/views/cartList/index.vue')
      },
      {
        path: 'checkout',
        component: () => import('@/views/checkout/index.vue')
      },
      {
        path: 'pay',
        component: () => import('@/views/pay/index.vue')
      },
      {
        path: 'member',
        component: () => import('@/views/member/index.vue'),
        children:[
          {
            path: '',
            component: () => import('@/views/member/components/userInfo.vue')
          },
          {
            path: 'order',
            component: () => import('@/views/member/components/userOrder.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //路由滚动行为定制
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3,// 初始化时的最小百分比,
})

router.beforeEach((to, from, next) => {
  //这这里开启加载条
  NProgress.start()
  next()
})
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

export default router
