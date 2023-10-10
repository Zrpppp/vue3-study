//axios封装
import axios from 'axios'
import {ElMessage, ElNotification} from 'element-plus'

const request = axios.create({
    baseURL: 'http://127.0.0.1:4523/m1/2348589-0-default/',
    timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(configs => {
    return configs
}, err =>  Promise.reject(err))

// 响应拦截器
request.interceptors.response.use(res =>  {
    if(res.data.code !== 0) ElNotification({ title: '处理结果',  message: res.data.message, type: 'error', position: 'bottom-left' })
    return res.data
} ,err => {
    ElMessage({ showClose: true, center: true, grouping: true, type:"error", message:err.message, duration: 1500, })
    return Promise.reject(err)
})

export default request
