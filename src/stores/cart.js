import {defineStore} from "pinia";
import {ref,computed} from "vue";
import {useUserStore} from "@/stores/user";
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {insertCartAPI,findNewCartListAPI,delCartAPI,mergeCartAPI} from "@/api/cart";

export const useCartStore = defineStore('cart', ()=>{
    const router = useRouter()
    const userStore = useUserStore()
    const isLogin = computed(()=> userStore.getToken())
    const cartList = ref([])

    const getCartList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    // 2. 定义action - addCart
    const addCart = async (goods) => {
        const { skuId, count } = goods
        if (isLogin.value) {
            await insertCartAPI({ skuId, count })
            await getCartList()
        } else {
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                // 找到了
                item.count++
            } else {
                // 没找到
                cartList.value.push(goods)
            }
        }
    }

    // 删除购物车 -> 登录状态下
    const delCart = async (skuId) => {
        if (isLogin.value) {
            await delCartAPI([skuId])
            await getCartList()
        } else {
            const idx = cartList.value.findIndex((item) => skuId === item.skuId)
            cartList.value.splice(idx, 1)
        }
    }
    const updateCount = (count,skuId) =>{
        const item = cartList.value.find(item => item.skuId === skuId)
        item.count = count
    }
    // 清除购物车
    const clearCart = () => {
        cartList.value = []
    }

    // 单选功能
    const updateChecked = (skuId, selected) => {
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected = selected
    }

    // 全选功能
    const updateAllChecked = (selected) => {
        cartList.value.forEach(item => item.selected = selected)
    }

    //计算属性
    const allCount = computed(()=> cartList.value.reduce((pre, item) => pre + item.count, 0))
    const allPrice = computed(()=> cartList.value.reduce((pre, item) => pre + item.count * item.price, 0))
    const isAllChecked = computed(()=> cartList.value.every(item => item.selected))
    const selectedCount = computed(()=> cartList.value.filter(item => item.selected).reduce((pre, item) => pre + item.count, 0))
    const selectedPrice = computed(()=> cartList.value.filter(item => item.selected).reduce((pre, item) => pre + item.count * item.price, 0))

    return{
        addCart,
        delCart,
        updateCount,
        updateChecked,
        updateAllChecked,
        getCartList,
        clearCart,
        cartList,
        allCount,
        allPrice,
        isAllChecked,
        selectedCount,
        selectedPrice,
    }
},{
    persist: true,
})
