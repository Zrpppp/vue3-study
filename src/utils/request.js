//axios封装
import axios from 'axios'
import {ElMessage, ElNotification} from 'element-plus'
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";

const request = axios.create({
    // baseURL: 'http://127.0.0.1:4523/m1/2348589-0-default/',
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 10000,

})

// 请求拦截器
request.interceptors.request.use(configs => {
    // 1. 从pinia里面获取token数据
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    // 2. 按照后端的要求拼接token数据
    if(token) configs.headers.Authorization = `Bearer ${token}`
    return configs
}, err =>  Promise.reject(err))

// 响应拦截器
request.interceptors.response.use(res =>  {
    if(res.data.code !== "1") ElNotification({ title: '接口错误',  message: res.data.msg, type: 'error', position: 'bottom-left' })
    return res.data
} ,async err => {
    ElMessage({ showClose: true, center: true, grouping: true, type:"error", message:err.response.data.msg, duration: 1500, })
    const userStore = useUserStore()
    const router = useRouter()
    //401 token失效处理
    if(err.response.status === 401) {
        userStore.clearUserInfo()
        await router.push({path:'/login'})
    }
    return Promise.reject(err)
})

export default request

