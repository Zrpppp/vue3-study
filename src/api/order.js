import request from "@/utils/request";

/**
 * 获取用户订单信息
 * @param params: { orderState:0, page:1, pageSize:2 }
 * @returns {*}
 */
export const getUserOrder = (params) => {
    return request({
        url: '/member/order',
        method: 'GET',
        params
    })
}
