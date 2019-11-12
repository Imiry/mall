<template>
  <div>
    <swiper>
      <swiper-item v-for="item in banners" :key="item.sort">
        <a :href="item.link">
          <!-- <img :src="item.image" alt="" @load="imageLoad1"> -->
          <img :src="item.image" alt="" >
        </a>
      </swiper-item>
    </swiper> 
  </div>
</template>

<script>
import {Swiper,SwiperItem} from 'components/common/swiper'
export default {
  name: 'HomeSwiper',
  components: {
    Swiper,
    SwiperItem
  },
    data() {
    return {
      isLoad: false
    }
  },
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
  },
  methods: {
    // imageLoad1() {
    //   if(!this.isLoad){
    //     this.$emit('swiperImageLoad')
    //     this.isLoad = true
    //   }
    // }
  },
  }
}
</script>
<style  scoped>

</style>