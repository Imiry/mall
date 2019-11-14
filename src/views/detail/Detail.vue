<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo"></detail-param-info>
      <detail-comment-info :comment-info="commentinfo"></detail-comment-info>
      <goods-list :goods="recommends"></goods-list>
    </scroll>
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

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail,getRcommend,Goods,Shop,GoodsParam} from 'network/detail'
import {debounce } from 'common/utils'
import {itemListenerMixin} from 'common/mixin'
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

    }
  },
  mixins: [itemListenerMixin],  //混入的知识点
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

  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
    }
  },

  mounted() {
    //对监听事件的保存
    // this.itemImgListener = () => {
    //   refresh()
    // } 
    // const refresh = debounce(this.$refs.scroll.refresh,200)  //调用防抖函数
    // this.$bus.$on('itemImageLoad',this.itemImgListener)

  },
  // deactivated() {
    //在之前没有让detail做缓存，所以取消全局监听事件应该在destroy中
  // },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImgListener)
    // console.log("00")
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