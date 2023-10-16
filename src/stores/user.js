import {defineStore} from "pinia";
import {ref} from "vue";
import { loginAPI } from '@/api/user'
import {useCartStore} from "@/stores/cart";
import {mergeCartAPI} from "@/api/cart";
export const useUserStore = defineStore('user', ()=>{
    const userInfo = ref({})
    const cartStore = useCartStore()
    const getUserInfo = async ({account, password})=>{
        const res = await loginAPI({account, password})
        userInfo.value = res.result
        await mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }))
        await cartStore.getCartList()
    }
    const clearUserInfo = async ()=>{
        userInfo.value = {}
        await cartStore.clearCart()
    }
    const getToken = ()=>{
        return userInfo.value.token
    }
    return {
        userInfo,
        getUserInfo,
        clearUserInfo,
        getToken
    }
},{
    // 持久化插件
    persist: true,
})
