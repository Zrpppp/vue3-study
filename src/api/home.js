import request from "@/utils/request";

//获取banner数据
export function getBannerAPI(params={}){
    //默认为1 商品为2
    const {distributionSite = '1'} = params
    return request({
        url: "/home/banner",
        method: "get",
        params:{
            distributionSite
        }
    })
}

/**
 * @description:获取新鲜好物
 * @return {*}
 */
export const findNewAPI = () => {
    return request({
        url: "/home/new",
        method: "get"
    })
}

/**
 * @description:获取人气推荐
 * @return {*}
 */
export const getHotAPI = () => {
    return request({
        url: '/home/hot',
        method: "get"
    })
}

/**
 * @description:获取所有商品模块
 * @return {*}
 */
export const getGoodsAPI = () => {
    return request({
        url: '/home/goods',
        method: "get"
    })
}
