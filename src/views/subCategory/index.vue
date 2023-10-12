<script setup>
import {getCategoryFilterAPI,getSubCategoryAPI} from '@/api/category'
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import GoodsItem from "@/components/goodsItem/goodsItem.vue";
//获取面包屑导航数据
const categoryData = ref({})
const route = useRoute()
const loading = ref(false)
const getCategoryData = async () => {
  const res = await getCategoryFilterAPI(route.params.id)
  categoryData.value = res.result
}
onMounted(() => getCategoryData())

//获取基础列表数据渲染
const goodList = ref([])
const counts = ref(0)
const reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'publishTime'
})
const getGoodList = async () => {
  loading.value = true
  const res = await getSubCategoryAPI(reqData.value)
  loading.value = false
  goodList.value = res.result.items
  counts.value = res.result.counts
}
onMounted(() => getGoodList())

//切换tab回调
const tabChange = () => {
  reqData.value.page = 1
  getGoodList()
}

//加载更多
const disabled = ref(false)
const loadMoreEvent = async () => {
  //获取下一页的数据
  reqData.value.page++;
  const res = await getSubCategoryAPI(reqData.value)
  goodList.value = [ ...goodList.value,...res.result.items]
  counts.value = res.result.counts
  if ( goodList.value.length >= counts.value) {
    disabled.value = true;
  }
}
</script>

<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{  path: `/category/${categoryData.parentId}` }">{{ categoryData.parentName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container" v-loading="loading">
      <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"/>
        <el-tab-pane label="最高人气" name="orderNum"/>
        <el-tab-pane label="评论最多" name="evaluateNum"/>
      </el-tabs>
      <div class="body" v-infinite-scroll="loadMoreEvent" :infinite-scroll-disabled="disabled" >
        <!-- 商品列表-->
        <goods-item v-for="goods in goodList" :goods="goods" :key="goods.id"/>
      </div>
    </div>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>
