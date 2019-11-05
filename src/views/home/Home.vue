<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">蘑菇街</div></nav-bar>
    <home-swiper :banners="banners"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control class="tabcontrol" :titles="['流行','新款','精选']"></tab-control>
    <goods-list :goods="goods['pop'].list"></goods-list>

  </div>

</template>

<script>

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'

import {getHomeMultidata,getHomeGoods} from 'network/home'
export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,

    NavBar,
    TabControl,
    GoodsList

  },
  data() {
    return {
      banners: [], 
      recommends: [],
      goods: {
        'pop': {page: 0,list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      }
    }
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
  methods: {
      /**
       * 网络请求相关的方法
       */
    getHomeMultidata() {
      getHomeMultidata().then(res =>{
        // console.log(res.data.recommend)
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
      })
    }
  },

}
</script>

<style  scoped>
  #home{
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

    position: sticky;
    top: 43px;
    z-index: 9;
  }


</style>