// 把components中的所组件都进行全局化注册
// 通过插件的方式
import ImageView from '@/components/imageView/imageView.vue'
import GoodsItem from "@/components/goodsItem/goodsItem.vue";
import XtxSku from "@/components/XtxSku/index.vue";

export const componentPlugin = {
    install(app) {
        app.component('ImageView',ImageView)
        app.component('GoodsItem',GoodsItem)
        app.component('XtxSku',XtxSku)
    }
}
