<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goodsItem="item" :key=""></goods-list-item>

  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem'
export default {
  name: 'GoodsList',
  components: {
    GoodsListItema
  },

  props:{
    goods: {  //父传子的方式的到item的数据  通过遍历goods里面的数据然后把item分别放到goods-list-item 
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style  scoped>
    .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 2px;

  }
</style>