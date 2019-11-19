import {debounce } from 'common/utils'

import BackTop from 'components/content/backTop/BackTop'


//对图片加载刷新的混入
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    
    //对监听事件的保存
    this.itemImgListener = () => {
      this.refresh()
    } 
    this.refresh = debounce(this.$refs.scroll.refresh,200)  //调用防抖函数
    this.$bus.$on('itemImageLoad',this.itemImgListener)

    // console.log('我是混入的内容')
  },
} 


export  const backTopmixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: true,
    }
  },
  methods: {
    backTop() {
      // this.$refs.scroll.scroll.scrollTo(0,0,500)  
      //不采用这种的方式是因为在scroll组件内部封装一个scrollTo的函数，在这里只需要通过this.$refs的方式来获取对应的组件
      this.$refs.scroll.scrollTo(0,0,500)
    },
    listenShowBackTop(position) {
      //判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000
    }
  },
}