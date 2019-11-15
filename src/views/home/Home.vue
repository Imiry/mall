<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">蘑菇街</div></nav-bar>
    <tab-control class="tabcontrol" ref="TabControl1" :titles="['流行','新款','精选']" @tabClick="tabClick" v-show="isTabFixed"></tab-control>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners"  @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control  ref="TabControl2" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backTop()" v-show="isShowBackTop"></back-top>
  </div>

</template>

<script>

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home'
import {debounce } from 'common/utils'
import {itemListenerMixin} from 'common/mixin'
export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,

    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop

  },
  data() {
    return {
      banners: [], 
      recommends: [],
      goods: {
        'pop': {page: 0,list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: true,
      tabOffsetTop: 650,
      isTabFixed: false,
      saveY: 0,
      
    }
  },
  mixins: [itemListenerMixin],
  computed: {
    showGoods(){   //通过计算属性的方式解决在组件上的实现功能的代码的可读性
     return this.goods[this.currentType].list
    } 
  },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      // console.log(this.saveY)
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //1.保存Y的值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件的监听----重点---->其中还利用到了mixin混入的知识
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },

  created() {  
    /*
      这样的封装--->就是一般实现功能的方法一般放在methods中，
      利用created里面的this.调用方式来调用methods中的方法解决了代码的可读性
    */
    // 1.请求多个数据
    this.getHomeMultidata()

      // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },

  mounted() {
    //1.监听item中的图片加载完成
    // this.$bus.$on('itemImageLoad', () => {    //利用事件总线的方式，在这里调用但图片加载完成时，调用scroll中refresh()对图片加载完成每一次进行刷新，解决首页可滚动区域的问题
    //   this.$refs.scroll.refresh()
    // })
    
    //对监听事件的保存
    // this.itemImgListener = () => {
    //   refresh()
    // } 
    // const refresh = debounce(this.$refs.scroll.refresh,200)  //调用防抖函数
    // this.$bus.$on('itemImageLoad',this.itemImgListener)
    // console.log('mounted')
  },

  methods: {
    /**
     * 有关事件的方法
     */

    tabClick(index) {
      // console.log(index)
      switch(index){
        case 0:
          this.currentType = 'pop'
        break
        case 1: 
          this.currentType = 'new'
        break
        case 2:
          this.currentType = 'sell'
        break
      }
      this.$refs.TabControl1.currentIndex = index   //解决吸顶效果之后遇到的索引的问题，具体在tabCtrol中体现
      this.$refs.TabControl2.currentIndex = index
    },
    backTop() {
      // this.$refs.scroll.scroll.scrollTo(0,0,500)  
      //不采用这种的方式是因为在scroll组件内部封装一个scrollTo的函数，在这里只需要通过this.$refs的方式来获取对应的组件
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position){
      //1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      //2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    //获取tabControl的offsetTop
    //所有组件都有一个属性$el，用于获取组件中的元素
    swiperImageLoad() {
      // console.log(this.$refs.TabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.TabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res =>{
        // console.log(res.data.recommend)
        // console.log(res.data.banner.list)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    /*   
      通过调用axios的封装好的方法，在methods中定义一个方法，把需要请求数据的方法放在里面调用，不要忘记传参，
      在这里主要注意page的变化，以及利用(...res.data.list)的方式获取对应goods[type].list的数据,
      其中在data上初始化好goods里面的数据，通过函数传参的方式把对应参数type传进去，
      然后执行.then的方法把对应type类型的数据push到对应的数据中

      %获取对象中不同类型的数据可以通过这种方式来获取this.goods[type].？
    */
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        //在数据加载完之后必须要调用此方法，才能进行下一次  ，，在这里我把此方法封装到scroll内部，通过$refs.scroll的方式调用内部的放方法
        this.$refs.scroll.finishPullUp()//完成加载下拉更多
      })
    }
  },

}
</script>

<style  scoped>
  #home{
    position: relative;
    height: 100vh;
    padding-top: 44px
    
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9
  }
  .tabcontrol{
    position: relative;
    z-index: 9;

  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }


</style>