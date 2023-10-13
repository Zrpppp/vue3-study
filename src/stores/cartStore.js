import {defineStore} from "pinia";
import {ref} from "vue";
export const useCartStore = defineStore('cart', ()=>{
    const cartList = ref([])
    //添加购物车
    const addCart = (goods)=>{
        const item = cartList.value.find(item => goods.skuId === item.skuId)
        if(!item) {
            cartList.value.push(goods)
            return
        }
        item.count+=goods.count
    }
    //删除购物车
    const delCart = (skuId)=>{
        const index = cartList.value.findIndex(item => skuId === item.skuId)
        cartList.value.splice(index, 1)
    }
    const updateCount = (count,skuId)=>{
        const item = cartList.value.find(item => skuId === item.skuId)
        item.count = count
    }
    return{
        cartList,
        addCart,
        delCart,
        updateCount
    }
},{
    persist: true,
})
