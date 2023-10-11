import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryAPI } from '@/api/layout'
export const useCategoryStore = defineStore('category', () => {
   //导航列表数据管理
    const categoryList = ref([])
    const getCategoryList = async () => {
        const res = await getCategoryAPI()
        categoryList.value = res.result
    }
    return {
        categoryList,
        getCategoryList
    }
})
