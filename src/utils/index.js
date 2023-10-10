import request from "@/utils/request";
import {ElNotification} from "element-plus";
/**---------------快捷请求------------------ */
export function myPost(url, data, isDefault = true) {
    return request({  url: url, method: 'post',  data }).then(res => {
        if (isDefault) {
            const type = res.code === 0 ? 'success' : 'error'
            ElNotification({
                title: '处理结果',
                message: res.message ? res.message : type,
                type: type,
                position: 'bottom-left'
            })
        }
        return res
    })
}

export function myGet(url, params, isDefault = true) {
    return request({ url: url, method: 'get', params }).then((res) => {
        if (isDefault) {
            if (res.code !== 0) ElNotification({ title: '处理结果', message: res.message, type: 'error', position: 'bottom-left' })
        }
        return res
    })
}
