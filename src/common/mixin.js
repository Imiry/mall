import {debounce } from 'common/utils'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    
    //对舰监听事件的保存
    this.itemImgListener = () => {
      refresh()
    } 
    const refresh = debounce(this.$refs.scroll.refresh,200)  //调用防抖函数
    this.$bus.$on('itemImageLoad',this.itemImgListener)

    console.log('我是混入的内容')
  },
} 