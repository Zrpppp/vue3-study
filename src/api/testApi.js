import request from "@/utils/request";

export function getTestData(params){
    return request({
        url: 'test',
        method: 'get',
        params
    })
}
