<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else=""><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: true
    }
  },
  computed: {
    isActive() {
      //home -> item(/home) = true
      //home -> item(/category) = true
      //home -> item(/cart) = true
      //home -> item(/profile) = true
      return this.$route.path.indexOf(this.path) !== -1  //true/false
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}  //采用计算属性来动态判断传过来的颜色
    }
  },
  methods: {
    itemClick() {
      this.$router.push(this.path)
    }
  },
}
</script>

<style  scoped>
  #tab-bar .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle
  }
  /* .active{
    color: red
  } */
</style>