//定义懒加载插件
import {useIntersectionObserver} from "@vueuse/core";

export const lazyPlugin = {
    install(app) {
        //懒加载指令
        app.directive('img-lazy',{
            //el:指令所绑定的元素，可以用来直接操作DOM
            //binding:binding.value是指令的绑定值，如v-img-lazy="imgUrl"，则binding.value=imgUrl
            mounted(el,binding){
                const { stop } = useIntersectionObserver( el, ([{ isIntersecting }]) => {
                        if (isIntersecting) {
                            // 进入视图区域
                            el.src = binding.value
                            stop()
                        }
                    },
                )
            }
        })
    }
}
