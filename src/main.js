import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
//引入样式文件
import '@/styles/common.scss'
//引入懒加载指令
import { lazyPlugin } from '@/directives'
//引入全局组件
import { componentPlugin } from '@/components'

const app = createApp(App)
//注册持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(ElementPlus)
app.use(componentPlugin)
app.mount('#app')
