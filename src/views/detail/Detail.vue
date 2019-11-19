<template>
  <div id="detail">
    <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentinfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backTop()" v-show="isShowBackTop"/>

 </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'



import {getDetail,getRcommend,Goods,Shop,GoodsParam} from 'network/detail'
import {debounce } from 'common/utils'
import {itemListenerMixin,backTopmixin} from 'common/mixin'
export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentinfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      
    }
  },
  mixins: [itemListenerMixin,backTopmixin],  //混入的知识点
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid   //获取id
    //2.根据iid获取数据
    getDetail(this.iid).then((res) => {
      //1.获取顶部的图片轮播数据
      // console.log(res)
      const data = res.result
      this.topImages = data.itemInfo.topImages
      
      //3.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //6.获取评论信息
      this.commentinfo = data.rate.list[0]
    })

    //3.获取推荐数据
    getRcommend().then((res) => {
      this.recommends = res.data.list
    })

    /*
      //1.第一次获取，值不对，
      //值不对的原因：this.$refs.params.$el压根没有渲染
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      console.log(this.themeTopYs)

      this.$nextTick(() => {
        //2.第二次获取，值不对
        //值不对原因： 图片没有计算在内
        // 根据最新的数据，对应的DOM已经被渲染出来
        // 但是图片依然是没有加载完(目前获取到的offsetTop不包含其中的图片)
        // offsetTop值不对的时候，都是因为图片的问题
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeTopYs)

      })
    */

    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs)
    },200)
  },

  mounted() {

  },
  // deactivated() {
    //在之前没有让detail做缓存，所以取消全局监听事件应该在destroy中
  // },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImgListener)
    // console.log("00")
  },

  methods: {
    detailImageLoad() {
      this.refresh()    //利用混入的方式
      this.getThemeTopY()  //在图片每次刷新的时候可以获取offsetTop的值，这时候图片都加载渲染完成
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position) {
      //1.获取y的值
      const positionY = -position.y

      //2.positionY和主题中的值进行对比
      //[0, 6281, 7091, 7307]
      //positionY 在 0 到 6281 之间， index = 0
      //positionY 在 6281 到 70911 之间， index = 1
      //positionY 在 7091 到 7307 之间， index = 2
      //positionY 在 大于等于7307， index = 3
      
      //第一种方式，代码性能比较差，但是消耗内存比较小
      // let length = this.themeTopYs.length
      // for(var i = 0;i < length;i++){
      //   if(this.currentIndex !== i && (i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1] || (i === length-1 && positionY >= this.themeTopYs[i]))){
      //     this.currentIndex = i    //做到不重复打印
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }

      //第二种方式，代码性能比较快，消耗内存比比较大
      let length = this.themeTopYs.length
      for (let i = 0; i <length-1; i++) {
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i]) && positionY < this.themeTopYs[i+1]){
          this.currentIndex = i    //做到不重复打印
          this.$refs.nav.currentIndex = this.currentIndex
        }
        
      }

      this.listenShowBackTop(position)
    },
    addToCart() {
      //1.获取购物车需要的展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //2.将商品添加到购物车中
      // this.$store.commit('addCart',product)
      this.$store.dispatch('addCart',product)
    }

  },
}
</script>

<style  scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>