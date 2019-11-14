<template>
  <div class="goods-item">
    <img :src="showImage" alt="" @load="imageLoad" @click="itemClick">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="cfav">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsListItem',
  props: { 
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showImage() {
       return this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imageLoad() {     //在图片上有一个load的事件，当图片加载完成，利用事件总线的方式发送一个事件，满足在home.vue中的使用：具体解决图片加载完成之后的问题
      this.$bus.$emit('itemImageLoad')

      
      // if(this.$route.path.indexof('/home')){
      //   this.$bus.$emit('homeitemImageLoad')
      // }else if(this.$route.path.indexof('/detail')) {
      //   this.$bus.$emit('detailitemImageLoad')
      // }
    },
    itemClick() {
      this.$router.push('/detail/' + this.goodsItem.iid)   //通过push的方式，跳转，在路由后面直接加参数iid，通过this.goodsItem.iid拿到iid
    }
  }, 
}
</script>

<style  scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>